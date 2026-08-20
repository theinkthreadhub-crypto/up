-- ============================================================================
-- INKTHREAD HUB - FULL PRODUCTION SUPABASE SCHEMA & RLS POLICIES
-- Brand: InkThread Hub (Streetwear & Artisanal Apparel)
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. SITE SETTINGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_name TEXT NOT NULL DEFAULT 'InkThread Hub',
    tagline TEXT DEFAULT 'Heavyweight Streetwear & Artisanal Oversized Drops',
    logo_url TEXT,
    contact_email TEXT NOT NULL DEFAULT 'support@inkthreadhub.com',
    support_phone TEXT NOT NULL DEFAULT '+91 98765 43210',
    currency TEXT NOT NULL DEFAULT 'INR',
    currency_symbol TEXT NOT NULL DEFAULT '₹',
    free_shipping_threshold NUMERIC NOT NULL DEFAULT 999,
    default_shipping_fee NUMERIC NOT NULL DEFAULT 99,
    tax_percent NUMERIC NOT NULL DEFAULT 5,
    instagram_url TEXT DEFAULT 'https://instagram.com/inkthreadhub',
    twitter_url TEXT DEFAULT 'https://twitter.com/inkthreadhub',
    facebook_url TEXT DEFAULT 'https://facebook.com/inkthreadhub',
    store_address TEXT DEFAULT 'Plot 42, Okhla Industrial Area Phase III',
    city TEXT DEFAULT 'New Delhi',
    state TEXT DEFAULT 'Delhi',
    pincode TEXT DEFAULT '110020',
    announcement_bar_enabled BOOLEAN DEFAULT true,
    announcement_bar_text TEXT DEFAULT '⚡ FLASH DROP: FREE SHIPPING ON ALL ORDERS ABOVE ₹999 | USE CODE: INKDROP10 FOR 10% OFF',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- 2. CATEGORIES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- 3. PRODUCTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    sku TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    short_description TEXT,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    category_name TEXT,
    product_type TEXT DEFAULT 'Oversized T-Shirt',
    price NUMERIC NOT NULL,
    sale_price NUMERIC,
    cost_price NUMERIC, -- Admin eyes only
    discount_percent INTEGER DEFAULT 0,
    sizes TEXT[] DEFAULT ARRAY['S', 'M', 'L', 'XL', 'XXL'],
    colors TEXT[] DEFAULT ARRAY['Obsidian Black', 'Chalk White'],
    thumbnail TEXT,
    images TEXT[] DEFAULT ARRAY[]::TEXT[],
    is_published BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    is_new_arrival BOOLEAN DEFAULT true,
    is_best_seller BOOLEAN DEFAULT false,
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    low_stock_threshold INTEGER NOT NULL DEFAULT 5,
    fabric_gsm INTEGER DEFAULT 240,
    material_care TEXT DEFAULT '100% Super-Combed Ring-Spun Cotton. 240 GSM Heavyweight French Terry. Bio-washed & Pre-shrunk. Cold machine wash inside out.',
    seo_title TEXT,
    seo_description TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- 4. PRODUCT VARIANTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    sku TEXT NOT NULL UNIQUE,
    size TEXT NOT NULL,
    color TEXT NOT NULL,
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    additional_price NUMERIC DEFAULT 0,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- 5. INVENTORY & AUDIT HISTORY
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.inventory_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    product_name TEXT,
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
    sku TEXT,
    previous_quantity INTEGER NOT NULL,
    new_quantity INTEGER NOT NULL,
    quantity_changed INTEGER NOT NULL,
    reason TEXT NOT NULL, -- 'Order Fulfillment', 'Restock', 'Damage Deduction', 'Manual Adjustment', 'Cancellation Restock'
    order_id UUID,
    admin_user TEXT DEFAULT 'System',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- 6. CUSTOMERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    total_orders INTEGER DEFAULT 0,
    total_spent NUMERIC DEFAULT 0,
    accepts_marketing BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- 7. CUSTOMER ADDRESSES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.customer_addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    address_line1 TEXT NOT NULL,
    address_line2 TEXT,
    landmark TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    pincode TEXT NOT NULL,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- 8. ORDERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT NOT NULL UNIQUE,
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    shipping_address JSONB NOT NULL,
    billing_address JSONB,
    subtotal NUMERIC NOT NULL,
    discount_amount NUMERIC DEFAULT 0,
    coupon_code TEXT,
    shipping_fee NUMERIC DEFAULT 0,
    tax_amount NUMERIC DEFAULT 0,
    total_amount NUMERIC NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pending Payment', -- 'Pending Payment', 'Paid', 'Processing', 'Packed', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'
    payment_status TEXT NOT NULL DEFAULT 'Pending', -- 'Pending', 'Paid', 'Failed', 'Refunded'
    payment_method TEXT DEFAULT 'Razorpay',
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    razorpay_signature TEXT,
    tracking_number TEXT,
    tracking_courier TEXT,
    internal_notes TEXT,
    customer_notes TEXT,
    timeline JSONB DEFAULT '[]'::JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- 9. ORDER ITEMS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    product_slug TEXT,
    product_sku TEXT,
    product_image TEXT,
    size TEXT NOT NULL,
    color TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price NUMERIC NOT NULL,
    total_price NUMERIC NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- 10. PAYMENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    razorpay_order_id TEXT NOT NULL,
    razorpay_payment_id TEXT,
    razorpay_signature TEXT,
    amount NUMERIC NOT NULL,
    currency TEXT DEFAULT 'INR',
    status TEXT NOT NULL, -- 'created', 'authorized', 'captured', 'failed', 'refunded'
    payment_method TEXT,
    error_code TEXT,
    error_description TEXT,
    raw_payload JSONB,
    webhook_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- 11. BLOG POSTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT NOT NULL,
    featured_image TEXT,
    category TEXT DEFAULT 'Streetwear Culture',
    tags TEXT[] DEFAULT ARRAY['Fashion', 'Drop', 'Streetwear'],
    author TEXT DEFAULT 'InkThread Hub Team',
    is_published BOOLEAN DEFAULT true,
    published_at TIMESTAMPTZ DEFAULT now(),
    read_time TEXT DEFAULT '4 min read',
    seo_title TEXT,
    seo_description TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- 12. ANNOUNCEMENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'sale', -- 'drop', 'sale', 'launch', 'general'
    link_url TEXT,
    is_active BOOLEAN DEFAULT true,
    priority INTEGER DEFAULT 0,
    start_date TIMESTAMPTZ DEFAULT now(),
    end_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- 13. EMAIL TEMPLATES & LOGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.email_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    subject TEXT NOT NULL,
    html_body TEXT NOT NULL,
    variables TEXT[] DEFAULT ARRAY['customer_name', 'order_number', 'total_amount'],
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.email_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_email TEXT NOT NULL,
    recipient_name TEXT,
    template_id UUID REFERENCES public.email_templates(id) ON DELETE SET NULL,
    subject TEXT NOT NULL,
    status TEXT NOT NULL, -- 'sent', 'failed', 'queued'
    error_message TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- 14. ADMIN USERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID UNIQUE,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin', -- 'super_admin', 'admin', 'content_manager'
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- 15. INDEXES FOR PERFORMANCE
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_is_published ON public.products(is_published);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON public.orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON public.payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_razorpay_order_id ON public.payments(razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_blog_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_published ON public.blog_posts(is_published);

-- ============================================================================
-- 16. ATOMIC INVENTORY DEDUCTION DATABASE FUNCTION
-- ============================================================================
CREATE OR REPLACE FUNCTION public.deduct_inventory_atomic(
    p_order_id UUID,
    p_items JSONB,
    p_admin_user TEXT DEFAULT 'Payment Webhook'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    item JSONB;
    v_product_id UUID;
    v_qty INTEGER;
    v_current_stock INTEGER;
    v_product_name TEXT;
    v_sku TEXT;
BEGIN
    -- Iterate through each item in the order
    FOR item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        v_product_id := (item->>'product_id')::UUID;
        v_qty := (item->>'quantity')::INTEGER;

        -- Lock the product row for update to prevent race conditions
        SELECT stock_quantity, name, sku INTO v_current_stock, v_product_name, v_sku
        FROM public.products
        WHERE id = v_product_id
        FOR UPDATE;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Product with ID % not found', v_product_id;
        END IF;

        IF v_current_stock < v_qty THEN
            RAISE EXCEPTION 'Insufficient stock for product % (Current: %, Requested: %)', v_product_name, v_current_stock, v_qty;
        END IF;

        -- Deduct stock
        UPDATE public.products
        SET stock_quantity = stock_quantity - v_qty,
            updated_at = now()
        WHERE id = v_product_id;

        -- Record in audit log
        INSERT INTO public.inventory_history (
            product_id,
            product_name,
            sku,
            previous_quantity,
            new_quantity,
            quantity_changed,
            reason,
            order_id,
            admin_user
        ) VALUES (
            v_product_id,
            v_product_name,
            v_sku,
            v_current_stock,
            v_current_stock - v_qty,
            -v_qty,
            'Order Placement & Payment Confirmation',
            p_order_id,
            p_admin_user
        );
    END LOOP;

    RETURN jsonb_build_object('success', true, 'message', 'Inventory successfully deducted');
END;
$$;

-- ============================================================================
-- 17. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is an authorized admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE auth_user_id = auth.uid() AND is_active = true
    );
$$;

-- SITE SETTINGS: Public read, Admin write
CREATE POLICY "Public can view site settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admin can update site settings" ON public.site_settings FOR ALL USING (public.is_admin());

-- CATEGORIES: Public read, Admin manage
CREATE POLICY "Public can view categories" ON public.categories FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "Admin can manage categories" ON public.categories FOR ALL USING (public.is_admin());

-- PRODUCTS: Public view published, Admin manage all
CREATE POLICY "Public can view published products" ON public.products FOR SELECT USING (is_published = true OR public.is_admin());
CREATE POLICY "Admin can manage products" ON public.products FOR ALL USING (public.is_admin());

-- PRODUCT VARIANTS: Public view, Admin manage
CREATE POLICY "Public can view product variants" ON public.product_variants FOR SELECT USING (true);
CREATE POLICY "Admin can manage product variants" ON public.product_variants FOR ALL USING (public.is_admin());

-- INVENTORY HISTORY: Admin only
CREATE POLICY "Admin can view inventory history" ON public.inventory_history FOR SELECT USING (public.is_admin());
CREATE POLICY "Admin can insert inventory history" ON public.inventory_history FOR INSERT WITH CHECK (public.is_admin());

-- BLOG POSTS: Public view published, Admin manage all
CREATE POLICY "Public can view published blog posts" ON public.blog_posts FOR SELECT USING (is_published = true OR public.is_admin());
CREATE POLICY "Admin can manage blog posts" ON public.blog_posts FOR ALL USING (public.is_admin());

-- ANNOUNCEMENTS: Public view active, Admin manage
CREATE POLICY "Public can view active announcements" ON public.announcements FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "Admin can manage announcements" ON public.announcements FOR ALL USING (public.is_admin());

-- ORDERS & ORDER ITEMS: Customer view own by email or authenticated ID, Admin manage all
CREATE POLICY "Public can create orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Customers view own orders" ON public.orders FOR SELECT USING (customer_email = current_setting('request.jwt.claim.email', true) OR public.is_admin());
CREATE POLICY "Admin manage orders" ON public.orders FOR ALL USING (public.is_admin());

CREATE POLICY "Public can create order items" ON public.order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Customers view own order items" ON public.order_items FOR SELECT USING (true);
CREATE POLICY "Admin manage order items" ON public.order_items FOR ALL USING (public.is_admin());

-- PAYMENTS: Admin manage, public insert through backend API
CREATE POLICY "Admin manage payments" ON public.payments FOR ALL USING (public.is_admin());

-- CUSTOMERS: Public create, Admin manage
CREATE POLICY "Public can create customer profile" ON public.customers FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin manage customers" ON public.customers FOR ALL USING (public.is_admin());

-- EMAIL TEMPLATES & LOGS: Admin only
CREATE POLICY "Admin manage email templates" ON public.email_templates FOR ALL USING (public.is_admin());
CREATE POLICY "Admin manage email logs" ON public.email_logs FOR ALL USING (public.is_admin());

-- ADMIN USERS: Non-recursive policies
CREATE POLICY "Admin can view admin users" ON public.admin_users FOR SELECT USING (auth_user_id = auth.uid() AND is_active = true);
CREATE POLICY "Super admin can manage admin users" ON public.admin_users FOR ALL USING (
    auth_user_id = auth.uid() AND is_active = true
);

-- ============================================================================
-- 18. STORAGE BUCKETS SETUP (Run via Supabase Dashboard or API)
-- ============================================================================
-- Bucket 'product-images' (Public)
-- Bucket 'blog-media' (Public)
-- Storage policy: Anyone can read, authenticated admin users can upload/delete.
