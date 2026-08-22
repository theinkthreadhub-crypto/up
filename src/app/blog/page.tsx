'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { ArrowRight, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { BlogPost } from '@/types/database';

export default function BlogIndexPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPosts() {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('is_published', true)
          .order('published_at', { ascending: false });
        if (data) setPosts(data as BlogPost[]);
      } catch (e) {
        console.error('Error fetching blog posts:', e);
      } finally {
        setLoading(false);
      }
    }
    void loadPosts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-mono font-bold text-brand-neon uppercase tracking-widest">STREETWEAR DISPATCHES</span>
        <h1 className="font-display font-black text-3xl sm:text-5xl text-white uppercase tracking-tight">THE INKTHREAD JOURNAL</h1>
        <p className="text-xs sm:text-sm text-zinc-400">Explorations in textile engineering, 240+ GSM silhouettes, manga mythology, and underground drops.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-zinc-400 font-mono text-xs gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-brand-neon" />
          <span>Loading journal dispatches...</span>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 bg-card border border-street-800 rounded-3xl p-8">
          <p className="text-zinc-400 font-mono">No journal dispatches found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group bg-card border border-street-800 rounded-3xl overflow-hidden hover:border-brand-neon hover:shadow-2xl transition-all duration-300 flex flex-col justify-between">
              <div className="relative aspect-[16/9] w-full bg-street-950 overflow-hidden">
                <Image src={post.featured_image || '/images/plain_oversized_black.jpg'} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-mono text-brand-neon border border-white/10 font-bold">{post.category}</div>
              </div>

              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-[11px] text-zinc-500 font-mono mb-2">
                    <span>{formatDate(post.published_at || post.created_at)}</span><span>•</span><span>{post.read_time || '4 min read'}</span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-white uppercase group-hover:text-brand-neon transition-colors line-clamp-2">{post.title}</h2>
                  <p className="text-xs sm:text-sm text-zinc-400 mt-2 line-clamp-3 leading-relaxed">{post.excerpt}</p>
                </div>
                <div className="pt-4 border-t border-street-800 flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-500">By {post.author}</span>
                  <span className="text-brand-neon font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">Read Journal <ArrowRight className="w-3.5 h-3.5" /></span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
