
import type { Metadata } from 'next';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Github, Linkedin, Twitter } from 'lucide-react';

const siteBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://auto-blog-ai-alpha.vercel.app/';
const pageUrl = `${siteBaseUrl}about`;
const ogImageUrl = `https://placehold.co/1200x630.png?text=About+My+Awesome+Blog`;

export const metadata: Metadata = {
  title: 'About | My Awesome Blog',
  description: 'Learn more about My Awesome Blog, its mission, and the author.',
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: 'About | My Awesome Blog',
    description: 'Learn more about My Awesome Blog, its mission, and the author.',
    url: pageUrl,
    type: 'profile',
    images: [{ url: ogImageUrl, width: 1200, height: 630, alt: 'About My Awesome Blog' }],
  },
};

export default function AboutPage() {
  const aboutPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About | My Awesome Blog',
    description: 'Learn more about My Awesome Blog, its mission, and the author.',
    url: pageUrl,
    mainEntity: {
      '@type': 'Person',
      name: 'Blog Author', // Replace with your name
      // "image": "URL_TO_YOUR_PROFILE_PICTURE.jpg", // Optional: Add a link to your profile picture
      // "jobTitle": "Your Role/Title", // Optional
      // "description": "A short bio about yourself.", // Optional
      // "sameAs": [ // Optional: Links to your social media profiles
      //   "https://twitter.com/yourprofile",
      //   "https://linkedin.com/in/yourprofile"
      // ]
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageSchema) }}
        key="aboutpage-schema"
      />
      <div className="max-w-3xl mx-auto py-8 space-y-12">
        <header className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl mb-6">
            About My Awesome Blog
          </h1>
          <p className="text-xl text-muted-foreground">
            Discover the story and passion behind this blog.
          </p>
        </header>

        <Card className="shadow-lg">
          <CardHeader className="items-center">
            <Avatar className="w-24 h-24 mb-4 border-2 border-primary shadow-md">
              <AvatarImage src="https://placehold.co/100x100.png" alt="Blog Author" data-ai-hint="profile picture" />
              <AvatarFallback>BA</AvatarFallback>
            </Avatar>
            <CardTitle className="text-2xl">Blog Author</CardTitle> {/* Replace with your name */}
            <p className="text-muted-foreground">Creator of My Awesome Blog</p> {/* Replace with your title/role */}
          </CardHeader>
          <CardContent className="prose prose-lg dark:prose-invert max-w-none
                                  prose-headings:font-semibold prose-headings:text-foreground
                                  prose-p:text-foreground/90
                                  prose-a:text-accent-foreground hover:prose-a:text-accent-foreground/90">
            <p>
              Welcome to My Awesome Blog! My name is [Your Name], and I'm thrilled to share my thoughts, experiences,
              and insights with you here.
            </p>
            <p>
              <strong>Our Mission:</strong> This blog is dedicated to [describe the main topics or mission of your blog - e.g., exploring the latest in technology, sharing creative writing tips, documenting travel adventures, etc.].
              I aim to provide [e.g., valuable information, inspiring stories, practical advice] that [e.g., helps you learn, sparks your curiosity, entertains you].
            </p>
            <p>
              <strong>My Story:</strong> I started this blog because [explain your motivation - e.g., of my passion for X, to connect with like-minded individuals, to document my learning journey].
              [Add a sentence or two about your background or relevant experience if you wish].
            </p>
            <p>
              Thank you for stopping by. I hope you find the content here engaging and useful. Feel free to connect with me or leave comments!
            </p>
            
            {/* Optional: Social Links Section */}
            <div className="mt-6 pt-4 border-t">
              <h3 className="text-lg font-semibold text-center mb-3">Connect with Me</h3>
              <div className="flex justify-center space-x-4">
                <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-muted-foreground hover:text-primary transition-colors">
                  <Twitter className="h-6 w-6" />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-muted-foreground hover:text-primary transition-colors">
                  <Linkedin className="h-6 w-6" />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-muted-foreground hover:text-primary transition-colors">
                  <Github className="h-6 w-6" />
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
            <Image 
                src="https://placehold.co/600x400.png" 
                alt="A workspace or an image relevant to your blog's theme" 
                width={600} 
                height={400} 
                className="mx-auto rounded-lg shadow-xl"
                data-ai-hint="creative workspace ideas"
            />
            <p className="text-sm text-muted-foreground mt-2">A glimpse into my creative space.</p>
        </div>

      </div>
    </>
  );
}
