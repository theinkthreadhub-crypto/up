import { MetadataRoute } from 'next';
import { createAdminClient } from '@/lib/supabase/admin';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://inkthreadhub.com';

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/shop`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/track-order`, lastModified: new Date(), changeFrequency: 'always', priority: 0.8 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  ];

  let productRoutes: MetadataRoute.Sitemap = [];
  let categoryRoutes: MetadataRoute.Sitemap = [];
  let blogRoutes: MetadataRoute.Sitemap = [];

  try {
    const supabase = createAdminClient();

    const [productsRes, categoriesRes, blogRes] = await Promise.all([
      supabase.from('products').select('slug, updated_at').eq('is_published', true),
      supabase.from('categories').select('slug, updated_at').eq('is_active', true),
      supabase.from('blog_posts').select('slug, updated_at').eq('is_published', true),
    ]);

    if (productsRes.data) {
      productRoutes = productsRes.data.map((p) => ({
        url: `${baseUrl}/product/${p.slug}`,
        lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
      }));
    }

    if (categoriesRes.data) {
      categoryRoutes = categoriesRes.data.map((c) => ({
        url: `${baseUrl}/category/${c.slug}`,
        lastModified: c.updated_at ? new Date(c.updated_at) : new Date(),
        changeFrequency: 'weekly',
        priority: 0.85,
      }));
    }

    if (blogRes.data) {
      blogRoutes = blogRes.data.map((b) => ({
        url: `${baseUrl}/blog/${b.slug}`,
        lastModified: b.updated_at ? new Date(b.updated_at) : new Date(),
        changeFrequency: 'monthly',
        priority: 0.75,
      }));
    }
  } catch (err) {
    console.error('Error generating dynamic sitemap:', err);
  }

  return [...staticRoutes, ...productRoutes, ...categoryRoutes, ...blogRoutes];
}
