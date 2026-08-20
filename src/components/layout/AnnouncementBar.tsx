'use client';

import { useState } from 'react';
import Link from 'next/link';
import { X, Sparkles } from 'lucide-react';

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-brand-neon via-emerald-400 to-brand-cyan text-black py-2 px-4 text-xs font-bold uppercase tracking-wider relative overflow-hidden transition-all shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-center text-center gap-2">
        <Sparkles className="w-3.5 h-3.5 animate-spin text-black shrink-0" style={{ animationDuration: '6s' }} />
        <span>⚡ FLASH DROP: 20% OFF ON ORDERS OVER ₹1,499 | CODE: <span className="bg-black text-brand-neon px-1.5 py-0.5 rounded text-[11px] font-mono tracking-normal ml-1">STREET20</span></span>
        <Link href="/shop" className="underline hover:text-white transition-colors ml-2 hidden sm:inline">
          SHOP THE DROP →
        </Link>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-black/10 rounded-full transition-colors"
        aria-label="Close Announcement"
      >
        <X className="w-3.5 h-3.5 text-black" />
      </button>
    </div>
  );
}
