// src/app/rss.xml/route.ts
import { getAllPosts, type PostMeta } from '@/lib/posts';
import {NextResponse} from 'next/server';

const siteBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://auto-blog-ai-alpha.vercel.app/';
const siteTitle = 'My Awesome Blog';
const siteDescription = 'Discover interesting articles and insights generated with AI.';

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

export async function GET() {
  const posts = getAllPosts();

  const rssItems = posts
    .map((post: PostMeta) => {
      const postUrl = `${siteBaseUrl}blog/${post.slug}`;
      return `
        <item>
          <title>${escapeXml(post.title)}</title>
          <link>${postUrl}</link>
          <guid>${postUrl}</guid>
          <pubDate>${new Date(post.date).toUTCString()}</pubDate>
          <description>${escapeXml(post.summary)}</description>
          ${post.tags && post.tags.length > 0 ? post.tags.map(tag => `<category>${escapeXml(tag)}</category>`).join('') : ''}
        </item>
      `;
    })
    .join('');

  const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
      <channel>
        <title>${escapeXml(siteTitle)}</title>
        <link>${siteBaseUrl}</link>
        <description>${escapeXml(siteDescription)}</description>
        <language>en-us</language>
        <lastBuildDate>${new Date(posts[0]?.date || Date.now()).toUTCString()}</lastBuildDate>
        <atom:link href="${siteBaseUrl}rss.xml" rel="self" type="application/rss+xml" />
        ${rssItems}
      </channel>
    </rss>
  `;

  return new NextResponse(rssFeed, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
