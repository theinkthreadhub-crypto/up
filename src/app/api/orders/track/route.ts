import { NextResponse } from 'next/server';
import { initialOrders } from '@/lib/mock-data';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: Request) {
  try {
    const { orderNumber, contact } = await req.json();

    if (!orderNumber || !contact) {
      return NextResponse.json(
        { error: 'Please provide both Order Number and Phone/Email' },
        { status: 400 }
      );
    }

    const cleanOrderNum = orderNumber.trim().toUpperCase();
    const cleanContact = contact.trim().toLowerCase();

    const supabase = createAdminClient();
    let order = null;

    const { data, error: dbError } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('order_number', cleanOrderNum)
      .maybeSingle();

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    if (data) {
      const matchesEmail = data.customer_email.toLowerCase() === cleanContact;
      const matchesPhone = data.customer_phone.replace(/[\s-]/g, '').includes(cleanContact.replace(/[\s-]/g, ''));
      if (matchesEmail || matchesPhone) {
        order = {
          ...data,
          items: data.order_items || [],
        };
      }
    }

    if (!order) {
      return NextResponse.json(
        { error: 'No order found matching the provided Order ID and contact details.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        order_number: order.order_number,
        customer_name: order.customer_name,
        status: order.status,
        payment_status: order.payment_status,
        total_amount: order.total_amount,
        tracking_courier: order.tracking_courier,
        tracking_number: order.tracking_number,
        timeline: order.timeline || [],
        shipping_address: order.shipping_address,
        items: order.items || [],
        created_at: order.created_at,
      },
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Error retrieving order';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
