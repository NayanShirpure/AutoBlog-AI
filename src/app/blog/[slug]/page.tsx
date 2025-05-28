
import { getPostBySlug, getPostSlugs, type Post, slugify } from '@/lib/posts';
import { MDXRemote } from 'next-mdx-remote/rsc';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { CalendarDays, ChevronLeft, Tag, Share2, Twitter, Facebook, Linkedin } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';


type Props = {
  params: { slug: string };
};

const siteBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://auto-blog-ai-alpha.vercel.app/';

export async function generateStaticParams() {
  const slugs = getPostSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export const revalidate = 3600; // Revalidate every hour

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPostBySlug(params.slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  let ogImageUrl = `https://placehold.co/1200x630.png?text=${encodeURIComponent(post.title)}`;
  if (post.featuredImage) {
    if (post.featuredImage.startsWith('http')) {
      ogImageUrl = post.featuredImage;
    }
    // For data URIs, we will let the default placeholder be used for OG images
  }


  return {
    title: post.title,
    description: post.summary,
    keywords: post.tags || [],
    openGraph: {
      title: post.title,
      description: post.summary,
      type: 'article',
      publishedTime: new Date(post.date).toISOString(),
      modifiedTime: new Date(post.date).toISOString(), // Or a separate updated_time field if you have it
      url: `${siteBaseUrl}blog/${post.slug}`,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        }
      ],
      authors: ['Blog Author'], 
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary,
      images: [ogImageUrl],
    },
  };
}

export default async function PostPage({ params }: Props) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const postUrl = `${siteBaseUrl}blog/${post.slug}`;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
    headline: post.title,
    description: post.summary,
    image: post.featuredImage && post.featuredImage.startsWith('http')
      ? post.featuredImage
      : `https://placehold.co/1200x630.png?text=${encodeURIComponent(post.title)}`,
    author: {
      '@type': 'Person', 
      name: 'Blog Author',
    },
    publisher: {
      '@type': 'Organization',
      name: 'My Awesome Blog', 
      logo: {
        '@type': 'ImageObject',
        url: `https://placehold.co/200x60.png?text=My+Awesome+Blog+Logo`,
      },
      url: siteBaseUrl,
    },
    datePublished: new Date(post.date).toISOString(),
    dateModified: new Date(post.date).toISOString(), // Use a separate updated_time field if available
    keywords: post.tags?.join(', '),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        key="article-schema"
      />
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
            <time dateTime={new Date(post.date).toISOString()}>{format(new Date(post.date), 'MMMM d, yyyy')}</time>
          </div>
          {post.tags && post.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Tag className="h-4 w-4 text-muted-foreground" />
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  <Link href={`/blog/tags/${slugify(tag)}`} className="hover:underline">
                    {tag}
                  </Link>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {post.featuredImage && (
          <div className="mb-8 overflow-hidden rounded-lg shadow-xl">
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
                        prose-a:text-accent-foreground hover:prose-a:text-accent-foreground/90
                        prose-strong:text-foreground
                        prose-blockquote:border-primary prose-blockquote:text-muted-foreground
                        prose-code:bg-muted prose-code:text-foreground prose-code:p-1 prose-code:rounded-md
                        prose-li:marker:text-primary
                        prose-img:rounded-lg prose-img:shadow-md prose-img:my-8 prose-img:mx-auto prose-img:block">
          <MDXRemote source={post.content} />
        </div>

        <div className="mt-12 pt-8 border-t">
          <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center">
            <Share2 className="h-5 w-5 mr-2"/>
            Share this post
          </h3>
          <div className="flex space-x-3">
            <Button variant="outline" size="icon" asChild>
              <a 
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(post.title)}`} 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Share on Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </Button>
            <Button variant="outline" size="icon" asChild>
              <a 
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`} 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Share on Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </Button>
            <Button variant="outline" size="icon" asChild>
              <a 
                href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(postUrl)}&title=${encodeURIComponent(post.title)}&summary=${encodeURIComponent(post.summary)}`}
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Share on LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>
      </article>
    </>
  );
}
