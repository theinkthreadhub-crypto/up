'use client';

import { useEffect, useMemo, useState } from 'react';
import { Save, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { SiteSettings } from '@/types/database';

const defaultSettings: SiteSettings = {
  id: '',
  brand_name: 'InkThread Hub',
  tagline: 'Heavyweight Streetwear & Artisanal Oversized Drops',
  contact_email: 'support@inkthreadhub.com',
  support_phone: '+91 98765 43210',
  currency: 'INR',
  currency_symbol: '₹',
  free_shipping_threshold: 999,
  default_shipping_fee: 99,
  tax_percent: 5,
  announcement_bar_enabled: true,
  announcement_bar_text: '⚡ FLASH DROP: FREE SHIPPING ON ALL ORDERS ABOVE ₹999 | USE CODE: INKDROP10 FOR 10% OFF',
  store_address: 'Plot 42, Okhla Industrial Area Phase III',
  city: 'New Delhi',
  state: 'Delhi',
  pincode: '110020',
};

export default function AdminSettingsPage() {
  const supabase = useMemo(() => createClient(), []);
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState('');

  const loadSettings = async () => {
    setLoading(true);
    setError('');
    const { data, error: dbError } = await supabase
      .from('site_settings')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (dbError) {
      setError(dbError.message);
    } else if (data) {
      setSettings(data as SiteSettings);
    }
    setLoading(false);
  };

  useEffect(() => {
    void loadSettings();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSavedSuccess(false);

    const payload = {
      brand_name: settings.brand_name,
      tagline: settings.tagline,
      contact_email: settings.contact_email,
      support_phone: settings.support_phone,
      currency: settings.currency || 'INR',
      currency_symbol: settings.currency_symbol || '₹',
      free_shipping_threshold: Number(settings.free_shipping_threshold),
      default_shipping_fee: Number(settings.default_shipping_fee),
      tax_percent: Number(settings.tax_percent),
      announcement_bar_enabled: settings.announcement_bar_enabled ?? true,
      announcement_bar_text: settings.announcement_bar_text || '',
      updated_at: new Date().toISOString(),
    };

    let dbError;
    if (settings.id) {
      const result = await supabase.from('site_settings').update(payload).eq('id', settings.id);
      dbError = result.error;
    } else {
      const result = await supabase.from('site_settings').insert(payload).select().single();
      dbError = result.error;
      if (result.data) setSettings(result.data as SiteSettings);
    }

    if (dbError) {
      setError(dbError.message);
    } else {
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
      await loadSettings();
    }
    setSaving(false);
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

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-2xl flex items-center gap-3 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {savedSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-2xl flex items-center gap-3 text-xs">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>Settings successfully updated in Supabase and synchronized live across the storefront.</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20 text-zinc-400 font-mono text-xs gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-brand-neon" />
          <span>Loading store settings from Supabase...</span>
        </div>
      ) : (
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
                  value={settings.tagline || ''}
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

          {/* Announcement Bar */}
          <div className="bg-card border border-street-800 rounded-3xl p-6 space-y-4">
            <h2 className="font-display font-bold text-sm text-white uppercase tracking-wider">
              Top Announcement Bar
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="ann_enabled"
                  checked={settings.announcement_bar_enabled}
                  onChange={(e) => setSettings({ ...settings, announcement_bar_enabled: e.target.checked })}
                  className="w-4 h-4 rounded border-street-800 bg-street-950 text-brand-neon focus:ring-brand-neon"
                />
                <label htmlFor="ann_enabled" className="text-white font-mono cursor-pointer">
                  Enable Top Notification Banner across storefront
                </label>
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-400 font-mono">Announcement Text</label>
                <textarea
                  rows={2}
                  value={settings.announcement_bar_text || ''}
                  onChange={(e) => setSettings({ ...settings, announcement_bar_text: e.target.value })}
                  className="w-full bg-street-950 border border-street-800 rounded-xl px-4 py-2.5 text-white"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={saving}
              className="bg-brand-neon hover:bg-brand-neonHover text-black font-black uppercase text-xs sm:text-sm px-8 py-3.5 rounded-xl shadow-glow-neon flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> SAVING...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> SAVE GLOBAL SETTINGS
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
