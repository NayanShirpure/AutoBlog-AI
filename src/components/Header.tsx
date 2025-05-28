
import Link from 'next/link';
import { Newspaper, Sparkles, HomeIcon, Tags, Info, MessageSquare, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetTitle } from '@/components/ui/sheet';

export function Header() {
  const navLinks = [
    { href: "/", label: "Home", icon: HomeIcon },
    { href: "/blog", label: "Blog", icon: Newspaper },
    { href: "/blog/tags", label: "Tags", icon: Tags },
    { href: "/about", label: "About", icon: Info },
    { href: "/contact", label: "Contact", icon: MessageSquare },
  ];

  return (
    <header className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Sparkles className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold tracking-tight text-foreground">My Awesome Blog</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-0.5 sm:gap-1">
          {navLinks.map((link) => (
            <Button variant="ghost" asChild key={link.href}>
              <Link href={link.href} className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground px-2 sm:px-3 py-2">
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            </Button>
          ))}
          <ThemeToggle />
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center">
          <ThemeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="ml-2">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] p-6">
              <SheetHeader className="mb-4">
                <SheetTitle className="text-left">Navigation Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col space-y-3">
                {navLinks.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <Link
                      href={link.href}
                      className="flex items-center gap-3 rounded-md px-3 py-2 text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      <link.icon className="h-5 w-5 text-muted-foreground" />
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
