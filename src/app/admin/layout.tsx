'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Menu, ShieldCheck, User } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

type AdminUser = {
  id: string;
  email: string;
  name: string;
  role: string;
  is_active: boolean;
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [checkedAuth, setCheckedAuth] = useState(false);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) {
      setCheckedAuth(true);
      return;
    }

    let active = true;

    const verifyAdmin = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          if (active) router.replace('/admin/login');
          return;
        }

        const { data: adminRecord, error: adminError } = await supabase
          .from('admin_users')
          .select('id, email, name, role, is_active')
          .eq('auth_user_id', user.id)
          .eq('is_active', true)
          .maybeSingle();

        if (adminError || !adminRecord) {
          await supabase.auth.signOut();
          if (active) router.replace('/admin/login');
          return;
        }

        if (active) setAdminUser(adminRecord as AdminUser);
      } catch {
        if (active) router.replace('/admin/login');
      } finally {
        if (active) setCheckedAuth(true);
      }
    };

    void verifyAdmin();

    return () => {
      active = false;
    };
  }, [isLoginPage, router]);

  if (isLoginPage) return <>{children}</>;

  if (!checkedAuth || !adminUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-zinc-400 font-mono text-xs">
        Authenticating Admin Portal...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <header className="h-16 border-b border-street-800 bg-card/80 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-zinc-400 hover:text-white"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="hidden sm:flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-neon animate-pulse" />
              <span className="text-xs font-mono text-zinc-400">Atelier Live Operations</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="bg-brand-neon/10 border border-brand-neon/30 text-brand-neon text-[11px] font-mono font-bold px-2.5 py-1 rounded-full uppercase flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              {adminUser.role.replace('_', ' ')}
            </span>

            <div className="flex items-center gap-2.5 text-xs">
              <div className="w-8 h-8 rounded-full bg-street-800 border border-street-700 flex items-center justify-center text-white font-bold">
                <User className="w-4 h-4 text-brand-cyan" />
              </div>
              <span className="hidden md:inline font-semibold text-white">{adminUser.name}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
