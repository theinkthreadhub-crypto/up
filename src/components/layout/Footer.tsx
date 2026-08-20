'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, ShieldCheck, Truck, RefreshCw, Sparkles, Globe, Share2 } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // If in admin routes, don't show the storefront footer
  if (pathname.startsWith('/admin')) return null;

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-zinc-900 border-t border-zinc-800 text-zinc-300 text-sm">
      {/* Brand Value Props Banner */}
      <div className="border-b border-zinc-800 bg-zinc-950 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex items-center gap-4 justify-center md:justify-start p-3 bg-zinc-900 rounded-xl border border-zinc-800">
            <div className="w-10 h-10 rounded-lg bg-white/10 text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-wider">240-380 GSM Heavyweight</h4>
              <p className="text-zinc-400 text-xs mt-0.5">Custom French terry & super-combed cotton</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-start p-3 bg-zinc-900 rounded-xl border border-zinc-800">
            <div className="w-10 h-10 rounded-lg bg-white/10 text-white flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-wider">Free Pan-India Delivery</h4>
              <p className="text-zinc-400 text-xs mt-0.5">Complimentary express shipping on orders over ₹999</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-start p-3 bg-zinc-900 rounded-xl border border-zinc-800">
            <div className="w-10 h-10 rounded-lg bg-white/10 text-white flex items-center justify-center shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-wider">Easy 7-Day Size Exchanges</h4>
              <p className="text-zinc-400 text-xs mt-0.5">Hassle-free doorstep pickup & exchange</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Col 1: Brand & Newsletter */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-serif text-2xl sm:text-3xl text-white tracking-tight">
                Inkthread Hub
              </span>
            </Link>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
              Slow fashion & tactile craftsmanship. Organic bio-washed cotton, heavy acid-wash fleece, and genuine leather pet collar hardware.
            </p>

            {/* Newsletter Form */}
            <div className="pt-2">
              <p className="text-xs font-bold text-white uppercase tracking-wider mb-2">JOIN THE PRIVATE DROP LIST</p>
              {subscribed ? (
                <div className="bg-white/10 border border-white/20 text-white p-3 rounded-xl text-xs font-semibold">
                  ⚡ Welcome to the underground. Look out for drop alerts!
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white"
                  />
                  <button
                    type="submit"
                    className="bg-white hover:bg-zinc-200 text-black font-bold text-xs uppercase px-4 py-2.5 rounded-xl transition-all flex items-center gap-1 shrink-0"
                  >
                    JOIN <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Col 2: Collections */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">COLLECTIONS</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/category/oversized-t-shirts" className="hover:text-brand-neon transition-colors">Oversized T-Shirts</Link></li>
              <li><Link href="/category/heavyweight-hoodies" className="hover:text-brand-neon transition-colors">Heavyweight Hoodies</Link></li>
              <li><Link href="/category/graphic-drops" className="hover:text-brand-neon transition-colors">Graphic Anime Drops</Link></li>
              <li><Link href="/category/jackets-outerwear" className="hover:text-brand-neon transition-colors">Bombers & Outerwear</Link></li>
              <li><Link href="/category/streetwear-accessories" className="hover:text-brand-neon transition-colors">Street Accessories</Link></li>
            </ul>
          </div>

          {/* Col 3: Support & Help */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">CLIENT CARE</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/track-order" className="text-brand-cyan hover:underline">Track Your Order</Link></li>
              <li><Link href="/contact" className="hover:text-brand-neon transition-colors">Atelier Support & FAQ</Link></li>
              <li><Link href="/about" className="hover:text-brand-neon transition-colors">Artisanal Manifesto</Link></li>
              <li><Link href="/blog" className="hover:text-brand-neon transition-colors">The Streetwear Journal</Link></li>
              <li><Link href="/admin" className="text-zinc-500 hover:text-white">Admin Management</Link></li>
            </ul>
          </div>

          {/* Col 4: Contact & Social */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">ATELIER CONTACT</h4>
            <div className="text-xs space-y-1.5 text-zinc-400">
              <p>Email: <a href="mailto:support@inkthreadhub.com" className="text-white hover:text-brand-neon">support@inkthreadhub.com</a></p>
              <p>WhatsApp / Call: <span className="text-white font-mono">+91 98765 43210</span></p>
              <p>Okhla Industrial Area Phase III, New Delhi, 110020</p>
            </div>

            <div className="flex gap-3 pt-2">
              <a
                href="https://instagram.com/inkthreadhub"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-street-900 border border-street-800 flex items-center justify-center text-zinc-400 hover:text-brand-neon hover:border-brand-neon transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://twitter.com/inkthreadhub"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-street-900 border border-street-800 flex items-center justify-center text-zinc-400 hover:text-brand-neon hover:border-brand-neon transition-colors"
                aria-label="Twitter / X"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Gateway Badges */}
        <div className="border-t border-street-800/80 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} InkThread Hub. All rights reserved. Built for street culture.</p>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-zinc-400">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-neon" /> Razorpay Verified 256-bit SSL
            </span>
            <span>•</span>
            <span>UPI / Cards / NetBanking</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
