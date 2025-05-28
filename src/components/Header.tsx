
import Link from 'next/link';
import { Newspaper, Sparkles, HomeIcon, Tags } from 'lucide-react'; // Added Tags icon
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';

export function Header() {
  return (
    <header className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Sparkles className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold tracking-tight text-foreground">My Awesome Blog</span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
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
          <Button variant="ghost" asChild>
            <Link href="/blog/tags" className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground">
              <Tags className="h-4 w-4" />
              Tags
            </Link>
          </Button>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
