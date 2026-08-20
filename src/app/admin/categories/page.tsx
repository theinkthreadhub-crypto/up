'use client';

import { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import { Plus, Edit2, Trash2, X, Loader2, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { slugify } from '@/lib/utils';
import { Category } from '@/types/database';

export default function AdminCategoriesPage() {
  const supabase = useMemo(() => createClient(), []);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);

  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formImage, setFormImage] = useState('/images/plain_oversized_black.jpg');

  const loadCategories = async () => {
    setLoading(true);
    setError('');
    const { data, error: dbError } = await supabase
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true });

    if (dbError) {
      setError(dbError.message);
    } else {
      setCategories((data || []) as Category[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    void loadCategories();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const openAdd = () => {
    setEditingCat(null);
    setFormName('');
    setFormSlug('');
    setFormDesc('');
    setFormImage('/images/plain_oversized_black.jpg');
    setError('');
    setIsModalOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditingCat(cat);
    setFormName(cat.name);
    setFormSlug(cat.slug);
    setFormDesc(cat.description || '');
    setFormImage(cat.image_url || '/images/plain_oversized_black.jpg');
    setError('');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      name: formName.trim(),
      slug: formSlug.trim() || slugify(formName),
      description: formDesc.trim() || null,
      image_url: formImage.trim() || null,
      is_active: true,
      display_order: editingCat ? editingCat.display_order : categories.length + 1,
      updated_at: new Date().toISOString(),
    };

    const result = editingCat
      ? await supabase.from('categories').update(payload).eq('id', editingCat.id)
      : await supabase.from('categories').insert(payload);

    if (result.error) {
      setError(result.error.message);
    } else {
      setIsModalOpen(false);
      await loadCategories();
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    setError('');
    const { error: deleteError } = await supabase.from('categories').delete().eq('id', id);
    if (deleteError) {
      setError(deleteError.message);
    } else {
      await loadCategories();
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

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-2xl flex items-center gap-3 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20 text-zinc-400 font-mono text-xs gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-brand-neon" />
          <span>Loading categories from Supabase...</span>
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-20 bg-card border border-street-800 rounded-3xl p-8 space-y-4">
          <p className="text-sm text-zinc-400 font-mono">No categories found in Supabase database.</p>
          <button
            onClick={openAdd}
            className="bg-brand-neon text-black font-bold uppercase text-xs px-5 py-2.5 rounded-xl shadow-glow-neon inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Create First Category
          </button>
        </div>
      ) : (
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
                  <span className="text-[11px] font-mono text-emerald-400 font-bold">
                    {cat.is_active ? 'Active Collection' : 'Hidden'}
                  </span>
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
      )}

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
                  disabled={saving}
                  className="bg-brand-neon text-black font-bold uppercase px-5 py-2 rounded-xl disabled:opacity-50 flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
                    </>
                  ) : (
                    'Save'
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
