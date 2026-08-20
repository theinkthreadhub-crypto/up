'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Truck, Sparkles } from 'lucide-react';
import { useCart } from '@/lib/store';
import { formatPrice } from '@/lib/utils';

export default function CartDrawer() {
  const {
    items,
    isDrawerOpen,
    setIsDrawerOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    discountAmount,
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

  if (!isDrawerOpen) return null;

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

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={() => setIsDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-card border-l border-street-800 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-5 border-b border-street-800 flex items-center justify-between bg-street-900/60">
            <div className="flex items-center gap-2">
              <h2 className="font-display font-bold text-lg text-white uppercase tracking-wider">
                Your Drop Cart
              </h2>
              <span className="bg-brand-neon/20 text-brand-neon text-xs font-mono px-2 py-0.5 rounded-full font-bold">
                {items.reduce((sum, item) => sum + item.quantity, 0)} Items
              </span>
            </div>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="p-1.5 text-zinc-400 hover:text-white hover:bg-street-800 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-street-950 p-4 border-b border-street-800">
            <div className="flex items-center justify-between text-xs font-medium mb-1.5">
              <span className="flex items-center gap-1.5 text-zinc-300">
                <Truck className="w-3.5 h-3.5 text-brand-cyan" />
                {amountNeededForFreeShipping === 0 ? (
                  <strong className="text-brand-neon">🎉 Free Pan-India Delivery Unlocked!</strong>
                ) : (
                  <span>Add <strong className="text-white">{formatPrice(amountNeededForFreeShipping)}</strong> for Free Delivery</span>
                )}
              </span>
              <span className="text-zinc-500 font-mono">{freeShippingProgress}%</span>
            </div>
            <div className="w-full bg-street-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-brand-cyan to-brand-neon h-full transition-all duration-500 rounded-full"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-street-800">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="w-16 h-16 rounded-full bg-street-900 flex items-center justify-center mb-4 text-zinc-600">
                  <Truck className="w-8 h-8" />
                </div>
                <h3 className="text-white font-semibold text-base mb-1">Your cart is currently empty</h3>
                <p className="text-zinc-400 text-xs max-w-xs mb-6">
                  Explore our latest heavyweight streetwear drops and limited edition anime graphics.
                </p>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="bg-brand-neon hover:bg-brand-neonHover text-black text-xs font-black uppercase tracking-wider py-3 px-6 rounded-xl transition-all shadow-glow-neon"
                >
                  <Link href="/shop">EXPLORE THE SHOP →</Link>
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="py-4 flex gap-4 items-start">
                  <div className="relative w-20 h-20 bg-street-900 rounded-xl overflow-hidden shrink-0 border border-street-800">
                    <Image
                      src={item.product.thumbnail || item.product.images[0] || '/images/plain_oversized_black.jpg'}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/product/${item.product.slug}`}
                        onClick={() => setIsDrawerOpen(false)}
                        className="text-sm font-semibold text-white hover:text-brand-neon transition-colors line-clamp-1"
                      >
                        {item.product.name}
                      </Link>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-zinc-500 hover:text-red-400 p-1 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1 font-mono">
                      <span className="bg-street-900 px-1.5 py-0.5 rounded border border-street-800">Size: {item.size}</span>
                      <span className="bg-street-900 px-1.5 py-0.5 rounded border border-street-800 truncate max-w-[110px]">{item.color}</span>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-street-800 rounded-lg bg-street-900">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1 text-zinc-400 hover:text-white px-2"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-mono font-bold text-white px-2 min-w-[24px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1 text-zinc-400 hover:text-white px-2"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-sm font-mono font-bold text-brand-neon">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Area */}
          {items.length > 0 && (
            <div className="p-5 border-t border-street-800 bg-street-900/90 space-y-4">
              {/* Promo Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                {couponCode ? (
                  <div className="flex items-center justify-between bg-brand-neon/10 border border-brand-neon/30 text-brand-neon px-3 py-2 rounded-xl text-xs">
                    <span className="flex items-center gap-1.5 font-mono font-bold">
                      <Sparkles className="w-3.5 h-3.5" /> Coupon: {couponCode} (-₹{discountAmount})
                    </span>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-zinc-400 hover:text-white underline text-[11px]"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputCoupon}
                      onChange={(e) => setInputCoupon(e.target.value)}
                      placeholder="Promo code (e.g. STREET20)"
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

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-zinc-400 border-t border-street-800 pt-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono text-zinc-200">{formatPrice(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-brand-neon">
                    <span>Discount</span>
                    <span className="font-mono">- {formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping (Pan-India)</span>
                  <span className="font-mono text-zinc-200">
                    {shippingFee === 0 ? <strong className="text-brand-neon">FREE</strong> : formatPrice(shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-street-800">
                  <span>Estimated Total</span>
                  <span className="font-mono text-brand-neon text-base">{formatPrice(totalAmount)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <Link
                href="/checkout"
                onClick={() => setIsDrawerOpen(false)}
                className="w-full bg-brand-neon hover:bg-brand-neonHover text-black font-black uppercase text-xs tracking-wider py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-glow-neon"
              >
                PROCEED TO CHECKOUT
                <ArrowRight className="w-4 h-4" />
              </Link>

              {/* Trust Badge */}
              <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-500">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-cyan" />
                <span>100% Encrypted UPI & Razorpay Checkout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
