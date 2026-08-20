# InkThread Hub — Production Deployment & Architecture Guide

A complete guide for deploying the **InkThread Hub** full-stack e-commerce system to **GitHub**, **Netlify**, and **Supabase**.

---

## 1. Project Folder Structure

```
inkthread-hub/
├── public/
│   ├── images/               # High-definition product photos, banner assets
│   ├── favicon.svg           # Brand vector icon
│   └── icons.svg
├── src/
│   ├── app/
│   │   ├── (Customer Pages)
│   │   │   ├── page.tsx                  # Home page (Hero drop, featured, lookbook)
│   │   │   ├── shop/page.tsx             # Catalog with category & price filters
│   │   │   ├── product/[slug]/page.tsx   # Detailed product view & image zoom
│   │   │   ├── category/[slug]/page.tsx  # Category drops
│   │   │   ├── cart/page.tsx             # Full cart with shipping estimator
│   │   │   ├── checkout/page.tsx         # Secure checkout with Indian validation
│   │   │   ├── order-success/page.tsx    # Order confirmed receipt
│   │   │   ├── track-order/page.tsx      # Public order timeline tracker
│   │   │   ├── blog/page.tsx             # Streetwear journal index
│   │   │   ├── blog/[slug]/page.tsx      # Article reader
│   │   │   ├── about/page.tsx            # Artisanal brand manifesto
│   │   │   └── contact/page.tsx          # Support & atelier contact
│   │   ├── admin/
│   │   │   ├── layout.tsx                # Admin layout with auth guard & sidebar
│   │   │   ├── login/page.tsx            # Protected admin authentication
│   │   │   ├── page.tsx                  # Dashboard with sales metrics & charts
│   │   │   ├── products/page.tsx         # Product management CRUD
│   │   │   ├── categories/page.tsx       # Taxonomy manager
│   │   │   ├── inventory/page.tsx        # Real-time stock & audit history
│   │   │   ├── orders/page.tsx           # Order fulfillment & timeline updater
│   │   │   ├── customers/page.tsx        # Customer database & spend metrics
│   │   │   ├── blog/page.tsx             # Blog CMS
│   │   │   ├── announcements/page.tsx    # Top notification bar manager
│   │   │   ├── emails/page.tsx           # Email templates & dispatcher
│   │   │   ├── payments/page.tsx         # Razorpay transaction ledger
│   │   │   ├── analytics/page.tsx        # Revenue & drop velocity analytics
│   │   │   └── settings/page.tsx         # Store settings & shipping thresholds
│   │   ├── api/
│   │   │   ├── payments/create-order/route.ts # Server price check & Razorpay order
│   │   │   ├── payments/verify/route.ts       # HMAC verification & stock deduction
│   │   │   ├── payments/webhook/route.ts      # Webhook listener
│   │   │   ├── orders/track/route.ts          # Public order tracking
│   │   │   └── email/send/route.ts            # Server-side email sender
│   │   ├── layout.tsx            # Root layout with fonts, metadata, navbar, footer
│   │   ├── globals.css           # Streetwear dark obsidian tokens & glass styles
│   │   ├── sitemap.ts            # SEO sitemap generator
│   │   └── robots.ts             # SEO robots rules
│   ├── components/
│   │   ├── layout/               # Navbar, Footer, AnnouncementBar, CartDrawer, SearchModal
│   │   ├── product/              # ProductCard, ProductGallery, SizeGuideModal
│   │   └── admin/                # AdminSidebar
│   ├── lib/
│   │   ├── supabase/             # Browser client, server client, admin client
│   │   ├── mock-data.ts          # Resilient streetwear catalog & initial seed
│   │   ├── razorpay.ts           # HMAC verification & order creation
│   │   ├── email.ts              # Email templates & sender
│   │   ├── store.ts              # LocalStorage persistent cart state
│   │   └── utils.ts              # Currency, date, validation & slug helpers
│   └── types/
│       └── database.ts           # Full TypeScript domain interfaces
├── supabase/
│   ├── schema.sql                # Complete 16-table PostgreSQL schema & RLS
│   └── seed.sql                  # Initial streetwear catalog seed data
├── .env.example
├── netlify.toml                  # Netlify Next.js runtime build config
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## 2. GitHub & Netlify Deployment Steps

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "feat: complete production-ready full-stack inkthread-hub e-commerce"
   git push origin main
   ```

2. **Deploy on Netlify**:
   - Log in to [Netlify](https://app.netlify.com/).
   - Click **Add new site -> Import an existing project**.
   - Select your GitHub repository.
   - Netlify will automatically detect Next.js with `@netlify/plugin-nextjs`.

3. **Configure Environment Variables in Netlify**:
   Go to **Site configuration -> Environment variables** and add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_SECRET`
   - `RAZORPAY_WEBHOOK_SECRET`
   - `EMAIL_PROVIDER_API_KEY`
   - `EMAIL_FROM`
   - `NEXT_PUBLIC_APP_URL` (Set to your Netlify custom domain e.g. `https://inkthreadhub.com`)

4. **Trigger Deploy**: Click **Deploy site**.

---

## 3. Testing Checklist

- [x] **Storefront Browsing**: Products load dynamically with images, prices in ₹, GSM badges.
- [x] **Catalog Filtering**: Category filter, size filter, and price slider work accurately.
- [x] **Cart Functionality**: Adding items, adjusting quantities, applying coupons (`STREET20`), and free shipping progress meter calculate properly.
- [x] **Checkout Validation**: Indian 10-digit mobile number and 6-digit PIN code are validated.
- [x] **Server Price Re-check**: Server verifies prices from the database before generating payments.
- [x] **Razorpay Order Creation**: `/api/payments/create-order` creates valid payment sessions.
- [x] **Payment Verification**: Server verifies cryptographic HMAC-SHA256 signature before confirming the order.
- [x] **Stock Deduction**: Live stock decreases atomically upon successful payment.
- [x] **Order Tracking**: Customers can look up their live timeline via `/track-order`.
- [x] **Admin Authentication**: Admin routes `/admin/*` require valid session.
- [x] **Product CRUD**: Products can be added, edited, unpublished, duplicated, and deleted in `/admin/products`.
- [x] **Inventory History**: Stock adjustments record previous qty, new qty, change delta, and reason in the audit log.
- [x] **Email Dispatch**: Confirmation emails are dispatched securely server-side.

---

## 4. Security Checklist

- [x] Zero secret keys (`SUPABASE_SERVICE_ROLE_KEY`, `RAZORPAY_KEY_SECRET`, `EMAIL_PROVIDER_API_KEY`) in client code or frontend bundles.
- [x] Supabase Row Level Security (RLS) enabled on all 16 tables.
- [x] Cryptographic HMAC-SHA256 signature verification on Razorpay payments and webhooks.
- [x] Idempotent order status transitions to prevent duplicate processing.
- [x] Safe input validation with sanitized inputs on all API routes.
- [x] HTTP Security Headers (`X-Frame-Options`, `X-Content-Type-Options`, `X-XSS-Protection`) enabled in `next.config.js`.
