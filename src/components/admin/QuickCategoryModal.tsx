'use client';

import { useState } from 'react';
import { X, Loader2, FolderPlus, Upload, Image as ImageIcon } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { slugify } from '@/lib/utils';
import { Category } from '@/types/database';

interface QuickCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCategoryCreated: (newCategory: Category) => void;
  existingCount: number;
}

export default function QuickCategoryModal({
  isOpen,
  onClose,
  onCategoryCreated,
  existingCount,
}: QuickCategoryModalProps) {
  const supabase = createClient();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('/images/plain_oversized_black.jpg');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleImageUpload = async (file: File | null) => {
    if (!file) return;
    setUploading(true);
    setError('');

    try {
      // 1. Try uploading to Supabase storage
      const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, '-');
      const filePath = `categories/${Date.now()}-${crypto.randomUUID()}-${safeName}`;
      const { error: uploadErr } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, { upsert: false });

      if (!uploadErr) {
        const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
        if (data?.publicUrl) {
          setImageUrl(data.publicUrl);
          setUploading(false);
          return;
        }
      }
    } catch (e) {
      console.warn('Storage upload error, falling back to data URL:', e);
    }

    // 2. Fallback: Convert PNG/JPG directly to Data URL (Base64)
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        setImageUrl(reader.result as string);
      }
      setUploading(false);
    };
    reader.onerror = () => {
      setError('Failed to read image file.');
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Category Name is required.');
      return;
    }

    setSaving(true);
    setError('');

    const payload = {
      name: name.trim(),
      slug: slug.trim() || slugify(name),
      description: description.trim() || null,
      image_url: imageUrl.trim() || null,
      is_active: true,
      display_order: existingCount + 1,
      updated_at: new Date().toISOString(),
    };

    const { data, error: insertError } = await supabase
      .from('categories')
      .insert(payload)
      .select('*')
      .single();

    if (insertError) {
      setError(insertError.message);
      setSaving(false);
    } else if (data) {
      setSaving(false);
      onCategoryCreated(data as Category);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-card border border-street-800 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-street-800">
          <div className="flex items-center gap-2">
            <FolderPlus className="w-5 h-5 text-brand-neon" />
            <h3 className="font-bold text-white uppercase text-sm">Create New Category</h3>
          </div>
          <button type="button" onClick={onClose} className="text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="text-zinc-400 font-mono uppercase text-[11px]">Category Name *</label>
            <input
              type="text"
              required
              placeholder="e.g., Hoodies & Jackets"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setSlug(slugify(e.target.value));
              }}
              className="w-full bg-street-950 border border-street-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-brand-neon"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-zinc-400 font-mono uppercase text-[11px]">Slug *</label>
            <input
              type="text"
              required
              placeholder="hoodies-and-jackets"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full bg-street-950 border border-street-800 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-brand-neon"
            />
          </div>

          {/* Banner Image PNG/JPG Direct Upload */}
          <div className="space-y-1.5">
            <label className="text-zinc-400 font-mono uppercase text-[11px]">Category Banner Image (PNG / JPG)</label>
            <div className="flex items-center gap-3 bg-street-950 border border-street-800 p-2.5 rounded-2xl">
              {imageUrl ? (
                <img src={imageUrl} alt="Preview" className="w-14 h-12 object-cover rounded-xl border border-street-800 shrink-0" />
              ) : (
                <div className="w-14 h-12 bg-street-900 rounded-xl flex items-center justify-center shrink-0 text-zinc-600">
                  <ImageIcon className="w-5 h-5" />
                </div>
              )}

              <label className="flex-1 bg-street-900 border border-street-700 hover:border-brand-neon text-white px-3 py-2 rounded-xl cursor-pointer flex items-center justify-center gap-2 font-bold text-xs transition-colors">
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-brand-neon" /> Processing...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 text-brand-neon" /> Select PNG / JPG File
                  </>
                )}
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  disabled={uploading}
                  className="hidden"
                  onChange={(e) => void handleImageUpload(e.target.files?.[0] || null)}
                />
              </label>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-zinc-400 font-mono uppercase text-[11px]">Description</label>
            <textarea
              rows={2}
              placeholder="Brief description for this collection..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-street-950 border border-street-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-brand-neon"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-street-800">
            <button
              type="button"
              onClick={onClose}
              className="bg-street-900 text-zinc-300 px-4 py-2 rounded-xl hover:bg-street-800 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || uploading}
              className="bg-brand-neon text-black font-black uppercase px-5 py-2 rounded-xl hover:bg-brand-neonHover disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                </>
              ) : (
                'Create Category'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
