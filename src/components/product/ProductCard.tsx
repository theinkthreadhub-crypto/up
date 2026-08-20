'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Eye, Sparkles } from 'lucide-react';
import { Product } from '@/types/database';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/lib/store';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes?.[0] || 'M');
  const [showQuickSizeModal, setShowQuickSizeModal] = useState(false);

  const primaryImage = product.thumbnail || product.images?.[0] || '/images/plain_oversized_black.jpg';
  const secondaryImage = product.images?.[1] || primaryImage;

  const currentPrice = product.sale_price && product.sale_price > 0 ? product.sale_price : product.price;
  const hasDiscount = product.sale_price && product.sale_price > 0 && product.sale_price < product.price;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(
      product,
      selectedSize,
      product.colors?.[0] || 'Obsidian Black',
      1
    );
  };

  return (
    <div className="group relative flex flex-col bg-white border border-zinc-200 rounded-2xl overflow-hidden hover:border-zinc-400 hover:shadow-lg transition-all duration-300">
      {/* Top Image Container */}
      <Link
        href={`/product/${product.slug}`}
        className="relative aspect-[4/5] w-full bg-zinc-100 overflow-hidden block"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Image
          src={isHovered && secondaryImage ? secondaryImage : primaryImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.is_new_arrival && (
            <span className="bg-black text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded tracking-wider">
              NEW DROP
            </span>
          )}
          {hasDiscount && (
            <span className="bg-red-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wider">
              {product.discount_percent || Math.round(((product.price - (product.sale_price || product.price)) / product.price) * 100)}% OFF
            </span>
          )}
          {product.fabric_gsm && product.fabric_gsm > 0 ? (
            <span className="bg-black/70 backdrop-blur-md text-zinc-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-white/10">
              {product.fabric_gsm} GSM
            </span>
          ) : null}
        </div>

        {/* Quick Add Overlay on Hover */}
        <div className="absolute inset-x-3 bottom-3 z-10 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <button
            onClick={handleQuickAdd}
            className="w-full bg-white/95 hover:bg-brand-neon text-black font-black uppercase text-xs tracking-wider py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 shadow-lg backdrop-blur-sm transition-all duration-200"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            QUICK ADD ({selectedSize})
          </button>
        </div>
      </Link>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-zinc-500 mb-1 font-mono">
            <span>{product.category_name || product.product_type}</span>
            {product.stock_quantity <= 5 && product.stock_quantity > 0 && (
              <span className="text-amber-400 font-semibold animate-pulse">Low Stock</span>
            )}
            {product.stock_quantity === 0 && (
              <span className="text-red-400 font-semibold">Sold Out</span>
            )}
          </div>

          <Link href={`/product/${product.slug}`} className="block group-hover:text-zinc-600 transition-colors">
            <h3 className="text-sm sm:text-base font-bold text-zinc-900 tracking-tight line-clamp-1">
              {product.name}
            </h3>
          </Link>

          {product.short_description && (
            <p className="text-xs text-zinc-500 mt-1 line-clamp-2 leading-relaxed">
              {product.short_description}
            </p>
          )}
        </div>

        {/* Price & Size Pills */}
        <div className="mt-4 pt-3 border-t border-zinc-200 flex items-end justify-between">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-mono font-black text-zinc-900">
                {formatPrice(currentPrice)}
              </span>
              {hasDiscount && (
                <span className="text-xs font-mono text-zinc-400 line-through">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-zinc-400">Tax Included</span>
          </div>

          {/* Size Pill Selection */}
          <div className="flex gap-1">
            {(product.sizes || ['S', 'M', 'L', 'XL']).slice(0, 3).map((size) => (
              <button
                key={size}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedSize(size);
                }}
                className={`text-[10px] font-mono px-1.5 py-0.5 rounded border transition-colors ${
                  selectedSize === size
                    ? 'border-black text-black bg-zinc-100 font-bold'
                    : 'border-zinc-200 text-zinc-500 hover:border-zinc-400'
                }`}
              >
                {size.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
