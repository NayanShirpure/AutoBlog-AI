import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import type { PostMeta } from '@/lib/posts';
import { format } from 'date-fns';
import { CalendarDays, ArrowRight } from 'lucide-react';

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
      </CardContent>
      <CardFooter>
        <Link href={`/blog/${post.slug}`} className="text-sm font-medium text-primary hover:underline flex items-center">
          {`Read article: "${post.title}"`} <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </CardFooter>
    </Card>
  );
}
