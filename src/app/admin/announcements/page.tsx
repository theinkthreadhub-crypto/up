'use client';

import { useState } from 'react';
import { Megaphone, Plus, Edit2, Trash2, X, Check } from 'lucide-react';
import { initialAnnouncements } from '@/lib/mock-data';
import { Announcement } from '@/types/database';

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnn, setEditingAnn] = useState<Announcement | null>(null);

  const [formTitle, setFormTitle] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [formType, setFormType] = useState<'drop' | 'sale' | 'launch' | 'general'>('sale');
  const [formLink, setFormLink] = useState('/shop');
  const [formIsActive, setFormIsActive] = useState(true);

  const openAdd = () => {
    setEditingAnn(null);
    setFormTitle('');
    setFormMessage('');
    setFormType('sale');
    setFormLink('/shop');
    setFormIsActive(true);
    setIsModalOpen(true);
  };

  const openEdit = (a: Announcement) => {
    setEditingAnn(a);
    setFormTitle(a.title);
    setFormMessage(a.message);
    setFormType(a.type);
    setFormLink(a.link_url || '/shop');
    setFormIsActive(a.is_active);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAnn) {
      setAnnouncements((prev) =>
        prev.map((a) =>
          a.id === editingAnn.id
            ? {
                ...a,
                title: formTitle,
                message: formMessage,
                type: formType,
                link_url: formLink,
                is_active: formIsActive,
              }
            : a
        )
      );
    } else {
      const newAnn: Announcement = {
        id: crypto.randomUUID(),
        title: formTitle,
        message: formMessage,
        type: formType,
        link_url: formLink,
        is_active: formIsActive,
        priority: announcements.length + 1,
      };
      setAnnouncements((prev) => [newAnn, ...prev]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this announcement?')) {
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-street-800 gap-4">
        <div>
          <span className="text-xs font-mono font-bold text-brand-neon uppercase tracking-widest">
            STOREFRONT PROMOTIONS
          </span>
          <h1 className="font-display font-black text-2xl sm:text-4xl text-white uppercase tracking-tight">
            ANNOUNCEMENTS & TOP BARS ({announcements.length})
          </h1>
        </div>

        <button
          onClick={openAdd}
          className="bg-brand-neon hover:bg-brand-neonHover text-black font-black uppercase text-xs px-5 py-3 rounded-xl shadow-glow-neon flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> CREATE ANNOUNCEMENT
        </button>
      </div>

      <div className="space-y-4">
        {announcements.map((ann) => (
          <div
            key={ann.id}
            className="bg-card border border-street-800 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-brand-cyan uppercase bg-brand-cyan/10 px-2 py-0.5 rounded">
                  {ann.type}
                </span>
                <h3 className="font-bold text-white text-sm">{ann.title}</h3>
              </div>
              <p className="text-xs text-zinc-300">{ann.message}</p>
              {ann.link_url && (
                <p className="text-[11px] text-zinc-500 font-mono">Target: {ann.link_url}</p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                  ann.is_active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-800 text-zinc-500'
                }`}
              >
                {ann.is_active ? 'ACTIVE' : 'INACTIVE'}
              </span>

              <button
                onClick={() => openEdit(ann)}
                className="p-1.5 text-zinc-400 hover:text-white bg-street-900 rounded-lg"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(ann.id)}
                className="p-1.5 text-zinc-400 hover:text-red-400 bg-street-900 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-card border border-street-800 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-street-800">
              <h3 className="font-bold text-white uppercase text-sm">
                {editingAnn ? 'Edit Announcement' : 'New Announcement'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-zinc-400 font-mono">Title *</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Flash Drop Discount"
                  className="w-full bg-street-950 border border-street-800 rounded-xl px-4 py-2.5 text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-400 font-mono">Message Text *</label>
                <input
                  type="text"
                  required
                  value={formMessage}
                  onChange={(e) => setFormMessage(e.target.value)}
                  placeholder="⚡ FLASH DROP: 20% OFF | USE CODE STREET20"
                  className="w-full bg-street-950 border border-street-800 rounded-xl px-4 py-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-zinc-400 font-mono">Type</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as any)}
                    className="w-full bg-street-950 border border-street-800 rounded-xl px-4 py-2.5 text-white"
                  >
                    <option value="sale">Sale Promotion</option>
                    <option value="drop">New Drop Launch</option>
                    <option value="general">General Info</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-zinc-400 font-mono">Target URL</label>
                  <input
                    type="text"
                    value={formLink}
                    onChange={(e) => setFormLink(e.target.value)}
                    className="w-full bg-street-950 border border-street-800 rounded-xl px-4 py-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={formIsActive}
                  onChange={(e) => setFormIsActive(e.target.checked)}
                  className="w-4 h-4 rounded bg-street-950 border-street-800 text-brand-neon"
                />
                <span>Active on Storefront Navbar</span>
              </label>

              <div className="flex justify-end gap-2 pt-3 border-t border-street-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-street-900 text-zinc-400 px-4 py-2 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-brand-neon text-black font-bold uppercase px-5 py-2 rounded-xl"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
