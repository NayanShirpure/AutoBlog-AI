
// src/app/blog/tags/page.tsx
import { getAllTags } from '@/lib/posts';
import { slugify } from '@/lib/utils';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import type { Metadata } from 'next';
import { Tag } from 'lucide-react';

const siteBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://auto-blog-ai-alpha.vercel.app/';
const allTagsPageOgImage = `https://placehold.co/1200x630.png?text=All+Blog+Tags`;

export const metadata: Metadata = {
  title: 'All Tags | My Awesome Blog',
  description: 'Browse all tags and categories on My Awesome Blog.',
  openGraph: {
    title: 'All Tags | My Awesome Blog',
    description: 'Browse all tags and categories on My Awesome Blog.',
    type: 'website',
    url: `${siteBaseUrl}blog/tags`,
    images: [
      {
        url: allTagsPageOgImage,
        width: 1200,
        height: 630,
        alt: 'All Tags on My Awesome Blog',
      },
    ],
  },
};

export const revalidate = 3600; // Revalidate every hour

export default async function AllTagsPage() {
  const tags = getAllTags();

  const collectionPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'All Tags | My Awesome Blog',
    description: 'A collection of all tags used across My Awesome Blog.',
    url: `${siteBaseUrl}blog/tags`,
    isPartOf: {
      '@type': 'WebSite',
      url: siteBaseUrl,
      name: 'My Awesome Blog',
    },
    // You could list some of the main tags here if desired using schema.org/ItemList
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }}
        key="alltagspage-schema"
      />
      <div className="max-w-3xl mx-auto py-8">
        <header className="mb-8 pb-4 border-b">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl flex items-center">
            <Tag className="h-8 w-8 mr-3 text-primary"/>
            All Tags
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Explore posts by browsing through the tags.
          </p>
        </header>

        {tags.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {tags.map((tag) => (
              <Link key={tag} href={`/blog/tags/${slugify(tag)}`}>
                <Badge 
                  variant="secondary" 
                  className="text-base px-4 py-2 hover:bg-primary/20 transition-colors cursor-pointer shadow-sm hover:shadow-md"
                >
                  {tag}
                </Badge>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No tags found yet. Start creating posts with tags!</p>
        )}
      </div>
    </>
  );
}
