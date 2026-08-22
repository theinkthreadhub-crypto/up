'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { SiteSettings } from '@/types/database';

export default function AnnouncementBar() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from('site_settings')
          .select('*')
          .limit(1)
          .maybeSingle();
        if (data) {
          setSettings(data as SiteSettings);
        }
      } catch (e) {
        console.error('Error loading announcement settings:', e);
      } finally {
        setLoading(false);
      }
    }
    void loadSettings();
  }, []);

  if (loading) return null;
  if (!settings || !settings.announcement_bar_enabled) return null;

  return (
    <div className="bg-black text-white py-2 px-4 text-[11px] font-mono tracking-wider text-center border-b border-zinc-800">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-none">
        <span>{settings.announcement_bar_text}</span>
      </div>
    </div>
  );
}
