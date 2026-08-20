import { NextResponse } from 'next/server';
import { verifyWebhookSignature } from '@/lib/razorpay';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature') || '';

    // Verify webhook signature
    const isValid = verifyWebhookSignature(rawBody, signature);
    if (!isValid) {
      console.error('[Razorpay Webhook Error] Invalid webhook signature');
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;
    console.log(`[Razorpay Webhook Received] Event: ${event}`);

    const supabase = createAdminClient();
    const now = new Date().toISOString();

    if (event === 'payment.captured' || event === 'order.paid') {
      const paymentEntity = payload.payload?.payment?.entity;
      const razorpayOrderId = paymentEntity?.order_id;
      const razorpayPaymentId = paymentEntity?.id;
      const amountInPaise = paymentEntity?.amount;
      const amountInRupees = amountInPaise ? amountInPaise / 100 : 0;

      if (razorpayOrderId) {
        // Idempotently update order if not yet marked Paid
        try {
          const { data: order } = await supabase
            .from('orders')
            .select('id, status, timeline')
            .eq('razorpay_order_id', razorpayOrderId)
            .single();

          if (order && order.status !== 'Paid' && order.status !== 'Delivered' && order.status !== 'Shipped') {
            const updatedTimeline = [
              ...(order.timeline || []),
              {
                status: 'Paid',
                timestamp: now,
                description: `Payment captured via Webhook event: ${event} (Ref: ${razorpayPaymentId})`,
              },
            ];

            await supabase
              .from('orders')
              .update({
                status: 'Paid',
                payment_status: 'Paid',
                razorpay_payment_id: razorpayPaymentId,
                timeline: updatedTimeline,
                updated_at: now,
              })
              .eq('id', order.id);

            // Log webhook verified in payments table
            await supabase
              .from('payments')
              .update({ webhook_verified: true, status: 'captured', updated_at: now })
              .eq('razorpay_order_id', razorpayOrderId);
          }
        } catch (dbErr) {
          console.warn('[Webhook Order Update Notice]', dbErr);
        }
      }
    } else if (event === 'payment.failed') {
      const paymentEntity = payload.payload?.payment?.entity;
      const razorpayOrderId = paymentEntity?.order_id;
      if (razorpayOrderId) {
        try {
          await supabase
            .from('orders')
            .update({ payment_status: 'Failed', updated_at: now })
            .eq('razorpay_order_id', razorpayOrderId);
        } catch (err) {
          console.warn('[Webhook Failed Status Update Notice]', err);
        }
      }
    }

    return NextResponse.json({ status: 'ok', eventReceived: event });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Webhook error';
    console.error('[Razorpay Webhook Exception]', errorMsg);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
