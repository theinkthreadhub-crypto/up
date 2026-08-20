'use client';

import { use, useEffect, useState, useMemo } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { useLiveProducts } from '@/lib/useLiveProducts';
import ProductCard from '@/components/product/ProductCard';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Category } from '@/types/database';

export default function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const { products, loading: productsLoading } = useLiveProducts();
  const [category, setCategory] = useState<Category | null>(null);
  const [categoryLoading, setCategoryLoading] = useState(true);

  useEffect(() => {
    async function loadCategory() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .eq('slug', slug)
          .maybeSingle();

        if (!error && data) {
          setCategory(data as Category);
        }
      } catch (e) {
        console.error('Error fetching category:', e);
      } finally {
        setCategoryLoading(false);
      }
    }
    void loadCategory();
  }, [slug]);

  const loading = productsLoading || categoryLoading;

  const categoryProducts = useMemo(() => {
    if (!category) return [];
    return products.filter(
      (p) => p.category_name === category.name || p.category_id === category.id
    );
  }, [products, category]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center py-20 text-zinc-400 font-mono text-xs gap-2">
        <Loader2 className="w-6 h-6 animate-spin text-brand-neon" />
        <span>Loading collection drop...</span>
      </div>
    );
  }

  if (!category) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Category Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-street-900 border border-street-800 p-8 sm:p-12 min-h-[220px] flex flex-col justify-end">
        <div className="absolute inset-0 z-0">
          <Image
            src={category.image_url || '/images/plain_oversized_black.jpg'}
            alt={category.name}
            fill
            className="object-cover opacity-25 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
        </div>

        <div className="relative z-10 space-y-2">
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-brand-neon transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to All Drops
          </Link>
          <span className="text-xs font-mono font-bold text-brand-neon uppercase tracking-widest block">
            COLLECTION SHOWCASE
          </span>
          <h1 className="font-display font-black text-3xl sm:text-5xl text-white uppercase tracking-tight">
            {category.name}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-300 max-w-xl">
            {category.description}
          </p>
        </div>
      </div>

      {/* Product Grid */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <span className="text-xs font-mono text-zinc-400">
            Showing {categoryProducts.length} drops in {category.name}
          </span>
        </div>

        {categoryProducts.length === 0 ? (
          <div className="text-center py-20 bg-card border border-street-800 rounded-2xl p-8">
            <p className="text-white font-bold text-base mb-2">New drops arriving soon in this collection.</p>
            <Link
              href="/shop"
              className="inline-block mt-4 bg-brand-neon text-black font-black uppercase text-xs px-6 py-3 rounded-xl shadow-glow-neon"
            >
              Explore Other Categories
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
