import { NextResponse } from 'next/server';
import { sendEmail, renderOrderEmailTemplate } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { to, subject, templateType, customerName, orderNumber, totalAmount, items, address } = body;

    if (!to) {
      return NextResponse.json({ error: 'Recipient email is required' }, { status: 400 });
    }

    let htmlBody = `
      <div style="background: #090a0f; color: #fff; padding: 24px; font-family: sans-serif;">
        <h1 style="color: #00ff87;">INKTHREAD HUB</h1>
        <p>${subject}</p>
        <p>This is an official communication from the InkThread Hub atelier team.</p>
      </div>
    `;

    if (templateType === 'order_confirmation') {
      htmlBody = renderOrderEmailTemplate({
        customerName: customerName || 'Valued Client',
        orderNumber: orderNumber || 'ITH-2026-DEMO',
        totalAmount: totalAmount || 1899,
        items: items || [{ name: 'Heavyweight Streetwear Piece', size: 'L', color: 'Obsidian Black', qty: 1, price: 1899 }],
        address: address || 'New Delhi, India',
      });
    }

    const result = await sendEmail({
      to,
      subject: subject || 'InkThread Hub Notification',
      html: htmlBody,
      recipientName: customerName,
    });

    return NextResponse.json(result);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to send email';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
