-- ============================================================================
-- INKTHREAD HUB - SEED DATA SCRIPT
-- ============================================================================

-- Site Settings
INSERT INTO public.site_settings (
    id, brand_name, tagline, contact_email, support_phone, currency, currency_symbol,
    free_shipping_threshold, default_shipping_fee, tax_percent,
    announcement_bar_enabled, announcement_bar_text
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    'InkThread Hub',
    'Heavyweight Artisanal Drops & Raw Streetwear Culture',
    'support@inkthreadhub.com',
    '+91 98765 43210',
    'INR',
    '₹',
    999,
    99,
    5,
    true,
    '⚡ FLASH DROP: 20% OFF ON ORDERS OVER ₹1,499 | USE CODE: STREET20'
) ON CONFLICT (id) DO NOTHING;

-- Categories
INSERT INTO public.categories (id, name, slug, description, image_url, display_order) VALUES
('11111111-1111-1111-1111-111111110001', 'Men', 'men', 'Heavyweight streetwear, boxy oversized graphic tees & hoodies for Men.', '/images/sungod_classic_black_front.jpg', 1),
('11111111-1111-1111-1111-111111110002', 'Women', 'women', 'Oversized crop tees, relaxed streetwear silhouettes & hoodies for Women.', '/images/plain_oversized_white.jpg', 2),
('11111111-1111-1111-1111-111111110003', 'Pet Accessories', 'pet', 'Genuine leather brass-buckle collars, neck belts & high-street pet gear.', '/images/hd_pet_collar.png', 3),
('11111111-1111-1111-1111-111111110004', 'Oversized T-Shirts', 'oversized-t-shirts', '240 GSM heavyweight boxy fit drops with drop-shoulder silhouettes.', '/images/plain_oversized_black.jpg', 4),
('11111111-1111-1111-1111-111111110005', 'Heavyweight Hoodies', 'heavyweight-hoodies', '380 GSM fleece and French terry hoodies engineered for comfort & drape.', '/images/hd_acidwash_hoodie.png', 5),
('11111111-1111-1111-1111-111111110006', 'Graphic Drops', 'graphic-drops', 'Artisanal anime, mythology, and dark-aesthetic screen-printed streetwear.', '/images/sungod_luffy_acidwash_front.jpg', 6),
('11111111-1111-1111-1111-111111110007', 'Jackets & Outerwear', 'jackets-outerwear', 'All-over print bombers and heavyweight varsity streetwear outerwear.', '/images/hd_aop_bomber.png', 7),
('11111111-1111-1111-1111-111111110008', 'Streetwear Accessories', 'streetwear-accessories', 'Totes, caps, brass-buckle pet collars and utility lifestyle pieces.', '/images/hd_tote_bag.png', 8)
ON CONFLICT (slug) DO NOTHING;

-- Products
INSERT INTO public.products (
    id, name, slug, sku, description, short_description, category_name, product_type,
    price, sale_price, cost_price, discount_percent, sizes, colors, thumbnail, images,
    is_published, is_featured, is_new_arrival, is_best_seller, stock_quantity, low_stock_threshold,
    fabric_gsm, material_care, seo_title, seo_description
) VALUES
(
    '22222222-2222-2222-2222-222222220001',
    'SunGod Luffy Acid Wash Graphic Hoodie',
    'sungod-luffy-acid-wash-hoodie',
    'ITH-HD-SGL-01',
    'The crowning piece of our Gear 5 drop. Features an ultra-heavy 380 GSM loop-knit French Terry with artisanal acid-wash distressing, custom embroidered chest detail, and a massive high-density back print depicting Sun God Luffy in mythological resonance. Ribbed hems, oversized kangaroo pocket, and double-layered heavyweight hood.',
    '380 GSM Heavyweight French Terry with artisanal acid-wash and mythology high-density screenprint.',
    'Heavyweight Hoodies',
    'Heavyweight Hoodie',
    2499,
    1999,
    850,
    20,
    ARRAY['S', 'M', 'L', 'XL', 'XXL'],
    ARRAY['Acid Wash Grey', 'Obsidian Black', 'Chalk White'],
    '/images/hd_acidwash_hoodie.png',
    ARRAY['/images/hd_acidwash_hoodie.png', '/images/sungod_luffy_acidwash_front.jpg', '/images/sungod_luffy_acidwash_back.jpg', '/images/sungod_luffy_black_hoodie.jpg'],
    true, true, true, true, 45, 5, 380,
    '100% Cotton French Terry. 380 GSM. Pre-shrunk & Acid Washed. Wash cold inside out.',
    'SunGod Luffy Acid Wash Streetwear Hoodie | InkThread Hub',
    'Shop the ultra-heavy 380 GSM SunGod Luffy Acid Wash Hoodie with high-density screenprint.'
),
(
    '22222222-2222-2222-2222-222222220002',
    'Vintage SunGod Graphic Oversized Tee',
    'vintage-sungod-graphic-oversized-tee',
    'ITH-TEE-SGC-02',
    'Crafted with 240 GSM pure combed cotton. Features a relaxed drop-shoulder cut, thick 1.25-inch ribbed crewneck collar, and durable discharge screen-printing that never cracks or peels.',
    '240 GSM boxy oversized drop with mythological Sun God discharge print.',
    'Oversized T-Shirts',
    'Oversized T-Shirt',
    1299,
    899,
    380,
    30,
    ARRAY['S', 'M', 'L', 'XL', 'XXL'],
    ARRAY['Obsidian Black', 'Vintage Off-White'],
    '/images/sungod_classic_black_front.jpg',
    ARRAY['/images/sungod_classic_black_front.jpg', '/images/sungod_classic_black_back.jpg', '/images/sungod_classic_white_front.jpg', '/images/sungod_classic_white_back.jpg'],
    true, true, true, true, 80, 10, 240,
    '100% Super-Combed Cotton. 240 GSM Heavyweight Jersey. Machine wash cold.',
    'Vintage SunGod Graphic Oversized Tee | InkThread Hub',
    'Heavyweight 240 GSM oversized streetwear t-shirt with durable vintage discharge print.'
),
(
    '22222222-2222-2222-2222-222222220003',
    'All-Over Print Street Bomber Jacket',
    'all-over-print-street-bomber-jacket',
    'ITH-JKT-BMB-03',
    'Engineered for maximum street presence. Premium satin polyester shell with all-over custom artwork sublimated under heat pressure. Diamond-quilted inner insulation lining, heavy brass zipper, and ribbed athletic cuffs.',
    'Insulated all-over sublimated streetwear bomber with heavy brass hardware.',
    'Jackets & Outerwear',
    'Bomber Jacket',
    3499,
    2799,
    1200,
    20,
    ARRAY['M', 'L', 'XL', 'XXL'],
    ARRAY['Cyber Obsidian', 'Neon Abstract'],
    '/images/hd_aop_bomber.png',
    ARRAY['/images/hd_aop_bomber.png', '/images/hd_varsity_jacket.png'],
    true, true, true, false, 28, 4, 320,
    'Water-resistant poly-satin shell with polyester diamond-quilted fill. Wipe clean or dry clean only.',
    'All-Over Print Street Bomber Jacket | InkThread Hub',
    'Elevate your streetwear layering with the insulated AOP Bomber Jacket by InkThread Hub.'
),
(
    '22222222-2222-2222-2222-222222220004',
    'Mandala Elephant Oversized Boxy Tee',
    'mandala-elephant-oversized-tee',
    'ITH-TEE-MDE-04',
    'A synthesis of Indian artisanal sacred geometry and raw modern streetwear. Intricate mandala elephant back-canvas printed with metallic-fleck and soft matte pigment ink on 240 GSM heavyweight cotton.',
    'Sacred geometry mandala elephant print on 240 GSM boxy streetwear tee.',
    'Graphic Drops',
    'Oversized T-Shirt',
    1199,
    799,
    350,
    33,
    ARRAY['S', 'M', 'L', 'XL', 'XXL'],
    ARRAY['Obsidian Black', 'Forest Sage', 'Chalk White'],
    '/images/mandala_elephant_front.jpg',
    ARRAY['/images/mandala_elephant_front.jpg', '/images/mandala_elephant_back.jpg'],
    true, false, true, true, 60, 8, 240,
    '100% Combed Cotton. 240 GSM. Gentle machine wash inside out in cold water.',
    'Mandala Elephant Oversized Boxy Tee | InkThread Hub',
    'Shop the Mandala Elephant Oversized Streetwear Tee with metallic and matte pigment ink.'
),
(
    '22222222-2222-2222-2222-222222220005',
    'Essential Minimalist Heavyweight Plain Tee',
    'essential-minimalist-heavyweight-plain-tee',
    'ITH-TEE-PLN-05',
    'The holy grail of streetwear basics. Zero loud branding, pristine tailoring. Cut with extra wide shoulders, elbow-length sleeves, and high-density bio-washed 240 GSM jersey that holds its structural shape wash after wash.',
    '240 GSM essential plain heavyweight tee with structural boxy fit.',
    'Oversized T-Shirts',
    'Oversized T-Shirt',
    999,
    699,
    290,
    30,
    ARRAY['S', 'M', 'L', 'XL', 'XXL'],
    ARRAY['Obsidian Black', 'Chalk White', 'Forest Green', 'Navy Blue', 'Teal Mist'],
    '/images/plain_oversized_black.jpg',
    ARRAY['/images/plain_oversized_black.jpg', '/images/plain_oversized_white.jpg', '/images/plain_oversized_green.jpg', '/images/plain_oversized_navy.jpg', '/images/plain_oversized_teal.jpg'],
    true, true, false, true, 120, 15, 240,
    '100% Ring-Spun Cotton. 240 GSM. Bio-washed for ultra-soft handfeel. Cold wash.',
    'Essential Heavyweight Plain Oversized Tee | InkThread Hub',
    'The cleanest streetwear basic. 240 GSM heavyweight boxy oversized plain t-shirt.'
),
(
    '22222222-2222-2222-2222-222222220006',
    'Heavy-Duty Canvas Street Tote Bag',
    'heavy-duty-canvas-street-tote-bag',
    'ITH-ACC-TOT-06',
    'Built from ultra-durable 16oz cotton duck canvas with reinforced cross-stitched webbing handles, interior zip organizer pocket for keys and phone, and screenprinted typographic street manifesto.',
    '16oz Heavyweight Canvas Tote with interior zippered stash pocket.',
    'Streetwear Accessories',
    'Accessories',
    799,
    499,
    180,
    37,
    ARRAY['One Size'],
    ARRAY['Natural Canvas', 'Obsidian Black'],
    '/images/hd_tote_bag.png',
    ARRAY['/images/hd_tote_bag.png'],
    true, false, true, false, 50, 5, 450,
    '100% 16oz Cotton Duck Canvas. Spot clean with damp cloth.',
    'Heavy-Duty Street Canvas Tote Bag | InkThread Hub',
    'Heavyweight 16oz canvas tote bag with reinforced handles and interior zip stash pocket.'
)
ON CONFLICT (slug) DO NOTHING;

-- Blog Posts
INSERT INTO public.blog_posts (
    id, title, slug, excerpt, content, featured_image, category, tags, author, read_time
) VALUES
(
    '33333333-3333-3333-3333-333333330001',
    'The Anatomy of 240 GSM: Why Heavyweight Cotton Defines Modern Streetwear',
    'the-anatomy-of-240-gsm-heavyweight-streetwear',
    'Discover why flimsy 140 GSM tees are obsolete and how 240+ GSM French Terry and heavy jersey create the iconic boxy drape coveted across streetwear culture.',
    '## The Death of Flimsy Fabrics\n\nFor decades, fast fashion normalized paper-thin 140-160 GSM cotton that lost its structural integrity after two laundry cycles. But the rise of modern Gen-Z streetwear culture flipped the script.\n\n### What Exactly is GSM?\n\nGSM stands for *Grams per Square Meter*. It is the objective metric of textile density. \n- **140 - 160 GSM**: Lightweight, transparent under sunlight, collapses onto the body without structure.\n- **180 - 200 GSM**: Standard commercial t-shirt weight.\n- **240 - 280 GSM (The InkThread Standard)**: Heavyweight, opaque, rigid drape, perfect boxy silhouette.\n- **350 - 400 GSM**: Premium fleece and French Terry used in luxury hoodies.\n\n### Why Structure Matters in Streetwear\n\nA true drop-shoulder oversized tee requires a fabric with enough tensile memory to hold a crisp line from the shoulder seam down to the elbow. When you slip on an InkThread Hub 240 GSM tee, it doesn''t cling—it creates a structured, architectural silhouette.',
    '/images/plain_oversized_black.jpg',
    'Streetwear Culture',
    ARRAY['Streetwear', 'Fabric Guide', 'GSM', 'Oversized Fit'],
    'Arjun Varma (Creative Lead)',
    '4 min read'
),
(
    '33333333-3333-3333-3333-333333330002',
    'Behind the Drop: Reimagining SunGod Mythology Through Acid-Wash Artistry',
    'behind-the-drop-sungod-acid-wash-artistry',
    'A look behind the scenes of our signature SunGod drop—from hand-drawn high-density vector illustrations to manual stone-wash distressing.',
    '## Myth Meets the Concrete Jungle\n\nStreetwear is about storytelling through wearable art. For our SunGod series, our design team spent three months conceptualizing ancient solar deities and manga-inspired warrior awakenings into high-contrast screenprints.\n\n### The Acid Wash Process\n\nNo two pieces from the SunGod collection are identical. Each garment undergoes a hand-applied potassium permanganate spray followed by pumice stone tumbling. This breaks down the surface dye while leaving the 380 GSM cotton fibers resilient and buttery soft.',
    '/images/sungod_luffy_acidwash_front.jpg',
    'Lookbook & Design',
    ARRAY['Design', 'Drop', 'Anime', 'Acid Wash'],
    'InkThread Atelier',
    '5 min read'
)
ON CONFLICT (slug) DO NOTHING;

-- Email Templates
INSERT INTO public.email_templates (id, name, subject, html_body, variables) VALUES
(
    '44444444-4444-4444-4444-444444440001',
    'order_confirmation',
    '🔥 InkThread Hub Order Confirmed: #{{order_number}}',
    '<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0c0d0e; color: #ffffff; padding: 32px; border-radius: 12px; border: 1px solid #222;">
        <h1 style="color: #00ff88; font-size: 24px; text-transform: uppercase; letter-spacing: 2px;">INKTHREAD HUB // ORDER CONFIRMED</h1>
        <p>Hey <strong>{{customer_name}}</strong>,</p>
        <p>Your drop is locked in! We have received your order <strong>#{{order_number}}</strong> totaling <strong>₹{{total_amount}}</strong>.</p>
        <div style="background: #18191c; padding: 20px; border-radius: 8px; margin: 24px 0;">
            <p style="margin: 0; color: #888;">Delivery Status:</p>
            <p style="margin: 4px 0 0 0; font-weight: bold; color: #ffffff;">⚡ Preparing for dispatch from Delhi Atelier</p>
        </div>
        <p style="color: #aaa; font-size: 14px;">You can track your order live anytime on our portal.</p>
        <p style="color: #666; font-size: 12px; margin-top: 30px;">InkThread Hub — Heavyweight Streetwear & Artisanal Drops.</p>
    </div>',
    ARRAY['customer_name', 'order_number', 'total_amount']
),
(
    '44444444-4444-4444-4444-444444440002',
    'order_shipped',
    '🚀 InkThread Hub Order #{{order_number}} is on its way!',
    '<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0c0d0e; color: #ffffff; padding: 32px; border-radius: 12px; border: 1px solid #222;">
        <h1 style="color: #3b82f6; font-size: 24px; text-transform: uppercase; letter-spacing: 2px;">ORDER DISPATCHED</h1>
        <p>Hey <strong>{{customer_name}}</strong>,</p>
        <p>Your pieces from order <strong>#{{order_number}}</strong> have been packed in our premium matte black box and handed over to our courier partner.</p>
        <p>Tracking Courier: <strong>{{tracking_courier}}</strong><br/>AWB Tracking No: <strong>{{tracking_number}}</strong></p>
    </div>',
    ARRAY['customer_name', 'order_number', 'tracking_courier', 'tracking_number']
)
ON CONFLICT (name) DO NOTHING;

-- Announcements
INSERT INTO public.announcements (id, title, message, type, link_url, is_active, priority) VALUES
('55555555-5555-5555-5555-555555550001', 'Gear 5 Acid Wash Drop', '⚡ NEW DROP: SunGod Acid Wash 380 GSM Hoodies are live in limited quantities.', 'drop', '/shop?category=heavyweight-hoodies', true, 1),
('55555555-5555-5555-5555-555555550002', 'Free Shipping Pan-India', '🚚 Free express shipping on all prepaid orders above ₹999.', 'general', '/shop', true, 2)
ON CONFLICT (id) DO NOTHING;
