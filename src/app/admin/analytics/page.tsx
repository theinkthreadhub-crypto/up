'use client';

import { BarChart3, TrendingUp, DollarSign, ShoppingBag, Flame, Sparkles } from 'lucide-react';
import { initialProducts, initialOrders } from '@/lib/mock-data';
import { formatPrice } from '@/lib/utils';

export default function AdminAnalyticsPage() {
  const totalRevenue = initialOrders.reduce((sum, o) => sum + o.total_amount, 0);
  const avgOrderValue = Math.round(totalRevenue / initialOrders.length);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-street-800 gap-4">
        <div>
          <span className="text-xs font-mono font-bold text-brand-neon uppercase tracking-widest">
            PERFORMANCE METRICS
          </span>
          <h1 className="font-display font-black text-2xl sm:text-4xl text-white uppercase tracking-tight">
            ATELIER STORE ANALYTICS
          </h1>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-card border border-street-800 rounded-3xl p-6 space-y-2">
          <span className="text-xs font-mono text-zinc-500">AVERAGE ORDER VALUE (AOV)</span>
          <p className="text-3xl font-mono font-black text-white">{formatPrice(avgOrderValue)}</p>
          <p className="text-xs text-brand-neon font-mono">+12% vs standard streetwear benchmarks</p>
        </div>

        <div className="bg-card border border-street-800 rounded-3xl p-6 space-y-2">
          <span className="text-xs font-mono text-zinc-500">REPEAT PURCHASE RATE</span>
          <p className="text-3xl font-mono font-black text-brand-cyan">38.5%</p>
          <p className="text-xs text-zinc-400 font-mono">High streetwear brand loyalty</p>
        </div>

        <div className="bg-card border border-street-800 rounded-3xl p-6 space-y-2">
          <span className="text-xs font-mono text-zinc-500">CONVERSION VELOCITY</span>
          <p className="text-3xl font-mono font-black text-brand-purple">4.2%</p>
          <p className="text-xs text-zinc-400 font-mono">Optimized mobile Razorpay checkout</p>
        </div>
      </div>

      {/* Top Streetwear Drop Velocity Ranking */}
      <div className="bg-card border border-street-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <h3 className="font-display font-bold text-white uppercase text-base tracking-wider flex items-center gap-2">
          <Flame className="w-5 h-5 text-brand-neon" />
          Top Selling Streetwear Pieces
        </h3>

        <div className="space-y-4 font-mono text-xs">
          {initialProducts.slice(0, 4).map((p, idx) => (
            <div key={p.id} className="space-y-1.5">
              <div className="flex justify-between text-white">
                <span className="font-sans font-bold">
                  {idx + 1}. {p.name} ({p.fabric_gsm} GSM)
                </span>
                <span className="text-brand-neon font-bold">{formatPrice((p.sale_price || p.price) * 18)}</span>
              </div>
              <div className="w-full bg-street-950 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-brand-neon to-brand-cyan h-full rounded-full"
                  style={{ width: `${100 - idx * 20}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
