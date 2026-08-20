'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search, Loader2, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { formatPrice, formatDate } from '@/lib/utils';
import { Customer } from '@/types/database';

export default function AdminCustomersPage() {
  const supabase = useMemo(() => createClient(), []);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const loadCustomers = async () => {
    setLoading(true);
    setError('');
    const { data, error: dbError } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false });

    if (dbError) {
      setError(dbError.message);
    } else {
      setCustomers((data || []) as Customer[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    void loadCustomers();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = customers.filter(
    (c) =>
      c.full_name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      (c.phone && c.phone.includes(search))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-street-800 gap-4">
        <div>
          <span className="text-xs font-mono font-bold text-brand-neon uppercase tracking-widest">
            CLIENT DIRECTORY & SPEND
          </span>
          <h1 className="font-display font-black text-2xl sm:text-4xl text-white uppercase tracking-tight">
            CUSTOMERS ({customers.length})
          </h1>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-2xl flex items-center gap-3 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-card p-4 rounded-2xl border border-street-800 flex items-center max-w-md">
        <Search className="w-4 h-4 text-zinc-500 mr-3" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, or phone..."
          className="w-full bg-transparent text-xs text-white placeholder-zinc-500 focus:outline-none"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-zinc-400 font-mono text-xs gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-brand-neon" />
          <span>Loading customer list from Supabase...</span>
        </div>
      ) : customers.length === 0 ? (
        <div className="text-center py-20 bg-card border border-street-800 rounded-3xl p-8">
          <p className="text-sm text-zinc-400 font-mono">No customers found in Supabase.</p>
        </div>
      ) : (
        <div className="bg-card border border-street-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-street-800 bg-street-950 text-zinc-500 uppercase">
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Total Drops Ordered</th>
                  <th className="py-3.5 px-4">Total Spend</th>
                  <th className="py-3.5 px-4">VIP Marketing Opt-in</th>
                  <th className="py-3.5 px-4">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-street-800/60">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-street-900/40">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-white font-sans text-sm">{c.full_name}</p>
                      <p className="text-[10px] text-zinc-500">ID: {c.id.slice(0, 8)}</p>
                    </td>
                    <td className="py-3.5 px-4 text-zinc-300">
                      <div>{c.email}</div>
                      <div className="text-[10px] text-zinc-500">{c.phone || 'N/A'}</div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-white">{c.total_orders || 0} Drops</td>
                    <td className="py-3.5 px-4 font-bold text-brand-neon">{formatPrice(c.total_spent || 0)}</td>
                    <td className="py-3.5 px-4">
                      {c.accepts_marketing ? (
                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px] font-bold">
                          OPTED IN
                        </span>
                      ) : (
                        <span className="text-zinc-600 text-[10px]">No</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-zinc-400">{formatDate(c.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
