'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FileText, Plus, Edit2, Trash2, X, Eye, EyeOff } from 'lucide-react';
import { initialBlogPosts } from '@/lib/mock-data';
import { slugify, formatDate } from '@/lib/utils';
import { BlogPost } from '@/types/database';

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>(initialBlogPosts);
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
    setIsModalOpen(true);
  };

  const openEdit = (p: BlogPost) => {
    setEditingPost(p);
    setFormTitle(p.title);
    setFormSlug(p.slug);
    setFormExcerpt(p.excerpt);
    setFormContent(p.content);
    setFormImage(p.featured_image);
    setFormCategory(p.category);
    setFormAuthor(p.author);
    setFormTags(p.tags.join(', '));
    setFormIsPublished(p.is_published);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const tagsArr = formTags.split(',').map((t) => t.trim()).filter(Boolean);

    if (editingPost) {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === editingPost.id
            ? {
                ...p,
                title: formTitle,
                slug: formSlug || slugify(formTitle),
                excerpt: formExcerpt,
                content: formContent,
                featured_image: formImage,
                category: formCategory,
                author: formAuthor,
                tags: tagsArr,
                is_published: formIsPublished,
              }
            : p
        )
      );
    } else {
      const newPost: BlogPost = {
        id: crypto.randomUUID(),
        title: formTitle,
        slug: formSlug || slugify(formTitle),
        excerpt: formExcerpt,
        content: formContent,
        featured_image: formImage,
        category: formCategory,
        author: formAuthor,
        tags: tagsArr,
        is_published: formIsPublished,
        published_at: new Date().toISOString().split('T')[0],
        read_time: '4 min read',
      };
      setPosts((prev) => [newPost, ...prev]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this blog post?')) {
      setPosts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-street-800 gap-4">
        <div>
          <span className="text-xs font-mono font-bold text-brand-neon uppercase tracking-widest">
            EDITORIAL CMS
          </span>
          <h1 className="font-display font-black text-2xl sm:text-4xl text-white uppercase tracking-tight">
            BLOG & LOOKBOOK DISPATCHES ({posts.length})
          </h1>
        </div>

        <button
          onClick={openAdd}
          className="bg-brand-neon hover:bg-brand-neonHover text-black font-black uppercase text-xs px-5 py-3 rounded-xl shadow-glow-neon flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> WRITE NEW ARTICLE
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-card border border-street-800 rounded-3xl overflow-hidden shadow-lg flex flex-col justify-between"
          >
            <div className="relative aspect-[16/9] w-full bg-street-950">
              <Image
                src={post.featured_image || '/images/plain_oversized_black.jpg'}
                alt={post.title}
                fill
                className="object-cover"
              />
              <span className="absolute top-3 left-3 bg-black/80 px-2.5 py-1 rounded text-[10px] font-mono text-brand-neon font-bold">
                {post.category}
              </span>
            </div>

            <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <p className="text-[11px] text-zinc-500 font-mono">
                  {formatDate(post.published_at)} • By {post.author}
                </p>
                <h3 className="font-bold text-white text-base uppercase mt-1 line-clamp-2">{post.title}</h3>
                <p className="text-xs text-zinc-400 mt-2 line-clamp-2 leading-relaxed">{post.excerpt}</p>
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
                    className="p-1.5 text-zinc-400 hover:text-brand-neon hover:bg-street-900 rounded-lg"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
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
          <div className="bg-card border border-street-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-street-800">
              <h3 className="font-bold text-white uppercase text-sm">
                {editingPost ? 'Edit Article' : 'Draft New Article'}
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
                  onChange={(e) => {
                    setFormTitle(e.target.value);
                    if (!editingPost) setFormSlug(slugify(e.target.value));
                  }}
                  className="w-full bg-street-950 border border-street-800 rounded-xl px-4 py-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-zinc-400 font-mono">Slug</label>
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
                <label className="text-zinc-400 font-mono">Excerpt</label>
                <textarea
                  rows={2}
                  value={formExcerpt}
                  onChange={(e) => setFormExcerpt(e.target.value)}
                  className="w-full bg-street-950 border border-street-800 rounded-xl px-4 py-2.5 text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-400 font-mono">Full Markdown Content</label>
                <textarea
                  rows={6}
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  className="w-full bg-street-950 border border-street-800 rounded-xl px-4 py-2.5 text-white font-mono"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-street-800">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsPublished}
                    onChange={(e) => setFormIsPublished(e.target.checked)}
                    className="w-4 h-4 rounded bg-street-950 border-street-800 text-brand-neon"
                  />
                  <span>Published to Storefront</span>
                </label>

                <div className="flex gap-2">
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
                    Save Post
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
