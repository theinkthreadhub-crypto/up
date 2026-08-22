'use client';

import { use, useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { ArrowLeft, Clock, User, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { BlogPost } from '@/types/database';

export default function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPost() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('slug', slug)
          .maybeSingle();

        if (!error && data) {
          setPost(data as BlogPost);
        }
      } catch (e) {
        console.error('Error fetching blog post:', e);
      } finally {
        setLoading(false);
      }
    }
    void loadPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center py-20 text-zinc-400 font-mono text-xs gap-2">
        <Loader2 className="w-6 h-6 animate-spin text-brand-neon" />
        <span>Loading journal dispatch...</span>
      </div>
    );
  }

  if (!post) {
    notFound();
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      <Link href="/blog" className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-brand-neon transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Journal Dispatches
      </Link>

      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
          <span className="bg-brand-neon/10 text-brand-neon px-3 py-1 rounded-full font-bold">{post.category}</span>
          <span className="text-zinc-500">•</span>
          <span className="text-zinc-400 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {post.read_time || '4 min read'}</span>
          <span className="text-zinc-500">•</span>
          <span className="text-zinc-400">{formatDate(post.published_at || post.created_at)}</span>
        </div>

        <h1 className="font-display font-black text-3xl sm:text-5xl text-white uppercase tracking-tight leading-tight">{post.title}</h1>

        {post.excerpt && (
          <p className="text-sm sm:text-base text-zinc-300 italic border-l-2 border-brand-neon pl-4 py-1">{post.excerpt}</p>
        )}

        <div className="flex items-center gap-3 pt-2 text-xs text-zinc-400 font-mono">
          <User className="w-4 h-4 text-brand-cyan" />
          <span>Curated by <strong className="text-white">{post.author}</strong></span>
        </div>
      </div>

      <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden border border-street-800 bg-street-950">
        <Image src={post.featured_image || '/images/plain_oversized_black.jpg'} alt={post.title} fill priority className="object-cover" />
      </div>

      <div className="prose prose-invert max-w-none text-zinc-300 text-sm sm:text-base leading-relaxed space-y-6">
        {post.content.split('\n\n').map((paragraph, idx) => {
          if (paragraph.startsWith('## ')) {
            return <h2 key={idx} className="font-display font-black text-xl sm:text-2xl text-white uppercase tracking-wide pt-4">{paragraph.replace('## ', '')}</h2>;
          }
          if (paragraph.startsWith('### ')) {
            return <h3 key={idx} className="font-bold text-lg text-brand-neon uppercase pt-2">{paragraph.replace('### ', '')}</h3>;
          }
          return <p key={idx}>{paragraph}</p>;
        })}
      </div>

      <div className="border-t border-street-800 pt-8 space-y-6">
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-zinc-500 mr-2">Tags:</span>
            {post.tags.map((tag) => (
              <span key={tag} className="text-xs font-mono bg-street-900 text-zinc-300 px-3 py-1 rounded-full border border-street-800">#{tag}</span>
            ))}
          </div>
        )}

        <div className="bg-street-900/60 border border-street-800 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-display font-bold text-white uppercase text-base">Ready to Upgrade Your Streetwear Rotation?</h3>
            <p className="text-xs text-zinc-400 mt-1">Explore our 240 GSM heavy drops with pan-India delivery.</p>
          </div>
          <Link href="/shop" className="bg-brand-neon text-black font-black uppercase text-xs px-6 py-3.5 rounded-xl shadow-glow-neon shrink-0">SHOP THE DROP →</Link>
        </div>
      </div>
    </article>
  );
}
