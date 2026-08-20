'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { Edit3, History, Search, X, Loader2, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { formatDateTime } from '@/lib/utils';
import { Product, InventoryHistoryItem } from '@/types/database';

export default function AdminInventoryPage() {
  const supabase = useMemo(() => createClient(), []);
  const [products, setProducts] = useState<Product[]>([]);
  const [history, setHistory] = useState<InventoryHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'low' | 'out'>('all');

  // Adjustment Modal
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [adjustType, setAdjustType] = useState<'add' | 'subtract' | 'set'>('add');
  const [adjustAmount, setAdjustAmount] = useState<number>(10);
  const [adjustReason, setAdjustReason] = useState('Supplier Restock');

  const loadData = async () => {
    setLoading(true);
    setError('');
    const [{ data: prodRows, error: prodError }, { data: histRows, error: histError }] = await Promise.all([
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      supabase.from('inventory_history').select('*').order('created_at', { ascending: false }).limit(50),
    ]);

    if (prodError || histError) {
      setError(prodError?.message || histError?.message || 'Could not load inventory data');
    } else {
      setProducts((prodRows || []) as Product[]);
      setHistory((histRows || []) as InventoryHistoryItem[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    void loadData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (filterType === 'low') return p.stock_quantity <= p.low_stock_threshold && p.stock_quantity > 0;
    if (filterType === 'out') return p.stock_quantity === 0;
    return true;
  });

  const handleApplyAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    setSaving(true);
    setError('');

    const prevQty = Number(selectedProduct.stock_quantity);
    let newQty = prevQty;
    let qtyChanged = 0;

    if (adjustType === 'add') {
      newQty = prevQty + Number(adjustAmount);
      qtyChanged = Number(adjustAmount);
    } else if (adjustType === 'subtract') {
      newQty = Math.max(0, prevQty - Number(adjustAmount));
      qtyChanged = -(prevQty - newQty);
    } else if (adjustType === 'set') {
      newQty = Math.max(0, Number(adjustAmount));
      qtyChanged = newQty - prevQty;
    }

    // 1. Update product in Supabase
    const { error: updateError } = await supabase
      .from('products')
      .update({ stock_quantity: newQty, updated_at: new Date().toISOString() })
      .eq('id', selectedProduct.id);

    if (updateError) {
      setError(updateError.message);
      setSaving(false);
      return;
    }

    // 2. Insert audit log row into inventory_history
    const auditPayload = {
      product_id: selectedProduct.id,
      product_name: selectedProduct.name,
      sku: selectedProduct.sku,
      previous_quantity: prevQty,
      new_quantity: newQty,
      quantity_changed: qtyChanged,
      reason: adjustReason,
      admin_user: 'Super Admin',
    };

    const { error: auditError } = await supabase.from('inventory_history').insert(auditPayload);
    if (auditError) {
      console.error('Inventory audit error:', auditError.message);
    }

    setSelectedProduct(null);
    await loadData();
    setSaving(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-street-800 gap-4">
        <div>
          <span className="text-xs font-mono font-bold text-brand-neon uppercase tracking-widest">
            SUPPLY CHAIN & REAL-TIME STOCK
          </span>
          <h1 className="font-display font-black text-2xl sm:text-4xl text-white uppercase tracking-tight">
            INVENTORY MANAGEMENT
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold uppercase transition-colors ${
              filterType === 'all' ? 'bg-brand-neon text-black' : 'bg-street-900 text-zinc-400'
            }`}
          >
            All ({products.length})
          </button>
          <button
            onClick={() => setFilterType('low')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold uppercase transition-colors ${
              filterType === 'low' ? 'bg-amber-500 text-black' : 'bg-street-900 text-amber-400'
            }`}
          >
            Low Stock ({products.filter((p) => p.stock_quantity <= p.low_stock_threshold && p.stock_quantity > 0).length})
          </button>
          <button
            onClick={() => setFilterType('out')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold uppercase transition-colors ${
              filterType === 'out' ? 'bg-red-500 text-white' : 'bg-street-900 text-red-400'
            }`}
          >
            Out of Stock ({products.filter((p) => p.stock_quantity === 0).length})
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-2xl flex items-center gap-3 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20 text-zinc-400 font-mono text-xs gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-brand-neon" />
          <span>Loading live inventory from Supabase...</span>
        </div>
      ) : (
        <>
          {/* Stock Matrix Table */}
          <div className="bg-card border border-street-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-street-800 flex items-center justify-between bg-street-950">
              <div className="relative max-w-md w-full">
                <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by SKU or drop title..."
                  className="w-full bg-street-900 border border-street-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-street-800 text-zinc-500 uppercase bg-street-900/30">
                    <th className="py-3.5 px-4">Item & Silhouette</th>
                    <th className="py-3.5 px-4">SKU</th>
                    <th className="py-3.5 px-4">Threshold</th>
                    <th className="py-3.5 px-4">Live Quantity</th>
                    <th className="py-3.5 px-4">Stock Status</th>
                    <th className="py-3.5 px-4 text-right">Adjust</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-street-800/60">
                  {filteredProducts.map((prod) => (
                    <tr key={prod.id} className="hover:bg-street-900/40">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-12 bg-street-950 rounded-lg overflow-hidden shrink-0 border border-street-800">
                            <Image
                              src={prod.thumbnail || prod.images?.[0] || '/images/plain_oversized_black.jpg'}
                              alt={prod.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-bold text-white font-sans text-xs">{prod.name}</p>
                            <p className="text-[10px] text-zinc-500">{prod.category_name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-zinc-300">{prod.sku}</td>
                      <td className="py-3.5 px-4 text-zinc-400">{prod.low_stock_threshold} units</td>
                      <td className="py-3.5 px-4 font-bold text-sm text-white">{prod.stock_quantity}</td>
                      <td className="py-3.5 px-4">
                        {prod.stock_quantity === 0 ? (
                          <span className="bg-red-500/10 text-red-400 border border-red-500/30 px-2 py-0.5 rounded text-[10px] font-bold">
                            OUT OF STOCK
                          </span>
                        ) : prod.stock_quantity <= prod.low_stock_threshold ? (
                          <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded text-[10px] font-bold">
                            LOW INVENTORY
                          </span>
                        ) : (
                          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px] font-bold">
                            HEALTHY
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedProduct(prod);
                            setAdjustAmount(10);
                            setAdjustType('add');
                          }}
                          className="bg-street-900 hover:bg-brand-neon hover:text-black text-zinc-300 font-bold uppercase text-[11px] px-3 py-1.5 rounded-lg border border-street-700 transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5 inline mr-1" /> Adjust Stock
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Inventory Audit History Log */}
          <div className="bg-card border border-street-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-street-800">
              <h3 className="font-display font-bold text-white uppercase text-base tracking-wider flex items-center gap-2">
                <History className="w-4 h-4 text-brand-neon" />
                Inventory Audit History Log
              </h3>
              <span className="text-xs font-mono text-zinc-500">{history.length} events logged</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-street-800 text-zinc-500 uppercase">
                    <th className="pb-2.5">Timestamp</th>
                    <th className="pb-2.5">Product</th>
                    <th className="pb-2.5">Prev Qty</th>
                    <th className="pb-2.5">Delta</th>
                    <th className="pb-2.5">New Qty</th>
                    <th className="pb-2.5">Reason</th>
                    <th className="pb-2.5">User</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-street-800/60">
                  {history.map((h) => (
                    <tr key={h.id} className="hover:bg-street-900/30">
                      <td className="py-2.5 text-zinc-400">{formatDateTime(h.created_at)}</td>
                      <td className="py-2.5 text-white font-sans font-semibold">{h.product_name}</td>
                      <td className="py-2.5 text-zinc-400">{h.previous_quantity}</td>
                      <td className="py-2.5">
                        <span
                          className={`font-bold ${
                            h.quantity_changed > 0 ? 'text-emerald-400' : 'text-red-400'
                          }`}
                        >
                          {h.quantity_changed > 0 ? `+${h.quantity_changed}` : h.quantity_changed}
                        </span>
                      </td>
                      <td className="py-2.5 text-white font-bold">{h.new_quantity}</td>
                      <td className="py-2.5 text-zinc-300">{h.reason}</td>
                      <td className="py-2.5 text-zinc-400">{h.admin_user || 'System'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Stock Adjustment Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-card border border-street-800 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-street-800">
              <h3 className="font-bold text-white uppercase text-sm">
                Adjust Stock: {selectedProduct.name}
              </h3>
              <button onClick={() => setSelectedProduct(null)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApplyAdjustment} className="space-y-4 text-xs">
              <div className="p-3 bg-street-950 rounded-xl border border-street-800 flex justify-between font-mono">
                <span className="text-zinc-400">Current In-Stock:</span>
                <strong className="text-brand-neon text-sm">{selectedProduct.stock_quantity} Units</strong>
              </div>

              {/* Adjustment Mode */}
              <div className="space-y-1.5">
                <label className="text-zinc-400 font-mono">Action Type</label>
                <div className="grid grid-cols-3 gap-2 font-mono">
                  <button
                    type="button"
                    onClick={() => setAdjustType('add')}
                    className={`py-2 rounded-xl font-bold uppercase transition-colors ${
                      adjustType === 'add' ? 'bg-emerald-500 text-black' : 'bg-street-950 text-zinc-400'
                    }`}
                  >
                    + Increase
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustType('subtract')}
                    className={`py-2 rounded-xl font-bold uppercase transition-colors ${
                      adjustType === 'subtract' ? 'bg-red-500 text-white' : 'bg-street-950 text-zinc-400'
                    }`}
                  >
                    - Deduct
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustType('set')}
                    className={`py-2 rounded-xl font-bold uppercase transition-colors ${
                      adjustType === 'set' ? 'bg-brand-cyan text-black' : 'bg-street-950 text-zinc-400'
                    }`}
                  >
                    Set Exact
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-400 font-mono">Quantity</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(Number(e.target.value))}
                  className="w-full bg-street-950 border border-street-800 rounded-xl px-4 py-2.5 text-white font-mono text-base font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-400 font-mono">Reason for Stock Change *</label>
                <select
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full bg-street-950 border border-street-800 rounded-xl px-4 py-2.5 text-white cursor-pointer"
                >
                  <option value="Supplier Restock">Supplier Batch Restock</option>
                  <option value="Manual Count Correction">Manual Inventory Count Correction</option>
                  <option value="Damaged / QC Rejection">Damaged in Atelier / QC Rejection</option>
                  <option value="Promotional Gifting">Promotional Drop Gifting</option>
                  <option value="Order Return Restock">Customer Order Return Restock</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-street-800">
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="bg-street-900 text-zinc-400 px-4 py-2 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-brand-neon text-black font-black uppercase px-5 py-2 rounded-xl shadow-glow-neon disabled:opacity-50 flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
                    </>
                  ) : (
                    'Commit Stock Update'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
