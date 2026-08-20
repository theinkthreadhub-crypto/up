'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Layers,
  Boxes,
  ShoppingBag,
  Users,
  FileText,
  Megaphone,
  Mail,
  CreditCard,
  BarChart3,
  Settings,
  LogOut,
  ExternalLink,
  Shield,
} from 'lucide-react';

const ADMIN_LINKS = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Categories', href: '/admin/categories', icon: Layers },
  { name: 'Inventory', href: '/admin/inventory', icon: Boxes },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { name: 'Customers', href: '/admin/customers', icon: Users },
  { name: 'Blog & CMS', href: '/admin/blog', icon: FileText },
  { name: 'Announcements', href: '/admin/announcements', icon: Megaphone },
  { name: 'Email System', href: '/admin/emails', icon: Mail },
  { name: 'Payments', href: '/admin/payments', icon: CreditCard },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminSidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem('ith_admin_auth');
    window.location.href = '/admin/login';
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-64 bg-card border-r border-street-800 transition-transform duration-300 ease-in-out flex flex-col justify-between ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div>
          <div className="h-16 flex items-center justify-between px-6 border-b border-street-800 bg-street-900/40">
            <Link href="/admin" className="flex items-center gap-2">
              <span className="font-display font-black text-lg text-white uppercase tracking-tight">
                INK<span className="text-brand-neon">THREAD</span>
              </span>
              <span className="text-[10px] bg-brand-neon/20 text-brand-neon px-1.5 py-0.5 rounded font-mono font-bold">
                ADMIN
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
            {ADMIN_LINKS.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors ${
                    isActive
                      ? 'bg-brand-neon text-black font-bold shadow-glow-neon'
                      : 'text-zinc-400 hover:text-white hover:bg-street-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-zinc-400'}`} />
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-street-800 space-y-2 bg-street-950">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 text-xs font-mono text-zinc-400 hover:text-white rounded-xl hover:bg-street-900 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" /> View Storefront
            </span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
