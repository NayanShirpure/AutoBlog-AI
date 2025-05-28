# My Awesome Blog

This is a Next.js blog project, built with Firebase Studio. It features AI-powered content generation (for admin use) and a clean, user-friendly interface for readers.

## Key Features

*   **Next.js 15 App Router**: Modern, performant React framework.
*   **TypeScript**: For robust, type-safe code.
*   **ShadCN UI Components & Tailwind CSS**: For a beautiful and responsive design.
*   **Genkit (Google AI)**: Powers the AI content and image generation.
    *   Blog post generation (topic-based).
    *   Hero image generation for posts.
    *   Inline image generation within posts.
    *   Content summarization.
*   **Markdown (MDX) Support**: For writing and rendering blog posts.
*   **SEO Friendly**:
    *   Dynamic sitemap (`/sitemap.xml`).
    *   `robots.txt` configuration.
    *   OpenGraph meta tags.
    *   Schema.org structured data.
    *   Canonical URLs.
*   **Blog Features**:
    *   Tagging system with dedicated tag pages.
    *   RSS feed (`/rss.xml`).
    *   Social sharing buttons.
    *   Client-side search and tag filtering on the blog index.
    *   Dark mode support.
*   **Admin-Only Content Generation**:
    *   `/generate` page protected by an environment variable token.
    *   Handles read-only filesystems in deployment (e.g., Vercel) by providing content for manual commit.
*   **Performance Optimized**:
    *   Optimized font loading with `next/font`.
    *   Incremental Static Regeneration (ISR) for content pages.

## Getting Started

1.  **Clone the repository.**
2.  **Install dependencies**: `npm install`
3.  **Set up Environment Variables**:
    *   Create a `.env` file in the project root.
    *   Add `POST_GENERATION_TOKEN="your_secret_admin_token"` to your `.env` file. Choose a strong, random token.
    *   (Optional) You can also set `NEXT_PUBLIC_BASE_URL="http://localhost:9002"` for local development if you want to override the default. For production, this should be your live site's URL.
4.  **Run the development server**: `npm run dev`
    The application will be available at `http://localhost:9002`.
5.  **Run Genkit development server** (in a separate terminal, if you plan to modify AI flows): `npm run genkit:watch`

To generate new posts, navigate to `http://localhost:9002/generate` and use the admin token you set.

## Deployment

This project is configured for easy deployment on platforms like Vercel.
*   Ensure you set the `POST_GENERATION_TOKEN` and `NEXT_PUBLIC_BASE_URL` environment variables in your Vercel project settings.
