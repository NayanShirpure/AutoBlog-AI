// src/actions/blogActions.ts
'use server';

import { generateBlogPost, type GenerateBlogPostInput } from '@/ai/flows/generate-blog-post';
import { summarizeBlogPost, type SummarizeBlogPostInput } from '@/ai/flows/summarize-blog-posts';
import { generateBlogImage, type GenerateBlogImageInput, type GenerateBlogImageOutput } from '@/ai/flows/generate-blog-image-flow';
import { createPostFile } from '@/lib/posts';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const GeneratePostSchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters long.' }).max(150, { message: 'Title must be 150 characters or less.' }),
});

export type GeneratePostFormState = {
  message: string;
  fields?: Record<string, string>;
  issues?: string[];
  success: boolean;
  slug?: string;
};

export async function handleGeneratePost(
  prevState: GeneratePostFormState,
  formData: FormData
): Promise<GeneratePostFormState> {
  const rawFormData = {
    title: formData.get('title') as string,
  };

  const validatedFields = GeneratePostSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      message: 'Invalid form data.',
      fields: rawFormData,
      issues: validatedFields.error.issues.map((issue) => issue.message),
      success: false,
    };
  }
  
  const title = validatedFields.data.title;

  try {
    // 1. Generate blog post content (may include image placeholders)
    const generateInput: GenerateBlogPostInput = { title };
    const blogPostOutput = await generateBlogPost(generateInput);
    
    if (!blogPostOutput.content) {
      return { message: 'AI failed to generate blog post content.', success: false };
    }

    let finalContent = blogPostOutput.content;

    // 2. Generate hero image
    let heroImageDataUri: string | undefined = undefined;
    try {
      const heroImagePrompt = `A visually compelling and highly relevant hero image for a blog post titled: "${title}". The image should directly reflect the core subject matter of the title. Avoid text in the image. Style: modern, clean, professional.`;
      const heroImageInput: GenerateBlogImageInput = { prompt: heroImagePrompt };
      const heroImageOutput = await generateBlogImage(heroImageInput);
      heroImageDataUri = heroImageOutput.imageDataUri;
    } catch (imageError) {
      console.warn('Hero image generation failed, proceeding without hero image:', imageError instanceof Error ? imageError.message : String(imageError));
    }

    // 3. Parse content for inline image placeholders and generate images
    const imagePlaceholderRegex = /\[IMAGE_PLACEHOLDER:\s*"([^"]+)"\]/g;
    const inlineImagePrompts: string[] = [];
    let match;
    while ((match = imagePlaceholderRegex.exec(blogPostOutput.content)) !== null) {
      inlineImagePrompts.push(match[1]);
    }

    if (inlineImagePrompts.length > 0) {
      const generatedImageResults = await Promise.allSettled(
        inlineImagePrompts.map(prompt => generateBlogImage({ prompt }))
      );

      let currentPlaceholderIndex = 0;
      finalContent = finalContent.replace(imagePlaceholderRegex, () => {
        const promptForAlt = inlineImagePrompts[currentPlaceholderIndex];
        const result = generatedImageResults[currentPlaceholderIndex];
        currentPlaceholderIndex++;
        
        if (result.status === 'fulfilled' && result.value.imageDataUri) {
          // Sanitize alt text: remove quotes and potentially other characters
          const sanitizedAlt = promptForAlt.replace(/"/g, "'").substring(0, 200); // Limit alt text length
          return `<img src="${result.value.imageDataUri}" alt="${sanitizedAlt}" class="my-6 rounded-lg shadow-xl mx-auto block max-w-full h-auto aspect-video object-cover" />`;
        } else {
          console.warn(`Failed to generate inline image for prompt: "${promptForAlt}". Placeholder will be removed.`);
          if (result.status === 'rejected') {
            console.error('Reason for inline image failure:', result.reason);
          }
          return ''; // Remove placeholder if image generation failed
        }
      });
    }

    // 4. Generate summary
    const summarizeInput: SummarizeBlogPostInput = { blogPostContent: finalContent }; // Use finalContent for summary
    const summaryOutput = await summarizeBlogPost(summarizeInput);

    if (!summaryOutput.summary) {
      return { message: 'AI failed to generate summary.', success: false };
    }

    // 5. Create post file with final content and hero image
    const newSlug = await createPostFile(title, finalContent, summaryOutput.summary, heroImageDataUri);

    revalidatePath('/');
    revalidatePath('/blog');
    revalidatePath(`/blog/${newSlug}`);

    return { message: 'Blog post generated successfully with inline images!', success: true, slug: newSlug };

  } catch (error) {
    console.error('Error generating post:', error);
    let errorMessage = 'An unexpected error occurred while generating the post.';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return { message: `Failed to generate post: ${errorMessage}`, success: false };
  }
}
