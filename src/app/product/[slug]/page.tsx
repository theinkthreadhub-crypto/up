'use client';

import { useEffect, useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ShoppingBag,
  Ruler,
  Truck,
  RefreshCw,
  ShieldCheck,
  Star,
  ChevronDown,
  Sparkles,
  Minus,
  Plus,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';
import { initialProducts } from '@/lib/mock-data';
import { useLiveProducts } from '@/lib/useLiveProducts';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/lib/store';
import ProductGallery from '@/components/product/ProductGallery';
import SizeGuideModal from '@/components/product/SizeGuideModal';
import ProductCard from '@/components/product/ProductCard';

import { Loader2 } from 'lucide-react';

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const { products, loading } = useLiveProducts();
  const product = products.find((p) => p.slug === slug);

  // Keep every hook above conditional returns so React sees the same hook order
  // while Supabase changes the page from loading -> loaded.
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [selectedColor, setSelectedColor] = useState<string>('Obsidian Black');
  const [quantity, setQuantity] = useState<number>(1);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState<boolean>(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>('fabric');
  const [addedSuccess, setAddedSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (!product) return;
    setSelectedSize(product.sizes?.[0] || 'M');
    setSelectedColor(product.colors?.[0] || 'Obsidian Black');
    setQuantity(1);
  }, [product]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center py-20 text-zinc-400 font-mono text-xs gap-2">
        <Loader2 className="w-6 h-6 animate-spin text-brand-neon" />
        <span>Loading product details from Supabase...</span>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  const currentPrice = product.sale_price && product.sale_price > 0 ? product.sale_price : product.price;
  const hasDiscount = product.sale_price && product.sale_price > 0 && product.sale_price < product.price;

  const relatedProducts = products
    .filter((p) => p.id !== product.id && (p.category_name === product.category_name || p.product_type === product.product_type))
    .slice(0, 3);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-white transition-colors">Shop</Link>
        <span>/</span>
        <span className="text-zinc-300 truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left: Image Gallery (7 cols on desktop) */}
        <div className="lg:col-span-7">
          <ProductGallery images={product.images} productName={product.name} />
        </div>

        {/* Right: Buy Box & Product Specs (5 cols on desktop) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Header Info */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-mono font-bold text-brand-neon uppercase tracking-widest">
                {product.category_name || product.product_type}
              </span>
              <span className="text-xs font-mono text-zinc-500">SKU: {product.sku}</span>
            </div>

            <h1 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-white uppercase tracking-tight leading-tight">
              {product.name}
            </h1>

            {/* Ratings & GSM tag */}
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-brand-neon text-brand-neon" />
                ))}
                <span className="text-xs font-bold text-white ml-1.5">5.0</span>
                <span className="text-xs text-zinc-500 font-mono">(48 reviews)</span>
              </div>
              {product.fabric_gsm ? (
                <span className="bg-street-900 border border-street-800 text-zinc-300 text-xs font-mono px-2 py-0.5 rounded">
                  {product.fabric_gsm} GSM Heavyweight
                </span>
              ) : null}
            </div>
          </div>

          {/* Pricing */}
          <div className="p-4 bg-street-900/50 border border-street-800 rounded-2xl flex items-baseline justify-between">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-mono font-black text-brand-neon">
                {formatPrice(currentPrice)}
              </span>
              {hasDiscount && (
                <span className="text-sm font-mono text-zinc-500 line-through">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>
            {hasDiscount && (
              <span className="bg-red-600/20 border border-red-600/40 text-red-400 text-xs font-mono font-bold uppercase px-2.5 py-1 rounded-lg">
                SAVE {product.discount_percent || Math.round(((product.price - currentPrice) / product.price) * 100)}%
              </span>
            )}
          </div>

          {/* Short description */}
          {product.short_description && (
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              {product.short_description}
            </p>
          )}

          {/* Color Selector */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-zinc-400">Color Palette:</span>
              <span className="text-white font-bold">{selectedColor}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`text-xs font-medium px-3.5 py-2 rounded-xl border transition-all ${
                    selectedColor === color
                      ? 'border-brand-neon bg-brand-neon/10 text-brand-neon font-bold shadow-glow-neon'
                      : 'border-street-800 text-zinc-400 hover:border-zinc-700 bg-street-950'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Size Selector + Size Guide Link */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-zinc-400">Select Streetwear Size:</span>
              <button
                onClick={() => setIsSizeGuideOpen(true)}
                className="text-brand-cyan hover:underline flex items-center gap-1"
              >
                <Ruler className="w-3.5 h-3.5" /> Size Guide
              </button>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-3 rounded-xl text-xs font-mono font-bold border transition-all ${
                    selectedSize === size
                      ? 'border-brand-neon bg-brand-neon text-black shadow-glow-neon'
                      : 'border-street-800 text-zinc-300 hover:border-zinc-600 bg-street-950'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Stock Indicator */}
          <div className="text-xs font-mono flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-neon animate-pulse" />
            <span className="text-zinc-300">
              {product.stock_quantity > 0 ? (
                <span>In Stock — Dispatching in 24 Hours from Delhi Atelier</span>
              ) : (
                <span className="text-red-400">Sold Out (Restocking Soon)</span>
              )}
            </span>
          </div>

          {/* Quantity and Add to Cart Button */}
          <div className="flex gap-4 items-center pt-2">
            <div className="flex items-center border border-street-800 rounded-xl bg-street-950 h-12 overflow-hidden">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-10 h-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-street-800 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <input
                type="number"
                min={1}
                max={Math.min(product.stock_quantity, 10)}
                value={quantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  if (!isNaN(val)) setQuantity(Math.min(Math.max(1, val), Math.min(product.stock_quantity, 10)));
                }}
                onBlur={() => { if (!quantity || quantity < 1) setQuantity(1); }}
                className="w-14 h-full bg-transparent text-white font-mono font-bold text-sm text-center border-x border-street-800 focus:outline-none focus:bg-street-900 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(q + 1, Math.min(product.stock_quantity, 10)))}
                className="w-10 h-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-street-800 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.stock_quantity === 0}
              className={`flex-1 h-12 rounded-xl font-black uppercase text-xs sm:text-sm tracking-wider flex items-center justify-center gap-2 transition-all duration-200 ${
                product.stock_quantity === 0
                  ? 'bg-street-800 text-zinc-500 cursor-not-allowed'
                  : 'bg-brand-neon hover:bg-brand-neonHover text-black shadow-glow-neon'
              }`}
            >
              {addedSuccess ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-black" />
                  ADDED TO CART!
                </>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5" />
                  ADD TO CART • {formatPrice(currentPrice * quantity)}
                </>
              )}
            </button>
          </div>

          {/* Atelier Guarantees */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-street-800 text-[11px] text-zinc-400">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-brand-cyan shrink-0" />
              <span>Free Delivery Above ₹999</span>
            </div>
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-brand-purple shrink-0" />
              <span>7-Day Hassle-Free Size Exchange</span>
            </div>
          </div>

          {/* Accordion Sections for Specs, Care, Shipping */}
          <div className="border-t border-street-800 pt-4 divide-y divide-street-800/80">
            {/* Fabric Specs */}
            <div className="py-3">
              <button
                onClick={() => setOpenAccordion(openAccordion === 'fabric' ? null : 'fabric')}
                className="w-full flex justify-between items-center text-xs font-bold uppercase text-white tracking-wider"
              >
                <span>Fabric & Silhouette Specs</span>
                <ChevronDown
                  className={`w-4 h-4 text-zinc-400 transition-transform ${
                    openAccordion === 'fabric' ? 'rotate-180 text-brand-neon' : ''
                  }`}
                />
              </button>
              {openAccordion === 'fabric' && (
                <div className="mt-2.5 text-xs text-zinc-400 space-y-1.5 leading-relaxed font-mono">
                  <p>• {product.description}</p>
                  <p>• Cut: Boxy drop-shoulder streetwear fit with 1.25&quot; reinforced neck ribbing.</p>
                  <p>• Dye: Pigment acid-wash with zero hazardous discharge.</p>
                </div>
              )}
            </div>

            {/* Wash Care */}
            <div className="py-3">
              <button
                onClick={() => setOpenAccordion(openAccordion === 'care' ? null : 'care')}
                className="w-full flex justify-between items-center text-xs font-bold uppercase text-white tracking-wider"
              >
                <span>Garment Care & Longevity</span>
                <ChevronDown
                  className={`w-4 h-4 text-zinc-400 transition-transform ${
                    openAccordion === 'care' ? 'rotate-180 text-brand-neon' : ''
                  }`}
                />
              </button>
              {openAccordion === 'care' && (
                <div className="mt-2.5 text-xs text-zinc-400 space-y-1 leading-relaxed">
                  <p>{product.material_care || 'Cold machine wash inside out. Do not tumble dry. Do not iron directly on graphics.'}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Streetwear Drops */}
      {relatedProducts.length > 0 && (
        <div className="pt-12 border-t border-street-800">
          <h2 className="font-display font-black text-xl sm:text-2xl text-white uppercase tracking-tight mb-8">
            COMPLETE THE STREET LOOK
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </div>
      )}

      {/* Size Guide Modal */}
      <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />
    </div>
  );
}
