import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import type { PostMeta } from '@/lib/posts';
import { slugify } from '@/lib/posts';
import { format } from 'date-fns';
import { CalendarDays, ArrowRight, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PostCardProps {
  post: PostMeta;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <Link href={`/blog/${post.slug}`} className="hover:underline">
          <CardTitle className="text-xl font-semibold leading-tight">{post.title}</CardTitle>
        </Link>
        <div className="flex items-center text-xs text-muted-foreground pt-1">
          <CalendarDays className="h-3.5 w-3.5 mr-1.5" />
          <time dateTime={post.date}>{format(new Date(post.date), 'MMMM d, yyyy')}</time>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription className="line-clamp-3 text-sm">
          {post.summary}
        </CardDescription>
        {post.tags && post.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((tag) => ( // Show up to 3 tags
              <Badge key={tag} variant="secondary" className="text-xs">
                <Link href={`/blog/tags/${slugify(tag)}`} className="hover:underline">
                  {tag}
                </Link>
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Link href={`/blog/${post.slug}`} className="text-sm font-medium text-accent-foreground hover:text-accent-foreground/90 flex items-center">
          {`Read article: "${post.title}"`} <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </CardFooter>
    </Card>
  );
}
