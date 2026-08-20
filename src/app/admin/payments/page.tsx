'use client';

import { useState } from 'react';
import { CreditCard, CheckCircle2, ShieldCheck, RefreshCw, AlertCircle } from 'lucide-react';
import { initialOrders } from '@/lib/mock-data';
import { formatPrice, formatDateTime } from '@/lib/utils';

export default function AdminPaymentsPage() {
  const ordersWithPayments = initialOrders.filter((o) => o.razorpay_payment_id);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-street-800 gap-4">
        <div>
          <span className="text-xs font-mono font-bold text-brand-neon uppercase tracking-widest">
            GATEWAY TRANSACTION LEDGER
          </span>
          <h1 className="font-display font-black text-2xl sm:text-4xl text-white uppercase tracking-tight">
            RAZORPAY PAYMENTS & WEBHOOKS
          </h1>
        </div>
      </div>

      {/* Gateway Status Capsule */}
      <div className="bg-card border border-street-800 rounded-3xl p-6 grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
        <div className="p-4 bg-street-950 rounded-2xl border border-street-800 space-y-1">
          <span className="text-zinc-500">Gateway Provider</span>
          <p className="font-bold text-white text-sm">Razorpay (India)</p>
          <span className="text-emerald-400 font-bold text-[11px]">⚡ UPI, Cards, NetBanking Active</span>
        </div>
        <div className="p-4 bg-street-950 rounded-2xl border border-street-800 space-y-1">
          <span className="text-zinc-500">Webhook Endpoint</span>
          <p className="font-bold text-brand-neon text-xs truncate">/api/payments/webhook</p>
          <span className="text-zinc-400 text-[10px]">HMAC-SHA256 Signature Verified</span>
        </div>
        <div className="p-4 bg-street-950 rounded-2xl border border-street-800 space-y-1">
          <span className="text-zinc-500">Settlement Currency</span>
          <p className="font-bold text-white text-sm">INR (₹ Rupees)</p>
          <span className="text-zinc-400 text-[10px]">T+1 Atelier Settlement</span>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-card border border-street-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-street-800 bg-street-950 text-zinc-500 uppercase">
                <th className="py-3.5 px-4">Payment Reference ID</th>
                <th className="py-3.5 px-4">Razorpay Order ID</th>
                <th className="py-3.5 px-4">Internal Order</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Captured At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-street-800/60">
              {ordersWithPayments.map((o) => (
                <tr key={o.id} className="hover:bg-street-900/40">
                  <td className="py-3.5 px-4 font-bold text-brand-neon">{o.razorpay_payment_id}</td>
                  <td className="py-3.5 px-4 text-zinc-400">{o.razorpay_order_id}</td>
                  <td className="py-3.5 px-4 font-bold text-white">{o.order_number}</td>
                  <td className="py-3.5 px-4 text-zinc-300">{o.customer_name}</td>
                  <td className="py-3.5 px-4 font-bold text-white">{formatPrice(o.total_amount)}</td>
                  <td className="py-3.5 px-4">
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px] font-bold">
                      CAPTURED
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-zinc-400">{formatDateTime(o.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
