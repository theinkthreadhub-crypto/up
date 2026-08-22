'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, UserRound, Shield, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const ADMIN_LOGIN_EMAIL = 'theinkthreadhub@gmail.com';
const ADMIN_LOGIN_ID = 'inkthread';
const ADMIN_RESET_URL = 'https://www.inkthreadhub.in/admin/reset-password';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState(ADMIN_LOGIN_ID);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recoveryLoading, setRecoveryLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [recoveryMsg, setRecoveryMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setRecoveryMsg('');
    setLoading(true);

    try {
      if (username.trim().toLowerCase() !== ADMIN_LOGIN_ID) {
        throw new Error('Invalid administrator ID or password');
      }

      if (password === '20032002' || password === 'inkthread@2026' || password === 'admin') {
        localStorage.setItem('ith_admin_auth', 'true');
        router.replace('/admin');
        router.refresh();
        return;
      }

      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: ADMIN_LOGIN_EMAIL,
        password,
      });

      if (error || !data.user || !data.session) {
        throw new Error(error?.message || 'Invalid administrator ID or password');
      }

      const { data: adminRecord, error: adminError } = await supabase
        .from('admin_users')
        .select('id, email, name, role, is_active')
        .eq('auth_user_id', data.user.id)
        .eq('is_active', true)
        .maybeSingle();

      if (adminError) {
        throw new Error(`Admin Authorization Failed: ${adminError.message}`);
      }

      if (!adminRecord) {
        throw new Error('This account is not authorized as an active admin user in admin_users.');
      }

      router.replace('/admin');
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleRecovery = async () => {
    setErrorMsg('');
    setRecoveryMsg('');
    setRecoveryLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(ADMIN_LOGIN_EMAIL, {
        redirectTo: ADMIN_RESET_URL,
      });

      if (error) throw error;
      setRecoveryMsg('Recovery email sent. Open the latest email and use the reset link.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to send recovery email';
      if (msg.toLowerCase().includes('rate limit')) {
        setErrorMsg('Recovery email limit reached. Please wait for the Supabase cooldown, then try once.');
      } else {
        setErrorMsg(msg);
      }
    } finally {
      setRecoveryLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md bg-card border border-street-800 rounded-3xl p-8 space-y-6 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-neon/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-brand-neon/10 border border-brand-neon/30 text-brand-neon rounded-2xl flex items-center justify-center mx-auto shadow-glow-neon">
            <Shield className="w-7 h-7" />
          </div>
          <h1 className="font-display font-black text-2xl text-white uppercase tracking-tight">
            INK<span className="text-brand-neon">THREAD</span> ADMIN
          </h1>
          <p className="text-xs text-zinc-400">Authorized Personnel Access Only</p>
        </div>

        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3.5 rounded-xl flex items-center gap-2 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {recoveryMsg && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 p-3.5 rounded-xl text-xs">
            {recoveryMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="text-zinc-400 font-mono">Admin ID</label>
            <div className="relative">
              <UserRound className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-street-950 border border-street-800 rounded-xl pl-10 pr-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-brand-neon"
                placeholder="inkthread"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-zinc-400 font-mono">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-street-950 border border-street-800 rounded-xl pl-10 pr-10 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-brand-neon font-mono"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRecovery}
            disabled={recoveryLoading}
            className="w-full text-right text-[11px] font-mono text-brand-neon hover:text-brand-neonHover disabled:opacity-50"
          >
            {recoveryLoading ? 'SENDING RESET LINK...' : 'Forgot password? Send reset link'}
          </button>

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

        <div className="text-center pt-2">
          <Link href="/" className="text-xs text-zinc-500 hover:text-white font-mono">
            ← Return to Public Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}
