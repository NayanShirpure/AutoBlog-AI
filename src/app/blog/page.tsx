
'use client'; // Make this a client component for search functionality

import { useState, useEffect, useMemo } from 'react';
import { getAllPosts, type PostMeta } from '@/lib/posts';
import { PostCard } from '@/components/PostCard';
import type { Metadata } from 'next'; // Metadata type can still be used
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const siteBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://auto-blog-ai-alpha.vercel.app/';
const blogPageOgImage = `https://placehold.co/1200x630.png?text=My+Awesome+Blog+Articles`;

// Note: `generateMetadata` is not used in Client Components.
// Metadata for this page should be handled in a parent Server Component (e.g., layout.tsx)
// or by exporting a `metadata` object if this were still a Server Component.
// For simplicity, we'll rely on the layout's metadata or assume this page doesn't need highly dynamic metadata.

// export const metadata: Metadata = { ... }; // This won't work directly in a 'use client' component.

export const revalidate = 3600; 

const POSTS_PER_PAGE = 9;

export default function BlogIndexPage({
  searchParams,
}: {
  searchParams?: { page?: string };
}) {
  const [allPosts, setAllPosts] = useState<PostMeta[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    // Fetch posts on the client side.
    // In a real app, you might fetch this from an API route if it needs to be dynamic and searchable server-side.
    // For now, using getAllPosts which reads from filesystem (this part runs during build for SSG,
    // but in a 'use client' component, if called directly, it might behave differently than expected in browser).
    // A better approach for client-side fetching would be an API endpoint.
    // However, for basic client-side filtering of already statically generated posts, this structure is okay.
    setAllPosts(getAllPosts());
  }, []);

  const filteredPosts = useMemo(() => {
    if (!searchTerm) {
      return allPosts;
    }
    return allPosts.filter(post => 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [allPosts, searchTerm]);

  const currentPage = Number(searchParams?.page) || 1;
  const paginatedPosts = useMemo(() => {
    return filteredPosts.slice(
      (currentPage - 1) * POSTS_PER_PAGE,
      currentPage * POSTS_PER_PAGE
    );
  }, [filteredPosts, currentPage]);

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);

  // Schema.org metadata should ideally be in a server component or handled via head management
  // For client components, you might use a library or effect to update document.head
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
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify(collectionPageSchema);
    script.key = 'collectionpage-schema';
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);


  if (allPosts.length === 0 && !searchTerm) { // Only show initial empty state if no posts at all
    return (
      <>
        {/* Schema script handled by useEffect */}
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
      {/* Schema script handled by useEffect */}
      <div className="space-y-8">
        <header className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Latest Articles
          </h1>
          <p className="mt-4 text-xl text-muted-foreground">
            Explore insights and stories from the blog.
          </p>
        </header>

        <div className="mb-8 max-w-xl mx-auto">
          <div className="relative">
            <Input 
              type="search"
              placeholder="Search articles by title, summary, or tag..."
              className="pl-10 text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>
        
        {paginatedPosts.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {paginatedPosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <Image 
              src="https://placehold.co/300x200.png" 
              alt="No results found" 
              width={150} 
              height={100} 
              className="mx-auto mb-4 rounded-md"
              data-ai-hint="no results"
            />
            <p className="text-muted-foreground">No articles found matching your search criteria.</p>
          </div>
        )}


        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-4 pt-8">
            {currentPage > 1 && (
              <Button variant="outline" asChild>
                <Link href={`/blog?page=${currentPage - 1}${searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : ''}`}>Previous</Link>
              </Button>
            )}
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            {currentPage < totalPages && (
              <Button variant="outline" asChild>
                <Link href={`/blog?page=${currentPage + 1}${searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : ''}`}>Next</Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </>
  );
}
