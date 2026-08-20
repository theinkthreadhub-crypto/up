'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search, Eye, X, Loader2, Save } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { formatPrice, formatDateTime } from '@/lib/utils';
import { Order, OrderStatus } from '@/types/database';

const statuses: OrderStatus[] = ['Pending Payment', 'Paid', 'Processing', 'Packed', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'];

export default function AdminOrdersPage() {
  const supabase = useMemo(() => createClient(), []);
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [courierInput, setCourierInput] = useState('');
  const [trackingNoInput, setTrackingNoInput] = useState('');
  const [internalNoteInput, setInternalNoteInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadOrders = async () => {
    setLoading(true);
    setError('');
    const { data, error: loadError } = await supabase
      .from('orders')
      .select('*, items:order_items(*)')
      .order('created_at', { ascending: false });
    if (loadError) setError(loadError.message);
    else setOrders((data || []) as Order[]);
    setLoading(false);
  };

  useEffect(() => { void loadOrders(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const openOrder = (order: Order) => {
    setSelectedOrder(order);
    setCourierInput(order.tracking_courier || '');
    setTrackingNoInput(order.tracking_number || '');
    setInternalNoteInput(order.internal_notes || '');
  };

  const handleUpdateStatus = async (newStatus: OrderStatus) => {
    if (!selectedOrder) return;
    setSaving(true);
    setError('');
    const newEvent = {
      status: newStatus,
      timestamp: new Date().toISOString(),
      description: `Order status moved to ${newStatus} by Admin`,
    };
    const timeline = [...(selectedOrder.timeline || []), newEvent];
    const { data, error: updateError } = await supabase
      .from('orders')
      .update({
        status: newStatus,
        tracking_courier: courierInput || null,
        tracking_number: trackingNoInput || null,
        internal_notes: internalNoteInput || null,
        timeline,
        updated_at: new Date().toISOString(),
      })
      .eq('id', selectedOrder.id)
      .select('*, items:order_items(*)')
      .single();

    if (updateError) setError(updateError.message);
    else {
      setSelectedOrder(data as Order);
      await loadOrders();
    }
    setSaving(false);
  };

  const saveShippingMeta = async () => {
    if (!selectedOrder) return;
    setSaving(true);
    const { data, error: updateError } = await supabase
      .from('orders')
      .update({
        tracking_courier: courierInput || null,
        tracking_number: trackingNoInput || null,
        internal_notes: internalNoteInput || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', selectedOrder.id)
      .select('*, items:order_items(*)')
      .single();
    if (updateError) setError(updateError.message);
    else { setSelectedOrder(data as Order); await loadOrders(); }
    setSaving(false);
  };

  const filteredOrders = orders.filter((o) => {
    const q = search.toLowerCase();
    const matchesSearch = o.order_number.toLowerCase().includes(q) || o.customer_name.toLowerCase().includes(q) || o.customer_email.toLowerCase().includes(q) || o.customer_phone.includes(search);
    return matchesSearch && (statusFilter === 'all' || o.status === statusFilter);
  });

  return <div className="space-y-6">
    <div className="pb-6 border-b border-street-800"><span className="text-xs font-mono font-bold text-brand-neon uppercase tracking-widest">LIVE FULFILLMENT</span><h1 className="font-display font-black text-2xl sm:text-4xl text-white uppercase">ORDER MANAGEMENT ({orders.length})</h1></div>
    {error && <div className="border border-red-500/30 bg-red-500/10 text-red-300 rounded-xl p-3 text-xs">{error}</div>}
    <div className="flex flex-col sm:flex-row gap-4 bg-card p-4 rounded-2xl border border-street-800">
      <div className="relative flex-1"><Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search order, name, email, phone..." className="w-full bg-street-950 border border-street-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white"/></div>
      <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} className="bg-street-950 border border-street-800 text-zinc-300 text-xs rounded-xl px-4 py-2"><option value="all">All Statuses</option>{statuses.map(s=><option key={s}>{s}</option>)}</select>
    </div>
    <div className="bg-card border border-street-800 rounded-3xl overflow-hidden">
      {loading ? <div className="p-10 flex justify-center text-zinc-400"><Loader2 className="animate-spin"/></div> : <div className="overflow-x-auto"><table className="w-full text-left text-xs font-mono"><thead><tr className="border-b border-street-800 bg-street-950 text-zinc-500 uppercase"><th className="p-4">Order</th><th className="p-4">Customer</th><th className="p-4">Date</th><th className="p-4">Amount</th><th className="p-4">Payment</th><th className="p-4">Status</th><th className="p-4 text-right">Open</th></tr></thead><tbody className="divide-y divide-street-800/60">{filteredOrders.map(o=><tr key={o.id} className="hover:bg-street-900/40"><td className="p-4 font-bold text-white">{o.order_number}</td><td className="p-4"><div className="text-white font-bold font-sans">{o.customer_name}</div><div className="text-zinc-500">{o.customer_email}</div></td><td className="p-4 text-zinc-400">{formatDateTime(o.created_at)}</td><td className="p-4 text-brand-neon font-bold">{formatPrice(o.total_amount)}</td><td className="p-4"><span className={o.payment_status==='Paid'?'text-emerald-400':'text-amber-400'}>{o.payment_status}</span></td><td className="p-4 text-zinc-200">{o.status}</td><td className="p-4 text-right"><button onClick={()=>openOrder(o)} className="p-2 bg-street-900 rounded-lg"><Eye className="w-4 h-4 text-zinc-300"/></button></td></tr>)}{!filteredOrders.length&&<tr><td colSpan={7} className="p-10 text-center text-zinc-500">No orders found.</td></tr>}</tbody></table></div>}
    </div>

    {selectedOrder && <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"><div className="bg-card border border-street-800 rounded-3xl w-full max-w-3xl max-h-[92vh] overflow-y-auto p-6 space-y-6">
      <div className="flex justify-between border-b border-street-800 pb-4"><div><span className="text-[10px] text-zinc-500 font-mono">INSPECTING ORDER</span><h2 className="text-white font-black text-2xl">{selectedOrder.order_number}</h2></div><button onClick={()=>setSelectedOrder(null)}><X className="text-zinc-400"/></button></div>
      <div className="grid sm:grid-cols-2 gap-4 text-xs"><Box title="Customer"><p className="text-white font-bold">{selectedOrder.customer_name}</p><p>{selectedOrder.customer_email}</p><p>{selectedOrder.customer_phone}</p></Box><Box title="Shipping"><p>{selectedOrder.shipping_address?.address_line1}</p><p>{selectedOrder.shipping_address?.city}, {selectedOrder.shipping_address?.state} - {selectedOrder.shipping_address?.pincode}</p></Box></div>
      <Box title="Items">{selectedOrder.items?.length ? selectedOrder.items.map((item,i)=><div key={item.id||i} className="flex justify-between py-2 border-b border-street-800/60 last:border-0"><div><p className="text-white font-bold">{item.product_name}</p><p className="text-zinc-500">{item.size} • {item.color} • Qty {item.quantity}</p></div><p className="text-brand-neon font-bold">{formatPrice(item.total_price || item.unit_price*item.quantity)}</p></div>) : <p className="text-zinc-500">No item rows found.</p>}</Box>
      <div className="space-y-3"><div className="text-xs font-bold text-white uppercase">Update Status</div><div className="flex flex-wrap gap-2">{statuses.map(st=><button disabled={saving} key={st} onClick={()=>void handleUpdateStatus(st)} className={`px-3 py-2 rounded-lg text-[10px] font-bold uppercase ${selectedOrder.status===st?'bg-brand-neon text-black':'bg-street-950 text-zinc-400 border border-street-800'}`}>{st}</button>)}</div></div>
      <div className="grid sm:grid-cols-2 gap-3"><Field label="Courier"><input value={courierInput} onChange={e=>setCourierInput(e.target.value)} className="input" placeholder="Delhivery / Blue Dart"/></Field><Field label="AWB Tracking"><input value={trackingNoInput} onChange={e=>setTrackingNoInput(e.target.value)} className="input"/></Field></div>
      <Field label="Internal Note"><textarea rows={3} value={internalNoteInput} onChange={e=>setInternalNoteInput(e.target.value)} className="input"/></Field>
      <button disabled={saving} onClick={()=>void saveShippingMeta()} className="w-full bg-brand-neon text-black font-black uppercase py-3 rounded-xl flex justify-center gap-2"><Save className="w-4 h-4"/>{saving?'SAVING...':'SAVE TRACKING & NOTES'}</button>
    </div><style jsx>{`.input{width:100%;background:#09090b;border:1px solid #27272a;border-radius:.75rem;padding:.7rem .85rem;color:white;font-size:.8rem;outline:none}.input:focus{border-color:#b8ff00}`}</style></div>}
  </div>;
}

function Box({title,children}:{title:string;children:React.ReactNode}) { return <div className="p-4 bg-street-950 rounded-2xl border border-street-800 text-xs text-zinc-300 space-y-1"><h3 className="text-white font-bold uppercase font-mono text-[11px] mb-2">{title}</h3>{children}</div>; }
function Field({label,children}:{label:string;children:React.ReactNode}) { return <label className="block space-y-1.5"><span className="text-[11px] text-zinc-400 font-mono uppercase">{label}</span>{children}</label>; }
