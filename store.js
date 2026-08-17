/**
 * Inkthread Hub — Centralized Product, Inventory & Journal CMS Store (Single Source of Truth)
 * Full Qikink & Custom Brand Product Catalog with All HD Images & Premium Stitch Aesthetics
 */

const STORAGE_KEY = 'inkthread_catalog_v11';
const CART_KEY = 'inkthread_cart_v1';
const ORDERS_KEY = 'inkthread_orders_v1';
const REVIEWS_KEY = 'inkthread_reviews_v1';
const JOURNAL_KEY = 'inkthread_journal_v1';
const EVENT_NAME = 'inkthread_catalog_updated';

// INITIAL 5 AUTHENTIC CUSTOMER REVIEWS
const INITIAL_REVIEWS = [
    {
        id: "rev-1",
        name: "Rahul Sharma",
        location: "Delhi",
        rating: 5,
        date: "2026-08-16",
        productName: "Acid Wash Oversized Hoodie",
        comment: "The 240 GSM Acid-Wash Hoodie has the best drape and boxy fit I've ever owned. Heavyweight cotton feels ultra premium. Worth every rupee!"
    },
    {
        id: "rev-2",
        name: "Ananya Roy",
        location: "Kolkata",
        rating: 5,
        date: "2026-08-15",
        productName: "Pet Neck Belt Bracket Collar | PC01",
        comment: "Bought the Pet Neck Belt Bracket Collar for my Golden Retriever. The solid brass buckle and genuine full-grain leather feel indestructible!"
    },
    {
        id: "rev-3",
        name: "Karan Verma",
        location: "Kanpur",
        rating: 5,
        date: "2026-08-14",
        productName: "Sun God Luffy Gear 5 Graphic Tee",
        comment: "The Sun God Luffy Gear 5 Tee print is crisp and vibrant even after 15+ machine washes. Direct-to-garment print quality is top-notch!"
    },
    {
        id: "rev-4",
        name: "Priya Nair",
        location: "Bangalore",
        rating: 5,
        date: "2026-08-12",
        productName: "Women's Boxy Cotton Crop Top | WC25",
        comment: "Women's Boxy Crop Top in Sage Green is extremely soft and thick (220 GSM). Perfect drop shoulder cut and super quick delivery to Bangalore!"
    },
    {
        id: "rev-5",
        name: "Devraj Patel",
        location: "Ahmedabad",
        rating: 5,
        date: "2026-08-10",
        productName: "Primitive Bull Skull Matty Polo | MP25",
        comment: "Ordered the Primitive Bull Skull Polo. Fabric matty pique quality is 10/10 and the COD ₹99 advance PhonePe QR process was super smooth."
    }
];

// INITIAL FASHION & CRAFTSMANSHIP JOURNAL STORIES
const INITIAL_JOURNAL = [
    {
        id: "art-1",
        title: "The Philosophy of 240 GSM Bio-Washed Heavyweight Cotton: Why Fabric Weight Matters",
        category: "Slow Fashion & Fabric",
        author: "Inkthread Design Lab",
        readTime: "5 min read",
        date: "August 15, 2026",
        image: "images/hd_acidwash_hoodie.png",
        excerpt: "Exploring why 240 GSM bio-washed combed cotton creates unmatched structural drape, boxy silhouette preservation, and breathable comfort.",
        content: `When building high-end streetwear and daily essentials, weight is not just a specification — it is the foundation of silhouette architecture. 240 GSM (grams per square meter) bio-washed cotton offers the perfect golden ratio: substantial enough to hold crisp boxy cuts without clinging to the body, yet refined enough to stay naturally breathable in Indian warm climates.\n\nBio-washing removes surface micro-fuzz, leaving a ultra-smooth handfeel that preserves printed graphics after 50+ wash cycles without pilling or fading.`,
        status: "published"
    },
    {
        id: "art-2",
        title: "From Screen Printing to Direct-to-Garment: The Art of Inkthread Craftsmanship",
        category: "Print Technology",
        author: "Surya Tiwari & Workshop",
        readTime: "6 min read",
        date: "August 10, 2026",
        image: "images/hd_aop_bomber.png",
        excerpt: "A deep dive into water-based pigmented inks, high-density screen transfers, and eco-friendly pigment curing.",
        content: `Every print produced at Inkthread Hub undergoes a rigorous multi-stage curing process. We use non-toxic, OEKO-TEX certified water-based inks that penetrate deep into cotton fibers rather than sitting as heavy plastic layers.\n\nThis ensures our Anime, Graphic, and Abstract prints remain soft, flexible, and completely crack-proof over time, while keeping skin non-irritated.`,
        status: "published"
    },
    {
        id: "art-3",
        title: "Streetwear Aesthetics 2026: Boxy Cuts, Oversized Silhouettes & Earth Tones",
        category: "Style Guide",
        author: "Editorial Team",
        readTime: "4 min read",
        date: "August 05, 2026",
        image: "images/hd_varsity_jacket.png",
        excerpt: "How to style oversized drop-shoulder tees, acid-wash hoodies, and heavyweight joggers for effortless modern minimalist looks.",
        content: `Streetwear has evolved beyond loud branding into quiet textural luxury. Modern oversized styling relies on proportion: pairing a 240 GSM boxy crop or oversized tee with relaxed, tapered joggers creates a balanced contour.\n\nMuted tones like Sage Green, Off-White, Burgundy Maroon, and Acid Wash Charcoal form the ultimate versatile capsule wardrobe that transitions seamlessly between work and street.`,
        status: "published"
    },
    {
        id: "art-4",
        title: "Crafting Premium Pet Apparel & Brass Hardware: Style For Your Companion",
        category: "Pet Accessories",
        author: "Pet Line Specialist",
        readTime: "4 min read",
        date: "August 01, 2026",
        image: "images/hd_pet_collar.png",
        excerpt: "Why full-grain leather, padded inner lining, and solid brass D-rings make our pet collar brackets built for a lifetime of walks.",
        content: `Pets deserve the same level of craftsmanship as human luxury wear. Our Pet Neck Belt Collars feature 100% genuine full-grain bridle leather, padded neoprene inner linings to prevent fur friction, and heavy-duty alloy bracket rivets with anti-rust brass D-rings engineered to withstand pull pressure up to 80 kg.`,
        status: "published"
    }
];

// FULL COMPREHENSIVE PRODUCT CATALOG WITH STITCH LUXURY SPECIFICATIONS
const INITIAL_PRODUCTS = [
    {
        id: "prod-pet-collar-bracket",
        sku: "PC01-COL-TAN-S",
        slug: "pet-neck-belt-bracket-collar-pc01",
        name: "Pet Neck Belt Bracket Collar with Brass Buckle & D-Ring | PC01",
        category: "Pet Products",
        subCategory: "Pet Collars & Belts",
        productType: "Pet Accessories",
        shortDescription: "Heavy-duty genuine leather pet neck belt collar with reinforced bracket, solid brass buckle and leash D-ring.",
        fullDescription: "Crafted for maximum comfort and durability. Features genuine full-grain leather, padded inner neck lining, heavy-duty alloy bracket rivets, anti-rust brass buckle, and secure D-ring leash attachment for dogs and cats.",
        regularPrice: 799,
        salePrice: 499,
        discountPercent: 37,
        colors: ["Tan Brown", "Obsidian Black", "Ruby Red"],
        sizes: ["S (Small Dogs/Cats)", "M (Medium Dogs)", "L (Large Dogs)"],
        variants: [
            { color: "Tan Brown", size: "M (Medium Dogs)", stock: 25, sku: "PC01-TAN-M" }
        ],
        images: {
            front: "images/hd_pet_collar.png",
            back: "images/hd_pet_collar.png",
            gallery: ["images/hd_pet_collar.png"]
        },
        rating: 5.0,
        reviewsCount: 35,
        reviews: INITIAL_REVIEWS,
        tags: ["pet", "collar", "neckbelt", "bracket", "dog", "cat", "bestseller"],
        status: "published",
        isFeatured: true,
        isNewLaunch: true,
        isBestseller: true,
        isTrending: true,
        isSale: true,
        isOutOfStock: false,
        createdAt: "2026-08-17T14:48:00Z"
    },
    {
        id: "prod-womens-crop-top",
        sku: "WC25-CRP-SGE-M",
        slug: "womens-heavyweight-boxy-cotton-crop-top-wc25",
        name: "Women's Heavyweight Boxy Cotton Crop Top | WC25",
        category: "Women's Clothing",
        subCategory: "Crop Tops",
        productType: "Apparel",
        shortDescription: "220 GSM 100% organic cotton boxy cropped tee with relaxed drop shoulders.",
        fullDescription: "Premium heavyweight organic cotton crop top in Soft Sage Green and Off White.",
        regularPrice: 899,
        salePrice: 599,
        discountPercent: 33,
        colors: ["Sage Green", "Off White", "Jet Black"],
        sizes: ["XS", "S", "M", "L"],
        variants: [
            { color: "Sage Green", size: "S", stock: 20, sku: "WC25-SGE-S" }
        ],
        images: {
            front: "images/hd_womens_crop_top.png",
            back: "images/hd_womens_crop_top.png",
            gallery: ["images/hd_womens_crop_top.png"]
        },
        rating: 4.9,
        reviewsCount: 22,
        reviews: INITIAL_REVIEWS,
        tags: ["womens", "croptop", "sagegreen", "bestseller", "cotton"],
        status: "published",
        isFeatured: true,
        isNewLaunch: true,
        isBestseller: true,
        isTrending: true,
        isSale: true,
        isOutOfStock: false,
        createdAt: "2026-08-17T14:45:00Z"
    },
    {
        id: "prod-kids-classic-tee",
        sku: "KC15-KID-YEL-5Y",
        slug: "kids-organic-cotton-graphic-tee-kc15",
        name: "Kids Organic Cotton Classic Graphic Tee | KC15",
        category: "Kids Clothing",
        subCategory: "Kids T-Shirts",
        productType: "Kids Wear",
        shortDescription: "180 GSM hypo-allergenic combed cotton soft tee for kids aged 2-12 years.",
        fullDescription: "Super gentle 100% organic combed cotton tee for kids.",
        regularPrice: 599,
        salePrice: 399,
        discountPercent: 33,
        colors: ["Pastel Yellow", "Baby Blue", "Soft Pink"],
        sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-12Y"],
        variants: [
            { color: "Pastel Yellow", size: "4-5Y", stock: 30, sku: "KC15-YEL-4Y" }
        ],
        images: {
            front: "images/hd_classic_crew_tee.png",
            back: "images/hd_classic_crew_tee.png",
            gallery: ["images/hd_classic_crew_tee.png"]
        },
        rating: 5.0,
        reviewsCount: 18,
        reviews: INITIAL_REVIEWS,
        tags: ["kids", "tshirt", "organic", "cotton", "bestseller"],
        status: "published",
        isFeatured: true,
        isNewLaunch: true,
        isBestseller: true,
        isTrending: true,
        isSale: true,
        isOutOfStock: false,
        createdAt: "2026-08-17T14:46:00Z"
    },
    {
        id: "prod-p349",
        sku: "MP25-PRIM-MAR-M",
        slug: "primitive-skull-graphic-polo-mp25",
        name: "Primitive Skull Graphic Matty Polo | MP25",
        category: "Men's Clothing",
        subCategory: "Polos",
        productType: "Apparel",
        shortDescription: "220 GSM Matty Pique Polo featuring custom Primitive Bull Skull chest embroidery.",
        fullDescription: "Crafted from 100% bio-washed 220 GSM combed matty pique cotton. Burgundy Maroon & Jet Black.",
        regularPrice: 699,
        salePrice: 349,
        discountPercent: 50,
        colors: ["Burgundy Maroon", "Jet Black"],
        sizes: ["S", "M", "L", "XL", "XXL"],
        variants: [
            { color: "Burgundy Maroon", size: "M", stock: 25, sku: "MP25-PRIM-MAR-M" }
        ],
        images: {
            front: "images/primitive_polo_maroon_front.jpg",
            back: "images/primitive_polo_maroon_back.jpg",
            gallery: ["images/primitive_polo_maroon_front.jpg", "images/primitive_polo_maroon_back.jpg"]
        },
        rating: 5.0,
        reviewsCount: 18,
        reviews: INITIAL_REVIEWS,
        tags: ["polo", "primitive", "skull", "sale", "mens", "bestseller"],
        status: "published",
        isFeatured: true,
        isNewLaunch: true,
        isBestseller: true,
        isTrending: true,
        isSale: true,
        isOutOfStock: false,
        createdAt: "2026-08-17T14:00:00Z"
    },
    {
        id: "prod-acidwash-hoodie",
        sku: "UH62-ACD-BLK-L",
        slug: "acid-wash-oversized-hoodie-uh62",
        name: "Acid Wash Heavyweight Oversized Hoodie | UH62",
        category: "Unisex Clothing",
        subCategory: "Hoodies",
        productType: "Apparel",
        shortDescription: "380 GSM 100% bio-washed fleece-lined acid wash heavyweight oversized hoodie.",
        fullDescription: "Vintage acid-wash treatment on 380 GSM heavyweight cotton fleece.",
        regularPrice: 1899,
        salePrice: 1299,
        discountPercent: 31,
        colors: ["Acid Wash Charcoal", "Vintage Blue"],
        sizes: ["S", "M", "L", "XL"],
        variants: [
            { color: "Acid Wash Charcoal", size: "L", stock: 15, sku: "UH62-ACD-L" }
        ],
        images: {
            front: "images/hd_acidwash_hoodie.png",
            back: "images/hd_acidwash_hoodie.png",
            gallery: ["images/hd_acidwash_hoodie.png"]
        },
        rating: 5.0,
        reviewsCount: 42,
        reviews: INITIAL_REVIEWS,
        tags: ["hoodie", "acidwash", "oversized", "unisex", "bestseller"],
        status: "published",
        isFeatured: true,
        isNewLaunch: true,
        isBestseller: true,
        isTrending: true,
        isSale: true,
        isOutOfStock: false,
        createdAt: "2026-08-17T14:10:00Z"
    },
    {
        id: "prod-aop-bomber",
        sku: "UA30-BMB-AOP-M",
        slug: "aop-oversized-bomber-jacket-ua30",
        name: "Unisex AOP Tactical Bomber Jacket | UA30",
        category: "Unisex Clothing",
        subCategory: "Jackets",
        productType: "Outerwear",
        shortDescription: "Water-resistant satin poly AOP bomber jacket with ribbed collar and brass zipper.",
        fullDescription: "High-definition custom sublimation print with thermal insulation layer.",
        regularPrice: 2499,
        salePrice: 1699,
        discountPercent: 32,
        colors: ["Cyber Matrix", "Stealth Black"],
        sizes: ["M", "L", "XL"],
        variants: [
            { color: "Cyber Matrix", size: "L", stock: 10, sku: "UA30-AOP-L" }
        ],
        images: {
            front: "images/hd_aop_bomber.png",
            back: "images/hd_aop_bomber.png",
            gallery: ["images/hd_aop_bomber.png"]
        },
        rating: 4.9,
        reviewsCount: 15,
        reviews: INITIAL_REVIEWS,
        tags: ["bomber", "jacket", "aop", "outerwear", "unisex"],
        status: "published",
        isFeatured: true,
        isNewLaunch: true,
        isBestseller: false,
        isTrending: true,
        isSale: true,
        isOutOfStock: false,
        createdAt: "2026-08-17T14:11:00Z"
    },
    {
        id: "prod-varsity-jacket",
        sku: "UJ31-VAR-BLK-L",
        slug: "vintage-varsity-heavyweight-jacket-uj31",
        name: "Varsity Heavyweight Leather-Sleeve Jacket | UJ31",
        category: "Unisex Clothing",
        subCategory: "Jackets",
        productType: "Outerwear",
        shortDescription: "Heavy melton wool body with vegan leather sleeves and chenille chest patch.",
        fullDescription: "Classic American varsity styling with snap buttons and quilted lining.",
        regularPrice: 2999,
        salePrice: 1999,
        discountPercent: 33,
        colors: ["Obsidian / Cream", "Maroon / OffWhite"],
        sizes: ["S", "M", "L", "XL"],
        variants: [
            { color: "Obsidian / Cream", size: "L", stock: 12, sku: "UJ31-VAR-L" }
        ],
        images: {
            front: "images/hd_varsity_jacket.png",
            back: "images/hd_varsity_jacket.png",
            gallery: ["images/hd_varsity_jacket.png"]
        },
        rating: 5.0,
        reviewsCount: 28,
        reviews: INITIAL_REVIEWS,
        tags: ["varsity", "jacket", "wool", "leather", "unisex"],
        status: "published",
        isFeatured: true,
        isNewLaunch: true,
        isBestseller: true,
        isTrending: true,
        isSale: true,
        isOutOfStock: false,
        createdAt: "2026-08-17T14:08:00Z"
    },
    {
        id: "prod-pet-hoodie",
        sku: "PH01-PET-HOD-M",
        slug: "pet-fleece-heavyweight-hoodie-ph01",
        name: "Pet Fleece Heavyweight Cozy Hoodie | PH01",
        category: "Pet Products",
        subCategory: "Pet Apparel",
        productType: "Pet Accessories",
        shortDescription: "Soft cotton fleece pet hoodie with leash slot and ribbed belly elastic.",
        fullDescription: "Keep your pet warm in style. Premium non-irritating cotton blend.",
        regularPrice: 799,
        salePrice: 449,
        discountPercent: 43,
        colors: ["Charcoal Grey", "Olive Green"],
        sizes: ["S", "M", "L"],
        variants: [
            { color: "Charcoal Grey", size: "M", stock: 20, sku: "PH01-GRE-M" }
        ],
        images: {
            front: "images/hd_pet_hoodie.png",
            back: "images/hd_pet_hoodie.png",
            gallery: ["images/hd_pet_hoodie.png"]
        },
        rating: 4.9,
        reviewsCount: 19,
        reviews: INITIAL_REVIEWS,
        tags: ["pet", "hoodie", "dog", "fleece"],
        status: "published",
        isFeatured: true,
        isNewLaunch: true,
        isBestseller: false,
        isTrending: true,
        isSale: true,
        isOutOfStock: false,
        createdAt: "2026-08-17T14:13:00Z"
    },
    {
        id: "prod-tote-bag",
        sku: "TA01-TOT-CAN-OS",
        slug: "classic-heavyweight-canvas-tote-bag-ta01",
        name: "Classic Heavyweight Canvas Tote Bag | TA01",
        category: "Accessories",
        subCategory: "Bags",
        productType: "Accessories",
        shortDescription: "400 GSM heavy cotton canvas tote bag with reinforced handles and interior pocket.",
        fullDescription: "Durable eco-canvas tote built for daily carrying, groceries, and laptop.",
        regularPrice: 499,
        salePrice: 299,
        discountPercent: 40,
        colors: ["Natural Canvas", "Jet Black"],
        sizes: ["One Size"],
        variants: [
            { color: "Natural Canvas", size: "One Size", stock: 50, sku: "TA01-NAT-OS" }
        ],
        images: {
            front: "images/hd_tote_bag.png",
            back: "images/hd_tote_bag.png",
            gallery: ["images/hd_tote_bag.png"]
        },
        rating: 5.0,
        reviewsCount: 30,
        reviews: INITIAL_REVIEWS,
        tags: ["tote", "bag", "canvas", "accessories"],
        status: "published",
        isFeatured: true,
        isNewLaunch: true,
        isBestseller: true,
        isTrending: true,
        isSale: true,
        isOutOfStock: false,
        createdAt: "2026-08-17T14:11:00Z"
    },
    {
        id: "prod-sungod-acidwash",
        sku: "UA61-SNG-ACD-M",
        slug: "sun-god-luffy-acidwash-tee-ua61",
        name: "Sun God Luffy Gear 5 Acid Wash Tee | UA61",
        category: "Unisex Clothing",
        subCategory: "T-Shirts",
        productType: "Apparel",
        shortDescription: "240 GSM bio-washed acid wash tee with vibrant DTG Sun God back graphic print.",
        fullDescription: "Premium heavyweight combed cotton with vintage wash and Japanese typography.",
        regularPrice: 1299,
        salePrice: 749,
        discountPercent: 42,
        colors: ["Acid Wash Charcoal"],
        sizes: ["S", "M", "L", "XL"],
        variants: [
            { color: "Acid Wash Charcoal", size: "M", stock: 35, sku: "UA61-SNG-M" }
        ],
        images: {
            front: "images/sungod_luffy_acidwash_front.jpg",
            back: "images/sungod_luffy_acidwash_back.jpg",
            gallery: ["images/sungod_luffy_acidwash_front.jpg", "images/sungod_luffy_acidwash_back.jpg"]
        },
        rating: 5.0,
        reviewsCount: 50,
        reviews: INITIAL_REVIEWS,
        tags: ["sungod", "luffy", "anime", "acidwash", "bestseller"],
        status: "published",
        isFeatured: true,
        isNewLaunch: true,
        isBestseller: true,
        isTrending: true,
        isSale: true,
        isOutOfStock: false,
        createdAt: "2026-08-17T14:08:00Z"
    }
];

class ProductsService {

    static init(forceReset = false) {
        if (forceReset || !localStorage.getItem(STORAGE_KEY)) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
        }
        if (!localStorage.getItem(JOURNAL_KEY)) {
            localStorage.setItem(JOURNAL_KEY, JSON.stringify(INITIAL_JOURNAL));
        }
        if (!localStorage.getItem(REVIEWS_KEY)) {
            localStorage.setItem(REVIEWS_KEY, JSON.stringify(INITIAL_REVIEWS));
        }

        if (!localStorage.getItem(CART_KEY)) {
            localStorage.setItem(CART_KEY, JSON.stringify([]));
        }
        if (!localStorage.getItem(ORDERS_KEY)) {
            localStorage.setItem(ORDERS_KEY, JSON.stringify([]));
        }

        window.addEventListener('storage', (e) => {
            if (e.key === STORAGE_KEY || e.key === CART_KEY || e.key === JOURNAL_KEY) {
                ProductsService.notifyListeners();
            }
        });
    }

    static notifyListeners() {
        window.dispatchEvent(new CustomEvent(EVENT_NAME));
    }

    static getRawCatalog() {
        ProductsService.init(false);
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY)) || INITIAL_PRODUCTS;
        } catch (e) {
            return INITIAL_PRODUCTS;
        }
    }

    static saveRawCatalog(catalog) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(catalog));
        ProductsService.notifyListeners();
    }

    // JOURNAL & BLOG ARTICLES CMS METHODS
    static getJournalArticles(includeDrafts = false) {
        try {
            let articles = JSON.parse(localStorage.getItem(JOURNAL_KEY)) || INITIAL_JOURNAL;
            if (!includeDrafts) {
                articles = articles.filter(a => a.status === 'published');
            }
            return articles;
        } catch (e) {
            return INITIAL_JOURNAL;
        }
    }

    static saveJournalArticle(articleData) {
        let articles = ProductsService.getJournalArticles(true);
        const existingIdx = articles.findIndex(a => a.id === articleData.id);

        if (existingIdx >= 0) {
            articles[existingIdx] = { ...articles[existingIdx], ...articleData, updatedAt: new Date().toISOString() };
        } else {
            const newArt = {
                id: 'art-' + Date.now(),
                date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
                readTime: '4 min read',
                author: 'Inkthread Hub Admin',
                status: 'published',
                ...articleData
            };
            articles.unshift(newArt);
        }

        localStorage.setItem(JOURNAL_KEY, JSON.stringify(articles));
        ProductsService.notifyListeners();
        return articleData;
    }

    static deleteJournalArticle(articleId) {
        let articles = ProductsService.getJournalArticles(true);
        articles = articles.filter(a => a.id !== articleId);
        localStorage.setItem(JOURNAL_KEY, JSON.stringify(articles));
        ProductsService.notifyListeners();
    }

    // CUSTOMER REVIEWS METHODS
    static getCustomerReviews() {
        try {
            return JSON.parse(localStorage.getItem(REVIEWS_KEY)) || INITIAL_REVIEWS;
        } catch (e) {
            return INITIAL_REVIEWS;
        }
    }

    static getAllProducts(options = {}) {
        let catalog = ProductsService.getRawCatalog();
        const now = new Date();

        catalog = catalog.map(p => {
            if (p.status === 'scheduled' && p.launchDate && new Date(p.launchDate) <= now) {
                p.status = 'published';
            }
            return p;
        });

        if (!options.includeUnpublished) {
            catalog = catalog.filter(p => p.status === 'published');
        } else if (options.status) {
            catalog = catalog.filter(p => p.status === options.status);
        }

        if (options.isFeatured) catalog = catalog.filter(p => p.isFeatured);
        if (options.isNewLaunch) catalog = catalog.filter(p => p.isNewLaunch);
        if (options.isBestseller) catalog = catalog.filter(p => p.isBestseller);
        if (options.isTrending) catalog = catalog.filter(p => p.isTrending);
        if (options.isSale) catalog = catalog.filter(p => p.isSale || (p.salePrice && p.salePrice < p.regularPrice));

        if (options.category && options.category !== 'all') {
            const catLower = options.category.toLowerCase();
            catalog = catalog.filter(p => 
                p.category.toLowerCase().includes(catLower) || 
                (p.productType && p.productType.toLowerCase().includes(catLower)) ||
                (p.subCategory && p.subCategory.toLowerCase().includes(catLower))
            );
        }

        if (options.search) {
            const q = options.search.toLowerCase().trim();
            catalog = catalog.filter(p =>
                p.name.toLowerCase().includes(q) ||
                p.sku.toLowerCase().includes(q) ||
                p.category.toLowerCase().includes(q) ||
                (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
            );
        }

        if (options.sort === 'price-low') {
            catalog.sort((a, b) => (a.salePrice || a.regularPrice) - (b.salePrice || b.regularPrice));
        } else if (options.sort === 'price-high') {
            catalog.sort((a, b) => (b.salePrice || b.regularPrice) - (a.salePrice || a.regularPrice));
        } else if (options.sort === 'newest') {
            catalog.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        return catalog;
    }

    static getProductById(id) {
        const catalog = ProductsService.getRawCatalog();
        return catalog.find(p => p.id === id || p.slug === id);
    }

    static getProductBySlug(slug) {
        const catalog = ProductsService.getRawCatalog();
        return catalog.find(p => p.slug === slug || p.id === slug);
    }

    static addReview(productId, reviewData) {
        let catalog = ProductsService.getRawCatalog();
        const p = catalog.find(x => x.id === productId || x.slug === productId);
        if (!p) return false;

        if (!p.reviews) p.reviews = [];
        
        const newReview = {
            id: 'rev-' + Date.now(),
            name: reviewData.name || 'Anonymous Client',
            rating: parseFloat(reviewData.rating) || 5,
            date: new Date().toISOString().split('T')[0],
            comment: reviewData.comment || 'Great quality!'
        };

        p.reviews.unshift(newReview);
        p.reviewsCount = p.reviews.length;
        
        const avg = p.reviews.reduce((sum, r) => sum + r.rating, 0) / p.reviews.length;
        p.rating = Math.round(avg * 10) / 10;

        ProductsService.saveRawCatalog(catalog);
        return newReview;
    }

    static saveProduct(productData) {
        let catalog = ProductsService.getRawCatalog();
        const existingIndex = catalog.findIndex(p => p.id === productData.id);

        if (!productData.slug) {
            productData.slug = productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        }
        if (!productData.sku) {
            productData.sku = 'INK-' + Math.random().toString(36).substr(2, 6).toUpperCase();
        }

        if (productData.regularPrice && productData.salePrice && productData.regularPrice > productData.salePrice) {
            productData.discountPercent = Math.round(((productData.regularPrice - productData.salePrice) / productData.regularPrice) * 100);
        } else {
            productData.discountPercent = 0;
        }

        if (existingIndex >= 0) {
            catalog[existingIndex] = { ...catalog[existingIndex], ...productData, updatedAt: new Date().toISOString() };
        } else {
            const newProduct = {
                id: 'prod-' + Date.now(),
                createdAt: new Date().toISOString(),
                rating: 5.0,
                reviewsCount: 0,
                reviews: INITIAL_REVIEWS,
                status: 'published',
                isFeatured: true,
                isNewLaunch: true,
                isBestseller: false,
                isTrending: true,
                isSale: false,
                variants: [
                    { color: "Standard", size: "M", stock: 10, sku: productData.sku + "-M" }
                ],
                colors: ["Standard"],
                sizes: ["M"],
                images: {
                    front: productData.images?.front || "images/hd_womens_crop_top.png",
                    back: productData.images?.back || "",
                    gallery: productData.images?.gallery || []
                },
                ...productData
            };
            catalog.unshift(newProduct);
        }

        ProductsService.saveRawCatalog(catalog);
        return productData;
    }

    static deleteProduct(id) {
        let catalog = ProductsService.getRawCatalog();
        catalog = catalog.filter(p => p.id !== id);
        ProductsService.saveRawCatalog(catalog);
    }

    static duplicateProduct(id) {
        const product = ProductsService.getProductById(id);
        if (!product) return;
        const copy = JSON.parse(JSON.stringify(product));
        copy.id = 'prod-' + Date.now();
        copy.name = copy.name + ' (Copy)';
        copy.slug = copy.slug + '-copy-' + Math.floor(Math.random() * 1000);
        copy.sku = 'INK-' + Math.random().toString(36).substr(2, 6).toUpperCase();
        copy.createdAt = new Date().toISOString();
        copy.status = 'draft';
        
        let catalog = ProductsService.getRawCatalog();
        catalog.unshift(copy);
        ProductsService.saveRawCatalog(catalog);
    }

    static toggleProductFlag(id, flagKey) {
        let catalog = ProductsService.getRawCatalog();
        const p = catalog.find(x => x.id === id);
        if (p) {
            p[flagKey] = !p[flagKey];
            ProductsService.saveRawCatalog(catalog);
        }
    }

    static updateProductStatus(id, newStatus) {
        let catalog = ProductsService.getRawCatalog();
        const p = catalog.find(x => x.id === id);
        if (p) {
            p.status = newStatus;
            ProductsService.saveRawCatalog(catalog);
        }
    }

    static getTotalStock(product) {
        if (product.isOutOfStock) return 0;
        if (!product.variants || product.variants.length === 0) return 0;
        return product.variants.reduce((sum, v) => sum + (parseInt(v.stock) || 0), 0);
    }

    static reduceInventory(productId, color, size, quantity = 1) {
        let catalog = ProductsService.getRawCatalog();
        const product = catalog.find(p => p.id === productId);
        if (!product) return false;

        let variant = product.variants ? product.variants.find(v => v.color === color && v.size === size) : null;
        if (!variant && product.variants && product.variants.length > 0) {
            variant = product.variants[0];
        }

        if (variant && variant.stock >= quantity) {
            variant.stock -= quantity;
            ProductsService.saveRawCatalog(catalog);
            return true;
        }
        return false;
    }

    static getCart() {
        ProductsService.init(false);
        try {
            return JSON.parse(localStorage.getItem(CART_KEY)) || [];
        } catch (e) {
            return [];
        }
    }

    static addToCart(productId, color = 'Standard', size = 'M', quantity = 1) {
        const product = ProductsService.getProductById(productId);
        if (!product) return false;

        const cart = ProductsService.getCart();
        const existing = cart.find(item => item.productId === product.id && item.color === color && item.size === size);
        const price = product.salePrice || product.regularPrice;

        if (existing) {
            existing.quantity += quantity;
        } else {
            cart.push({
                cartId: 'item-' + Date.now(),
                productId: product.id,
                slug: product.slug,
                name: product.name,
                price: price,
                color: color,
                size: size,
                image: product.images ? product.images.front : '',
                quantity: quantity
            });
        }

        localStorage.setItem(CART_KEY, JSON.stringify(cart));
        ProductsService.notifyListeners();
        return true;
    }

    static removeFromCart(cartId) {
        let cart = ProductsService.getCart();
        cart = cart.filter(item => item.cartId !== cartId);
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
        ProductsService.notifyListeners();
    }

    static clearCart() {
        localStorage.setItem(CART_KEY, JSON.stringify([]));
        ProductsService.notifyListeners();
    }

    static calculateCheckoutTotals(paymentType = 'prepaid') {
        const cart = ProductsService.getCart();
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        let shippingFee = 0;
        if (paymentType === 'prepaid') {
            shippingFee = subtotal > 0 ? 50 : 0;
        } else if (paymentType === 'cod') {
            shippingFee = subtotal > 0 ? 99 : 0;
        }

        const total = subtotal + shippingFee;

        return {
            subtotal,
            shippingFee,
            total,
            codAdvanceAmount: paymentType === 'cod' ? 99 : 0,
            codRemainingBalance: paymentType === 'cod' ? Math.max(0, total - 99) : 0
        };
    }

    // 1. AUTOMATIC ADMIN EMAIL NOTIFICATION DISPATCH (theinkhthreadhub@gmail.com)
    static sendAdminEmailNotification(order) {
        const adminEmail = "theinkhthreadhub@gmail.com";
        const emailData = {
            access_key: "f3796d8e-3249-43c2-bf77-160824b209a8",
            subject: `🚨 NEW INKTHREAD HUB ORDER: ${order.orderId} - ${order.customer.name}`,
            from_name: "Inkthread Hub Online Store",
            to_email: adminEmail,
            email_body: `
NEW ORDER DISPATCH!
----------------------------------
Order ID: ${order.orderId}
Customer Name: ${order.customer.name}
Phone Number: ${order.customer.phone}
Email Address: ${order.customer.email}
Delivery Pincode: ${order.customer.pincode}
Full Address: ${order.customer.address}

Payment Option: ${order.paymentType.toUpperCase()}
PhonePe Payment UTR: ${order.customer.utr || 'Not Provided'}

ORDERED ITEMS:
${order.items.map(i => `• ${i.name} (${i.color} / ${i.size}) x ${i.quantity} = ₹${i.price * i.quantity}`).join('\n')}

Subtotal: ₹${order.subtotal}
Shipping Fee: ₹${order.shippingFee}
FINAL TOTAL: ₹${order.total}
            `
        };

        try {
            fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(emailData)
            }).catch(() => {});
        } catch (e) {}
    }

    // 2. AUTOMATIC CUSTOMER EMAIL CONFIRMATION RECEIPT DISPATCH (to customerDetails.email)
    static sendCustomerEmailConfirmation(order) {
        if (!order.customer.email) return;

        const customerEmail = order.customer.email;
        const emailData = {
            access_key: "f3796d8e-3249-43c2-bf77-160824b209a8",
            subject: `🎉 Order Confirmation: ${order.orderId} — Inkthread Hub`,
            from_name: "Inkthread Hub Team",
            to_email: customerEmail,
            email_body: `
Dear ${order.customer.name},

Thank you for your order with Inkthread Hub! We are excited to prepare your package for dispatch.

---------------------------------------------------
ORDER RECEIPT DETAILS
---------------------------------------------------
Order ID: ${order.orderId}
Order Date: ${new Date().toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}
Payment Method: ${order.paymentType.toUpperCase()}
PhonePe Transaction UTR / Ref: ${order.customer.utr || 'N/A'}

DELIVERY ADDRESS:
Name: ${order.customer.name}
Phone: ${order.customer.phone}
Address: ${order.customer.address}
Pincode: ${order.customer.pincode}

ORDERED ITEMS:
${order.items.map(i => `• ${i.name} (${i.color} / ${i.size}) x ${i.quantity} = ₹${i.price * i.quantity}`).join('\n')}

---------------------------------------------------
Subtotal: ₹${order.subtotal.toLocaleString('en-IN')}
Shipping Charge: ₹${order.shippingFee.toLocaleString('en-IN')}
TOTAL AMOUNT: ₹${order.total.toLocaleString('en-IN')}
---------------------------------------------------

Our fulfillment team is currently processing your items. You will receive tracking details on your registered phone number (${order.customer.phone}) and email (${customerEmail}) once your shipment leaves our facility.

If you have any questions, reply to this email or contact us on WhatsApp: 6392995127

Warm regards,
Inkthread Hub Team
theinkhthreadhub@gmail.com
            `
        };

        try {
            fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(emailData)
            }).catch(() => {});
        } catch (e) {}
    }

    static placeOrder(customerDetails = {}) {
        const cart = ProductsService.getCart();
        if (cart.length === 0) return { success: false, message: 'Cart is empty' };

        const paymentType = customerDetails.paymentType || 'prepaid';
        const totals = ProductsService.calculateCheckoutTotals(paymentType);

        cart.forEach(item => {
            ProductsService.reduceInventory(item.productId, item.color, item.size, item.quantity);
        });

        const order = {
            orderId: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
            createdAt: new Date().toISOString(),
            items: cart,
            subtotal: totals.subtotal,
            shippingFee: totals.shippingFee,
            total: totals.total,
            customer: customerDetails,
            paymentType: paymentType,
            status: 'Processing'
        };

        const orders = JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
        orders.unshift(order);
        localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));

        ProductsService.sendAdminEmailNotification(order);
        ProductsService.sendCustomerEmailConfirmation(order);

        const adminWhatsAppNumber = "916392995127";
        let itemsListText = cart.map((i, idx) => `${idx + 1}. *${i.name}*\n   • Color: ${i.color} | Size: ${i.size}\n   • Qty: ${i.quantity} x ₹${i.price}`).join('\n');
        
        let msg = `🛍️ *NEW ORDER CONFIRMATION — INKTHREAD HUB*\n`;
        msg += `-----------------------------------\n`;
        msg += `📦 *Order ID*: ${order.orderId}\n`;
        msg += `👤 *Customer Name*: ${customerDetails.name || 'N/A'}\n`;
        msg += `📞 *Phone Number*: ${customerDetails.phone || 'N/A'}\n`;
        msg += `📧 *Email ID*: ${customerDetails.email || 'N/A'}\n`;
        msg += `📍 *Delivery Address*: ${customerDetails.address || 'N/A'}\n`;
        msg += `📮 *Pincode*: ${customerDetails.pincode || 'N/A'}\n\n`;
        msg += `🛒 *ORDERED ITEMS*:\n${itemsListText}\n\n`;
        msg += `💳 *Payment Option*: ${paymentType === 'cod' ? 'CASH ON DELIVERY (COD)' : 'PREPAID ONLINE'}\n`;
        msg += `📲 *Payment PhonePe UTR / Ref*: ${customerDetails.utr || 'Not Provided'}\n`;
        msg += `-----------------------------------\n`;
        msg += `💵 *Product Base Price*: ₹${totals.subtotal.toLocaleString('en-IN')}\n`;
        if (paymentType === 'prepaid') {
            msg += `🚚 *Prepaid Delivery Charge*: +₹50 Extra\n`;
            msg += `💰 *TOTAL AMOUNT PAID ONLINE*: ₹${totals.total.toLocaleString('en-IN')}\n`;
        } else {
            msg += `🚚 *COD Delivery Charge*: +₹99 Extra\n`;
            msg += `💰 *TOTAL COD ORDER VALUE*: ₹${totals.total.toLocaleString('en-IN')}\n`;
            msg += `⚠️ *COD ADVANCE PAID ONLINE (PhonePe QR)*: ₹99\n`;
            msg += `💵 *REMAINING BALANCE PAYABLE ON DELIVERY*: ₹${totals.codRemainingBalance.toLocaleString('en-IN')}\n`;
        }
        msg += `-----------------------------------\n`;
        msg += `Please process and ship my order!`;

        const whatsappUrl = `https://wa.me/${adminWhatsAppNumber}?text=${encodeURIComponent(msg)}`;

        ProductsService.clearCart();
        return { success: true, order: order, whatsappUrl: whatsappUrl };
    }

    static getOrders() {
        ProductsService.init(false);
        try {
            return JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
        } catch (e) {
            return [];
        }
    }
}

window.ProductsService = ProductsService;
ProductsService.init(false);
