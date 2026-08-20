'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function AdminResetPasswordPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    async function initialiseRecovery() {
      try {
        const url = new URL(window.location.href);
        const code = url.searchParams.get('code');

        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) throw exchangeError;
          window.history.replaceState({}, document.title, url.pathname);
        }

        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (!session) {
          if (mounted) {
            setError('Recovery session not found. Please open the latest password recovery email link.');
            setReady(false);
          }
          return;
        }

        if (mounted) {
          setError('');
          setReady(true);
        }
      } catch (err) {
        if (mounted) {
          setReady(false);
          setError(err instanceof Error ? err.message : 'Recovery link is invalid or expired.');
        }
      }
    }

    initialiseRecovery();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if ((event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') && session && mounted) {
        setError('');
        setReady(true);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    await supabase.auth.signOut();
    router.replace('/admin/login?reset=success');
  }

  return (
    <main className="min-h-screen bg-[#0b0b0c] flex items-center justify-center px-4 py-10 text-white">
      <section className="w-full max-w-md rounded-[28px] border border-white/10 bg-[#151517] p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#ff542f]/40 bg-[#ff542f]/10 text-2xl">🔐</div>
          <h1 className="text-3xl font-black tracking-tight">INKTHREAD ADMIN</h1>
          <p className="mt-2 text-sm text-white/55">Secure Password Recovery</p>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-white/60">New Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={!ready || loading}
              autoComplete="new-password"
              className="w-full rounded-xl border border-white/10 bg-black/45 px-4 py-3.5 outline-none transition focus:border-[#ff542f] disabled:opacity-50"
              placeholder="Enter new password"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-white/60">Confirm Password</span>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={!ready || loading}
              autoComplete="new-password"
              className="w-full rounded-xl border border-white/10 bg-black/45 px-4 py-3.5 outline-none transition focus:border-[#ff542f] disabled:opacity-50"
              placeholder="Re-enter new password"
            />
          </label>

          <button
            type="submit"
            disabled={!ready || loading}
            className="w-full rounded-xl bg-[#ff542f] px-5 py-4 font-black text-black transition hover:bg-[#ff6848] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'UPDATING…' : 'SET NEW PASSWORD →'}
          </button>
        </form>

        <button
          type="button"
          onClick={() => router.push('/admin/login')}
          className="mt-6 w-full text-center text-sm text-white/45 hover:text-white/70"
        >
          ← Return to Admin Login
        </button>
      </section>
    </main>
  );
}
