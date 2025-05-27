import { getPostBySlug, getPostSlugs, type Post } from '@/lib/posts';
import { MDXRemote } from 'next-mdx-remote/rsc';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { CalendarDays, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

type Props = {
  params: { slug: string };
};

export async function generateStaticParams() {
  const slugs = getPostSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPostBySlug(params.slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }
  
  // Note: Using data URIs directly in og:image is not reliably supported by all crawlers.
  // A production app might upload the image to a CDN and use its URL here.
  // For this prototype, we'll omit it from Open Graph if it's a data URI
  // to avoid potential issues, or one could link to a placeholder.

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: 'article',
      publishedTime: post.date,
      url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/blog/${post.slug}`,
      // images: post.featuredImage && post.featuredImage.startsWith('http') ? [{ url: post.featuredImage }] : undefined,
    },
  };
}

export default async function PostPage({ params }: Props) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="max-w-3xl mx-auto py-8">
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4 text-muted-foreground hover:text-foreground">
          <Link href="/blog">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Blog
          </Link>
        </Button>
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl mb-3">
          {post.title}
        </h1>
        <div className="flex items-center text-base text-muted-foreground">
          <CalendarDays className="h-4 w-4 mr-2" />
          <time dateTime={post.date}>{format(new Date(post.date), 'MMMM d, yyyy')}</time>
        </div>
      </div>

      {post.featuredImage && (
        <div className="mb-8 overflow-hidden rounded-lg shadow-xl">
          <Image 
            src={post.featuredImage} 
            alt={`Featured image for ${post.title}`} 
            width={1200} // Define a base width for layout
            height={600} // Define a base height for layout
            className="w-full h-auto object-cover aspect-[2/1]" // Maintain aspect ratio
            priority // Prioritize loading if it's LCP
          />
        </div>
      )}

      <div className="prose prose-lg dark:prose-invert max-w-none 
                      prose-headings:font-bold prose-headings:text-foreground
                      prose-p:text-foreground/90
                      prose-a:text-primary hover:prose-a:text-primary/80
                      prose-strong:text-foreground
                      prose-blockquote:border-primary prose-blockquote:text-muted-foreground
                      prose-code:bg-muted prose-code:text-foreground prose-code:p-1 prose-code:rounded-md
                      prose-li:marker:text-primary">
        <MDXRemote source={post.content} />
      </div>
    </article>
  );
}
