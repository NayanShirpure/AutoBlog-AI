
// src/actions/blogActions.ts
'use server';

import { generateBlogPost, type GenerateBlogPostInput } from '@/ai/flows/generate-blog-post';
import { summarizeBlogPost, type SummarizeBlogPostInput } from '@/ai/flows/summarize-blog-posts';
import { generateBlogImage, type GenerateBlogImageInput } from '@/ai/flows/generate-blog-image-flow';
import { createPostFile, type CreatePostResult } from '@/lib/posts';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const GeneratePostSchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters long.' }).max(150, { message: 'Title must be 150 characters or less.' }),
  adminToken: z.string().min(1, { message: 'Admin token is required.' }),
});

export type GeneratePostFormState = {
  message: string;
  fields?: Record<string, string>;
  issues?: string[];
  success: boolean;
  slug?: string;
  generatedContent?: string; // To hold content if not saved
  postStatus?: 'created' | 'generated_not_saved' | 'error'; // Status from createPostFile
};

export async function handleGeneratePost(
  prevState: GeneratePostFormState,
  formData: FormData
): Promise<GeneratePostFormState> {
  const rawFormData = {
    title: formData.get('title') as string,
    adminToken: formData.get('adminToken') as string,
  };

  const validatedFields = GeneratePostSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      message: 'Invalid form data.',
      fields: rawFormData,
      issues: validatedFields.error.issues.map((issue) => issue.message),
      success: false,
      postStatus: 'error',
    };
  }
  
  const title = validatedFields.data.title;
  const adminToken = validatedFields.data.adminToken;

  const serverAdminToken = process.env.POST_GENERATION_TOKEN;
  if (!serverAdminToken) {
    console.error('POST_GENERATION_TOKEN is not set in the environment.');
    return { message: 'Admin configuration error. Post generation is disabled.', success: false, postStatus: 'error' };
  }

  if (adminToken !== serverAdminToken) {
    return {
      message: 'Invalid admin token.',
      fields: rawFormData,
      issues: ['Admin token is incorrect.'],
      success: false,
      postStatus: 'error',
    };
  }

  try {
    const generateInput: GenerateBlogPostInput = { title };
    const blogPostOutput = await generateBlogPost(generateInput);
    
    if (!blogPostOutput.content) {
      return { message: 'AI failed to generate blog post content.', success: false, postStatus: 'error' };
    }
    if (!blogPostOutput.tags || blogPostOutput.tags.length === 0) {
      console.warn("AI did not generate tags for the post.");
    }

    // Generate summary BEFORE embedding potentially large inline image data URIs
    const summarizeInput: SummarizeBlogPostInput = { blogPostContent: blogPostOutput.content };
    const summaryOutput = await summarizeBlogPost(summarizeInput);

    if (!summaryOutput.summary) {
      console.warn('AI failed to generate summary. Proceeding without summary.');
    }
    const postSummary = summaryOutput.summary || "Summary not available.";

    let finalContent = blogPostOutput.content;
    let heroImageDataUri: string | undefined = undefined;

    try {
      const heroImagePrompt = `A visually compelling and highly relevant hero image for a blog post titled: "${title}". The image should be web-optimized for reasonable file size. The image should directly reflect the core subject matter of the title. Avoid text in the image. Style: modern, clean, professional.`;
      const heroImageInput: GenerateBlogImageInput = { prompt: heroImagePrompt };
      const heroImageOutput = await generateBlogImage(heroImageInput);
      heroImageDataUri = heroImageOutput.imageDataUri;
    } catch (imageError) {
      console.warn('Hero image generation failed, proceeding without hero image:', imageError instanceof Error ? imageError.message : String(imageError));
    }

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
          const sanitizedAlt = promptForAlt.replace(/"/g, "'").substring(0, 200);
          // Using className for React compatibility, even though it's an HTML string here,
          // it will be correctly interpreted by MDXRemote's custom img component
          return `<img src="${result.value.imageDataUri}" alt="${sanitizedAlt}" className="my-6 rounded-lg shadow-xl mx-auto block max-w-full h-auto aspect-video object-cover" />`;
        } else {
          console.warn(`Failed to generate inline image for prompt: "${promptForAlt}". Placeholder will be removed.`);
          if (result.status === 'rejected') {
            console.error('Reason for inline image failure:', result.reason);
          }
          return ''; 
        }
      });
    }

    const createResult: CreatePostResult = await createPostFile(
      title, 
      finalContent, 
      postSummary,
      heroImageDataUri,
      blogPostOutput.tags 
    );

    if (createResult.status === 'created') {
      revalidatePath('/');
      revalidatePath('/blog');
      revalidatePath(`/blog/${createResult.slug}`);
      (blogPostOutput.tags || []).forEach(tag => {
        revalidatePath(`/blog/tags/${tag.toLowerCase().replace(/\s+/g, '-')}`);
      });
      revalidatePath('/rss.xml');
      return { 
        message: 'Blog post generated and saved successfully!', 
        success: true, 
        slug: createResult.slug,
        postStatus: 'created',
      };
    } else if (createResult.status === 'generated_not_saved') {
      return {
        message: `Blog post content generated! Manual step required.`,
        success: true, // AI generation was successful
        slug: createResult.slug,
        generatedContent: createResult.fullContent,
        postStatus: 'generated_not_saved',
      };
    } else { // status is 'error'
      return {
        message: createResult.message || 'Failed to save blog post.',
        success: false,
        slug: createResult.slug !== 'error-slug' ? createResult.slug : undefined,
        generatedContent: createResult.fullContent, 
        postStatus: 'error',
      };
    }

  } catch (error)
 {
    console.error('Error generating post:', error);
    let errorMessage = 'An unexpected error occurred while generating the post.';
    if (error instanceof Error) {
      errorMessage = `Failed to generate post: ${error.message}`;
    }
    // Check if the error message contains "FALLBACK_BODY_TOO_LARGE" or "EROFS" specific details
    if (typeof error === 'string' && error.includes('FALLBACK_BODY_TOO_LARGE')) {
        errorMessage = 'Failed to generate post: The generated post is too large, likely due to oversized images. Try reducing image complexity or number.';
    } else if (error instanceof Error && error.message.includes('EROFS')) {
        errorMessage = 'Failed to generate post: Filesystem is read-only. Content was generated but could not be saved automatically.';
         // In this specific EROFS case, even if it's an error, if blogPostOutput was successful, we might have content.
        // This part is tricky as blogPostOutput might not be defined if the error happened very early.
        // For safety, we'll rely on the createPostFile function to return fullContent on EROFS
    }


    return { message: errorMessage, success: false, postStatus: 'error' };
  }
}
