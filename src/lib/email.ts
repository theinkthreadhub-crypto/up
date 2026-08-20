interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  recipientName?: string;
}

export async function sendEmail({ to, subject, html, recipientName }: SendEmailParams): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const apiKey = process.env.EMAIL_PROVIDER_API_KEY;
  const fromEmail = process.env.EMAIL_FROM || 'InkThread Hub <orders@inkthreadhub.com>';

  // Log in server console for visibility
  console.log(`[Email Dispatch] Sending to: ${to} | Subject: "${subject}"`);

  if (!apiKey || apiKey.startsWith('re_placeholder')) {
    // Development fallback / Test mode logging
    console.log(`[Email System Mock] Email simulated successfully to ${to} (${recipientName || 'Customer'})`);
    return {
      success: true,
      messageId: `mock_email_${Date.now()}`,
    };
  }

  try {
    // If Resend API key is provided, perform live API request
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [to],
        subject,
        html,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('[Email Error]', data);
      return { success: false, error: data.message || 'Failed to dispatch email' };
    }

    return { success: true, messageId: data.id };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown email dispatch error';
    console.error('[Email Dispatch Exception]', errorMsg);
    return { success: false, error: errorMsg };
  }
}

export function renderOrderEmailTemplate(params: {
  customerName: string;
  orderNumber: string;
  totalAmount: number;
  items: Array<{ name: string; size: string; color: string; qty: number; price: number }>;
  address: string;
}): string {
  const itemsHtml = params.items
    .map(
      (item) => `
      <tr style="border-bottom: 1px solid #222;">
        <td style="padding: 12px 0; color: #fff;">
          <strong>${item.name}</strong><br/>
          <span style="color: #888; font-size: 13px;">Size: ${item.size} | Color: ${item.color} | Qty: ${item.qty}</span>
        </td>
        <td style="padding: 12px 0; text-align: right; color: #00ff87; font-weight: bold;">
          ₹${item.price * item.qty}
        </td>
      </tr>
    `
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Order Confirmation - InkThread Hub</title>
      </head>
      <body style="background-color: #090a0f; color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 30px 15px;">
        <div style="max-width: 600px; margin: 0 auto; background: #111319; border: 1px solid #1f2430; border-radius: 12px; padding: 32px; box-shadow: 0 8px 30px rgba(0,0,0,0.5);">
          <div style="border-bottom: 1px solid #1f2430; padding-bottom: 20px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center;">
            <h1 style="color: #00ff87; font-size: 24px; letter-spacing: 2px; margin: 0; text-transform: uppercase;">INKTHREAD HUB</h1>
          </div>
          
          <h2 style="font-size: 18px; color: #ffffff; margin-top: 0;">Order Confirmed: #${params.orderNumber}</h2>
          <p style="color: #9ca3af; font-size: 15px; line-height: 1.6;">
            Hey <strong>${params.customerName}</strong>, your drop is secured! We are preparing your order at our workshop.
          </p>

          <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
            <thead>
              <tr style="border-bottom: 1px solid #2d3748; text-align: left; color: #718096; font-size: 12px; text-transform: uppercase;">
                <th style="padding-bottom: 8px;">Product</th>
                <th style="padding-bottom: 8px; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div style="background: #1a1d24; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px; color: #9ca3af;">
              <span>Total Paid (INR):</span>
              <strong style="color: #00ff87; font-size: 18px;">₹${params.totalAmount}</strong>
            </div>
            <div style="font-size: 13px; color: #718096; margin-top: 12px;">
              <strong>Delivery Address:</strong><br/>
              ${params.address}
            </div>
          </div>

          <div style="text-align: center; margin-top: 32px;">
            <p style="color: #6b7280; font-size: 13px;">
              Questions? Reply directly to this email or reach us on WhatsApp.
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}
