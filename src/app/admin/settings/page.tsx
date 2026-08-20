'use client';

import { useState } from 'react';
import { Settings, Save, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { initialSiteSettings } from '@/lib/mock-data';
import { SiteSettings } from '@/types/database';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(initialSiteSettings);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-street-800 gap-4">
        <div>
          <span className="text-xs font-mono font-bold text-brand-neon uppercase tracking-widest">
            GLOBAL CONFIGURATION
          </span>
          <h1 className="font-display font-black text-2xl sm:text-4xl text-white uppercase tracking-tight">
            STORE SETTINGS
          </h1>
        </div>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-2xl flex items-center gap-3 text-xs">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>Settings successfully synchronized across the storefront.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* Brand Information */}
        <div className="bg-card border border-street-800 rounded-3xl p-6 space-y-4">
          <h2 className="font-display font-bold text-sm text-white uppercase tracking-wider">
            Brand Identity
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-zinc-400 font-mono">Brand Name</label>
              <input
                type="text"
                value={settings.brand_name}
                onChange={(e) => setSettings({ ...settings, brand_name: e.target.value })}
                className="w-full bg-street-950 border border-street-800 rounded-xl px-4 py-2.5 text-white"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-zinc-400 font-mono">Brand Tagline</label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full bg-street-950 border border-street-800 rounded-xl px-4 py-2.5 text-white"
              />
            </div>
          </div>
        </div>

        {/* Contact & Support */}
        <div className="bg-card border border-street-800 rounded-3xl p-6 space-y-4">
          <h2 className="font-display font-bold text-sm text-white uppercase tracking-wider">
            Atelier Contact & Support
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-zinc-400 font-mono">Support Email</label>
              <input
                type="email"
                value={settings.contact_email}
                onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                className="w-full bg-street-950 border border-street-800 rounded-xl px-4 py-2.5 text-white"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-zinc-400 font-mono">Helpline / WhatsApp</label>
              <input
                type="text"
                value={settings.support_phone}
                onChange={(e) => setSettings({ ...settings, support_phone: e.target.value })}
                className="w-full bg-street-950 border border-street-800 rounded-xl px-4 py-2.5 text-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* Shipping & Tax Thresholds */}
        <div className="bg-card border border-street-800 rounded-3xl p-6 space-y-4">
          <h2 className="font-display font-bold text-sm text-white uppercase tracking-wider">
            Shipping & Taxes (Pan-India)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-zinc-400 font-mono">Free Delivery Threshold (₹)</label>
              <input
                type="number"
                value={settings.free_shipping_threshold}
                onChange={(e) => setSettings({ ...settings, free_shipping_threshold: Number(e.target.value) })}
                className="w-full bg-street-950 border border-street-800 rounded-xl px-4 py-2.5 text-white font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-zinc-400 font-mono">Standard Shipping Fee (₹)</label>
              <input
                type="number"
                value={settings.default_shipping_fee}
                onChange={(e) => setSettings({ ...settings, default_shipping_fee: Number(e.target.value) })}
                className="w-full bg-street-950 border border-street-800 rounded-xl px-4 py-2.5 text-white font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-zinc-400 font-mono">GST Rate (%)</label>
              <input
                type="number"
                value={settings.tax_percent}
                onChange={(e) => setSettings({ ...settings, tax_percent: Number(e.target.value) })}
                className="w-full bg-street-950 border border-street-800 rounded-xl px-4 py-2.5 text-white font-mono"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="bg-brand-neon hover:bg-brand-neonHover text-black font-black uppercase text-xs sm:text-sm px-8 py-3.5 rounded-xl shadow-glow-neon flex items-center gap-2 transition-all"
          >
            <Save className="w-4 h-4" /> SAVE GLOBAL SETTINGS
          </button>
        </div>
      </form>
    </div>
  );
}
