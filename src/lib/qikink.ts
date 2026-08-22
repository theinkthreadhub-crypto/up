/**
 * Qikink Print-on-Demand (POD) Automated Order Sync & Fulfillment Service
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

export async function sendOrderToQikink(orderData: QikinkOrderPayload, apiKeyOverride?: string): Promise<{ success: boolean; qikinkOrderId?: string; error?: string }> {
  const apiKey = apiKeyOverride || process.env.QIKINK_API_KEY || '18edc332f4f51381dcc9d41012cdeb9eb3bb43bec5e0b2730b17b5bf6d732196';

  if (!apiKey) {
    return { success: false, error: 'Qikink API Key is missing.' };
  }

  try {
    const response = await fetch('https://api.qikink.com/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ApiKey': apiKey,
        'Authorization': `Bearer ${apiKey}`,
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
