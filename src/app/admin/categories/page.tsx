'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Layers, Plus, Edit2, Trash2, X, Check } from 'lucide-react';
import { initialCategories } from '@/lib/mock-data';
import { slugify } from '@/lib/utils';
import { Category } from '@/types/database';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);

  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formImage, setFormImage] = useState('/images/plain_oversized_black.jpg');

  const openAdd = () => {
    setEditingCat(null);
    setFormName('');
    setFormSlug('');
    setFormDesc('');
    setFormImage('/images/plain_oversized_black.jpg');
    setIsModalOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditingCat(cat);
    setFormName(cat.name);
    setFormSlug(cat.slug);
    setFormDesc(cat.description || '');
    setFormImage(cat.image_url || '/images/plain_oversized_black.jpg');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCat) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editingCat.id
            ? {
                ...c,
                name: formName,
                slug: formSlug || slugify(formName),
                description: formDesc,
                image_url: formImage,
              }
            : c
        )
      );
    } else {
      const newCat: Category = {
        id: crypto.randomUUID(),
        name: formName,
        slug: formSlug || slugify(formName),
        description: formDesc,
        image_url: formImage,
        is_active: true,
        display_order: categories.length + 1,
      };
      setCategories((prev) => [...prev, newCat]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-street-800 gap-4">
        <div>
          <span className="text-xs font-mono font-bold text-brand-neon uppercase tracking-widest">
            COLLECTION TAXONOMY
          </span>
          <h1 className="font-display font-black text-2xl sm:text-4xl text-white uppercase tracking-tight">
            CATEGORIES ({categories.length})
          </h1>
        </div>

        <button
          onClick={openAdd}
          className="bg-brand-neon hover:bg-brand-neonHover text-black font-black uppercase text-xs px-5 py-3 rounded-xl shadow-glow-neon flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> CREATE CATEGORY
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-card border border-street-800 rounded-3xl overflow-hidden shadow-lg flex flex-col justify-between"
          >
            <div className="relative aspect-[16/9] w-full bg-street-950">
              <Image
                src={cat.image_url || '/images/plain_oversized_black.jpg'}
                alt={cat.name}
                fill
                className="object-cover"
              />
            </div>

            <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase">Slug: /{cat.slug}</span>
                <h3 className="font-bold text-white text-base uppercase mt-0.5">{cat.name}</h3>
                <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                  {cat.description || 'No description provided.'}
                </p>
              </div>

              <div className="pt-4 border-t border-street-800 flex items-center justify-between">
                <span className="text-[11px] font-mono text-emerald-400 font-bold">Active Collection</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(cat)}
                    className="p-1.5 text-zinc-400 hover:text-white hover:bg-street-900 rounded-lg"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-street-900 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
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
                {editingCat ? 'Edit Category' : 'New Category'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-zinc-400 font-mono">Category Name *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => {
                    setFormName(e.target.value);
                    if (!editingCat) setFormSlug(slugify(e.target.value));
                  }}
                  className="w-full bg-street-950 border border-street-800 rounded-xl px-4 py-2.5 text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-400 font-mono">Slug *</label>
                <input
                  type="text"
                  required
                  value={formSlug}
                  onChange={(e) => setFormSlug(e.target.value)}
                  className="w-full bg-street-950 border border-street-800 rounded-xl px-4 py-2.5 text-white font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-400 font-mono">Banner Image URL</label>
                <input
                  type="text"
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  className="w-full bg-street-950 border border-street-800 rounded-xl px-4 py-2.5 text-white font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-400 font-mono">Description</label>
                <textarea
                  rows={2}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full bg-street-950 border border-street-800 rounded-xl px-4 py-2.5 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-street-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-street-900 text-zinc-300 px-4 py-2 rounded-xl"
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
