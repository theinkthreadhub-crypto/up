'use client';

import { useState } from 'react';
import { ShoppingBag, Search, Filter, Eye, Truck, CheckCircle2, XCircle, Clock, AlertCircle, X } from 'lucide-react';
import { initialOrders } from '@/lib/mock-data';
import { formatPrice, formatDateTime } from '@/lib/utils';
import { Order, OrderStatus } from '@/types/database';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Status update inside modal
  const [courierInput, setCourierInput] = useState('');
  const [trackingNoInput, setTrackingNoInput] = useState('');
  const [internalNoteInput, setInternalNoteInput] = useState('');

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.order_number.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_email.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_phone.includes(search);
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const newEvent = {
            status: newStatus,
            timestamp: new Date().toISOString(),
            description: `Order status moved to ${newStatus} by Admin`,
          };
          const updated = {
            ...o,
            status: newStatus,
            timeline: [...(o.timeline || []), newEvent],
            tracking_courier: courierInput || o.tracking_courier,
            tracking_number: trackingNoInput || o.tracking_number,
            internal_notes: internalNoteInput || o.internal_notes,
            updated_at: new Date().toISOString(),
          };
          if (selectedOrder?.id === orderId) {
            setSelectedOrder(updated);
          }
          return updated;
        }
        return o;
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-street-800 gap-4">
        <div>
          <span className="text-xs font-mono font-bold text-brand-neon uppercase tracking-widest">
            FULFILLMENT & PAYMENT AUDIT
          </span>
          <h1 className="font-display font-black text-2xl sm:text-4xl text-white uppercase tracking-tight">
            ORDER MANAGEMENT ({orders.length})
          </h1>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between bg-card p-4 rounded-2xl border border-street-800">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order #, client name, email, phone..."
            className="w-full bg-street-950 border border-street-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-brand-neon font-mono"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-street-950 border border-street-800 text-zinc-300 text-xs rounded-xl px-4 py-2 focus:outline-none focus:border-brand-neon cursor-pointer font-mono"
        >
          <option value="all">All Statuses</option>
          <option value="Pending Payment">Pending Payment</option>
          <option value="Paid">Paid</option>
          <option value="Processing">Processing</option>
          <option value="Packed">Packed</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-card border border-street-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-street-800 bg-street-950 text-zinc-500 uppercase">
                <th className="py-3.5 px-4">Order ID</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4">Fulfillment</th>
                <th className="py-3.5 px-4 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-street-800/60">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-street-900/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white">
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setCourierInput(order.tracking_courier || '');
                        setTrackingNoInput(order.tracking_number || '');
                        setInternalNoteInput(order.internal_notes || '');
                      }}
                      className="hover:text-brand-neon underline"
                    >
                      {order.order_number}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-zinc-300">
                    <div className="font-sans font-bold text-white">{order.customer_name}</div>
                    <div className="text-[10px] text-zinc-500">{order.customer_email}</div>
                  </td>
                  <td className="py-3.5 px-4 text-zinc-400">{formatDateTime(order.created_at)}</td>
                  <td className="py-3.5 px-4 font-bold text-brand-neon text-sm">
                    {formatPrice(order.total_amount)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        order.payment_status === 'Paid'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-amber-500/10 text-amber-400'
                      }`}
                    >
                      {order.payment_status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        order.status === 'Delivered'
                          ? 'bg-brand-neon/10 text-brand-neon border border-brand-neon/30'
                          : order.status === 'Shipped'
                          ? 'bg-brand-purple/10 text-brand-purple border border-brand-purple/30'
                          : order.status === 'Paid'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-amber-500/10 text-amber-400'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setCourierInput(order.tracking_courier || '');
                        setTrackingNoInput(order.tracking_number || '');
                        setInternalNoteInput(order.internal_notes || '');
                      }}
                      className="p-1.5 text-zinc-400 hover:text-white bg-street-900 rounded-lg hover:border-street-700 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Inspector Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-card border border-street-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-street-800">
              <div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase">INSPECTING ORDER</span>
                <h3 className="font-display font-black text-xl text-white uppercase">
                  {selectedOrder.order_number}
                </h3>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer & Address details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-street-950 rounded-2xl border border-street-800 space-y-1">
                <h4 className="font-bold text-white uppercase font-mono text-[11px]">Customer Info</h4>
                <p className="text-zinc-200 font-sans font-semibold">{selectedOrder.customer_name}</p>
                <p className="text-zinc-400">{selectedOrder.customer_email}</p>
                <p className="text-zinc-400 font-mono">{selectedOrder.customer_phone}</p>
              </div>

              <div className="p-4 bg-street-950 rounded-2xl border border-street-800 space-y-1">
                <h4 className="font-bold text-white uppercase font-mono text-[11px]">Shipping Destination</h4>
                <p className="text-zinc-300">{selectedOrder.shipping_address.address_line1}</p>
                <p className="text-zinc-300">
                  {selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} - {selectedOrder.shipping_address.pincode}
                </p>
              </div>
            </div>

            {/* Payment References */}
            <div className="p-4 bg-street-950 rounded-2xl border border-street-800 space-y-1 text-xs font-mono">
              <h4 className="font-bold text-white uppercase text-[11px]">Razorpay Payment Ledger</h4>
              <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                <div>
                  <span className="text-zinc-500">Method: </span>
                  <span className="text-zinc-300">{selectedOrder.payment_method}</span>
                </div>
                <div>
                  <span className="text-zinc-500">Payment ID: </span>
                  <span className="text-brand-neon">{selectedOrder.razorpay_payment_id || 'Pending'}</span>
                </div>
                <div>
                  <span className="text-zinc-500">Order ID: </span>
                  <span className="text-zinc-300">{selectedOrder.razorpay_order_id || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-zinc-500">Amount Paid: </span>
                  <span className="text-brand-neon font-bold">{formatPrice(selectedOrder.total_amount)}</span>
                </div>
              </div>
            </div>

            {/* Items Ordered List */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-white uppercase font-mono">Items In Drop</h4>
              <div className="border border-street-800 rounded-2xl divide-y divide-street-800/60 p-2 text-xs">
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} className="p-2 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-white font-sans">{item.product_name}</p>
                      <p className="text-[11px] text-zinc-500 font-mono">
                        Size: {item.size} | Color: {item.color} | Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="font-mono font-bold text-brand-neon">
                      {formatPrice(item.unit_price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Transition Pipeline */}
            <div className="p-4 bg-street-900/60 rounded-2xl border border-street-800 space-y-3 text-xs">
              <h4 className="font-bold text-white uppercase font-mono">Update Order Status</h4>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 font-mono">
                {['Pending Payment', 'Paid', 'Processing', 'Packed', 'Shipped', 'Delivered'].map((st) => (
                  <button
                    key={st}
                    onClick={() => handleUpdateStatus(selectedOrder.id, st as OrderStatus)}
                    className={`py-1.5 px-2 rounded-lg text-[10px] font-bold uppercase transition-colors ${
                      selectedOrder.status === st
                        ? 'bg-brand-neon text-black font-black shadow-glow-neon'
                        : 'bg-street-950 text-zinc-400 hover:bg-street-800 hover:text-white'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="text-zinc-400 text-[11px] font-mono">Courier Name</label>
                  <input
                    type="text"
                    value={courierInput}
                    onChange={(e) => setCourierInput(e.target.value)}
                    placeholder="Blue Dart / Delhivery"
                    className="w-full bg-street-950 border border-street-800 rounded-lg px-3 py-1.5 text-white text-xs mt-1"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 text-[11px] font-mono">AWB Tracking #</label>
                  <input
                    type="text"
                    value={trackingNoInput}
                    onChange={(e) => setTrackingNoInput(e.target.value)}
                    placeholder="BLUEDART-883920"
                    className="w-full bg-street-950 border border-street-800 rounded-lg px-3 py-1.5 text-white text-xs mt-1"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
