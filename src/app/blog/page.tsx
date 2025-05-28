
import { getAllPosts, type PostMeta } from '@/lib/posts';
import BlogListingClient from './blog-listing-client';
import type { Metadata } from 'next';

export const revalidate = 3600; // Revalidate every hour

const siteBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://auto-blog-ai-alpha.vercel.app/';
const blogPageOgImage = `https://placehold.co/1200x630.png?text=My+Awesome+Blog+Articles`;

export const metadata: Metadata = {
  title: 'Blog | My Awesome Blog',
  description: 'Explore insights and stories from the blog.',
  openGraph: {
    title: 'Blog | My Awesome Blog',
    description: 'Explore insights and stories from the blog.',
    type: 'website',
    url: `${siteBaseUrl}blog`,
    images: [
      {
        url: blogPageOgImage,
        width: 1200,
        height: 630,
        alt: 'My Awesome Blog Articles',
      },
    ],
  },
};

export default async function BlogPageServer({
  searchParams,
}: {
  searchParams?: { page?: string; search?: string };
}) {
  const allPostsData = getAllPosts();
  return <BlogListingClient initialPosts={allPostsData} searchParams={searchParams} />;
}
