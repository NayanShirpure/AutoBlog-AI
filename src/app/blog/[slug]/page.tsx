import { getPostBySlug, getPostSlugs, type Post } from '@/lib/posts';
import { MDXRemote } from 'next-mdx-remote/rsc';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { CalendarDays, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image'; // Keep for potential future use or if some images are handled by next/image

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
  
  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: 'article',
      publishedTime: post.date,
      url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/blog/${post.slug}`,
      // Use hero image for Open Graph if it's a full URL (not data URI for broad compatibility)
      images: post.featuredImage && post.featuredImage.startsWith('http') 
        ? [{ url: post.featuredImage }] 
        : (post.featuredImage ? [{ url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/placeholder-og.png` }] : undefined), // Fallback or omit data URIs
    },
  };
}

export default async function PostPage({ params }: Props) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  // Inline images are now part of post.content as HTML <img> tags.
  // MDXRemote will render them. The styling is applied via classes on the <img> tags themselves.
  // We can customize MDXRemote components if needed, but for simple <img> it might not be necessary.

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
          {/* Using next/image for the hero image for optimization benefits */}
          <Image 
            src={post.featuredImage} 
            alt={`Featured image for ${post.title}`} 
            width={1200} 
            height={600} 
            className="w-full h-auto object-cover aspect-[2/1]"
            priority 
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
                      prose-li:marker:text-primary
                      prose-img:rounded-lg prose-img:shadow-md prose-img:my-8 prose-img:mx-auto prose-img:block">
        {/* 
          Inline images are now part of post.content as HTML <img> tags like:
          <img src="data:image/png;base64,..." alt="description" class="my-6 rounded-lg shadow-xl mx-auto block max-w-full h-auto aspect-video object-cover" />
          The `prose-img` Tailwind Typography plugin styles will apply, and we've added custom classes directly to the img tag.
        */}
        <MDXRemote 
          source={post.content} 
          // No custom components needed for basic <img> tags.
          // If we wanted to use next/image for inline images, we'd parse placeholders
          // and pass a custom Image component here. For now, HTML <img> is simpler for dynamic injection.
        />
      </div>
    </article>
  );
}
