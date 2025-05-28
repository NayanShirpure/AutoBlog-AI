
import type { MetadataRoute } from 'next';
import { getAllPosts, getAllTags, type PostMeta } from '@/lib/posts';
import { slugify } from '@/lib/utils';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://auto-blog-ai-alpha.vercel.app/';

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const tags = getAllTags();

  const postEntries: MetadataRoute.Sitemap = posts.map((post: PostMeta) => ({
    url: `${BASE_URL}blog/${post.slug}`,
    lastModified: new Date(post.date).toISOString(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const tagEntries: MetadataRoute.Sitemap = tags.map((tag: string) => ({
    url: `${BASE_URL}blog/tags/${slugify(tag)}`,
    lastModified: new Date().toISOString(), // Tags pages update when posts do
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${BASE_URL}blog`,
      lastModified: new Date().toISOString(), 
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}blog/tags`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}about`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}contact`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'yearly', // Contact info doesn't change often
      priority: 0.5,
    },
    {
      url: `${BASE_URL}privacy-policy`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}terms-of-service`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    // `/generate` is intentionally excluded as it's an admin page
  ];

  return [
    ...staticPages,
    ...postEntries,
    ...tagEntries,
  ];
}
