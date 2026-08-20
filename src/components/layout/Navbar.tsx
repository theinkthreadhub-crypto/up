'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Search, Menu, X, Shield, Truck, Compass, Flame } from 'lucide-react';
import { useCart } from '@/lib/store';
import SearchModal from './SearchModal';

export default function Navbar() {
  const pathname = usePathname();
  const { totalItemCount, setIsDrawerOpen } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // If in admin routes, don't show the storefront navbar
  const isAdminRoute = pathname.startsWith('/admin');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isAdminRoute) return null;

  const navLinks = [
    { name: 'DROP / SHOP', href: '/shop', highlight: true },
    { name: 'OVERSIZED TEES', href: '/category/oversized-t-shirts' },
    { name: 'HOODIES', href: '/category/heavyweight-hoodies' },
    { name: 'OUTERWEAR', href: '/category/jackets-outerwear' },
    { name: 'LOOKBOOK', href: '/blog' },
    { name: 'ABOUT', href: '/about' },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-background/90 backdrop-blur-md border-b border-street-800 shadow-glass'
            : 'bg-background/60 backdrop-blur-sm border-b border-white/5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Left: Mobile menu toggle + Desktop Logo */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-zinc-300 hover:text-white transition-colors"
                aria-label="Toggle Menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              {/* Brand Logo */}
              <Link href="/" className="flex items-center gap-2 group">
                <span className="font-display font-black text-xl sm:text-2xl tracking-tighter text-white uppercase group-hover:text-brand-neon transition-colors">
                  INK<span className="text-brand-neon">THREAD</span>
                  <span className="text-zinc-500 text-xs ml-1 font-mono tracking-normal px-1.5 py-0.5 border border-zinc-700 rounded uppercase">HUB</span>
                </span>
              </Link>
            </div>

            {/* Middle: Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-7">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-xs font-semibold tracking-wider transition-all duration-200 uppercase relative py-1 ${
                      isActive
                        ? 'text-brand-neon font-bold'
                        : 'text-zinc-300 hover:text-white'
                    } ${link.highlight ? 'flex items-center gap-1 text-brand-neon' : ''}`}
                  >
                    {link.highlight && <Flame className="w-3.5 h-3.5 text-brand-neon animate-pulse" />}
                    {link.name}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-neon rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right: Actions (Search, Track Order, Cart, Admin Icon) */}
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-zinc-300 hover:text-white hover:bg-street-900 rounded-full transition-colors flex items-center gap-1.5 text-xs font-medium"
                title="Search Products (Ctrl+K)"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden md:inline text-zinc-400">Search</span>
              </button>

              <Link
                href="/track-order"
                className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-300 hover:text-white p-2 hover:bg-street-900 rounded-full transition-colors"
                title="Track Live Order"
              >
                <Truck className="w-4 h-4 text-brand-cyan" />
                <span className="hidden md:inline">Track</span>
              </Link>

              {/* Cart Drawer Trigger */}
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="p-2 text-zinc-200 hover:text-white hover:bg-street-900 rounded-full transition-colors relative flex items-center"
                aria-label="Open Shopping Cart"
              >
                <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
                {totalItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand-neon text-black font-black text-[11px] w-5 h-5 rounded-full flex items-center justify-center shadow-glow-neon animate-bounce">
                    {totalItemCount}
                  </span>
                )}
              </button>

              {/* Admin Access Shortcut */}
              <Link
                href="/admin"
                className="p-2 text-zinc-500 hover:text-brand-neon hover:bg-street-900 rounded-full transition-colors hidden sm:block"
                title="Admin Management Portal"
              >
                <Shield className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-card border-b border-street-800 px-4 pt-3 pb-6 animate-in slide-in-from-top-4 duration-200">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-sm font-medium tracking-wide uppercase py-2 px-3 rounded-lg transition-colors ${
                    pathname === link.href
                      ? 'bg-street-800 text-brand-neon font-bold'
                      : 'text-zinc-300 hover:bg-street-900 hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="border-t border-street-800 pt-3 mt-2 flex flex-col gap-2">
                <Link
                  href="/track-order"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-sm text-zinc-300 py-2 px-3 rounded-lg hover:bg-street-900"
                >
                  <Truck className="w-4 h-4 text-brand-cyan" />
                  Track Your Order
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-sm text-zinc-300 py-2 px-3 rounded-lg hover:bg-street-900"
                >
                  <Compass className="w-4 h-4 text-brand-amber" />
                  Contact & Atelier Support
                </Link>
                <Link
                  href="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-sm text-zinc-400 py-2 px-3 rounded-lg hover:bg-street-900"
                >
                  <Shield className="w-4 h-4 text-zinc-400" />
                  Admin Portal Login
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
