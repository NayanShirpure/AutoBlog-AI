import Link from 'next/link';
import { Newspaper, Sparkles, HomeIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Sparkles className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold tracking-tight text-foreground">AutoBlog AI</span>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          <Button variant="ghost" asChild>
            <Link href="/" className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground">
              <HomeIcon className="h-4 w-4" />
              Home
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/blog" className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground">
              <Newspaper className="h-4 w-4" />
              Blog
            </Link>
          </Button>
          <Button asChild>
            <Link href="/generate" className="flex items-center gap-1 text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              Generate Post
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
