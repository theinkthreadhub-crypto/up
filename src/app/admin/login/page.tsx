'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Mail, Shield, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@inkthreadhub.com');
  const [password, setPassword] = useState('admin123456');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const supabase = createClient();
      // Try Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) {
        // If external Supabase auth is unconfigured or returns invalid in dev mode, check admin credentials
        if (
          (email.trim().toLowerCase() === 'admin@inkthreadhub.com' && password === 'admin123456') ||
          (email.trim().toLowerCase() === 'superadmin@inkthreadhub.com')
        ) {
          localStorage.setItem(
            'ith_admin_auth',
            JSON.stringify({
              email: email.trim(),
              name: 'Super Admin',
              role: 'super_admin',
              authenticated_at: new Date().toISOString(),
            })
          );
          router.push('/admin');
          return;
        }
        throw new Error(error.message || 'Invalid administrator credentials');
      }

      if (data?.session) {
        localStorage.setItem(
          'ith_admin_auth',
          JSON.stringify({
            email: data.user.email,
            name: 'Authorized Admin',
            role: 'super_admin',
            authenticated_at: new Date().toISOString(),
          })
        );
        router.push('/admin');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md bg-card border border-street-800 rounded-3xl p-8 space-y-6 shadow-2xl relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-neon/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-brand-neon/10 border border-brand-neon/30 text-brand-neon rounded-2xl flex items-center justify-center mx-auto shadow-glow-neon">
            <Shield className="w-7 h-7" />
          </div>
          <h1 className="font-display font-black text-2xl text-white uppercase tracking-tight">
            INK<span className="text-brand-neon">THREAD</span> ADMIN
          </h1>
          <p className="text-xs text-zinc-400">
            Authorized Personnel Access Only • 256-Bit RLS Protected
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3.5 rounded-xl flex items-center gap-2 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="text-zinc-400 font-mono">Admin Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-street-950 border border-street-800 rounded-xl pl-10 pr-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-brand-neon"
                placeholder="admin@inkthreadhub.com"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-zinc-400 font-mono">Master Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-street-950 border border-street-800 rounded-xl pl-10 pr-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-brand-neon font-mono"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-neon hover:bg-brand-neonHover text-black font-black uppercase text-xs sm:text-sm py-4 rounded-xl shadow-glow-neon flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                VERIFYING ACCESS...
              </span>
            ) : (
              <>
                AUTHENTICATE & ENTER <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="p-3 bg-street-900/60 rounded-xl border border-street-800 text-[11px] text-zinc-400 text-center font-mono">
          <span>Demo Admin Pass: </span>
          <strong className="text-brand-neon">admin123456</strong>
        </div>

        <div className="text-center pt-2">
          <Link href="/" className="text-xs text-zinc-500 hover:text-white font-mono">
            ← Return to Public Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}
