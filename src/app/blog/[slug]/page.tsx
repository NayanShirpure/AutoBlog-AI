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

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: 'article',
      publishedTime: post.date,
      url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/blog/${post.slug}`,
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

      {/* Optional: Featured Image Placeholder if you add it to frontmatter */}
      {/* <Image src="https://placehold.co/1200x600.png" alt={post.title} width={1200} height={600} className="rounded-lg mb-8 shadow-md" data-ai-hint="blog hero" /> */}

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
