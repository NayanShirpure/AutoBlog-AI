import { getAllPosts, type PostMeta } from '@/lib/posts';
import { PostCard } from '@/components/PostCard';
import type { Metadata } from 'next';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const siteBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://auto-blog-ai-alpha.vercel.app/';
const blogPageOgImage = `https://placehold.co/1200x630.png?text=My+Awesome+Blog+Articles`;

export const metadata: Metadata = {
  title: 'Blog | My Awesome Blog',
  description: 'Browse all articles and insights on My Awesome Blog.',
  openGraph: {
    title: 'Blog | My Awesome Blog',
    description: 'Browse all articles and insights on My Awesome Blog.',
    url: `${siteBaseUrl}/blog`,
    type: 'website', 
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

// Simple pagination (can be expanded later)
const POSTS_PER_PAGE = 9;

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams?: { page?: string };
}) {
  const allPosts = getAllPosts();
  const currentPage = Number(searchParams?.page) || 1;
  const paginatedPosts = allPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );
  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);

  const collectionPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Blog | My Awesome Blog',
    description: 'Browse all articles and insights on My Awesome Blog.',
    url: `${siteBaseUrl}/blog`,
    isPartOf: {
      '@type': 'WebSite',
      url: siteBaseUrl,
      name: 'My Awesome Blog',
    },
  };


  if (allPosts.length === 0) {
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }}
          key="collectionpage-schema"
        />
        <div className="text-center py-12">
          <Image 
              src="https://placehold.co/400x300.png" 
              alt="Empty blog illustration" 
              width={200} 
              height={150} 
              className="mx-auto mb-6 rounded-md"
              data-ai-hint="empty state"
          />
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-4">The Blog is Just Getting Started!</h1>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Fresh content is on its way. If you're the admin, you can generate a new post now.
          </p>
          <Button asChild>
            <Link href="/generate">Create a New Post (Admin)</Link>
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }}
        key="collectionpage-schema"
      />
      <div className="space-y-8">
        <header className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Latest Articles
          </h1>
          <p className="mt-4 text-xl text-muted-foreground">
            Explore insights and stories from the blog.
          </p>
        </header>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {paginatedPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-4 pt-8">
            {currentPage > 1 && (
              <Button variant="outline" asChild>
                <Link href={`/blog?page=${currentPage - 1}`}>Previous</Link>
              </Button>
            )}
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            {currentPage < totalPages && (
              <Button variant="outline" asChild>
                <Link href={`/blog?page=${currentPage + 1}`}>Next</Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </>
  );
}