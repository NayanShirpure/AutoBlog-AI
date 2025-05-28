
import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, Send, Smartphone, MapPin } from 'lucide-react';

const siteBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://auto-blog-ai-alpha.vercel.app/';
const pageUrl = `${siteBaseUrl}contact`;
const ogImageUrl = `https://placehold.co/1200x630.png?text=Contact+My+Awesome+Blog`;

export const metadata: Metadata = {
  title: 'Contact | My Awesome Blog',
  description: 'Get in touch with the author of My Awesome Blog. We love to hear from our readers!',
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: 'Contact | My Awesome Blog',
    description: 'Get in touch with the author of My Awesome Blog.',
    url: pageUrl,
    type: 'website',
    images: [{ url: ogImageUrl, width: 1200, height: 630, alt: 'Contact My Awesome Blog' }],
  },
};

export default function ContactPage() {
  const contactPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact | My Awesome Blog',
    description: 'Get in touch with the author of My Awesome Blog.',
    url: pageUrl,
    // Optional: Add your organization details if applicable
    // publisher: {
    //   '@type': 'Organization',
    //   name: 'My Awesome Blog',
    //   logo: {
    //     '@type': 'ImageObject',
    //     url: `${siteBaseUrl}logo.png` // Replace with your actual logo URL
    //   }
    // }
  };

  // Basic form handler (does not actually send email)
  async function handleSubmit(formData: FormData) {
    'use server';
    // This is a placeholder. In a real app, you'd send this data to a backend or email service.
    // For now, we'll just log it to the server console.
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    console.log('Contact form submission (placeholder):', { name, email, message });
    // You would typically redirect or show a success message here.
  }


  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
        key="contactpage-schema"
      />
      <div className="max-w-4xl mx-auto py-8 space-y-12">
        <header className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl mb-6">
            Get In Touch
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have a question, suggestion, or just want to say hello? I'd love to hear from you!
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-10 items-start">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Send className="mr-2 h-6 w-6 text-primary" /> Send a Message
              </CardTitle>
              <CardDescription>Fill out the form below and I'll get back to you as soon as possible.</CardDescription>
            </CardHeader>
            <CardContent>
              {/* 
                NOTE: This is a basic HTML form. 
                For actual email sending, you'd need a backend or a service like Formspree, Resend, etc.
                The 'action' prop here is a server action placeholder.
              */}
              <form action={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name" className="font-medium">Full Name</Label>
                  <Input type="text" id="name" name="name" placeholder="Your Name" required className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="email" className="font-medium">Email Address</Label>
                  <Input type="email" id="email" name="email" placeholder="your.email@example.com" required className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="message" className="font-medium">Message</Label>
                  <Textarea id="message" name="message" rows={5} placeholder="Your message..." required className="mt-1" />
                </div>
                <Button type="submit" className="w-full">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-xl">Other Ways to Connect</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start">
                  <Mail className="h-6 w-6 mr-3 mt-1 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <a href="mailto:your-email@example.com" className="text-accent-foreground hover:underline">
                      your-email@example.com {/* Replace with your email */}
                    </a>
                    <p className="text-xs text-muted-foreground">For direct inquiries.</p>
                  </div>
                </div>
                {/* Add more contact methods if needed, e.g., social media */}
                {/* <div className="flex items-start">
                  <Smartphone className="h-6 w-6 mr-3 mt-1 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold">Phone (Optional)</h3>
                    <p className="text-accent-foreground">[Your Phone Number]</p>
                    <p className="text-xs text-muted-foreground">If you prefer to call.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-6 w-6 mr-3 mt-1 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold">Location (Optional)</h3>
                    <p className="text-accent-foreground">[Your City, Country]</p>
                    <p className="text-xs text-muted-foreground">General area.</p>
                  </div>
                </div> */}
              </CardContent>
            </Card>
             <p className="text-sm text-muted-foreground text-center">
                I typically respond within 24-48 hours.
             </p>
          </div>
        </div>
      </div>
    </>
  );
}
