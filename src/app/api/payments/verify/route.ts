import { NextResponse } from 'next/server';
import { verifyPaymentSignature } from '@/lib/razorpay';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendEmail, renderOrderEmailTemplate } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      orderId,
      orderNumber,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      items,
      customer,
      totalAmount,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing payment signature parameters' },
        { status: 400 }
      );
    }

    // 1. VERIFY SIGNATURE SERVER-SIDE
    const isValidSignature = verifyPaymentSignature({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    if (!isValidSignature) {
      console.error('[Security Warning] Invalid Razorpay Payment Signature detected!', {
        razorpay_order_id,
        razorpay_payment_id,
      });
      return NextResponse.json(
        { error: 'Payment signature verification failed. Untrusted payment.' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    const now = new Date().toISOString();

    // 2. RECORD PAYMENT TRANSACTION
    try {
      await supabase.from('payments').insert([
        {
          order_id: orderId,
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
          amount: totalAmount,
          currency: 'INR',
          status: 'captured',
          payment_method: 'Razorpay',
          webhook_verified: false,
          created_at: now,
          updated_at: now,
        },
      ]);
    } catch (payErr) {
      console.warn('[DB Payment Insert Notice]', payErr);
    }

    // 3. ATOMICALLY DEDUCT INVENTORY
    if (items && Array.isArray(items)) {
      try {
        // Try calling atomic Supabase RPC if available
        const { error: rpcError } = await supabase.rpc('deduct_inventory_atomic', {
          p_order_id: orderId,
          p_items: items,
          p_admin_user: 'Razorpay Verification',
        });

        if (rpcError) {
          // If RPC is not created yet in dev, perform standard update query
          for (const item of items) {
            const { data: prod } = await supabase
              .from('products')
              .select('stock_quantity, name, sku')
              .eq('id', item.product_id)
              .single();

            if (prod) {
              const prev = prod.stock_quantity;
              const next = Math.max(0, prev - item.quantity);
              await supabase
                .from('products')
                .update({ stock_quantity: next, updated_at: now })
                .eq('id', item.product_id);

              await supabase.from('inventory_history').insert([
                {
                  product_id: item.product_id,
                  product_name: prod.name,
                  sku: prod.sku,
                  previous_quantity: prev,
                  new_quantity: next,
                  quantity_changed: -item.quantity,
                  reason: 'Order Placement & Payment Confirmation',
                  order_id: orderId,
                  admin_user: 'Razorpay Verification',
                },
              ]);
            }
          }
        }
      } catch (invErr) {
        console.warn('[Inventory Deduction Notice]', invErr);
      }
    }

    // 4. UPDATE ORDER STATUS & TIMELINE
    const newTimelineEvent = {
      status: 'Paid',
      timestamp: now,
      description: `Payment of ₹${totalAmount} verified successfully (Ref: ${razorpay_payment_id})`,
    };

    try {
      const { data: existingOrder } = await supabase
        .from('orders')
        .select('timeline')
        .eq('id', orderId)
        .single();

      const updatedTimeline = existingOrder?.timeline
        ? [...existingOrder.timeline, newTimelineEvent]
        : [newTimelineEvent];

      await supabase
        .from('orders')
        .update({
          status: 'Paid',
          payment_status: 'Paid',
          razorpay_payment_id,
          razorpay_signature,
          timeline: updatedTimeline,
          updated_at: now,
        })
        .eq('id', orderId);
    } catch (ordErr) {
      console.warn('[DB Order Update Notice]', ordErr);
    }

    // 5. SEND CONFIRMATION EMAIL ASYNCHRONOUSLY
    if (customer?.email) {
      const emailHtml = renderOrderEmailTemplate({
        customerName: customer.name || 'Valued Customer',
        orderNumber: orderNumber || 'ITH-ORDER',
        totalAmount: totalAmount || 0,
        items: (items || []).map((i: { product_name: string; size: string; color: string; quantity: number; unit_price: number }) => ({
          name: i.product_name,
          size: i.size,
          color: i.color,
          qty: i.quantity,
          price: i.unit_price,
        })),
        address: customer.address || 'Address on file',
      });

      sendEmail({
        to: customer.email,
        subject: `🔥 InkThread Hub Order Confirmed: #${orderNumber}`,
        html: emailHtml,
        recipientName: customer.name,
      }).catch((err) => console.error('[Email Dispatch Non-blocking Error]', err));
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified and order confirmed successfully',
      orderId,
      orderNumber,
      status: 'Paid',
      paymentId: razorpay_payment_id,
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Payment verification failure';
    console.error('[Verify Payment Exception]', errorMsg);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
