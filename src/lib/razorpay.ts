import crypto from 'crypto';
import Razorpay from 'razorpay';

export function getRazorpayClient() {
  const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '';
  const keySecret = process.env.RAZORPAY_KEY_SECRET || '';

  if (!keyId || !keySecret) {
    // If running in development without real credentials, return null
    return null;
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
}

/**
 * Verifies Razorpay payment signature server-side using HMAC SHA-256
 */
export function verifyPaymentSignature(params: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET || '';
  if (!secret) {
    // In test/mock mode without configured secrets, allow test bypass if test mode explicitly enabled
    if (process.env.NEXT_PUBLIC_ENABLE_TEST_MODE === 'true' && params.razorpay_signature.startsWith('test_sig_')) {
      return true;
    }
    return false;
  }

  const generatedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${params.razorpay_order_id}|${params.razorpay_payment_id}`)
    .digest('hex');

  return generatedSignature === params.razorpay_signature;
}

/**
 * Validates webhook signature sent by Razorpay in header 'x-razorpay-signature'
 */
export function verifyWebhookSignature(body: string, signature: string): boolean {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || '';
  if (!webhookSecret) {
    if (process.env.NEXT_PUBLIC_ENABLE_TEST_MODE === 'true') return true;
    return false;
  }

  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(body)
    .digest('hex');

  return expectedSignature === signature;
}
