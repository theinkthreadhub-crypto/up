'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Truck, Package, ArrowRight, ShieldCheck } from 'lucide-react';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('orderNumber') || 'ITH-2026-CONFIRMED';
  const paymentId = searchParams.get('paymentId') || 'pay_verified_razorpay';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <div className="bg-card border border-street-800 rounded-3xl p-6 sm:p-10 text-center space-y-6 shadow-2xl">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-brand-neon/10 border border-brand-neon/30 text-brand-neon rounded-full flex items-center justify-center mx-auto shadow-glow-neon animate-in zoom-in-50 duration-300">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono font-bold text-brand-neon uppercase tracking-widest">
            PAYMENT VERIFIED & ORDER LOCKED
          </span>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-white uppercase tracking-tight">
            DROP SECURED!
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
            Thank you for ordering with InkThread Hub. We have received your payment and are now preparing your pieces at our Delhi atelier.
          </p>
        </div>

        {/* Order Details Capsule */}
        <div className="bg-street-950 border border-street-800 rounded-2xl p-5 text-left text-xs font-mono space-y-2.5 max-w-md mx-auto">
          <div className="flex justify-between">
            <span className="text-zinc-500">Order Number:</span>
            <span className="text-white font-bold text-brand-neon">{orderNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">Razorpay Payment ID:</span>
            <span className="text-zinc-300 truncate max-w-[200px]">{paymentId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">Status:</span>
            <span className="text-emerald-400 font-bold">⚡ Paid & In Queue</span>
          </div>
        </div>

        {/* Timeline Preview */}
        <div className="grid grid-cols-3 gap-2 max-w-md mx-auto pt-2 text-[11px] text-zinc-400">
          <div className="bg-street-900/60 p-3 rounded-xl border border-street-800">
            <Package className="w-4 h-4 text-brand-neon mx-auto mb-1" />
            <p className="font-bold text-white">1. Processing</p>
            <p className="text-[10px] text-zinc-500">Allocating stock</p>
          </div>
          <div className="bg-street-900/60 p-3 rounded-xl border border-street-800">
            <ShieldCheck className="w-4 h-4 text-brand-cyan mx-auto mb-1" />
            <p className="font-bold text-white">2. Quality Check</p>
            <p className="text-[10px] text-zinc-500">Matte black box</p>
          </div>
          <div className="bg-street-900/60 p-3 rounded-xl border border-street-800">
            <Truck className="w-4 h-4 text-brand-purple mx-auto mb-1" />
            <p className="font-bold text-white">3. Dispatch</p>
            <p className="text-[10px] text-zinc-500">Blue Dart / Delhivery</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-street-800">
          <Link
            href="/track-order"
            className="w-full sm:w-auto bg-brand-neon hover:bg-brand-neonHover text-black font-black uppercase text-xs px-8 py-4 rounded-xl shadow-glow-neon flex items-center justify-center gap-2"
          >
            <Truck className="w-4 h-4" /> TRACK ORDER LIVE
          </Link>
          <Link
            href="/shop"
            className="w-full sm:w-auto bg-street-900 hover:bg-street-800 text-white font-bold uppercase text-xs px-8 py-4 rounded-xl border border-street-700 flex items-center justify-center gap-2"
          >
            CONTINUE BROWSING <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center text-zinc-400">Loading Order Confirmation...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
