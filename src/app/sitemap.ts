import type { MetadataRoute } from 'next';
import { getAllPosts, type PostMeta } from '@/lib/posts';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002';

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();

  const postEntries: MetadataRoute.Sitemap = posts.map((post: PostMeta) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date).toISOString(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date().toISOString(), // Or derive from latest post
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...postEntries,
    {
      url: `${BASE_URL}/generate`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.5,
    }
  ];
}
