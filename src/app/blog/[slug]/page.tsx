
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

const siteBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://auto-blog-ai-alpha.vercel.app/';

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
    openGraph: {
      title: post.title,
      description: post.summary,
      type: 'article',
      publishedTime: new Date(post.date).toISOString(),
      modifiedTime: new Date(post.date).toISOString(),
      url: `${siteBaseUrl}/blog/${post.slug}`,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        }
      ],
      authors: ['Blog Author'], // Updated Author
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

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteBaseUrl}/blog/${post.slug}`,
    },
    headline: post.title,
    description: post.summary,
    image: post.featuredImage && post.featuredImage.startsWith('http')
      ? post.featuredImage
      : `https://placehold.co/1200x630.png?text=${encodeURIComponent(post.title)}`,
    author: {
      '@type': 'Person', // Or Organization
      name: 'Blog Author', // Updated Author
      // url: siteBaseUrl, // Optionally add author URL
    },
    publisher: {
      '@type': 'Organization',
      name: 'My Awesome Blog', // Updated Publisher
      logo: {
        '@type': 'ImageObject',
        url: `https://placehold.co/200x60.png?text=My+Awesome+Blog+Logo`,
      }, // Added comma here
      url: siteBaseUrl,
    },
    datePublished: new Date(post.date).toISOString(),
    dateModified: new Date(post.date).toISOString(),
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
      </article>
    </>
  );
}
