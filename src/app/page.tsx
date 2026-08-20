import Image from 'next/image';
import Link from 'next/link';
import { Flame, ArrowRight, Sparkles, Shield, Truck, RefreshCw, Star } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { initialProducts, initialCategories } from '@/lib/mock-data';

export default function HomePage() {
  const featuredProducts = initialProducts.filter((p) => p.is_featured || p.is_new_arrival).slice(0, 6);
  const hoodies = initialProducts.filter((p) => p.category_name?.includes('Hoodies'));
  const oversizedTees = initialProducts.filter((p) => p.category_name?.includes('Oversized'));

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center overflow-hidden border-b border-street-800 bg-gradient-to-b from-street-950 via-background to-background">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero_banner.png"
            alt="InkThread Hub Streetwear Hero Banner"
            fill
            priority
            className="object-cover object-center opacity-30 scale-105 transform animate-pulse-glow"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 bg-radial from-brand-neon/5 via-transparent to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8 pb-16">
          <div className="inline-flex items-center gap-2 bg-street-900/90 border border-brand-neon/30 text-brand-neon px-3.5 py-1.5 rounded-full text-xs font-mono font-bold tracking-widest uppercase mb-6 shadow-glow-neon animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Flame className="w-3.5 h-3.5 text-brand-neon animate-bounce" />
            <span>DROP 04: SUN GOD & HEAVYWEIGHT ESSENTIALS</span>
          </div>

          <h1 className="font-display font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tighter text-white uppercase leading-[0.95] mb-6">
            HEAVYWEIGHT <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-neon via-emerald-400 to-brand-cyan">
              STREET CULTURE
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-zinc-300 font-normal leading-relaxed mb-8 sm:mb-10">
            Engineered with bespoke 240 GSM bio-washed cotton and 380 GSM French Terry. Architectural oversized silhouettes crafted for the concrete underground.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/shop"
              className="w-full sm:w-auto bg-brand-neon hover:bg-brand-neonHover text-black font-black text-xs sm:text-sm uppercase tracking-wider py-4 px-8 rounded-xl flex items-center justify-center gap-2 transition-all shadow-glow-neon group"
            >
              SHOP ALL DROPS
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/category/heavyweight-hoodies"
              className="w-full sm:w-auto bg-street-900/90 hover:bg-street-800 text-white font-bold text-xs sm:text-sm uppercase tracking-wider py-4 px-8 rounded-xl border border-street-700 flex items-center justify-center gap-2 transition-all"
            >
              EXPLORE HOODIES
            </Link>
          </div>

          {/* Micro stats banner */}
          <div className="mt-12 pt-8 border-t border-street-800/80 grid grid-cols-3 gap-4 max-w-xl mx-auto text-center font-mono">
            <div>
              <p className="text-xl sm:text-2xl font-black text-white">240+</p>
              <p className="text-[11px] text-zinc-500 uppercase">GSM Textile</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-black text-brand-neon">100%</p>
              <p className="text-[11px] text-zinc-500 uppercase">Combed Cotton</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-black text-brand-cyan">PAN-IN</p>
              <p className="text-[11px] text-zinc-500 uppercase">Free Express</p>
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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {initialCategories.slice(0, 4).map((cat) => (
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
            EXPLORE CATALOG ({initialProducts.length}) <ArrowRight className="w-3.5 h-3.5" />
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
