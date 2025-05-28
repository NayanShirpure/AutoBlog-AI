
'use client';

import { useState, useEffect, useMemo } from 'react';
import type { PostMeta } from '@/lib/posts'; // Only PostMeta type
import { PostCard } from '@/components/PostCard';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

const siteBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://auto-blog-ai-alpha.vercel.app/';

const POSTS_PER_PAGE = 9;

export default function BlogListingClient({
  initialPosts,
  searchParams,
}: {
  initialPosts: PostMeta[];
  searchParams?: { page?: string; search?: string };
}) {
  const router = useRouter();
  const pathname = usePathname();

  // Initialize searchTerm from URL query parameters, or default to empty string
  const [searchTerm, setSearchTerm] = useState(searchParams?.search || '');
  // Initialize allPosts state with the posts fetched on the server
  const [allPosts, setAllPosts] = useState<PostMeta[]>(initialPosts);

  // Update allPosts if initialPosts prop changes (e.g., on navigation if data is re-fetched)
  useEffect(() => {
    setAllPosts(initialPosts);
  }, [initialPosts]);

  // Effect to update URL when searchTerm changes
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (searchTerm) {
      params.set('search', searchTerm);
    } else {
      params.delete('search');
    }
    // Reset page to 1 when search term changes
    params.delete('page'); 
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchTerm, pathname, router]);


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
    const scriptId = 'collectionpage-schema';
    // Remove existing script if it exists
    const existingScript = document.head.querySelector(`script[data-id="${scriptId}"]`);
    if (existingScript) {
      document.head.removeChild(existingScript);
    }
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify(collectionPageSchema);
    script.setAttribute('data-id', scriptId); // Add an attribute to identify the script
    document.head.appendChild(script);
    
    // Cleanup function to remove the script when the component unmounts or re-renders
    return () => {
       const scriptToRemove = document.head.querySelector(`script[data-id="${scriptId}"]`);
        if (scriptToRemove) {
            document.head.removeChild(scriptToRemove);
        }
    };
  }, [searchTerm, currentPage]); // Re-run if search term or page changes to update schema potentially, though schema content is static


  if (initialPosts.length === 0 && !searchTerm) {
    return (
      <>
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const buildPageLink = (pageNumber: number) => {
    const params = new URLSearchParams();
    if (searchTerm) {
      params.set('search', searchTerm);
    }
    if (pageNumber > 1) {
      params.set('page', pageNumber.toString());
    }
    const queryString = params.toString();
    return queryString ? `${pathname}?${queryString}` : pathname;
  };


  return (
    <>
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
              onChange={handleSearchChange}
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
                <Link href={buildPageLink(currentPage - 1)}>Previous</Link>
              </Button>
            )}
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            {currentPage < totalPages && (
              <Button variant="outline" asChild>
                <Link href={buildPageLink(currentPage + 1)}>Next</Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </>
  );
}
