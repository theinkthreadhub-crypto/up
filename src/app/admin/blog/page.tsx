'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { Plus, Edit2, Trash2, X, Loader2, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { slugify, formatDate } from '@/lib/utils';
import { BlogPost } from '@/types/database';

export default function AdminBlogPage() {
  const supabase = useMemo(() => createClient(), []);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  const [formTitle, setFormTitle] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formExcerpt, setFormExcerpt] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formImage, setFormImage] = useState('/images/sungod_luffy_acidwash_front.jpg');
  const [formCategory, setFormCategory] = useState('Streetwear Culture');
  const [formAuthor, setFormAuthor] = useState('InkThread Atelier');
  const [formTags, setFormTags] = useState('Streetwear, Drop, Fashion');
  const [formIsPublished, setFormIsPublished] = useState(true);

  const loadPosts = async () => {
    setLoading(true);
    setError('');
    const { data, error: dbError } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (dbError) {
      setError(dbError.message);
    } else {
      setPosts((data || []) as BlogPost[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    void loadPosts();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const openAdd = () => {
    setEditingPost(null);
    setFormTitle('');
    setFormSlug('');
    setFormExcerpt('');
    setFormContent('## Subheading\n\nEnter article content here...');
    setFormImage('/images/sungod_luffy_acidwash_front.jpg');
    setFormCategory('Streetwear Culture');
    setFormAuthor('InkThread Atelier');
    setFormTags('Streetwear, Drop, Fashion');
    setFormIsPublished(true);
    setError('');
    setIsModalOpen(true);
  };

  const openEdit = (p: BlogPost) => {
    setEditingPost(p);
    setFormTitle(p.title);
    setFormSlug(p.slug);
    setFormExcerpt(p.excerpt || '');
    setFormContent(p.content);
    setFormImage(p.featured_image || '/images/sungod_luffy_acidwash_front.jpg');
    setFormCategory(p.category || 'Streetwear Culture');
    setFormAuthor(p.author || 'InkThread Atelier');
    setFormTags((p.tags || []).join(', '));
    setFormIsPublished(p.is_published);
    setError('');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const tagsArr = formTags.split(',').map((t) => t.trim()).filter(Boolean);
    const payload = {
      title: formTitle.trim(),
      slug: formSlug.trim() || slugify(formTitle),
      excerpt: formExcerpt.trim() || null,
      content: formContent.trim(),
      featured_image: formImage.trim() || null,
      category: formCategory.trim() || 'Streetwear Culture',
      author: formAuthor.trim() || 'InkThread Atelier',
      tags: tagsArr,
      is_published: formIsPublished,
      updated_at: new Date().toISOString(),
    };

    const result = editingPost
      ? await supabase.from('blog_posts').update(payload).eq('id', editingPost.id)
      : await supabase.from('blog_posts').insert({
          ...payload,
          published_at: new Date().toISOString(),
          read_time: '4 min read',
        });

    if (result.error) {
      setError(result.error.message);
    } else {
      setIsModalOpen(false);
      await loadPosts();
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this blog post?')) return;
    setError('');
    const { error: deleteError } = await supabase.from('blog_posts').delete().eq('id', id);
    if (deleteError) {
      setError(deleteError.message);
    } else {
      await loadPosts();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-street-800 gap-4">
        <div>
          <span className="text-xs font-mono font-bold text-brand-neon uppercase tracking-widest">
            BRAND JOURNAL CMS
          </span>
          <h1 className="font-display font-black text-2xl sm:text-4xl text-white uppercase tracking-tight">
            BLOG ARTICLES ({posts.length})
          </h1>
        </div>

        <button
          onClick={openAdd}
          className="bg-brand-neon hover:bg-brand-neonHover text-black font-black uppercase text-xs px-5 py-3 rounded-xl shadow-glow-neon flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> WRITE ARTICLE
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
          <span>Loading articles from Supabase...</span>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 bg-card border border-street-800 rounded-3xl p-8 space-y-4">
          <p className="text-sm text-zinc-400 font-mono">No blog posts found in Supabase.</p>
          <button
            onClick={openAdd}
            className="bg-brand-neon text-black font-bold uppercase text-xs px-5 py-2.5 rounded-xl shadow-glow-neon inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Write First Article
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-card border border-street-800 rounded-3xl overflow-hidden shadow-lg flex flex-col justify-between"
            >
              <div className="relative aspect-[16/9] w-full bg-street-950">
                <Image
                  src={post.featured_image || '/images/sungod_luffy_acidwash_front.jpg'}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 mb-1">
                    <span>{post.category}</span>
                    <span>{formatDate(post.published_at || post.created_at)}</span>
                  </div>
                  <h3 className="font-bold text-white text-base leading-snug line-clamp-2">{post.title}</h3>
                  <p className="text-xs text-zinc-400 mt-2 line-clamp-2">{post.excerpt}</p>
                </div>

                <div className="pt-4 border-t border-street-800 flex items-center justify-between">
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      post.is_published ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-800 text-zinc-500'
                    }`}
                  >
                    {post.is_published ? 'PUBLISHED' : 'DRAFT'}
                  </span>

                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(post)}
                      className="p-1.5 text-zinc-400 hover:text-white bg-street-900 rounded-lg"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="p-1.5 text-zinc-400 hover:text-red-400 bg-street-900 rounded-lg"
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
          <div className="bg-card border border-street-800 rounded-3xl w-full max-w-xl p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-street-800">
              <h3 className="font-bold text-white uppercase text-sm">
                {editingPost ? 'Edit Blog Article' : 'New Blog Article'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-zinc-400 font-mono">Article Title *</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => {
                    setFormTitle(e.target.value);
                    if (!editingPost) setFormSlug(slugify(e.target.value));
                  }}
                  className="w-full bg-street-950 border border-street-800 rounded-xl px-4 py-2.5 text-white font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
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
                  <label className="text-zinc-400 font-mono">Category</label>
                  <input
                    type="text"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-street-950 border border-street-800 rounded-xl px-4 py-2.5 text-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-400 font-mono">Featured Image URL</label>
                <input
                  type="text"
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  className="w-full bg-street-950 border border-street-800 rounded-xl px-4 py-2.5 text-white font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-400 font-mono">Short Excerpt</label>
                <textarea
                  rows={2}
                  value={formExcerpt}
                  onChange={(e) => setFormExcerpt(e.target.value)}
                  className="w-full bg-street-950 border border-street-800 rounded-xl px-4 py-2.5 text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-400 font-mono">Full Content (Markdown)</label>
                <textarea
                  rows={6}
                  required
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  className="w-full bg-street-950 border border-street-800 rounded-xl px-4 py-2.5 text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-zinc-400 font-mono">Author</label>
                  <input
                    type="text"
                    value={formAuthor}
                    onChange={(e) => setFormAuthor(e.target.value)}
                    className="w-full bg-street-950 border border-street-800 rounded-xl px-4 py-2.5 text-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-zinc-400 font-mono">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={formTags}
                    onChange={(e) => setFormTags(e.target.value)}
                    className="w-full bg-street-950 border border-street-800 rounded-xl px-4 py-2.5 text-white"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={formIsPublished}
                  onChange={(e) => setFormIsPublished(e.target.checked)}
                  className="w-4 h-4 rounded bg-street-950 border-street-800 text-brand-neon"
                />
                <span>Published on Journal Page</span>
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
                  disabled={saving}
                  className="bg-brand-neon text-black font-bold uppercase px-5 py-2 rounded-xl disabled:opacity-50 flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
                    </>
                  ) : (
                    'Save Article'
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
