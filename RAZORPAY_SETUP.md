# InkThread Hub — Razorpay Payment Gateway & Webhook Setup

This guide details how to configure **Razorpay** for Indian online payments (UPI, Cards, NetBanking, Wallets).

---

## 1. Retrieve API Keys (Test / Live)

1. Log into your [Razorpay Dashboard](https://dashboard.razorpay.com/).
2. Switch to **Test Mode** (or **Live Mode** for production).
3. Navigate to **Settings -> API Keys**.
4. Click **Generate Key**.
5. Note down:
   - **Key ID** -> `NEXT_PUBLIC_RAZORPAY_KEY_ID` and `RAZORPAY_KEY_ID`
   - **Key Secret** -> `RAZORPAY_KEY_SECRET` *(Keep private)*

---

## 2. Configure Webhooks

Webhooks ensure that if a user closes their browser before redirection, the payment and stock deduction are recorded automatically and idempotently.

1. In Razorpay Dashboard, go to **Settings -> Webhooks**.
2. Click **Add New Webhook**.
3. Set the **Webhook URL**:
   ```
   https://your-domain.netlify.app/api/payments/webhook
   ```
   *(For local testing with ngrok: `https://your-ngrok-subdomain.ngrok-free.app/api/payments/webhook`)*
4. Enter a strong secret string into **Secret** -> set as `RAZORPAY_WEBHOOK_SECRET` in your `.env`.
5. Select the following **Active Events**:
   - `payment.captured`
   - `order.paid`
   - `payment.failed`
   - `refund.processed`
6. Click **Save**.

---

## 3. Server-Side Security Verification Rules

1. The Razorpay Key Secret is used exclusively in Node.js server routes (`/api/payments/create-order`, `/api/payments/verify`, `/api/payments/webhook`).
2. Payment signatures are verified using `HMAC-SHA256`:
   ```ts
   crypto.createHmac('sha256', secret).update(order_id + '|' + payment_id).digest('hex');
   ```
3. An order is **NEVER** marked as `Paid` based on client claims alone—the server must verify the cryptographic signature or webhook confirmation.
