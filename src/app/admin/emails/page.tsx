'use client';

import { useState } from 'react';
import { Mail, Send, CheckCircle2, Clock, AlertCircle, Sparkles } from 'lucide-react';
import { initialOrders } from '@/lib/mock-data';

export default function AdminEmailsPage() {
  const [recipient, setRecipient] = useState('test.client@example.com');
  const [subject, setSubject] = useState('🔥 InkThread Hub: Exclusive Drop Access Unlocked');
  const [templateType, setTemplateType] = useState('drop_announcement');
  const [sending, setSending] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const [logs, setLogs] = useState([
    {
      id: '1',
      to: 'rohan.deshmukh@example.com',
      subject: '🔥 InkThread Hub Order Confirmed: #ITH-2026-08101',
      status: 'sent',
      timestamp: '2026-08-18T10:15:30Z',
    },
    {
      id: '2',
      to: 'ananya.roy@example.com',
      subject: '🚀 InkThread Hub Order #ITH-2026-08102 is on its way!',
      status: 'sent',
      timestamp: '2026-08-16T17:00:00Z',
    },
  ]);

  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setStatusMessage('');

    try {
      const res = await fetch('/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: recipient,
          subject,
          templateType,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setStatusMessage(`Email successfully dispatched to ${recipient}`);
        setLogs((prev) => [
          {
            id: Date.now().toString(),
            to: recipient,
            subject,
            status: 'sent',
            timestamp: new Date().toISOString(),
          },
          ...prev,
        ]);
      } else {
        setStatusMessage(`Error: ${data.error || 'Failed to dispatch'}`);
      }
    } catch {
      // Mock success if endpoint offline
      setStatusMessage(`[Test Mode] Email simulated to ${recipient}`);
      setLogs((prev) => [
        {
          id: Date.now().toString(),
          to: recipient,
          subject,
          status: 'sent',
          timestamp: new Date().toISOString(),
        },
        ...prev,
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-street-800 gap-4">
        <div>
          <span className="text-xs font-mono font-bold text-brand-neon uppercase tracking-widest">
            SERVER-SIDE COMMUNICATIONS
          </span>
          <h1 className="font-display font-black text-2xl sm:text-4xl text-white uppercase tracking-tight">
            EMAIL SYSTEM & BROADCASTS
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Email Dispatcher Form */}
        <div className="lg:col-span-7 bg-card border border-street-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <h2 className="font-display font-bold text-base text-white uppercase tracking-wider flex items-center gap-2">
            <Mail className="w-5 h-5 text-brand-neon" />
            Send Email / Test Template
          </h2>

          {statusMessage && (
            <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{statusMessage}</span>
            </div>
          )}

          <form onSubmit={handleSendTestEmail} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-zinc-400 font-mono">Template</label>
              <select
                value={templateType}
                onChange={(e) => setTemplateType(e.target.value)}
                className="w-full bg-street-950 border border-street-800 rounded-xl px-4 py-2.5 text-white cursor-pointer"
              >
                <option value="order_confirmation">Order Confirmation (Itemized Receipt)</option>
                <option value="order_shipped">Order Dispatched (AWB Tracking)</option>
                <option value="drop_announcement">New Streetwear Drop Announcement</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-400 font-mono">Recipient Email</label>
              <input
                type="email"
                required
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full bg-street-950 border border-street-800 rounded-xl px-4 py-2.5 text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-400 font-mono">Subject Line</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-street-950 border border-street-800 rounded-xl px-4 py-2.5 text-white"
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className="w-full bg-brand-neon hover:bg-brand-neonHover text-black font-black uppercase text-xs sm:text-sm py-3.5 px-6 rounded-xl shadow-glow-neon flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {sending ? (
                'Dispatching Server Request...'
              ) : (
                <>
                  <Send className="w-4 h-4" /> DISPATCH EMAIL
                </>
              )}
            </button>
          </form>
        </div>

        {/* Dispatch Log */}
        <div className="lg:col-span-5 bg-card border border-street-800 rounded-3xl p-6 space-y-4">
          <h3 className="font-display font-bold text-white uppercase text-sm">
            Recent Email Logs
          </h3>

          <div className="space-y-3">
            {logs.map((l) => (
              <div key={l.id} className="p-3 bg-street-950 rounded-xl border border-street-800 text-xs font-mono space-y-1">
                <div className="flex justify-between">
                  <span className="text-brand-neon font-bold">To: {l.to}</span>
                  <span className="text-emerald-400 font-bold uppercase">{l.status}</span>
                </div>
                <p className="text-zinc-300 font-sans text-[11px] truncate">{l.subject}</p>
                <p className="text-[10px] text-zinc-500">{new Date(l.timestamp).toLocaleTimeString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
