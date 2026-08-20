'use client';

import { useState, useMemo, useEffect } from 'react';
import { useLiveProducts } from '@/lib/useLiveProducts';
import ProductCard from '@/components/product/ProductCard';
import { Filter, SlidersHorizontal, ArrowUpDown, X, Check } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Category } from '@/types/database';

export default function ShopPage() {
  const { products } = useLiveProducts();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [selectedColor, setSelectedColor] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(4000);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  useEffect(() => {
    async function loadCategories() {
      try {
        const supabase = createClient();
        const { data } = await supabase.from('categories').select('*').eq('is_active', true).order('display_order');
        if (data) setCategories(data as Category[]);
      } catch (e) {
        console.error('Error fetching categories:', e);
      }
    }
    void loadCategories();
  }, []);

  const allSizes = ['S', 'M', 'L', 'XL', 'XXL', 'One Size'];
  const allColors = ['Obsidian Black', 'Chalk White', 'Acid Wash Grey', 'Forest Sage', 'Navy Blue', 'Cyber Obsidian'];

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category filter
      if (selectedCategory !== 'all') {
        const cat = categories.find((c) => c.slug === selectedCategory);
        if (cat) {
          if (product.category_id && product.category_id !== cat.id && product.category_name !== cat.name) return false;
          if (!product.category_id && product.category_name !== cat.name) return false;
        } else {
          if (product.category_name?.toLowerCase() !== selectedCategory.toLowerCase()) return false;
        }
      }

      // Size filter
      if (selectedSize !== 'all' && !product.sizes.includes(selectedSize)) {
        return false;
      }

      // Color filter
      if (selectedColor !== 'all' && !product.colors.some((c) => c.toLowerCase().includes(selectedColor.toLowerCase()))) {
        return false;
      }

      // Price filter
      const price = product.sale_price || product.price;
      if (price > maxPrice) return false;

      // In stock filter
      if (inStockOnly && product.stock_quantity <= 0) return false;

      return true;
    }).sort((a, b) => {
      const priceA = a.sale_price || a.price;
      const priceB = b.sale_price || b.price;

      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      if (sortBy === 'bestseller') return (b.is_best_seller ? 1 : 0) - (a.is_best_seller ? 1 : 0);
      return (b.is_new_arrival ? 1 : 0) - (a.is_new_arrival ? 1 : 0);
    });
  }, [products, selectedCategory, selectedSize, selectedColor, maxPrice, inStockOnly, sortBy]);

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSelectedSize('all');
    setSelectedColor('all');
    setMaxPrice(4000);
    setInStockOnly(false);
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedSize !== 'all' ||
    selectedColor !== 'all' ||
    maxPrice < 4000 ||
    inStockOnly;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 border-b border-street-800 gap-4">
        <div>
          <span className="text-xs font-mono font-bold text-brand-neon uppercase tracking-widest">
            ALL STREETWEAR SILHOUETTES
          </span>
          <h1 className="font-display font-black text-3xl sm:text-5xl text-white uppercase tracking-tight mt-1">
            SHOP THE DROPS
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Heavyweight 240 GSM tees, 380 GSM acid-wash hoodies, and limited outer garments.
          </p>
        </div>

        {/* Sort & Filter toggles */}
        <div className="flex items-center gap-3">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 bg-street-900 border border-street-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold uppercase"
          >
            <SlidersHorizontal className="w-4 h-4 text-brand-neon" />
            Filters {hasActiveFilters && '•'}
          </button>

          {/* Sort selector */}
          <div className="flex items-center gap-2 bg-street-900 border border-street-800 rounded-xl px-3 py-2 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-white focus:outline-none font-medium cursor-pointer"
            >
              <option value="newest" className="bg-street-950 text-white">Sort: Newest Drops</option>
              <option value="bestseller" className="bg-street-950 text-white">Sort: Best Sellers</option>
              <option value="price-asc" className="bg-street-950 text-white">Price: Low to High</option>
              <option value="price-desc" className="bg-street-950 text-white">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Layout: Sidebar + Grid */}
      <div className="flex gap-8 pt-8">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
              <Filter className="w-4 h-4 text-brand-neon" />
              Filter Catalog
            </h3>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-[11px] text-zinc-400 hover:text-brand-neon font-mono underline"
              >
                Reset
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-zinc-300 uppercase font-mono">Category</h4>
            <div className="space-y-1 text-xs">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left py-1.5 px-2.5 rounded-lg transition-colors flex items-center justify-between ${
                  selectedCategory === 'all'
                    ? 'bg-brand-neon/10 text-brand-neon font-bold'
                    : 'text-zinc-400 hover:bg-street-900 hover:text-white'
                }`}
              >
                <span>All Streetwear</span>
                <span className="font-mono text-[10px]">{products.length}</span>
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`w-full text-left py-1.5 px-2.5 rounded-lg transition-colors flex items-center justify-between ${
                    selectedCategory === cat.slug
                      ? 'bg-brand-neon/10 text-brand-neon font-bold'
                      : 'text-zinc-400 hover:bg-street-900 hover:text-white'
                  }`}
                >
                  <span className="truncate">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Size Filter */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-zinc-300 uppercase font-mono">Size</h4>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setSelectedSize('all')}
                className={`text-xs font-mono px-3 py-1.5 rounded-lg border transition-colors ${
                  selectedSize === 'all'
                    ? 'border-brand-neon bg-brand-neon/10 text-brand-neon font-bold'
                    : 'border-street-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                All
              </button>
              {allSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`text-xs font-mono px-3 py-1.5 rounded-lg border transition-colors ${
                    selectedSize === size
                      ? 'border-brand-neon bg-brand-neon/10 text-brand-neon font-bold'
                      : 'border-street-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-2.5">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-zinc-300 uppercase font-mono">Max Price</span>
              <span className="font-mono font-bold text-brand-neon">₹{maxPrice}</span>
            </div>
            <input
              type="range"
              min="500"
              max="4000"
              step="100"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-brand-neon bg-street-800"
            />
          </div>

          {/* In Stock Only Toggle */}
          <div className="pt-2 border-t border-street-800">
            <label className="flex items-center gap-2.5 cursor-pointer text-xs text-zinc-300">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 rounded bg-street-900 border-street-800 text-brand-neon focus:ring-0 cursor-pointer"
              />
              <span>In Stock Drops Only</span>
            </label>
          </div>
        </aside>

        {/* Product Grid Area */}
        <main className="flex-1">
          {/* Active filter pills */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 mb-6 p-3 bg-street-900/60 rounded-xl border border-street-800">
              <span className="text-xs text-zinc-400 font-mono">Active Filters:</span>
              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-1 text-[11px] bg-street-800 text-white px-2.5 py-1 rounded-full">
                  Category: {selectedCategory}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCategory('all')} />
                </span>
              )}
              {selectedSize !== 'all' && (
                <span className="inline-flex items-center gap-1 text-[11px] bg-street-800 text-white px-2.5 py-1 rounded-full">
                  Size: {selectedSize}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedSize('all')} />
                </span>
              )}
              {inStockOnly && (
                <span className="inline-flex items-center gap-1 text-[11px] bg-street-800 text-white px-2.5 py-1 rounded-full">
                  In Stock Only
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setInStockOnly(false)} />
                </span>
              )}
              <button
                onClick={clearAllFilters}
                className="text-xs text-brand-neon hover:underline ml-auto font-mono"
              >
                Clear All
              </button>
            </div>
          )}

          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-card border border-street-800 rounded-2xl p-8">
              <p className="text-white font-bold text-base mb-2">No streetwear drops match your filters.</p>
              <p className="text-zinc-400 text-xs mb-6 max-w-sm mx-auto">
                Try widening your price range or clearing selected category and size filters.
              </p>
              <button
                onClick={clearAllFilters}
                className="bg-brand-neon text-black font-black uppercase text-xs px-6 py-3 rounded-xl shadow-glow-neon"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filter Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-xs bg-card border-r border-street-800 h-full p-6 overflow-y-auto space-y-6 animate-in slide-in-from-left">
            <div className="flex items-center justify-between pb-4 border-b border-street-800">
              <h3 className="font-bold text-white uppercase text-sm">Filter Drops</h3>
              <button onClick={() => setIsMobileFilterOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category selection */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-zinc-300 uppercase">Category</h4>
              <div className="space-y-1 text-xs">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left py-2 px-3 rounded-lg ${
                    selectedCategory === 'all' ? 'bg-brand-neon text-black font-bold' : 'text-zinc-300'
                  }`}
                >
                  All Streetwear
                </button>
                {categories.map((cat: Category) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`w-full text-left py-2 px-3 rounded-lg ${
                      selectedCategory === cat.slug ? 'bg-brand-neon text-black font-bold' : 'text-zinc-300'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setIsMobileFilterOpen(false)}
              className="w-full bg-brand-neon text-black font-bold uppercase text-xs py-3 rounded-xl shadow-glow-neon"
            >
              Apply Filters ({filteredProducts.length})
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
