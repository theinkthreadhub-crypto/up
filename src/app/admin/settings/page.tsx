'use client';

import { useEffect, useMemo, useState } from 'react';
import { Save, CheckCircle2, Loader2, AlertCircle, Share2, MapPin, Globe, Printer } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { SiteSettings } from '@/types/database';

const defaultSettings: SiteSettings = {
  id: '',
  brand_name: 'InkThread Hub',
  tagline: 'Slow fashion & tactile craftsmanship. Organic bio-washed cotton, heavy acid-wash fleece, and genuine leather pet collar hardware.',
  contact_email: 'support@inkthreadhub.com',
  support_phone: '+91 98765 43210',
  currency: 'INR',
  currency_symbol: '₹',
  free_shipping_threshold: 999,
  default_shipping_fee: 99,
  tax_percent: 5,
  announcement_bar_enabled: true,
  announcement_bar_text: '⚡ FLASH DROP: 20% OFF ON ORDERS OVER ₹1,499 | USE CODE: STREET20',
  store_address: 'Okhla Industrial Area Phase III',
  city: 'New Delhi',
  state: 'Delhi',
  pincode: '110020',
  facebook_url: 'https://facebook.com/inkthreadhub',
  instagram_url: 'https://instagram.com/inkthreadhub',
  twitter_url: 'https://twitter.com/inkthreadhub',
  qikink_client_id: '',
  qikink_auto_fulfillment: true,
};

export default function AdminSettingsPage() {
  const supabase = useMemo(() => createClient(), []);
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testingQikink, setTestingQikink] = useState(false);
  const [qikinkTestResult, setQikinkTestResult] = useState<{ success: boolean; msg: string } | null>(null);

  const testQikinkConnection = async () => {
    setTestingQikink(true);
    setQikinkTestResult(null);
    try {
      const res = await fetch('/api/admin/test-qikink', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: settings.qikink_api_key }),
      });
      const data = await res.json();
      if (data.success) {
        setQikinkTestResult({ success: true, msg: '✅ ' + data.message });
      } else {
        setQikinkTestResult({ success: false, msg: '❌ ' + (data.error || 'Connection failed') });
      }
    } catch (e) {
      setQikinkTestResult({ success: false, msg: '❌ Connection error' });
    } finally {
      setTestingQikink(false);
    }
  };

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
      setSettings({
        ...defaultSettings,
        ...(data as SiteSettings),
      });
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
      brand_name: settings.brand_name.trim(),
      tagline: settings.tagline.trim(),
      contact_email: settings.contact_email.trim(),
      support_phone: settings.support_phone.trim(),
      currency: settings.currency || 'INR',
      currency_symbol: settings.currency_symbol || '₹',
      free_shipping_threshold: Number(settings.free_shipping_threshold),
      default_shipping_fee: Number(settings.default_shipping_fee),
      tax_percent: Number(settings.tax_percent),
      announcement_bar_enabled: settings.announcement_bar_enabled ?? true,
      announcement_bar_text: settings.announcement_bar_text || '',
      store_address: settings.store_address.trim(),
      city: settings.city.trim(),
      state: settings.state.trim(),
      pincode: settings.pincode.trim(),
      facebook_url: settings.facebook_url?.trim() || null,
      instagram_url: settings.instagram_url?.trim() || null,
      twitter_url: settings.twitter_url?.trim() || null,
      qikink_client_id: settings.qikink_client_id?.trim() || null,
      qikink_auto_fulfillment: settings.qikink_auto_fulfillment ?? true,
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
            STORE & POD INTEGRATION SETTINGS
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
          <span>Settings & Qikink POD Integration successfully updated in database!</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20 text-zinc-400 font-mono text-xs gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-brand-neon" />
          <span>Loading store settings from Supabase...</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          {/* Qikink Print-on-Demand POD Integration */}
          <div className="bg-card border border-street-800 rounded-3xl p-6 space-y-4 shadow-xl relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-brand-neon/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-brand-neon" />
                <h2 className="font-display font-bold text-sm text-white uppercase tracking-wider">
                  Qikink Print-on-Demand (POD) API Integration
                </h2>
              </div>
              <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono px-2.5 py-1 rounded-full flex items-center gap-1 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" /> SERVER ENV SECURED
              </span>
            </div>

            <div className="space-y-4 pt-1">
              <div className="rounded-xl border border-street-800 bg-street-950 px-4 py-3 text-zinc-400 font-mono text-[11px] leading-relaxed">
                Qikink secret API key is managed server-side in Vercel as QIKINK_API_KEY and is never displayed or saved from this browser page.
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="qikink_auto"
                  checked={settings.qikink_auto_fulfillment ?? true}
                  onChange={(e) => setSettings({ ...settings, qikink_auto_fulfillment: e.target.checked })}
                  className="w-4 h-4 rounded border-street-800 bg-street-950 text-brand-neon focus:ring-brand-neon"
                />
                <label htmlFor="qikink_auto" className="text-white font-mono cursor-pointer text-xs">
                  Enable Automatic Order Sync & Dispatch to Qikink POD
                </label>
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-400 font-mono uppercase text-[11px]">
                  Qikink Store / Client ID (Optional)
                </label>
                <input
                  type="text"
                  value={settings.qikink_client_id || ''}
                  onChange={(e) => setSettings({ ...settings, qikink_client_id: e.target.value })}
                  placeholder="e.g. QIK-9876"
                  className="w-full bg-street-950 border border-street-800 rounded-xl px-4 py-2.5 text-white font-mono focus:outline-none focus:border-brand-neon text-xs"
                />
              </div>

              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={testQikinkConnection}
                  disabled={testingQikink}
                  className="bg-street-800 hover:bg-street-700 text-white font-mono font-bold text-xs px-4 py-2 rounded-xl border border-street-700 hover:border-brand-neon flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  {testingQikink ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-neon" /> Pinging Qikink API...
                    </>
                  ) : (
                    <>
                      <Printer className="w-3.5 h-3.5 text-brand-neon" /> Test Qikink Connection Live
                    </>
                  )}
                </button>

                {qikinkTestResult && (
                  <span
                    className={`text-xs font-mono font-bold px-3 py-1.5 rounded-xl border ${
                      qikinkTestResult.success
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : 'bg-red-500/10 border-red-500/30 text-red-400'
                    }`}
                  >
                    {qikinkTestResult.msg}
                  </span>
                )}
              </div>
            </div>
            </div>
          </div>

          {/* Brand Identity & Footer Description */}
          <div className="bg-card border border-street-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-brand-neon" />
              <h2 className="font-display font-bold text-sm text-white uppercase tracking-wider">
                Brand Identity & Footer Description
              </h2>
            </div>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-zinc-400 font-mono uppercase text-[11px]">Brand Name</label>
                <input
                  type="text"
                  required
                  value={settings.brand_name}
                  onChange={(e) => setSettings({ ...settings, brand_name: e.target.value })}
                  placeholder="Inkthread Hub"
                  className="w-full bg-street-950 border border-street-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-brand-neon"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-400 font-mono uppercase text-[11px]">
                  Footer Description / Brand Tagline
                </label>
                <textarea
                  rows={3}
                  required
                  value={settings.tagline || ''}
                  onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                  placeholder="Slow fashion & tactile craftsmanship..."
                  className="w-full bg-street-950 border border-street-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-brand-neon"
                />
              </div>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="bg-card border border-street-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-2">
              <Share2 className="w-5 h-5 text-brand-neon" />
              <h2 className="font-display font-bold text-sm text-white uppercase tracking-wider">
                Social Media Links (Footer Icons)
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-zinc-400 font-mono uppercase text-[11px]">Facebook URL</label>
                <input
                  type="url"
                  placeholder="https://facebook.com/yourpage"
                  value={settings.facebook_url || ''}
                  onChange={(e) => setSettings({ ...settings, facebook_url: e.target.value })}
                  className="w-full bg-street-950 border border-street-800 rounded-xl px-4 py-2.5 text-white font-mono focus:outline-none focus:border-brand-neon"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-400 font-mono uppercase text-[11px]">Instagram URL</label>
                <input
                  type="url"
                  placeholder="https://instagram.com/yourpage"
                  value={settings.instagram_url || ''}
                  onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })}
                  className="w-full bg-street-950 border border-street-800 rounded-xl px-4 py-2.5 text-white font-mono focus:outline-none focus:border-brand-neon"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-400 font-mono uppercase text-[11px]">Twitter / X URL</label>
                <input
                  type="url"
                  placeholder="https://twitter.com/yourpage"
                  value={settings.twitter_url || ''}
                  onChange={(e) => setSettings({ ...settings, twitter_url: e.target.value })}
                  className="w-full bg-street-950 border border-street-800 rounded-xl px-4 py-2.5 text-white font-mono focus:outline-none focus:border-brand-neon"
                />
              </div>
            </div>
          </div>

          {/* Atelier Contact & Address */}
          <div className="bg-card border border-street-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-brand-neon" />
              <h2 className="font-display font-bold text-sm text-white uppercase tracking-wider">
                Atelier Contact & Location Address
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-zinc-400 font-mono uppercase text-[11px]">Support Email</label>
                <input
                  type="email"
                  required
                  value={settings.contact_email}
                  onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                  className="w-full bg-street-950 border border-street-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-brand-neon"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-zinc-400 font-mono uppercase text-[11px]">WhatsApp / Helpline Phone</label>
                <input
                  type="text"
                  required
                  value={settings.support_phone}
                  onChange={(e) => setSettings({ ...settings, support_phone: e.target.value })}
                  className="w-full bg-street-950 border border-street-800 rounded-xl px-4 py-2.5 text-white font-mono focus:outline-none focus:border-brand-neon"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-zinc-400 font-mono uppercase text-[11px]">Store Street Address</label>
                <input
                  type="text"
                  required
                  value={settings.store_address}
                  onChange={(e) => setSettings({ ...settings, store_address: e.target.value })}
                  placeholder="Okhla Industrial Area Phase III"
                  className="w-full bg-street-950 border border-street-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-brand-neon"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-zinc-400 font-mono uppercase text-[11px]">City</label>
                <input
                  type="text"
                  required
                  value={settings.city}
                  onChange={(e) => setSettings({ ...settings, city: e.target.value })}
                  placeholder="New Delhi"
                  className="w-full bg-street-950 border border-street-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-brand-neon"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-zinc-400 font-mono uppercase text-[11px]">Pincode</label>
                <input
                  type="text"
                  required
                  value={settings.pincode}
                  onChange={(e) => setSettings({ ...settings, pincode: e.target.value })}
                  placeholder="110020"
                  className="w-full bg-street-950 border border-street-800 rounded-xl px-4 py-2.5 text-white font-mono focus:outline-none focus:border-brand-neon"
                />
              </div>
            </div>
          </div>

          {/* Shipping & Tax Thresholds */}
          <div className="bg-card border border-street-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <h2 className="font-display font-bold text-sm text-white uppercase tracking-wider">
              Shipping & Taxes (Pan-India)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-zinc-400 font-mono uppercase text-[11px]">Free Delivery Threshold (₹)</label>
                <input
                  type="number"
                  value={settings.free_shipping_threshold}
                  onChange={(e) => setSettings({ ...settings, free_shipping_threshold: Number(e.target.value) })}
                  className="w-full bg-street-950 border border-street-800 rounded-xl px-4 py-2.5 text-white font-mono focus:outline-none focus:border-brand-neon"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-zinc-400 font-mono uppercase text-[11px]">Standard Shipping Fee (₹)</label>
                <input
                  type="number"
                  value={settings.default_shipping_fee}
                  onChange={(e) => setSettings({ ...settings, default_shipping_fee: Number(e.target.value) })}
                  className="w-full bg-street-950 border border-street-800 rounded-xl px-4 py-2.5 text-white font-mono focus:outline-none focus:border-brand-neon"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-zinc-400 font-mono uppercase text-[11px]">GST Rate (%)</label>
                <input
                  type="number"
                  value={settings.tax_percent}
                  onChange={(e) => setSettings({ ...settings, tax_percent: Number(e.target.value) })}
                  className="w-full bg-street-950 border border-street-800 rounded-xl px-4 py-2.5 text-white font-mono focus:outline-none focus:border-brand-neon"
                />
              </div>
            </div>
          </div>

          {/* Announcement Bar */}
          <div className="bg-card border border-street-800 rounded-3xl p-6 space-y-4 shadow-xl">
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
                <label htmlFor="ann_enabled" className="text-white font-mono cursor-pointer text-xs">
                  Enable Top Notification Banner across storefront
                </label>
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-400 font-mono uppercase text-[11px]">Announcement Text</label>
                <textarea
                  rows={2}
                  value={settings.announcement_bar_text || ''}
                  onChange={(e) => setSettings({ ...settings, announcement_bar_text: e.target.value })}
                  className="w-full bg-street-950 border border-street-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-brand-neon"
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
                  <Loader2 className="w-4 h-4 animate-spin" /> SAVING TO DATABASE...
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
