'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, X, ArrowRight, Tag } from 'lucide-react';
import { initialProducts } from '@/lib/mock-data';
import { formatPrice } from '@/lib/utils';
import { Product } from '@/types/database';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setQuery('');
      setResults([]);
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const q = query.toLowerCase();
    const filtered = initialProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category_name?.toLowerCase().includes(q) ||
        p.product_type.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q)
    );
    setResults(filtered);
  }, [query]);

  // Keyboard shortcut Ctrl+K / Cmd+K to open, Esc to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        // Toggle search
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-card border border-street-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-street-800 bg-street-900/50">
          <Search className="w-5 h-5 text-brand-neon shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search hoodies, oversized tees, drops, SKUs..."
            className="w-full bg-transparent text-white placeholder-zinc-500 text-base focus:outline-none font-medium"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-zinc-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs bg-street-800 hover:bg-street-700 text-zinc-300 px-2.5 py-1 rounded font-mono"
          >
            ESC
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4 divide-y divide-street-800">
          {query && results.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-zinc-400 text-sm">No streetwear drops found for &quot;{query}&quot;</p>
              <p className="text-zinc-600 text-xs mt-1">Try searching &quot;Hoodie&quot;, &quot;Oversized&quot;, or &quot;SunGod&quot;</p>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-2">
              {results.map((product) => {
                const currentPrice = product.sale_price || product.price;
                return (
                  <Link
                    key={product.id}
                    href={`/product/${product.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-4 p-2.5 rounded-xl hover:bg-street-800/80 transition-colors group"
                  >
                    <div className="relative w-14 h-14 bg-street-900 rounded-lg overflow-hidden shrink-0 border border-street-800">
                      <Image
                        src={product.thumbnail || product.images[0] || '/images/hd_classic_crew_tee.png'}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-white group-hover:text-brand-neon transition-colors truncate">
                        {product.name}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
                        <span className="text-zinc-300 font-medium">{product.category_name}</span>
                        <span>•</span>
                        <span className="font-mono text-brand-neon font-bold">{formatPrice(currentPrice)}</span>
                        {product.fabric_gsm ? (
                          <>
                            <span>•</span>
                            <span className="text-zinc-500 font-mono">{product.fabric_gsm} GSM</span>
                          </>
                        ) : null}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-brand-neon group-hover:translate-x-1 transition-all" />
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="py-6 px-2">
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Popular Searches</p>
              <div className="flex flex-wrap gap-2">
                {['Oversized T-Shirts', 'SunGod Luffy', '380 GSM Hoodie', 'Acid Wash', 'Bomber Jacket'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="flex items-center gap-1.5 text-xs bg-street-900 hover:bg-street-800 text-zinc-300 px-3 py-1.5 rounded-full border border-street-800 transition-colors"
                  >
                    <Tag className="w-3 h-3 text-brand-neon" />
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
