
import { getAllPosts, type PostMeta } from '@/lib/posts';
import { PostCard } from '@/components/PostCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Sparkles, ArrowRight, UserCircle } from 'lucide-react';
import Image from 'next/image';
import type { Metadata } from 'next';

const siteBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://auto-blog-ai-alpha.vercel.app/';
const homePageOgImage = `https://placehold.co/1200x630.png?text=Welcome+to+My+Awesome+Blog`;

export const metadata: Metadata = {
  title: 'My Awesome Blog - Homepage',
  description: 'Welcome to My Awesome Blog. Discover insightful articles and stories by Blog Author.', // Updated description
  alternates: {
    canonical: siteBaseUrl,
  },
  openGraph: {
    title: 'My Awesome Blog - Homepage',
    description: 'Welcome to My Awesome Blog. Discover insightful articles and stories by Blog Author.', // Updated description
    url: siteBaseUrl,
    images: [
      {
        url: homePageOgImage,
        width: 1200,
        height: 630,
        alt: 'Welcome to My Awesome Blog',
      },
    ],
  },
};

export const revalidate = 3600; // Revalidate every hour

export default async function HomePage() {
  const allPosts = getAllPosts();
  const recentPosts = allPosts.slice(0, 3); 

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    url: siteBaseUrl,
    name: 'My Awesome Blog - Homepage',
    description: 'Welcome to My Awesome Blog. Discover insightful articles and stories by Blog Author.', // Updated description
    isPartOf: {
      '@type': 'WebSite',
      url: siteBaseUrl,
      name: 'My Awesome Blog',
    },
    // Optional: Add publisher info if desired
    // publisher: {
    //   '@type': 'Person', // Or 'Organization'
    //   name: 'Blog Author'
    // }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
        key="webpage-schema"
      />
      <div className="space-y-12">
        <section className="text-center py-12 md:py-20 bg-card rounded-lg shadow-xl">
          <div className="container mx-auto px-4">
            {/* You can use a different icon or image here if Sparkles isn't fitting */}
            <UserCircle className="h-16 w-16 text-primary mx-auto mb-6" /> 
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-6">
              Welcome to My Awesome Blog
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Hi, I'm [Your Name/Blog Author Name]! Explore my thoughts, stories, and insights on various topics.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Button size="lg" asChild className="shadow-lg hover:shadow-xl transition-shadow">
                <Link href="/blog">
                  Explore Articles <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="shadow-lg hover:shadow-xl transition-shadow">
                <Link href="/about">
                  Learn More About Me
                </Link>
              </Button>
            </div>
          </div>
        </section>
        
        {recentPosts.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-8 text-center sm:text-left">
              Latest Articles
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
                  alt="Illustration of an empty desk" 
                  width={300} 
                  height={200} 
                  className="mx-auto mb-6 rounded-md"
                  data-ai-hint="empty desk writing"
              />
              <h2 className="text-2xl font-semibold text-foreground mb-4">The First Post is Coming Soon!</h2>
              <p className="text-muted-foreground mb-6">
                  This blog is just getting started. Check back soon for amazing content!
              </p>
              <Button asChild>
                  <Link href="/blog">Browse the Blog (Soon!)</Link>
              </Button>
          </section>
        )}
      </div>
    </>
  );
}
