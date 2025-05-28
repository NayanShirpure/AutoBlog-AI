
// src/app/terms-of-service/page.tsx
import type { Metadata } from 'next';

const siteBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://auto-blog-ai-alpha.vercel.app/';
const pageUrl = `${siteBaseUrl}terms-of-service`;

export const metadata: Metadata = {
  title: 'Terms of Service | My Awesome Blog',
  description: 'Read the Terms of Service for My Awesome Blog.',
  alternates: {
    canonical: pageUrl,
  },
  // IMPORTANT: This is placeholder content. Remove noindex once you have a real policy.
  robots: { 
    index: false, 
    follow: false,
  },
};

export default function TermsOfServicePage() {
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage', // Could also be 'LegalForceStatus' or a more specific type if available
    name: 'Terms of Service | My Awesome Blog',
    description: 'Terms of Service for My Awesome Blog.',
    url: pageUrl,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
        key="termspage-schema"
      />
      <div className="max-w-3xl mx-auto py-8 prose prose-lg dark:prose-invert
                        prose-headings:font-bold prose-headings:text-foreground
                        prose-p:text-foreground/90
                        prose-a:text-accent-foreground hover:prose-a:text-accent-foreground/90
                        prose-strong:text-foreground
                        prose-ul:list-disc prose-ul:pl-6 prose-li:marker:text-primary
                        prose-ol:list-decimal prose-ol:pl-6">
        <header className="mb-8 text-center not-prose">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Terms of Service
          </h1>
          <p className="mt-2 text-muted-foreground">Last Updated: {new Date().toLocaleDateString()}</p>
        </header>

        {/* 
          IMPORTANT! The following is generic placeholder text. 
          You MUST replace this with comprehensive Terms of Service that accurately
          reflect your blog's rules, user responsibilities, and your limitations of liability.
          Consult with a legal professional if needed.
        */}
        <p className="p-4 bg-destructive/10 text-destructive border border-destructive rounded-md">
          <strong>Disclaimer:</strong> This is a template Terms of Service and should not be used as-is.
          It is for illustrative purposes only. You must tailor these terms to your specific
          blog and consult with a legal professional to ensure compliance and adequacy.
        </p>

        <h2>1. Agreement to Terms</h2>
        <p>
          By accessing or using My Awesome Blog (the "Site"), you agree to be bound by these Terms of Service ("Terms").
          If you disagree with any part of the terms, then you may not access the Site.
        </p>

        <h2>2. Intellectual Property Rights</h2>
        <p>
          Unless otherwise stated, we or our licensors own the intellectual property rights for all material on My Awesome Blog.
          All intellectual property rights are reserved. You may access this from My Awesome Blog for your own personal use
          subjected to restrictions set in these terms and conditions.
        </p>
        <p>You must not:</p>
        <ul>
          <li>Republish material from My Awesome Blog without proper attribution and permission.</li>
          <li>Sell, rent, or sub-license material from My Awesome Blog.</li>
          <li>Reproduce, duplicate or copy material from My Awesome Blog for commercial purposes without permission.</li>
          <li>Redistribute content from My Awesome Blog unless content is specifically made for redistribution.</li>
        </ul>

        <h2>3. User Content</h2>
        <p>
          In these Terms of Service, "User Content" means material (including without limitation text, images, audio material,
          video material, and audio-visual material) that you submit to this Site, for whatever purpose (e.g., comments).
        </p>
        <p>
          You grant to us a worldwide, irrevocable, non-exclusive, royalty-free license to use, reproduce, adapt, publish,
          translate and distribute your user content in any existing or future media. You also grant to us the right to
          sub-license these rights, and the right to bring an action for infringement of these rights.
        </p>
        <p>
          Your user content must not be illegal or unlawful, must not infringe any third party's legal rights, and must not
          be capable of giving rise to legal action whether against you or us or a third party (in each case under any
          applicable law).
        </p>
        <p>
          We reserve the right to edit or remove any material submitted to this Site, or stored on our servers, or hosted or
          published upon this Site.
        </p>

        <h2>4. Acceptable Use</h2>
        <p>You must not use this Site in any way that causes, or may cause, damage to the Site or impairment of the availability or accessibility of My Awesome Blog; or in any way which is unlawful, illegal, fraudulent or harmful, or in connection with any unlawful, illegal, fraudulent or harmful purpose or activity.</p>
        <p>You must not use this Site to copy, store, host, transmit, send, use, publish or distribute any material which consists of (or is linked to) any spyware, computer virus, Trojan horse, worm, keystroke logger, rootkit or other malicious computer software.</p>
        <p>You must not conduct any systematic or automated data collection activities (including without limitation scraping, data mining, data extraction and data harvesting) on or in relation to this Site without our express written consent.</p>

        <h2>5. No Warranties</h2>
        <p>
          This Site is provided "as is," with all faults, and My Awesome Blog expresses no representations or warranties,
          of any kind related to this Site or the materials contained on this Site. Also, nothing contained on this Site
          shall be interpreted as advising you.
        </p>

        <h2>6. Limitation of Liability</h2>
        <p>
          In no event shall My Awesome Blog, nor any of its officers, directors, and employees, be held liable for anything
          arising out of or in any way connected with your use of this Site whether such liability is under contract.
          My Awesome Blog, including its officers, directors, and employees shall not be held liable for any indirect,
          consequential, or special liability arising out of or in any way related to your use of this Site.
        </p>

        <h2>7. Indemnification</h2>
        <p>
          You hereby indemnify to the fullest extent My Awesome Blog from and against any and/or all liabilities, costs,
          demands, causes of action, damages and expenses arising in any way related to your breach of any of the
          provisions of these Terms.
        </p>

        <h2>8. Severability</h2>
        <p>
          If any provision of these Terms is found to be invalid under any applicable law, such provisions shall be
          deleted without affecting the remaining provisions herein.
        </p>

        <h2>9. Variation of Terms</h2>
        <p>
          My Awesome Blog is permitted to revise these Terms at any time as it sees fit, and by using this Site you are
          expected to review these Terms on a regular basis.
        </p>

        <h2>10. Assignment</h2>
        <p>
          My Awesome Blog is allowed to assign, transfer, and subcontract its rights and/or obligations under these Terms
          without any notification. However, you are not allowed to assign, transfer, or subcontract any of your rights
          and/or obligations under these Terms.
        </p>

        <h2>11. Entire Agreement</h2>
        <p>
          These Terms constitute the entire agreement between My Awesome Blog and you in relation to your use of this
          Site, and supersede all prior agreements and understandings.
        </p>

        <h2>12. Governing Law & Jurisdiction</h2>
        <p>
          These Terms will be governed by and interpreted in accordance with the laws of [Your State/Country],
          and you submit to the non-exclusive jurisdiction of the state and federal courts located in
          [Your City, Your State/Country] for the resolution of any disputes.
        </p>

        <h2>13. Contact Information</h2>
        <p>
          If you have any queries regarding any of our terms, please contact us at [Your Contact Email or Link to Contact Page].
        </p>

      </div>
    </>
  );
}
