import { NextResponse } from 'next/server';
import { getRazorpayClient } from '@/lib/razorpay';
import { initialProducts } from '@/lib/mock-data';
import { generateOrderNumber } from '@/lib/utils';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, customer, couponCode } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    if (!customer || !customer.fullName || !customer.email || !customer.phone || !customer.address) {
      return NextResponse.json({ error: 'Incomplete customer details' }, { status: 400 });
    }

    // SERVER-SIDE PRICE AND STOCK RE-VALIDATION
    let verifiedSubtotal = 0;
    const validatedOrderItems = [];
    const supabase = createAdminClient();

    for (const cartItem of items) {
      const { data: product, error: dbError } = await supabase
        .from('products')
        .select('*')
        .eq('id', cartItem.product.id)
        .maybeSingle();

      if (dbError || !product) {
        return NextResponse.json(
          { error: `Product "${cartItem.product.name}" is no longer available or database query failed.` },
          { status: 400 }
        );
      }

      if (!product.is_published) {
        return NextResponse.json(
          { error: `Product "${product.name}" is currently unpublished.` },
          { status: 400 }
        );
      }

      if (product.stock_quantity < cartItem.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for "${product.name}". Available: ${product.stock_quantity}` },
          { status: 400 }
        );
      }

      const unitPrice = product.sale_price && product.sale_price > 0 ? product.sale_price : product.price;
      const itemTotal = unitPrice * cartItem.quantity;
      verifiedSubtotal += itemTotal;

      validatedOrderItems.push({
        product_id: product.id,
        product_name: product.name,
        product_slug: product.slug,
        product_sku: product.sku,
        product_image: product.thumbnail || product.images?.[0] || '',
        size: cartItem.size,
        color: cartItem.color,
        quantity: cartItem.quantity,
        unit_price: unitPrice,
        total_price: itemTotal,
      });
    }

    // Server-side discount validation
    let discountPercent = 0;
    if (couponCode === 'STREET20') discountPercent = 20;
    else if (couponCode === 'INKDROP10') discountPercent = 10;

    const discountAmount = Math.round((verifiedSubtotal * discountPercent) / 100);
    const shippingFee = verifiedSubtotal >= 999 ? 0 : 99;
    const taxAmount = Math.round((verifiedSubtotal - discountAmount) * 0.05);
    const finalTotalAmount = Math.max(0, verifiedSubtotal - discountAmount + shippingFee);

    const orderNumber = generateOrderNumber();
    const orderId = crypto.randomUUID();

    // Check if real Razorpay is configured
    const razorpay = getRazorpayClient();
    let razorpayOrderId = `order_${crypto.randomUUID().replace(/-/g, '').slice(0, 14)}`;

    if (razorpay) {
      try {
        const rzpOrder = await razorpay.orders.create({
          amount: Math.round(finalTotalAmount * 100), // amount in paise
          currency: 'INR',
          receipt: orderNumber,
          notes: {
            customer_name: customer.fullName,
            customer_email: customer.email,
            customer_phone: customer.phone,
            order_number: orderNumber,
          },
        });
        razorpayOrderId = rzpOrder.id;
      } catch (err: unknown) {
        console.error('[Razorpay Order Creation Failed]', err);
        // If razorpay API fails due to sandbox test credentials, provide fallback in test mode
        if (process.env.NEXT_PUBLIC_ENABLE_TEST_MODE !== 'true') {
          return NextResponse.json({ error: 'Failed to create payment order with gateway' }, { status: 500 });
        }
      }
    }

    const orderPayload = {
      id: orderId,
      order_number: orderNumber,
      customer_name: customer.fullName,
      customer_email: customer.email,
      customer_phone: customer.phone,
      shipping_address: {
        address_line1: customer.address,
        landmark: customer.landmark || '',
        city: customer.city,
        state: customer.state,
        pincode: customer.pincode,
      },
      subtotal: verifiedSubtotal,
      discount_amount: discountAmount,
      coupon_code: couponCode || null,
      shipping_fee: shippingFee,
      tax_amount: taxAmount,
      total_amount: finalTotalAmount,
      status: 'Pending Payment',
      payment_status: 'Pending',
      payment_method: 'Razorpay',
      razorpay_order_id: razorpayOrderId,
      timeline: [
        {
          status: 'Pending Payment',
          timestamp: new Date().toISOString(),
          description: `Order ${orderNumber} initiated for ₹${finalTotalAmount}`,
        },
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Try saving order to Supabase
    try {
      await supabase.from('orders').insert([orderPayload]);
      if (validatedOrderItems.length > 0) {
        const orderItemsToInsert = validatedOrderItems.map((item) => ({
          ...item,
          order_id: orderId,
        }));
        await supabase.from('order_items').insert(orderItemsToInsert);
      }
    } catch (dbErr) {
      console.warn('[DB Pending Order Insert Notice]', dbErr);
    }

    return NextResponse.json({
      success: true,
      orderId,
      orderNumber,
      razorpayOrderId,
      amount: finalTotalAmount * 100, // paise
      currency: 'INR',
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
      customer: {
        name: customer.fullName,
        email: customer.email,
        phone: customer.phone,
      },
      items: validatedOrderItems,
      finalTotalAmount,
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Internal server error';
    console.error('[Create Order Exception]', errorMsg);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
