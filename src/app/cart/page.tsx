'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Plus, Minus, ArrowRight, Truck, ShieldCheck, ArrowLeft, Sparkles } from 'lucide-react';
import { useCart } from '@/lib/store';
import { formatPrice } from '@/lib/utils';

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    discountAmount,
    discountPercent,
    couponCode,
    shippingFee,
    totalAmount,
    freeShippingThreshold,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    const res = applyCoupon(inputCoupon);
    if (res.success) {
      setCouponSuccess(res.message);
      setInputCoupon('');
    } else {
      setCouponError(res.message);
    }
  };

  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="max-w-md mx-auto bg-card border border-street-800 rounded-3xl p-10 space-y-4">
          <div className="w-16 h-16 rounded-full bg-street-900 flex items-center justify-center mx-auto text-zinc-500">
            <Truck className="w-8 h-8" />
          </div>
          <h1 className="font-display font-black text-2xl text-white uppercase">Your Cart is Empty</h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Looks like you haven&apos;t added any heavyweight streetwear pieces to your bag yet.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 bg-brand-neon hover:bg-brand-neonHover text-black font-black uppercase text-xs px-6 py-3.5 rounded-xl shadow-glow-neon transition-all"
          >
            DISCOVER THE DROPS <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-street-800">
        <div>
          <Link href="/shop" className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white font-mono mb-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Continue Browsing
          </Link>
          <h1 className="font-display font-black text-2xl sm:text-4xl text-white uppercase tracking-tight">
            SHOPPING CART ({items.reduce((s, i) => s + i.quantity, 0)})
          </h1>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-zinc-500 hover:text-red-400 font-mono underline"
        >
          Clear Cart
        </button>
      </div>

      {/* Free Shipping Alert Meter */}
      <div className="bg-street-900/60 border border-street-800 rounded-2xl p-4">
        <div className="flex justify-between text-xs font-mono mb-2">
          <span className="flex items-center gap-2 text-zinc-300">
            <Truck className="w-4 h-4 text-brand-cyan" />
            {amountNeededForFreeShipping === 0 ? (
              <strong className="text-brand-neon">🎉 Free Pan-India Delivery Unlocked!</strong>
            ) : (
              <span>Add <strong className="text-white">{formatPrice(amountNeededForFreeShipping)}</strong> more to get Free Express Delivery</span>
            )}
          </span>
          <span className="text-zinc-400">{freeShippingProgress}%</span>
        </div>
        <div className="w-full bg-street-950 h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-brand-cyan to-brand-neon h-full transition-all duration-500"
            style={{ width: `${freeShippingProgress}%` }}
          />
        </div>
      </div>

      {/* Main Grid: Cart Items List + Order Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Items Table / Cards */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-card border border-street-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-24 bg-street-950 rounded-xl overflow-hidden shrink-0 border border-street-800">
                  <Image
                    src={item.product.thumbnail || item.product.images[0] || '/images/plain_oversized_black.jpg'}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <Link
                    href={`/product/${item.product.slug}`}
                    className="font-bold text-white hover:text-brand-neon text-sm sm:text-base line-clamp-1"
                  >
                    {item.product.name}
                  </Link>
                  <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                    <span className="bg-street-900 px-2 py-0.5 rounded border border-street-800">Size: {item.size}</span>
                    <span className="bg-street-900 px-2 py-0.5 rounded border border-street-800">{item.color}</span>
                  </div>
                  <p className="text-xs font-mono text-zinc-400">Unit: {formatPrice(item.price)}</p>
                </div>
              </div>

              {/* Modifiers & Subtotal */}
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-street-800">
                <div className="flex items-center border border-street-800 rounded-xl bg-street-950 h-10 px-2">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="p-1 text-zinc-400 hover:text-white"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-mono font-bold text-white text-xs px-3 min-w-[28px] text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="p-1 text-zinc-400 hover:text-white"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <span className="font-mono font-bold text-brand-neon text-base">
                  {formatPrice(item.price * item.quantity)}
                </span>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-zinc-500 hover:text-red-400 p-1.5 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Card */}
        <div className="lg:col-span-4 bg-card border border-street-800 rounded-3xl p-6 space-y-6">
          <h2 className="font-display font-bold text-lg text-white uppercase tracking-wider pb-4 border-b border-street-800">
            Order Summary
          </h2>

          {/* Promo Form */}
          <form onSubmit={handleApplyCoupon} className="space-y-2">
            <label className="text-xs font-mono text-zinc-400 block">Promo Code:</label>
            {couponCode ? (
              <div className="flex items-center justify-between bg-brand-neon/10 border border-brand-neon/30 text-brand-neon p-3 rounded-xl text-xs font-mono font-bold">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> {couponCode} ({discountPercent}% OFF)
                </span>
                <button type="button" onClick={removeCoupon} className="underline text-zinc-400 hover:text-white">
                  Remove
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputCoupon}
                  onChange={(e) => setInputCoupon(e.target.value)}
                  placeholder="e.g. STREET20"
                  className="flex-1 bg-street-950 border border-street-800 rounded-xl px-3 py-2 text-xs text-white uppercase placeholder-zinc-500 focus:outline-none focus:border-brand-neon"
                />
                <button
                  type="submit"
                  className="bg-street-800 hover:bg-street-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
                >
                  Apply
                </button>
              </div>
            )}
            {couponError && <p className="text-red-400 text-[11px]">{couponError}</p>}
            {couponSuccess && <p className="text-brand-neon text-[11px]">{couponSuccess}</p>}
          </form>

          {/* Pricing breakdown */}
          <div className="space-y-2.5 text-xs text-zinc-400 border-t border-street-800 pt-4">
            <div className="flex justify-between">
              <span>Bag Subtotal</span>
              <span className="font-mono text-white">{formatPrice(subtotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-brand-neon font-medium">
                <span>Coupon Discount ({couponCode})</span>
                <span className="font-mono">- {formatPrice(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping Fee</span>
              <span className="font-mono text-white">
                {shippingFee === 0 ? <strong className="text-brand-neon">FREE</strong> : formatPrice(shippingFee)}
              </span>
            </div>
            <div className="flex justify-between text-base font-black text-white pt-4 border-t border-street-800">
              <span>Grand Total</span>
              <span className="font-mono text-brand-neon text-xl">{formatPrice(totalAmount)}</span>
            </div>
            <p className="text-[10px] text-zinc-500 text-right font-mono">Includes all applicable GST</p>
          </div>

          <Link
            href="/checkout"
            className="w-full bg-brand-neon hover:bg-brand-neonHover text-black font-black uppercase text-xs sm:text-sm tracking-wider py-4 px-4 rounded-xl flex items-center justify-center gap-2 shadow-glow-neon transition-all"
          >
            PROCEED TO CHECKOUT <ArrowRight className="w-4 h-4" />
          </Link>

          <div className="flex items-center justify-center gap-2 text-xs text-zinc-500 pt-2">
            <ShieldCheck className="w-4 h-4 text-brand-cyan" />
            <span>Encrypted 256-Bit Razorpay Payments</span>
          </div>
        </div>
      </div>
    </div>
  );
}
