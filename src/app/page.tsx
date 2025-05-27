
import { getAllPosts, type PostMeta } from '@/lib/posts';
import { PostCard } from '@/components/PostCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import type { Metadata } from 'next';

const siteBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://auto-blog-ai-alpha.vercel.app/';
const homePageOgImage = `https://placehold.co/1200x630.png?text=Welcome+to+AutoBlog+AI`;

export const metadata: Metadata = {
  title: 'AutoBlog AI - AI Powered Blogging Homepage',
  description: 'Welcome to AutoBlog AI. Effortlessly generate insightful, SEO-friendly blog posts with the power of AI.',
  alternates: {
    canonical: siteBaseUrl,
  },
  openGraph: {
    title: 'AutoBlog AI - AI Powered Blogging Homepage',
    description: 'Welcome to AutoBlog AI. Effortlessly generate insightful, SEO-friendly blog posts with the power of AI.',
    url: siteBaseUrl,
    images: [
      {
        url: homePageOgImage,
        width: 1200,
        height: 630,
        alt: 'Welcome to AutoBlog AI',
      },
    ],
  },
};

export default async function HomePage() {
  const allPosts = getAllPosts();
  const recentPosts = allPosts.slice(0, 3); // Display up to 3 recent posts

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    url: siteBaseUrl,
    name: 'AutoBlog AI - AI Powered Blogging Homepage',
    description: 'Welcome to AutoBlog AI. Effortlessly generate insightful, SEO-friendly blog posts with the power of AI.',
    isPartOf: {
      '@type': 'WebSite',
      url: siteBaseUrl,
      name: 'AutoBlog AI',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
        key="webpage-schema"
      />
      <div className="space-y-12">
        <section className="text-center py-16 bg-card rounded-lg shadow-md">
          <div className="container mx-auto px-4">
            <Sparkles className="h-16 w-16 text-primary mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-6">
              Welcome to AutoBlog AI
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Effortlessly generate insightful, SEO-friendly blog posts with the power of AI. Focus on your ideas, let us handle the writing.
            </p>
            <Button size="lg" asChild className="shadow-lg hover:shadow-xl transition-shadow">
              <Link href="/generate">
                Create Your First AI Post <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
        
        {recentPosts.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-8 text-center sm:text-left">
              Recent Articles
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {recentPosts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
            {allPosts.length > 3 && (
               <div className="text-center mt-12">
                  <Button variant="outline" asChild>
                      <Link href="/blog">View All Posts <ArrowRight className="ml-2 h-4 w-4" /></Link>
                  </Button>
              </div>
            )}
          </section>
        )}

        {recentPosts.length === 0 && (
          <section className="text-center py-12 bg-card rounded-lg shadow-md">
              <Image 
                  src="https://placehold.co/600x400.png" 
                  alt="Abstract illustration of AI writing" 
                  width={300} 
                  height={200} 
                  className="mx-auto mb-6 rounded-md"
                  data-ai-hint="ai writing"
              />
              <h2 className="text-2xl font-semibold text-foreground mb-4">No Posts Yet!</h2>
              <p className="text-muted-foreground mb-6">
                  It looks like your blog is brand new. Get started by generating your first post.
              </p>
              <Button asChild>
                  <Link href="/generate">Generate Your First Post</Link>
              </Button>
          </section>
        )}
      </div>
    </>
  );
}
