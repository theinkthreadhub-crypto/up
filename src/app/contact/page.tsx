'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && message) {
      setSubmitted(true);
      setName('');
      setEmail('');
      setOrderNumber('');
      setMessage('');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-mono font-bold text-brand-cyan uppercase tracking-widest">
          ATELIER CLIENT CARE
        </span>
        <h1 className="font-display font-black text-3xl sm:text-5xl text-white uppercase tracking-tight">
          GET IN TOUCH
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400">
          Have questions about sizing, custom drop allocations, or an existing order? Reach out directly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Form */}
        <div className="lg:col-span-7 bg-card border border-street-800 rounded-3xl p-6 sm:p-10 space-y-6">
          <h2 className="font-display font-bold text-lg text-white uppercase tracking-wider">
            Send an Inquiry
          </h2>

          {submitted ? (
            <div className="bg-brand-neon/10 border border-brand-neon/30 text-brand-neon p-6 rounded-2xl text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 mx-auto" />
              <h3 className="font-bold text-base">Inquiry Received</h3>
              <p className="text-xs text-zinc-300">
                Our atelier support team responds to all tickets within 2-4 business hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 text-xs font-mono underline text-white"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-zinc-400 font-mono">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Rohan Sharma"
                    className="w-full bg-street-950 border border-street-800 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-brand-neon"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-zinc-400 font-mono">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="rohan@example.com"
                    className="w-full bg-street-950 border border-street-800 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-brand-neon"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-400 font-mono">Order Number (if regarding an order)</label>
                <input
                  type="text"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="e.g. ITH-2026-08101"
                  className="w-full bg-street-950 border border-street-800 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-brand-neon font-mono uppercase"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-400 font-mono">Message / Sizing Query *</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us how we can assist you..."
                  className="w-full bg-street-950 border border-street-800 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-brand-neon"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-brand-neon hover:bg-brand-neonHover text-black font-black uppercase text-xs sm:text-sm py-4 px-6 rounded-xl shadow-glow-neon flex items-center justify-center gap-2 transition-all"
              >
                <Send className="w-4 h-4" /> TRANSMIT MESSAGE
              </button>
            </form>
          )}
        </div>

        {/* Contact Info Cards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-card border border-street-800 rounded-3xl p-6 space-y-4">
            <h3 className="font-display font-bold text-white uppercase text-sm">Direct Atelier Channels</h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-street-900 text-brand-neon flex items-center justify-center shrink-0 border border-street-800">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-white font-bold">Email Support</h4>
                  <a href="mailto:support@inkthreadhub.com" className="text-zinc-400 hover:text-brand-neon">
                    support@inkthreadhub.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-street-900 text-brand-cyan flex items-center justify-center shrink-0 border border-street-800">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-white font-bold">WhatsApp / Helpline</h4>
                  <p className="text-zinc-400 font-mono">+91 98765 43210 (Mon-Sat, 10am - 7pm IST)</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-street-900 text-brand-purple flex items-center justify-center shrink-0 border border-street-800">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-white font-bold">HQ & Atelier</h4>
                  <p className="text-zinc-400">Plot 42, Okhla Industrial Area Phase III, New Delhi 110020</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-street-950 border border-street-800 rounded-3xl p-6 space-y-2 text-xs">
            <h4 className="font-bold text-white uppercase">Frequently Asked</h4>
            <p className="text-zinc-400">
              <strong className="text-zinc-300">How long does delivery take?</strong><br/>
              Standard metro deliveries take 2-3 business days. Non-metro pin codes take 4-5 business days via Blue Dart or Delhivery.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
