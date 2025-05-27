// src/actions/blogActions.ts
'use server';

import { generateBlogPost, type GenerateBlogPostInput } from '@/ai/flows/generate-blog-post';
import { summarizeBlogPost, type SummarizeBlogPostInput } from '@/ai/flows/summarize-blog-posts';
import { generateBlogImage, type GenerateBlogImageInput } from '@/ai/flows/generate-blog-image-flow';
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
    const generateInput: GenerateBlogPostInput = { title };
    const blogPostOutput = await generateBlogPost(generateInput);
    
    if (!blogPostOutput.content) {
      return { message: 'AI failed to generate blog post content.', success: false };
    }

    let imageDataUri: string | undefined = undefined;
    try {
      const imageInput: GenerateBlogImageInput = { title };
      const imageOutput = await generateBlogImage(imageInput);
      imageDataUri = imageOutput.imageDataUri;
    } catch (imageError) {
      console.warn('Image generation failed, proceeding without image:', imageError instanceof Error ? imageError.message : String(imageError));
      // Optionally, add a message to the user here if needed
    }

    const summarizeInput: SummarizeBlogPostInput = { blogPostContent: blogPostOutput.content };
    const summaryOutput = await summarizeBlogPost(summarizeInput);

    if (!summaryOutput.summary) {
      return { message: 'AI failed to generate summary.', success: false };
    }

    const newSlug = await createPostFile(title, blogPostOutput.content, summaryOutput.summary, imageDataUri);

    // Revalidate paths to show new post immediately
    revalidatePath('/');
    revalidatePath('/blog');
    revalidatePath(`/blog/${newSlug}`);

    return { message: 'Blog post generated successfully!', success: true, slug: newSlug };

  } catch (error) {
    console.error('Error generating post:', error);
    let errorMessage = 'An unexpected error occurred while generating the post.';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return { message: `Failed to generate post: ${errorMessage}`, success: false };
  }
}
