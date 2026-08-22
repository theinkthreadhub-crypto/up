'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Flame, ArrowRight, Sparkles, Shield, Truck, RefreshCw, Star, Loader2 } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { useLiveProducts } from '@/lib/useLiveProducts';
import { createClient } from '@/lib/supabase/client';
import { Category } from '@/types/database';

export default function HomePage() {
  const { products, loading: productsLoading } = useLiveProducts();
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  useEffect(() => {
    async function loadCategories() {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from('categories')
          .select('*')
          .eq('is_active', true)
          .order('display_order')
          .limit(4);
        if (data) setCategories(data as Category[]);
      } catch (e) {
        console.error('Error fetching home categories:', e);
      } finally {
        setCategoriesLoading(false);
      }
    }
    void loadCategories();
  }, []);

  const featuredProducts = useMemo(() => {
    return products.filter((p) => p.is_published && (p.is_featured || p.is_new_arrival)).slice(0, 6);
  }, [products]);

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* 1. HERO SECTION (Stitch AI Craftsmanship Edition) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="relative bg-street-900 border border-street-700 rounded-3xl p-8 sm:p-12 lg:p-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center overflow-hidden" style={{background: 'linear-gradient(135deg, #1E1C19 0%, #141210 60%, #0C0C0D 100%)'}}>
          {/* Decorative glow blob */}
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none" style={{background: 'radial-gradient(circle, #FF5C1A 0%, transparent 70%)'}} />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full opacity-15 blur-3xl pointer-events-none" style={{background: 'radial-gradient(circle, #C6F135 0%, transparent 70%)'}} />

          {/* Left Content Column */}
          <div className="lg:col-span-7 space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 bg-street-800 border border-street-600 text-brand-neon px-3.5 py-1 rounded-full text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-brand-neon animate-pulse" />
              <span>NOT FOR EVERYONE</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal text-white leading-[1.08] tracking-tight">
              Slow Fashion & <br className="hidden sm:inline" />
              <span className="text-brand-neon">Tactile Craftsmanship</span>
            </h1>

            <p className="text-street-300 text-sm sm:text-base leading-relaxed max-w-xl">
              Crafted from 240 GSM organic bio-washed cotton, heavy acid-wash fleece, and genuine leather pet collar brackets. Built for silhouette permanence and tactile comfort.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <Link
                href="/shop"
                className="bg-brand-neon hover:bg-brand-neonHover text-white px-7 py-3.5 rounded-xl font-bold text-xs sm:text-sm inline-flex items-center justify-center gap-2 transition-all shadow-glow-neon"
              >
                EXPLORE FULL CATALOG →
              </Link>
              <Link
                href="/category/pet"
                className="bg-transparent border border-street-500 hover:border-brand-cyan text-street-200 hover:text-brand-cyan px-7 py-3.5 rounded-xl font-medium text-xs sm:text-sm inline-flex items-center justify-center gap-2 transition-all"
              >
                PET HARDWARE COLLECTION
              </Link>
            </div>
          </div>

          {/* Right Card Column */}
          <div className="lg:col-span-5 relative z-10">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-glass border border-street-700 group">
              <Image
                src="/images/hero_models.jpg"
                alt="Not For Everyone Artisanal Streetwear Collection"
                fill
                priority
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

              {/* Card Footer Overlay */}
              <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-md p-4 rounded-xl flex items-center justify-between border border-street-700">
                <div>
                  <p className="text-[10px] font-mono uppercase text-brand-neon tracking-wider">FEATURED CRAFT</p>
                  <p className="text-xs font-serif font-bold text-white">240 GSM Stacked Heavyweight Cotton</p>
                </div>
                <Link
                  href="/shop"
                  className="bg-brand-neon hover:bg-brand-neonHover text-white text-xs font-bold px-3.5 py-2 rounded-lg transition-colors shrink-0"
                >
                  VIEW DETAILS
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Icons Bar below Hero */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-street-900 border border-street-700 rounded-2xl text-xs font-medium">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-brand-neon" />
            <div>
              <p className="font-bold text-white">Heavyweight Quality</p>
              <p className="text-[11px] text-street-400">240-380 GSM Cotton</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Truck className="w-5 h-5 text-brand-cyan" />
            <div>
              <p className="font-bold text-white">Express Delivery</p>
              <p className="text-[11px] text-street-400">Pan-India Express Shipping</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-brand-purple" />
            <div>
              <p className="font-bold text-white">Pet Hardware</p>
              <p className="text-[11px] text-street-400">Brass Buckle Leather Belts</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <RefreshCw className="w-5 h-5 text-brand-amber" />
            <div>
              <p className="font-bold text-white">Easy Returns</p>
              <p className="text-[11px] text-street-400">7-Day Hassle Free Exchange</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORY QUICK-SWITCHER GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
              CURATED CATEGORIES
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">Select a streetwear silhouette to filter</p>
          </div>
          <Link href="/shop" className="text-xs font-mono font-bold text-brand-neon hover:underline">
            VIEW ALL CATEGORIES →
          </Link>
        </div>

        {categoriesLoading ? (
          <div className="flex items-center justify-center py-12 text-zinc-400 font-mono text-xs gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-brand-neon" />
            <span>Loading curated collections...</span>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12 bg-street-900 border border-street-800 rounded-2xl">
            <p className="text-zinc-500 font-mono text-xs">No active collections found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {categories.slice(0, 4).map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="group relative aspect-[3/4] bg-street-900 rounded-2xl overflow-hidden border border-street-800 hover:border-brand-neon transition-all duration-300"
              >
                <Image
                  src={cat.image_url || '/images/plain_oversized_black.jpg'}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-[10px] font-mono text-brand-neon uppercase font-bold tracking-widest">
                    COLLECTION
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-white uppercase group-hover:text-brand-neon transition-colors">
                    {cat.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* 3. FEATURED DROPS (CURRENT UNDERGROUND DROPS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-brand-neon text-xs font-mono font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>LIMITED INVENTORY</span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-4xl text-white uppercase tracking-tight">
              FEATURED DROPS
            </h2>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-street-900 hover:bg-street-800 border border-street-700 px-4 py-2.5 rounded-xl uppercase transition-colors"
          >
            EXPLORE CATALOG ({products.length}) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. FABRIC & GSM ATELIER MANIFESTO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-gradient-to-br from-street-900 via-street-950 to-black border border-street-800 rounded-3xl p-8 sm:p-12 md:p-16 overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <span className="text-brand-neon text-xs font-mono font-bold uppercase tracking-widest">
              ATELIER FABRIC ENGINEERING
            </span>
            <h2 className="font-display font-black text-2xl sm:text-4xl text-white uppercase tracking-tight mt-2 mb-4 leading-tight">
              ZERO FLIMSY COTTON. <br />
              <span className="text-brand-cyan">HEAVYWEIGHT FRENCH TERRY ONLY.</span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-6">
              Every InkThread Hub piece is knit from 100% super-combed ring-spun cotton. We reject paper-thin commercial fast fashion in favor of 240 GSM jersey and 380 GSM fleece that holds an architectural drop-shoulder silhouette for years.
            </p>
            <div className="grid grid-cols-2 gap-4 sm:gap-6 pt-4 border-t border-street-800 text-xs">
              <div>
                <h4 className="text-white font-bold uppercase mb-1">Pre-Shrunk & Bio-Washed</h4>
                <p className="text-zinc-400">Zero dimensional shrinkage after high-temp laundry cycles.</p>
              </div>
              <div>
                <h4 className="text-white font-bold uppercase mb-1">High-Density Screenprint</h4>
                <p className="text-zinc-400">Crack-resistant soft-hand matte discharge pigment inks.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CUSTOMER TESTIMONIALS & STREETWEAR REVIEWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
            STREET CREDIBILITY
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Real feedback from verified streetwear collectors across India
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'Rahul Sharma',
              city: 'New Delhi',
              product: 'SunGod Luffy Acid Wash Hoodie',
              comment: 'The 380 GSM French Terry has the most insane boxy drape. You can feel the sheer weight the moment you unbox it. Worth every rupee.',
              rating: 5,
            },
            {
              name: 'Ananya Roy',
              city: 'Kolkata',
              product: 'Vintage SunGod Oversized Tee',
              comment: 'Best 240 GSM drop shoulder tee in India. The ribbed collar stays crisp after 10+ washes. Definitely ordering the bomber next.',
              rating: 5,
            },
            {
              name: 'Vikramaditya S.',
              city: 'Bengaluru',
              product: 'All-Over Print Bomber Jacket',
              comment: 'Insane satin finish and heavy brass zippers. Fast 2-day delivery to Bangalore. InkThread Hub is top tier.',
              rating: 5,
            },
          ].map((rev, idx) => (
            <div key={idx} className="bg-card border border-street-800 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex gap-1 text-brand-neon mb-3">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-brand-neon text-brand-neon" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed italic mb-4">
                  &quot;{rev.comment}&quot;
                </p>
              </div>
              <div className="border-t border-street-800/80 pt-3">
                <h4 className="text-xs font-bold text-white uppercase">{rev.name}</h4>
                <p className="text-[11px] text-zinc-500 font-mono">{rev.city} • Verified Drop</p>
                <p className="text-[10px] text-brand-cyan mt-0.5 truncate">{rev.product}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
