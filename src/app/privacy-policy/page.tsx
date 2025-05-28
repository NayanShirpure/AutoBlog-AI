
// src/app/privacy-policy/page.tsx
import type { Metadata } from 'next';

const siteBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://auto-blog-ai-alpha.vercel.app/';
const pageUrl = `${siteBaseUrl}privacy-policy`;

export const metadata: Metadata = {
  title: 'Privacy Policy | My Awesome Blog',
  description: 'Read the Privacy Policy for My Awesome Blog.',
  alternates: {
    canonical: pageUrl,
  },
  // IMPORTANT: This is placeholder content. Remove noindex once you have a real policy.
  robots: { 
    index: false, 
    follow: false,
  },
};

export default function PrivacyPolicyPage() {
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Privacy Policy | My Awesome Blog',
    description: 'Privacy Policy for My Awesome Blog.',
    url: pageUrl,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
        key="privacypage-schema"
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
            Privacy Policy
          </h1>
          <p className="mt-2 text-muted-foreground">Last Updated: {new Date().toLocaleDateString()}</p>
        </header>
        
        {/* 
          IMPORTANT! The following is generic placeholder text. 
          You MUST replace this with a comprehensive privacy policy that accurately
          reflects your data collection, usage, and protection practices,
          and complies with all relevant laws (e.g., GDPR, CCPA).
          Consult with a legal professional if needed.
        */}

        <p className="p-4 bg-destructive/10 text-destructive border border-destructive rounded-md">
          <strong>Disclaimer:</strong> This is a template privacy policy and should not be used as-is.
          It is for illustrative purposes only. You must tailor this policy to your specific
          data practices and consult with a legal professional to ensure compliance.
        </p>

        <h2>1. Introduction</h2>
        <p>
          Welcome to My Awesome Blog ("we," "our," or "us"). We are committed to protecting your personal information
          and your right to privacy. If you have any questions or concerns about this privacy notice, or our practices
          with regards to your personal information, please contact us at [Your Contact Email or Link to Contact Page].
        </p>
        <p>
          This privacy notice describes how we might use your information if you visit our website at {siteBaseUrl},
          or otherwise engage with us.
        </p>

        <h2>2. What Information Do We Collect?</h2>
        <p>
          <strong>Personal information you disclose to us:</strong> We collect personal information that you voluntarily provide to us
          when you [e.g., register on the website, express an interest in obtaining information about us or our products and
          services, when you participate in activities on the Website (such as posting comments or entering competitions,
          giveaways) or otherwise when you contact us].
        </p>
        <p>
          The personal information that we collect depends on the context of your interactions with us and the Website,
          the choices you make and the products and features you use. The personal information we collect may include
          the following: [List types of personal data, e.g., names, email addresses, usernames, passwords, contact preferences, etc.].
        </p>
        <p>
          <strong>Information automatically collected:</strong> We automatically collect certain information when you visit, use or navigate
          the Website. This information does not reveal your specific identity (like your name or contact information) but
          may include device and usage information, such as your IP address, browser and device characteristics, operating
          system, language preferences, referring URLs, device name, country, location, information about how and when you
          use our Website and other technical information. This information is primarily needed to maintain the security
          and operation of our Website, and for our internal analytics and reporting purposes.
        </p>
        <p>Like many businesses, we also collect information through cookies and similar technologies. [Link to Cookie Policy if you have one, or explain more here].</p>

        <h2>3. How Do We Use Your Information?</h2>
        <p>
          We use personal information collected via our Website for a variety of business purposes described below.
          We process your personal information for these purposes in reliance on our legitimate business interests,
          in order to enter into or perform a contract with you, with your consent, and/or for compliance with our
          legal obligations. We indicate the specific processing grounds we rely on next to each purpose listed below.
        </p>
        <p>We use the information we collect or receive:</p>
        <ul>
          <li>To facilitate account creation and logon process. [Explain details]</li>
          <li>To post testimonials. [Explain details, e.g., with consent]</li>
          <li>Request feedback. [Explain details]</li>
          <li>To enable user-to-user communications. [Explain details, e.g., with consent]</li>
          <li>To manage user accounts. [Explain details]</li>
          <li>To send administrative information to you. [Explain details]</li>
          <li>To protect our Services. [Explain details, e.g., for fraud monitoring]</li>
          <li>To enforce our terms, conditions and policies for business purposes, to comply with legal and regulatory requirements or in connection with our contract.</li>
          <li>To respond to legal requests and prevent harm. [Explain details]</li>
          <li>Fulfill and manage your orders. [If applicable]</li>
          <li>Administer prize draws and competitions. [If applicable]</li>
          <li>To deliver and facilitate delivery of services to the user. [Explain details]</li>
          <li>To respond to user inquiries/offer support to users.</li>
          <li>To send you marketing and promotional communications. [Explain details, include opt-out]</li>
          <li>Deliver targeted advertising to you. [Explain details, include opt-out]</li>
          <li>For other Business Purposes. [Explain details, e.g., data analysis, identifying usage trends]</li>
        </ul>

        <h2>4. Will Your Information Be Shared With Anyone?</h2>
        <p>
          We may process or share your data that we hold based on the following legal basis: [Explain legal bases, e.g., Consent, Legitimate Interests, Performance of a Contract, Legal Obligations, Vital Interests].
        </p>
        <p>
          More specifically, we may need to process your data or share your personal information in the following situations: [List situations, e.g., Business Transfers, Affiliates, Business Partners, Third-Party Vendors like analytics providers, hosting services, etc.].
        </p>

        <h2>5. Do We Use Cookies and Other Tracking Technologies?</h2>
        <p>
          We may use cookies and similar tracking technologies (like web beacons and pixels) to access or store information.
          Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Notice [Link if you have one, or explain here].
        </p>

        <h2>6. How Long Do We Keep Your Information?</h2>
        <p>
          We will only keep your personal information for as long as it is necessary for the purposes set out in this
          privacy notice, unless a longer retention period is required or permitted by law (such as tax, accounting or
          other legal requirements). [Specify retention periods or criteria].
        </p>

        <h2>7. How Do We Keep Your Information Safe?</h2>
        <p>
          We have implemented appropriate technical and organizational security measures designed to protect the security
          of any personal information we process. However, despite our safeguards and efforts to secure your information,
          no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure,
          so we cannot promise or guarantee that hackers, cybercriminals, or other unauthorized third parties will not be
          able to defeat our security, and improperly collect, access, steal, or modify your information. [Add details of your security measures if appropriate].
        </p>

        <h2>8. What Are Your Privacy Rights?</h2>
        <p>
          In some regions (like the EEA and UK and Canada), you have certain rights under applicable data protection laws. These may include the right (i) to request access and obtain a copy of your personal information, (ii) to request rectification or erasure; (iii) to restrict the processing of your personal information; and (iv) if applicable, to data portability. In certain circumstances, you may also have the right to object to the processing of your personal information. To make such a request, please use the contact details provided below.
        </p>
        <p>[Detail other rights, e.g., withdrawing consent, opt-out of marketing, lodging complaints with supervisory authorities].</p>

        <h2>9. Controls for Do-Not-Track Features</h2>
        <p>
          Most web browsers and some mobile operating systems and mobile applications include a Do-Not-Track ("DNT")
          feature or setting you can activate to signal your privacy preference not to have data about your online
          browsing activities monitored and collected. [State your policy regarding DNT signals].
        </p>

        <h2>10. Do California Residents Have Specific Privacy Rights?</h2>
        <p>
          Yes, if you are a resident of California, you are granted specific rights regarding access to your personal information.
          California Civil Code Section 1798.83, also known as the "Shine The Light" law, permits our users who are
          California residents to request and obtain from us, once a year and free of charge, information about categories
          of personal information (if any) we disclosed to third parties for direct marketing purposes and the names and
          addresses of all third parties with which we shared personal information in the immediately preceding calendar year.
          If you are a California resident and would like to make such a request, please submit your request in writing to us
          using the contact information provided below.
        </p>
        <p>[Add CCPA specific details if applicable, including categories of data collected, consumer rights, etc.]</p>

        <h2>11. Do We Make Updates to This Notice?</h2>
        <p>
          Yes, we will update this notice as necessary to stay compliant with relevant laws. The updated version will be
          indicated by an updated "Revised" date and the updated version will be effective as soon as it is accessible.
          We encourage you to review this privacy notice frequently to be informed of how we are protecting your information.
        </p>

        <h2>12. How Can You Contact Us About This Notice?</h2>
        <p>
          If you have questions or comments about this notice, you may email us at [Your Contact Email] or by post to:
        </p>
        <p>[Your Company Name, if applicable]</p>
        <p>[Your Address, if applicable]</p>

      </div>
    </>
  );
}
