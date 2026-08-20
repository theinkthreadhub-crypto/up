'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Search, Truck, Package, CheckCircle2, Clock, MapPin, AlertCircle } from 'lucide-react';
import { formatPrice, formatDateTime } from '@/lib/utils';

const STATUS_STEPS = ['Pending Payment', 'Paid', 'Processing', 'Packed', 'Shipped', 'Delivered'];

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [contact, setContact] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderResult, setOrderResult] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setOrderResult(null);

    if (!orderNumber.trim() || !contact.trim()) {
      setErrorMessage('Please enter both your Order Number and Email/Phone Number.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/orders/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderNumber: orderNumber.trim(),
          contact: contact.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'No matching order found.');
      }

      setOrderResult(data.order);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to look up order';
      setErrorMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const getStepIndex = (status: string) => {
    const idx = STATUS_STEPS.indexOf(status);
    return idx === -1 ? 1 : idx;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      {/* Header */}
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <span className="text-xs font-mono font-bold text-brand-cyan uppercase tracking-widest">
          LIVE ATELIER TRACKING
        </span>
        <h1 className="font-display font-black text-3xl sm:text-5xl text-white uppercase tracking-tight">
          TRACK YOUR DROP
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400">
          Enter your Order Number and registered Email or Phone to track live packaging, transit status, and courier updates.
        </p>
      </div>

      {/* Tracking Form */}
      <form
        onSubmit={handleTrackSubmit}
        className="bg-card border border-street-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl max-w-2xl mx-auto"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5">
            <label className="text-zinc-400 font-mono">Order Number *</label>
            <input
              type="text"
              required
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="e.g. ITH-2026-08101"
              className="w-full bg-street-950 border border-street-800 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-brand-neon font-mono uppercase"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-zinc-400 font-mono">Email or Mobile Number *</label>
            <input
              type="text"
              required
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="rohan@example.com or 9820012345"
              className="w-full bg-street-950 border border-street-800 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-brand-neon"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-neon hover:bg-brand-neonHover text-black font-black uppercase text-xs sm:text-sm py-4 px-6 rounded-xl shadow-glow-neon flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              LOOKING UP ATELIER DISPATCH...
            </span>
          ) : (
            <>
              <Search className="w-4 h-4" /> TRACK SHIPMENT
            </>
          )}
        </button>

        {errorMessage && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl flex items-center gap-2 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </form>

      {/* Results View */}
      {orderResult && (
        <div className="bg-card border border-street-800 rounded-3xl p-6 sm:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Order Header Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-street-800 gap-4">
            <div>
              <span className="text-[11px] font-mono text-zinc-500 uppercase">Order Details</span>
              <h2 className="text-xl font-bold text-white font-mono">{orderResult.order_number}</h2>
              <p className="text-xs text-zinc-400 mt-0.5">Recipient: {orderResult.customer_name}</p>
            </div>

            <div className="flex sm:flex-col items-start sm:items-end justify-between">
              <span className="bg-brand-neon/10 border border-brand-neon/30 text-brand-neon font-mono text-xs px-3 py-1 rounded-full font-bold uppercase">
                {orderResult.status}
              </span>
              <span className="text-xs font-mono text-zinc-400 mt-1">
                Total: <strong className="text-white">{formatPrice(orderResult.total_amount)}</strong>
              </span>
            </div>
          </div>

          {/* Stepper Progress Pipeline */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-zinc-400 uppercase font-mono tracking-wider">
              Shipment Status Progress
            </h3>

            <div className="relative">
              {/* Progress line */}
              <div className="overflow-hidden h-1.5 mb-4 text-xs flex rounded bg-street-900">
                <div
                  style={{
                    width: `${Math.min(
                      100,
                      ((getStepIndex(orderResult.status) + 1) / STATUS_STEPS.length) * 100
                    )}%`,
                  }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-brand-cyan to-brand-neon transition-all duration-500"
                />
              </div>

              {/* Step badges */}
              <div className="grid grid-cols-6 text-center text-[10px] sm:text-xs font-mono">
                {STATUS_STEPS.map((step, idx) => {
                  const currentIdx = getStepIndex(orderResult.status);
                  const isCompleted = idx <= currentIdx;
                  const isCurrent = idx === currentIdx;

                  return (
                    <div key={step} className="flex flex-col items-center">
                      <span
                        className={`w-4 h-4 rounded-full mb-1 flex items-center justify-center text-[8px] font-bold ${
                          isCompleted
                            ? 'bg-brand-neon text-black'
                            : 'bg-street-800 text-zinc-600'
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <span
                        className={`hidden sm:inline ${
                          isCurrent
                            ? 'text-brand-neon font-bold'
                            : isCompleted
                            ? 'text-zinc-300'
                            : 'text-zinc-600'
                        }`}
                      >
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Courier & Tracking info */}
          {orderResult.tracking_number && (
            <div className="bg-street-950 p-4 rounded-2xl border border-street-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-brand-cyan shrink-0" />
                <div>
                  <p className="text-zinc-400">Carrier Partner: <strong className="text-white">{orderResult.tracking_courier || 'Express Surface'}</strong></p>
                  <p className="text-zinc-400">AWB Tracking No: <strong className="text-brand-neon">{orderResult.tracking_number}</strong></p>
                </div>
              </div>
              <span className="text-emerald-400 font-bold">⚡ IN TRANSIT</span>
            </div>
          )}

          {/* Timeline Events Log */}
          {orderResult.timeline && orderResult.timeline.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-zinc-400 uppercase font-mono tracking-wider">
                Event Activity History
              </h3>
              <div className="border-l-2 border-street-800 pl-4 space-y-4 text-xs">
                {orderResult.timeline.map((event: any, idx: number) => (
                  <div key={idx} className="relative">
                    <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-brand-neon" />
                    <p className="text-white font-bold">{event.status}</p>
                    <p className="text-zinc-400 text-xs mt-0.5">{event.description}</p>
                    <span className="text-[10px] text-zinc-500 font-mono block mt-1">
                      {formatDateTime(event.timestamp)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
