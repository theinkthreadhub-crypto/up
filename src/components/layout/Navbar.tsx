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
    { name: 'HOME', href: '/' },
    { name: 'CATALOG', href: '/shop' },
    { name: 'JOURNAL', href: '/blog' },
    { name: 'MEN', href: '/category/men' },
    { name: 'WOMEN', href: '/category/women' },
    { name: 'PETS', href: '/category/pet' },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-street-950/95 backdrop-blur-md border-b border-street-700 shadow-glass'
            : 'bg-street-950/80 backdrop-blur-sm border-b border-street-800'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Left: Desktop Links / Mobile Menu Toggle */}
            <div className="flex items-center gap-6">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-street-300 hover:text-brand-neon transition-colors"
                aria-label="Toggle Menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              <nav className="hidden lg:flex items-center gap-6">
                {navLinks.slice(0, 3).map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`text-xs font-medium tracking-widest transition-colors uppercase relative py-1 ${
                        isActive
                          ? 'text-brand-neon font-bold border-b-2 border-brand-neon'
                          : 'text-street-300 hover:text-brand-neon'
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Center: Elegant Serif Logo */}
            <Link href="/" className="flex items-center justify-center">
              <span className="font-serif text-2xl sm:text-3xl tracking-tight hover:opacity-80 transition-opacity">
                <span className="text-white">Inkthread </span><span className="text-brand-neon">Hub</span>
              </span>
            </Link>

            {/* Right: Actions & Category Quick Links */}
            <div className="flex items-center gap-3 sm:gap-5">
              <nav className="hidden xl:flex items-center gap-4 text-xs font-mono text-street-400 border-r border-street-700 pr-4">
                <Link href="/category/men" className="hover:text-brand-neon transition-colors">MEN</Link>
                <Link href="/category/women" className="hover:text-brand-neon transition-colors">WOMEN</Link>
                <Link href="/category/pet" className="hover:text-brand-neon transition-colors">PETS</Link>
              </nav>

              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-street-300 hover:text-brand-neon hover:bg-street-800 rounded-full transition-colors"
                title="Search Products"
              >
                <Search className="w-5 h-5" />
              </button>

              <Link
                href="/admin/login"
                className="p-2 text-street-400 hover:text-brand-neon hover:bg-street-800 rounded-full transition-colors"
                title="Admin Access"
              >
                <Shield className="w-5 h-5" />
              </Link>

              {/* Cart Drawer Trigger */}
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="p-2 text-street-200 hover:bg-street-800 rounded-full transition-colors relative flex items-center"
                aria-label="Open Shopping Cart"
              >
                <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
                {totalItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand-neon text-white font-black text-[11px] w-5 h-5 rounded-full flex items-center justify-center shadow-glow-neon animate-bounce">
                    {totalItemCount}
                  </span>
                )}
              </button>
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
