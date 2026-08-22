'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShieldCheck, Lock, ArrowRight, Truck, CreditCard,
  Sparkles, AlertCircle, CheckCircle2, ArrowLeft, Banknote, Package,
} from 'lucide-react';
import { useCart } from '@/lib/store';
import { formatPrice, isValidIndianPhone, isValidIndianPincode } from '@/lib/utils';

declare global {
  interface Window { Razorpay: any; }
}

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan',
  'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
];

const COD_ADVANCE_FEE = 99; // ₹99 advance for COD orders

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, discountAmount, couponCode, shippingFee, totalAmount, clearCart } = useCart();

  // Address fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Delhi');
  const [pincode, setPincode] = useState('');
  const [acceptsMarketing, setAcceptsMarketing] = useState(true);

  // Payment method selection
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cod'>('online');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [testOrderSession, setTestOrderSession] = useState<any>(null);
  const [codSuccess, setCodSuccess] = useState(false);

  // COD total = cart total + ₹99 advance
  const codTotal = totalAmount + COD_ADVANCE_FEE;

  const validateForm = (): boolean => {
    if (!fullName.trim()) { setErrorMessage('Please enter your full name.'); return false; }
    if (email.trim() && !email.includes('@')) { setErrorMessage('Please enter a valid email address.'); return false; }
    if (!isValidIndianPhone(phone)) { setErrorMessage('Please enter a valid 10-digit Indian mobile number (+91).'); return false; }
    if (!address.trim() || address.length < 10) { setErrorMessage('Please enter your complete street address.'); return false; }
    if (!city.trim()) { setErrorMessage('Please enter your city.'); return false; }
    if (!isValidIndianPincode(pincode)) { setErrorMessage('Please enter a valid 6-digit Indian PIN code.'); return false; }
    if (items.length === 0) { setErrorMessage('Your cart is empty.'); return false; }
    return true;
  };

  // ─── COD FLOW ───────────────────────────────────────────────────────────────
  const handleCodOrder = async () => {
    setErrorMessage('');
    if (!validateForm()) return;
    setLoading(true);

    try {
      const res = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          customer: { fullName, email, phone, address, landmark, city, state, pincode, acceptsMarketing },
          couponCode,
          paymentMethod: 'cod',
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'COD order creation failed.');

      clearCart();
      router.push(
        `/order-success?orderNumber=${encodeURIComponent(data.orderNumber)}&orderId=${encodeURIComponent(data.orderId)}&paymentMethod=cod`
      );
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  // ─── ONLINE (RAZORPAY) FLOW ──────────────────────────────────────────────
  const handleOnlineCheckout = async () => {
    setErrorMessage('');
    if (!validateForm()) return;
    setLoading(true);

    try {
      const createOrderRes = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          customer: { fullName, email, phone, address, landmark, city, state, pincode, acceptsMarketing },
          couponCode,
          paymentMethod: 'online',
        }),
      });

      const orderData = await createOrderRes.json();
      if (!createOrderRes.ok || !orderData.success) throw new Error(orderData.error || 'Failed to initialize payment.');

      const hasRealRazorpay = typeof window !== 'undefined' && window.Razorpay &&
        orderData.keyId && !orderData.keyId.startsWith('rzp_test_placeholder');

      if (hasRealRazorpay) {
        const rzp = new window.Razorpay({
          key: orderData.keyId,
          amount: orderData.amount,
          currency: orderData.currency,
          name: 'InkThread Hub',
          description: `Order #${orderData.orderNumber}`,
          image: '/favicon.svg',
          order_id: orderData.razorpayOrderId,
          prefill: { name: fullName, email, contact: phone },
          theme: { color: '#00ff87' },
          modal: { ondismiss: () => { setLoading(false); setErrorMessage('Payment window closed. You can retry.'); } },
          handler: async (response: any) => {
            await verifyAndCompleteOrder({
              orderId: orderData.orderId, orderNumber: orderData.orderNumber,
              razorpay_order_id: response.razorpay_order_id || orderData.razorpayOrderId,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              items: orderData.items, customer: orderData.customer,
              totalAmount: orderData.finalTotalAmount,
            });
          },
        });
        rzp.on('payment.failed', (resp: any) => {
          setLoading(false);
          setErrorMessage(`Payment failed: ${resp.error?.description || 'Transaction declined'}`);
        });
        rzp.open();
      } else {
        setTestOrderSession(orderData);
        setIsTestModalOpen(true);
        setLoading(false);
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Checkout error');
      setLoading(false);
    }
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMethod === 'cod') handleCodOrder();
    else handleOnlineCheckout();
  };

  const verifyAndCompleteOrder = async (payload: any) => {
    setLoading(true);
    try {
      const verifyRes = await fetch('/api/payments/verify', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const verifyData = await verifyRes.json();
      if (!verifyRes.ok || !verifyData.success) throw new Error(verifyData.error || 'Verification failed.');

      clearCart();
      router.push(
        `/order-success?orderNumber=${encodeURIComponent(verifyData.orderNumber)}&orderId=${encodeURIComponent(verifyData.orderId)}&paymentId=${encodeURIComponent(verifyData.paymentId || '')}`
      );
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Verification failed');
      setLoading(false);
    }
  };

  const handleSimulatedTestPayment = async () => {
    if (!testOrderSession) return;
    setIsTestModalOpen(false);
    await verifyAndCompleteOrder({
      orderId: testOrderSession.orderId, orderNumber: testOrderSession.orderNumber,
      razorpay_order_id: testOrderSession.razorpayOrderId,
      razorpay_payment_id: `pay_sim_${Date.now()}`,
      razorpay_signature: `test_sig_${crypto.randomUUID()}`,
      items: testOrderSession.items,
      customer: { name: fullName, email, phone, address: `${address}, ${city}, ${state} - ${pincode}` },
      totalAmount: testOrderSession.finalTotalAmount,
    });
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold text-white uppercase">Your cart is empty</h1>
        <p className="text-zinc-400 text-xs">Please add items to your cart before proceeding to checkout.</p>
        <Link href="/shop" className="inline-block bg-brand-neon text-black font-bold uppercase text-xs px-6 py-3 rounded-xl">
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-street-800">
        <div>
          <Link href="/cart" className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white font-mono mb-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Cart
          </Link>
          <h1 className="font-display font-black text-2xl sm:text-4xl text-white uppercase tracking-tight">
            SECURE CHECKOUT
          </h1>
        </div>
        <div className="flex items-center gap-2 text-xs text-brand-neon font-mono">
          <Lock className="w-4 h-4" /> 256-Bit SSL Encrypted
        </div>
      </div>

      {errorMessage && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-2xl flex items-start gap-3 text-xs">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-bold">Checkout Alert</strong>
            <span>{errorMessage}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ── Left: Form ── */}
        <form onSubmit={handleCheckoutSubmit} className="lg:col-span-7 space-y-6">

          {/* Section 1: Contact */}
          <div className="bg-card border border-street-800 rounded-3xl p-6 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-brand-neon text-black font-mono text-xs flex items-center justify-center font-bold">1</span>
              Contact Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-zinc-400 font-mono">Full Name *</label>
                <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Rohan Sharma"
                  className="w-full bg-street-950 border border-street-800 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-brand-neon" />
              </div>
              <div className="space-y-1.5">
                <label className="text-zinc-400 font-mono">Email (Optional)</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="rohan@example.com (Optional)"
                  className="w-full bg-street-950 border border-street-800 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-brand-neon" />
              </div>
              <div className="space-y-1.5">
                <label className="text-zinc-400 font-mono">Mobile (+91) *</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-street-800 bg-street-900 text-zinc-400 font-mono text-xs">+91</span>
                  <input type="tel" required maxLength={10} value={phone} onChange={(e) => setPhone(e.target.value)}
                    placeholder="9820012345"
                    className="w-full bg-street-950 border border-street-800 rounded-r-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-brand-neon font-mono" />
                </div>
              </div>
            </div>
            <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer pt-1">
              <input type="checkbox" checked={acceptsMarketing} onChange={(e) => setAcceptsMarketing(e.target.checked)}
                className="w-4 h-4 rounded bg-street-950 border-street-800" />
              <span>Send me exclusive drop alerts and discount codes</span>
            </label>
          </div>

          {/* Section 2: Address */}
          <div className="bg-card border border-street-800 rounded-3xl p-6 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-brand-neon text-black font-mono text-xs flex items-center justify-center font-bold">2</span>
              Shipping Address (Pan-India)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-zinc-400 font-mono">Street Address *</label>
                <input type="text" required value={address} onChange={(e) => setAddress(e.target.value)}
                  placeholder="Flat 402, Sea Breeze Apts, 14th Road"
                  className="w-full bg-street-950 border border-street-800 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-brand-neon" />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-zinc-400 font-mono">Landmark (Optional)</label>
                <input type="text" value={landmark} onChange={(e) => setLandmark(e.target.value)}
                  placeholder="Near National Park Gate"
                  className="w-full bg-street-950 border border-street-800 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-brand-neon" />
              </div>
              <div className="space-y-1.5">
                <label className="text-zinc-400 font-mono">City *</label>
                <input type="text" required value={city} onChange={(e) => setCity(e.target.value)}
                  placeholder="Mumbai / Delhi / Bengaluru"
                  className="w-full bg-street-950 border border-street-800 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-brand-neon" />
              </div>
              <div className="space-y-1.5">
                <label className="text-zinc-400 font-mono">State *</label>
                <select value={state} onChange={(e) => setState(e.target.value)}
                  className="w-full bg-street-950 border border-street-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-neon cursor-pointer">
                  {INDIAN_STATES.map((st) => <option key={st} value={st}>{st}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-zinc-400 font-mono">PIN Code *</label>
                <input type="text" required maxLength={6} value={pincode} onChange={(e) => setPincode(e.target.value)}
                  placeholder="110020"
                  className="w-full bg-street-950 border border-street-800 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-brand-neon font-mono" />
              </div>
            </div>
          </div>

          {/* Section 3: Payment Method Selection */}
          <div className="bg-card border border-street-800 rounded-3xl p-6 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-brand-neon text-black font-mono text-xs flex items-center justify-center font-bold">3</span>
              Choose Payment Method
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Online Payment */}
              <button
                type="button"
                onClick={() => setPaymentMethod('online')}
                className={`p-4 rounded-2xl border-2 text-left transition-all ${
                  paymentMethod === 'online'
                    ? 'border-brand-neon bg-brand-neon/5'
                    : 'border-street-800 bg-street-950 hover:border-street-600'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    paymentMethod === 'online' ? 'bg-brand-neon/20 text-brand-neon' : 'bg-street-800 text-zinc-400'
                  }`}>
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className={`font-bold text-xs uppercase tracking-wide ${paymentMethod === 'online' ? 'text-brand-neon' : 'text-white'}`}>
                      Pay Online
                    </h4>
                    <p className="text-zinc-400 text-[11px] mt-0.5">UPI, Cards, NetBanking via Razorpay</p>
                    <span className="text-[10px] text-emerald-400 font-mono font-bold mt-1 block">✓ Zero surcharge</span>
                  </div>
                </div>
                {paymentMethod === 'online' && (
                  <div className="mt-3 pt-3 border-t border-brand-neon/20 flex items-center gap-2 text-[10px] text-zinc-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-neon" />
                    Instant confirmation after payment
                  </div>
                )}
              </button>

              {/* COD */}
              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-4 rounded-2xl border-2 text-left transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-brand-amber bg-brand-amber/5'
                    : 'border-street-800 bg-street-950 hover:border-street-600'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    paymentMethod === 'cod' ? 'bg-brand-amber/20 text-brand-amber' : 'bg-street-800 text-zinc-400'
                  }`}>
                    <Banknote className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className={`font-bold text-xs uppercase tracking-wide ${paymentMethod === 'cod' ? 'text-brand-amber' : 'text-white'}`}>
                      Cash on Delivery
                    </h4>
                    <p className="text-zinc-400 text-[11px] mt-0.5">Pay cash when your order arrives</p>
                    <span className="text-[10px] text-brand-amber font-mono font-bold mt-1 block">+ ₹99 advance charge</span>
                  </div>
                </div>
                {paymentMethod === 'cod' && (
                  <div className="mt-3 pt-3 border-t border-brand-amber/20 space-y-1.5 text-[10px] text-zinc-400">
                    <div className="flex items-center gap-2">
                      <Package className="w-3.5 h-3.5 text-brand-amber" />
                      ₹99 advance paid now via Razorpay
                    </div>
                    <div className="flex items-center gap-2">
                      <Banknote className="w-3.5 h-3.5 text-brand-amber" />
                      Remaining {formatPrice(totalAmount - COD_ADVANCE_FEE)} paid at delivery
                    </div>
                  </div>
                )}
              </button>
            </div>

            {/* COD info note */}
            {paymentMethod === 'cod' && (
              <div className="bg-brand-amber/5 border border-brand-amber/30 rounded-xl p-3.5 text-xs text-zinc-300 space-y-1">
                <p className="font-bold text-brand-amber flex items-center gap-1.5">
                  <Banknote className="w-4 h-4" /> Cash on Delivery — How it works:
                </p>
                <ul className="text-[11px] space-y-1 text-zinc-400 pl-1">
                  <li>• Pay <strong className="text-white">₹99 advance</strong> now via Razorpay (confirmation fee)</li>
                  <li>• Remaining <strong className="text-white">{formatPrice(totalAmount - COD_ADVANCE_FEE > 0 ? totalAmount - COD_ADVANCE_FEE : 0)}</strong> paid in cash at doorstep</li>
                  <li>• Delivery in 5–7 business days across India</li>
                  <li>• COD available for orders up to ₹10,000</li>
                </ul>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full font-black uppercase text-sm tracking-wider py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 ${
              paymentMethod === 'cod'
                ? 'bg-brand-amber hover:bg-amber-400 text-black shadow-glow-neon'
                : 'bg-brand-neon hover:bg-brand-neonHover text-black shadow-glow-neon'
            }`}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                {paymentMethod === 'cod' ? 'PLACING COD ORDER...' : 'INITIALIZING RAZORPAY...'}
              </span>
            ) : paymentMethod === 'cod' ? (
              <>
                <Banknote className="w-4 h-4" />
                CONFIRM COD — PAY ₹99 ADVANCE NOW
              </>
            ) : (
              <>
                PAY {formatPrice(totalAmount)} WITH RAZORPAY
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-zinc-500 pt-1">
            <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-brand-cyan" /> Secure & Encrypted</span>
            <span className="flex items-center gap-1"><Truck className="w-3.5 h-3.5 text-brand-cyan" /> Pan-India Delivery</span>
            <span className="flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 text-brand-neon" /> 7-Day Easy Returns</span>
          </div>
        </form>

        {/* ── Right: Order Summary ── */}
        <div className="lg:col-span-5 bg-card border border-street-800 rounded-3xl p-6 space-y-6">
          <h2 className="font-display font-bold text-base text-white uppercase tracking-wider pb-4 border-b border-street-800">
            Order Review ({items.reduce((s, i) => s + i.quantity, 0)} Items)
          </h2>

          <div className="max-h-[280px] overflow-y-auto space-y-3 divide-y divide-street-800/60 pr-1">
            {items.map((item) => (
              <div key={item.id} className="pt-3 first:pt-0 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-14 bg-street-950 rounded-lg overflow-hidden shrink-0 border border-street-800">
                    <Image
                      src={item.product.thumbnail || item.product.images[0] || '/images/plain_oversized_black.jpg'}
                      alt={item.product.name} fill className="object-cover" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold line-clamp-1">{item.product.name}</h4>
                    <p className="text-zinc-500 font-mono text-[11px]">{item.size} • {item.color} • Qty: {item.quantity}</p>
                  </div>
                </div>
                <span className="font-mono font-bold text-white shrink-0">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          {/* Price breakdown */}
          <div className="space-y-2 text-xs text-zinc-400 border-t border-street-800 pt-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-mono text-white">{formatPrice(subtotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-brand-neon">
                <span>Promo Discount ({couponCode})</span>
                <span className="font-mono">- {formatPrice(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Pan-India Shipping</span>
              <span className="font-mono text-white">
                {shippingFee === 0 ? <strong className="text-brand-neon">FREE</strong> : formatPrice(shippingFee)}
              </span>
            </div>
            {paymentMethod === 'cod' && (
              <div className="flex justify-between text-brand-amber">
                <span>COD Advance Fee</span>
                <span className="font-mono">+ {formatPrice(COD_ADVANCE_FEE)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-black text-white pt-3 border-t border-street-800">
              <span>{paymentMethod === 'cod' ? 'Pay Now (Advance)' : 'Total Payable'}</span>
              <span className={`font-mono text-xl ${paymentMethod === 'cod' ? 'text-brand-amber' : 'text-brand-neon'}`}>
                {paymentMethod === 'cod' ? formatPrice(COD_ADVANCE_FEE) : formatPrice(totalAmount)}
              </span>
            </div>
            {paymentMethod === 'cod' && (
              <div className="flex justify-between text-zinc-500 text-[11px]">
                <span>Cash at doorstep</span>
                <span className="font-mono">{formatPrice(Math.max(0, totalAmount - COD_ADVANCE_FEE))}</span>
              </div>
            )}
          </div>

          <div className="bg-street-900/60 p-4 rounded-2xl border border-street-800 text-[11px] text-zinc-400 space-y-1.5">
            <div className="flex items-center gap-1.5 text-zinc-300 font-bold">
              <Truck className="w-3.5 h-3.5 text-brand-cyan" /> Delhi Atelier Dispatch
            </div>
            <p>Your order will be safely packed in our premium matte black apparel box within 24 hours.</p>
          </div>
        </div>
      </div>

      {/* Razorpay Test Modal */}
      {isTestModalOpen && testOrderSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-card border border-brand-neon/40 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-street-800">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-brand-neon" />
                <h3 className="font-bold text-white uppercase text-sm">Razorpay Sandbox Gateway</h3>
              </div>
              <span className="text-[10px] bg-brand-neon/20 text-brand-neon font-mono px-2 py-0.5 rounded font-bold">TEST MODE</span>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-zinc-300">Checking out with order <strong className="text-white font-mono">{testOrderSession.orderNumber}</strong>.</p>
              <div className="bg-street-900 p-4 rounded-xl border border-street-800 space-y-1.5 font-mono">
                <div className="flex justify-between text-zinc-400">
                  <span>Razorpay Order ID:</span>
                  <span className="text-white">{testOrderSession.razorpayOrderId}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Amount:</span>
                  <span className="text-brand-neon font-bold">₹{testOrderSession.finalTotalAmount}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <button onClick={handleSimulatedTestPayment}
                className="w-full bg-brand-neon hover:bg-brand-neonHover text-black font-black uppercase text-xs py-3.5 rounded-xl shadow-glow-neon flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> SIMULATE SUCCESSFUL PAYMENT
              </button>
              <button onClick={() => { setIsTestModalOpen(false); setLoading(false); }}
                className="w-full bg-street-900 hover:bg-street-800 text-zinc-400 hover:text-white font-semibold text-xs py-3 rounded-xl">
                Cancel Transaction
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
