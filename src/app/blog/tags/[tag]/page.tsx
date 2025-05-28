// src/app/blog/tags/[tag]/page.tsx
import { getAllPosts, getAllTags, type PostMeta, slugify } from '@/lib/posts';
import { PostCard } from '@/components/PostCard';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Tag } from 'lucide-react';
import { notFound } from 'next/navigation';
import Image from 'next/image';

const siteBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://auto-blog-ai-alpha.vercel.app/';

type Props = {
  params: { tag: string };
};

export async function generateStaticParams() {
  const tags = getAllTags();
  return tags.map((tag) => ({
    tag: slugify(tag),
  }));
}

export const revalidate = 3600; // Revalidate every hour

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const allTags = getAllTags();
  const originalTag = allTags.find(t => slugify(t) === params.tag);

  if (!originalTag) {
    return {
      title: 'Tag Not Found',
    };
  }

  const title = `Posts tagged with "${originalTag}" | My Awesome Blog`;
  const description = `Browse articles related to ${originalTag} on My Awesome Blog.`;
  const ogImageUrl = `https://placehold.co/1200x630.png?text=Tag%3A+${encodeURIComponent(originalTag)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${siteBaseUrl}blog/tags/${params.tag}`,
      type: 'website',
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: title }],
    },
  };
}

export default async function TagPage({ params }: Props) {
  const { tag: tagSlug } = params;
  const allPosts = getAllPosts();
  const allTags = getAllTags();
  const originalTag = allTags.find(t => slugify(t) === tagSlug);

  if (!originalTag) {
    notFound();
  }

  const postsWithTag = allPosts.filter(post => 
    post.tags?.some(pt => slugify(pt) === tagSlug)
  );

  const pageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Posts tagged with "${originalTag}" | My Awesome Blog`,
    description: `Articles about ${originalTag}.`,
    url: `${siteBaseUrl}blog/tags/${tagSlug}`,
    isPartOf: {
      '@type': 'WebSite',
      url: siteBaseUrl,
      name: 'My Awesome Blog',
    },
  };


  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }}
        key="tagpage-schema"
      />
      <div className="space-y-8">
        <header className="pb-4 border-b">
          <Button variant="ghost" asChild className="mb-4 text-muted-foreground hover:text-foreground -ml-4">
            <Link href="/blog">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to all articles
            </Link>
          </Button>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl flex items-center">
            <Tag className="h-7 w-7 mr-3 text-primary"/> 
            Posts tagged with: <span className="ml-2 text-primary">{originalTag}</span>
          </h1>
        </header>

        {postsWithTag.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {postsWithTag.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
             <Image 
              src="https://placehold.co/400x300.png" 
              alt="No posts found for this tag" 
              width={200} 
              height={150} 
              className="mx-auto mb-6 rounded-md"
              data-ai-hint="empty tag results"
            />
            <p className="text-xl text-muted-foreground">
              No posts found for the tag "{originalTag}".
            </p>
          </div>
        )}
      </div>
    </>
  );
}
