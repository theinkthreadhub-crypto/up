'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Search, Menu, X, Shield, Truck, Compass, ChevronDown } from 'lucide-react';
import { useCart } from '@/lib/store';
import SearchModal from './SearchModal';

const megaMenu = [
  {
    label: 'T-SHIRTS',
    href: '/category/regular-t-shirts',
    items: [
      { name: 'Regular T-Shirts', href: '/category/regular-t-shirts' },
      { name: 'Oversized T-Shirts', href: '/category/oversized-t-shirts' },
      { name: 'Acid Wash Tees', href: '/category/acid-wash-t-shirts' },
      { name: 'Full Sleeve', href: '/category/full-sleeve' },
      { name: 'Polo T-Shirts', href: '/category/polo-t-shirts' },
      { name: 'Tank / Sleeveless', href: '/category/tank-tops' },
      { name: 'AOP T-Shirts', href: '/category/aop-t-shirts' },
    ],
  },
  {
    label: 'HOODIES',
    href: '/category/hoodies',
    items: [
      { name: 'Regular Hoodies', href: '/category/hoodies' },
      { name: 'Oversized Hoodies', href: '/category/hoodies' },
      { name: 'Acid Wash Hoodies', href: '/category/acid-wash-hoodies' },
      { name: 'Zip Hoodies', href: '/category/hoodies' },
      { name: 'Sweatshirts', href: '/category/sweatshirts' },
    ],
  },
  {
    label: 'BOTTOMWEAR',
    href: '/category/bottomwear',
    items: [
      { name: 'Joggers', href: '/category/bottomwear' },
      { name: 'Sweatpants', href: '/category/bottomwear' },
      { name: 'Shorts', href: '/category/bottomwear' },
    ],
  },
  {
    label: 'WOMEN',
    href: '/category/women',
    items: [
      { name: 'Baby Tees', href: '/category/women' },
      { name: 'Crop Tops', href: '/category/women' },
      { name: 'Oversized Tees', href: '/category/women' },
      { name: 'Hoodies', href: '/category/women' },
      { name: 'Tanks', href: '/category/women' },
      { name: 'Dresses', href: '/category/women' },
    ],
  },
  {
    label: 'ACCESSORIES',
    href: '/category/caps-headwear',
    items: [
      { name: 'Caps & Headwear', href: '/category/caps-headwear' },
      { name: 'Tote Bags', href: '/category/tote-bags' },
      { name: 'Phone Cases', href: '/category/phone-cases' },
      { name: 'Stickers & Badges', href: '/category/stickers-badges' },
      { name: 'Pet Products', href: '/category/pet' },
    ],
  },
  {
    label: 'HOME',
    href: '/category/home-lifestyle',
    items: [
      { name: 'Mugs & Drinkware', href: '/category/mugs-drinkware' },
      { name: 'Posters & Prints', href: '/category/home-lifestyle' },
      { name: 'Cushion Covers', href: '/category/home-lifestyle' },
      { name: 'Notebooks', href: '/category/home-lifestyle' },
      { name: 'Kids', href: '/category/kids' },
    ],
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const { totalItemCount, setIsDrawerOpen } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeMega, setActiveMega] = useState<string | null>(null);
  const megaTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isAdminRoute = pathname.startsWith('/admin');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isAdminRoute) return null;

  const handleMegaEnter = (label: string) => {
    if (megaTimeout.current) clearTimeout(megaTimeout.current);
    setActiveMega(label);
  };

  const handleMegaLeave = () => {
    megaTimeout.current = setTimeout(() => setActiveMega(null), 150);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-street-950/98 backdrop-blur-xl border-b border-street-700 shadow-glass'
            : 'bg-street-950/90 backdrop-blur-md border-b border-street-800'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">

            {/* Left: Mobile Toggle + Desktop Nav */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-street-300 hover:text-brand-neon transition-colors"
                aria-label="Toggle Menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              {/* Quick Links */}
              <nav className="hidden lg:flex items-center gap-1">
                {/* NEW DROPS */}
                <Link
                  href="/category/new-drops"
                  className={`text-[11px] font-black tracking-widest uppercase px-3 py-2 rounded-lg transition-colors ${
                    pathname === '/category/new-drops'
                      ? 'text-brand-neon bg-brand-neon/10'
                      : 'text-brand-neon hover:bg-brand-neon/10'
                  }`}
                >
                  NEW DROPS 🔥
                </Link>

                {/* MEGA MENU ITEMS */}
                {megaMenu.map((menu) => (
                  <div
                    key={menu.label}
                    className="relative"
                    onMouseEnter={() => handleMegaEnter(menu.label)}
                    onMouseLeave={handleMegaLeave}
                  >
                    <Link
                      href={menu.href}
                      className={`flex items-center gap-1 text-[11px] font-medium tracking-widest uppercase px-3 py-2 rounded-lg transition-colors ${
                        activeMega === menu.label
                          ? 'text-brand-neon bg-street-800'
                          : 'text-street-300 hover:text-brand-neon hover:bg-street-900'
                      }`}
                    >
                      {menu.label}
                      <ChevronDown className={`w-3 h-3 transition-transform ${activeMega === menu.label ? 'rotate-180' : ''}`} />
                    </Link>

                    {/* Dropdown */}
                    {activeMega === menu.label && (
                      <div
                        className="absolute top-full left-0 mt-1 w-48 bg-street-900 border border-street-700 rounded-xl shadow-glass overflow-hidden"
                        onMouseEnter={() => handleMegaEnter(menu.label)}
                        onMouseLeave={handleMegaLeave}
                      >
                        {menu.items.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            className="block px-4 py-2.5 text-xs text-street-300 hover:text-brand-neon hover:bg-street-800 transition-colors border-b border-street-800 last:border-0"
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {/* BESTSELLERS */}
                <Link
                  href="/category/bestsellers"
                  className="text-[11px] font-medium tracking-widest uppercase px-3 py-2 rounded-lg text-brand-amber hover:bg-brand-amber/10 transition-colors"
                >
                  BESTSELLERS ⭐
                </Link>
              </nav>
            </div>

            {/* Center: Logo */}
            <Link href="/" className="flex items-center justify-center absolute left-1/2 -translate-x-1/2">
              <span className="font-serif text-xl sm:text-2xl tracking-tight hover:opacity-80 transition-opacity whitespace-nowrap">
                <span className="text-white">Inkthread </span>
                <span className="text-brand-neon">Hub</span>
              </span>
            </Link>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-street-300 hover:text-brand-neon hover:bg-street-800 rounded-full transition-colors"
                title="Search Products"
              >
                <Search className="w-5 h-5" />
              </button>

              <Link
                href="/admin"
                className="p-2 text-street-400 hover:text-brand-neon hover:bg-street-800 rounded-full transition-colors hidden sm:block"
                title="Admin Portal"
              >
                <Shield className="w-4 h-4" />
              </Link>

              {/* Cart */}
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

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-street-950 border-b border-street-800 px-4 pt-3 pb-6 max-h-[75vh] overflow-y-auto">
            <div className="flex flex-col gap-1">
              <Link
                href="/category/new-drops"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm font-black text-brand-neon py-2.5 px-3 rounded-lg hover:bg-brand-neon/10 transition-colors uppercase tracking-wider"
              >
                🔥 NEW DROPS
              </Link>
              {megaMenu.map((menu) => (
                <div key={menu.label}>
                  <p className="text-[10px] font-bold text-street-500 uppercase tracking-widest pt-3 pb-1 px-3">
                    {menu.label}
                  </p>
                  {menu.items.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block text-sm text-street-300 hover:text-brand-neon py-2 px-3 rounded-lg hover:bg-street-900 transition-colors"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              ))}
              <div className="border-t border-street-800 pt-3 mt-2 flex flex-col gap-1">
                <Link href="/category/bestsellers" onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-sm text-brand-amber py-2 px-3 rounded-lg hover:bg-brand-amber/10">
                  ⭐ Bestsellers
                </Link>
                <Link href="/track-order" onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-sm text-street-300 py-2 px-3 rounded-lg hover:bg-street-900">
                  <Truck className="w-4 h-4 text-brand-cyan" /> Track Order
                </Link>
                <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-sm text-street-300 py-2 px-3 rounded-lg hover:bg-street-900">
                  <Compass className="w-4 h-4 text-brand-amber" /> Contact
                </Link>
                <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-sm text-street-400 py-2 px-3 rounded-lg hover:bg-street-900">
                  <Shield className="w-4 h-4" /> Admin Portal
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
