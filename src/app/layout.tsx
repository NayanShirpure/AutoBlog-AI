
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/ThemeProvider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'optional', // Explicitly set for clarity
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'optional', // Explicitly set for clarity
});

const siteBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://auto-blog-ai-alpha.vercel.app/';
const defaultOgImage = `https://placehold.co/1200x630.png?text=My+Awesome+Blog`;

export const metadata: Metadata = {
  metadataBase: new URL(siteBaseUrl),
  title: {
    default: 'My Awesome Blog - AI Powered Content',
    template: '%s | My Awesome Blog',
  },
  description: 'Welcome to My Awesome Blog. Discover interesting articles and insights.',
  openGraph: {
    title: {
      default: 'My Awesome Blog - AI Powered Content',
      template: '%s | My Awesome Blog',
    },
    description: 'Welcome to My Awesome Blog. Discover interesting articles and insights.',
    type: 'website',
    locale: 'en_US',
    url: siteBaseUrl,
    siteName: 'My Awesome Blog',
    images: [
      {
        url: defaultOgImage,
        width: 1200,
        height: 630,
        alt: 'My Awesome Blog',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  // Add more metadata as needed, like icons, manifest, etc.
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const webSiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'My Awesome Blog',
    url: siteBaseUrl,
    description: 'Welcome to My Awesome Blog. Discover interesting articles and insights.',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteBaseUrl}/blog?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
          <Header />
          <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
          <Footer />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
