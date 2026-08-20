import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, ShieldCheck, Flame, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-mono font-bold text-brand-neon uppercase tracking-widest">
          OUR MANIFESTO
        </span>
        <h1 className="font-display font-black text-3xl sm:text-6xl text-white uppercase tracking-tight leading-tight">
          CRAFTED FOR THE CONCRETE AVANT-GARDE
        </h1>
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
          InkThread Hub was founded in New Delhi with a singular conviction: street clothing should possess structural weight, uncompromising textiles, and timeless artisanal storytelling.
        </p>
      </div>

      {/* Grid: 3 Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-street-800 rounded-3xl p-8 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-neon/10 text-brand-neon flex items-center justify-center font-mono font-bold text-lg">
            01
          </div>
          <h3 className="font-display font-bold text-lg text-white uppercase">240-380 GSM Rule</h3>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            We reject the flimsy 140 GSM cotton standard. Our drop tees start at 240 GSM and our winter French Terry hoodies reach a dense 380 GSM to create true architectural boxy silhouettes.
          </p>
        </div>

        <div className="bg-card border border-street-800 rounded-3xl p-8 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-cyan/10 text-brand-cyan flex items-center justify-center font-mono font-bold text-lg">
            02
          </div>
          <h3 className="font-display font-bold text-lg text-white uppercase">Artisanal Distressing</h3>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Every acid-wash hoodie and mineral-dyed piece is hand-distressed in limited micro-batches. No two garments are completely identical—each represents a unique wearable canvas.
          </p>
        </div>

        <div className="bg-card border border-street-800 rounded-3xl p-8 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-purple/10 text-brand-purple flex items-center justify-center font-mono font-bold text-lg">
            03
          </div>
          <h3 className="font-display font-bold text-lg text-white uppercase">Ethical Atelier</h3>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Cut, sewn, bio-washed, and screenprinted with high-density eco-certified pigment inks in Delhi NCR, ensuring fair wages and meticulous master tailoring.
          </p>
        </div>
      </div>

      {/* Atelier Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-street-950 border border-street-800 p-8 sm:p-14 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-xl space-y-3 z-10">
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase">
            EXPERIENCE THE HEAVYWEIGHT DRAPE
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Order today with free express pan-India delivery and 7-day size exchanges.
          </p>
        </div>
        <Link
          href="/shop"
          className="z-10 bg-brand-neon hover:bg-brand-neonHover text-black font-black uppercase text-xs sm:text-sm px-8 py-4 rounded-xl shadow-glow-neon flex items-center gap-2 shrink-0 transition-all"
        >
          EXPLORE CATALOG <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
