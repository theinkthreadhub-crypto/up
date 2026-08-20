# InkThread Hub — Supabase Database, RLS & Storage Setup Guide

This document provides step-by-step instructions to configure your Supabase project for **InkThread Hub**.

---

## 1. Create a Supabase Project

1. Log in to [Supabase](https://supabase.com/).
2. Click **New Project** and select your organization.
3. Name your project (e.g., `inkthread-hub-prod`) and choose a database region (e.g., `South Asia (Mumbai)` for Indian customers).
4. Save your Database Password in a secure vault.

---

## 2. Execute SQL Schema & Database Migration

1. In your Supabase Dashboard, navigate to the **SQL Editor** tab on the left sidebar.
2. Click **New Query**.
3. Copy the entire contents of [`supabase/schema.sql`](file:///c:/Users/jjcka/OneDrive/Desktop/School/snaoke%20eor/inkthread-hub/supabase/schema.sql) and paste it into the query editor.
4. Click **Run**.
5. This creates all 16 tables, constraints, foreign keys, performance indexes, RLS policies, and the atomic inventory deduction function:
   - `site_settings`
   - `categories`
   - `products`
   - `product_variants`
   - `inventory_history`
   - `customers`
   - `customer_addresses`
   - `orders`
   - `order_items`
   - `payments`
   - `blog_posts`
   - `announcements`
   - `email_templates`
   - `email_logs`
   - `admin_users`

---

## 3. Seed Initial Streetwear Products & Drops

1. In the SQL Editor, create another **New Query**.
2. Copy and paste the contents of [`supabase/seed.sql`](file:///c:/Users/jjcka/OneDrive/Desktop/School/snaoke%20eor/inkthread-hub/supabase/seed.sql).
3. Click **Run**.
4. This seeds the initial 240 GSM & 380 GSM streetwear drops, categories, blog posts, and site settings.

---

## 4. Setup Storage Buckets

1. Navigate to **Storage** in the Supabase Dashboard.
2. Click **New Bucket** and name it `product-images`.
   - Set **Public Bucket** to `ON`.
3. Click **New Bucket** and name it `blog-media`.
   - Set **Public Bucket** to `ON`.
4. Storage Policies:
   - **SELECT**: Allow public access to view images.
   - **INSERT / UPDATE / DELETE**: Allow authenticated admin users (`auth.uid()`) to upload and modify assets.

---

## 5. Setup Admin Accounts

1. Navigate to **Authentication -> Users** in the Supabase Dashboard.
2. Click **Add User** -> **Create User**.
3. Enter your administrator email (e.g., `admin@inkthreadhub.com`) and secure password.
4. Go to the **SQL Editor** and insert the user ID into `admin_users`:
   ```sql
   INSERT INTO public.admin_users (auth_user_id, email, name, role)
   VALUES (
     'YOUR_AUTH_USER_UUID_FROM_AUTH_USERS_TABLE',
     'admin@inkthreadhub.com',
     'Master Admin',
     'super_admin'
   );
   ```

---

## 6. Retrieve Environment Variables

Go to **Project Settings -> API** and copy:
- **Project URL** -> `NEXT_PUBLIC_SUPABASE_URL`
- **anon public key** -> `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **service_role secret key** -> `SUPABASE_SERVICE_ROLE_KEY` *(Never expose this on frontend)*
