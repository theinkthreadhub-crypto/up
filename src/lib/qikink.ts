/**
 * Qikink Print-on-Demand (POD) Automated Order Sync & Fulfillment Service
 *
 * Security: the API key is server-only and must come from Vercel's
 * QIKINK_API_KEY environment variable. Never hardcode or pass it from clients.
 */

interface QikinkOrderItem {
  search_by: 'sku' | 'id';
  sku: string;
  quantity: number;
}

interface QikinkOrderPayload {
  order_number: string;
  first_name: string;
  last_name: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  email: string;
  payment_gateway: 'Prepaid' | 'COD';
  line_items: QikinkOrderItem[];
}

export async function sendOrderToQikink(
  orderData: QikinkOrderPayload,
): Promise<{ success: boolean; qikinkOrderId?: string; error?: string }> {
  const apiKey = process.env.QIKINK_API_KEY;

  if (!apiKey) {
    console.error('[Qikink POD] QIKINK_API_KEY is not configured on the server.');
    return { success: false, error: 'Qikink API configuration is missing.' };
  }

  try {
    const response = await fetch('https://api.qikink.com/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ApiKey: apiKey,
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(orderData),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[Qikink POD API Error]', data);
      return { success: false, error: data.message || 'Qikink order creation failed' };
    }

    return {
      success: true,
      qikinkOrderId: data.order_id || data.qikink_order_id || data.id,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error pushing order to Qikink POD';
    console.error('[Qikink Dispatch Exception]', errorMsg);
    return { success: false, error: errorMsg };
  }
}
