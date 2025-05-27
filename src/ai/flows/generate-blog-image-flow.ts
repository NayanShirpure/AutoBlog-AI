
// src/ai/flows/generate-blog-image-flow.ts
'use server';
/**
 * @fileOverview An AI agent for generating blog post hero images.
 *
 * - generateBlogImage - A function that handles the image generation.
 * - GenerateBlogImageInput - The input type for the generateBlogImage function.
 * - GenerateBlogImageOutput - The return type for the generateBlogImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBlogImageInputSchema = z.object({
  title: z.string().describe('The title of the blog post to generate an image for.'),
  // Optional: Add summary or a snippet of content if available and useful for context
  // contentHint: z.string().optional().describe('A brief snippet or summary of the blog post content for better image context.') 
});
export type GenerateBlogImageInput = z.infer<typeof GenerateBlogImageInputSchema>;

const GenerateBlogImageOutputSchema = z.object({
  imageDataUri: z.string().describe("The generated image as a data URI. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type GenerateBlogImageOutput = z.infer<typeof GenerateBlogImageOutputSchema>;

export async function generateBlogImage(input: GenerateBlogImageInput): Promise<GenerateBlogImageOutput> {
  return generateBlogImageFlow(input);
}

const generateBlogImageFlow = ai.defineFlow(
  {
    name: 'generateBlogImageFlow',
    inputSchema: GenerateBlogImageInputSchema,
    outputSchema: GenerateBlogImageOutputSchema,
  },
  async (input) => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-exp', 
      prompt: `Generate a highly relevant and visually compelling hero image for a blog post titled: "${input.title}". 
The image should directly reflect the core subject matter of the title. 
For example, if the title is "The Future of Quantum Computing", the image should be about quantum computing, not just abstract shapes.
If the title is "Healthy Baking Recipes", depict appealing baked goods or ingredients.
Avoid text in the image. The style should be modern, clean, and professional.
Focus on creating an image that a reader would immediately associate with the blog post's topic based on the title.`,
      config: {
        responseModalities: ['TEXT', 'IMAGE'], 
      },
    });

    if (!media?.url) {
      throw new Error('Image generation failed or returned no media URL.');
    }

    return {imageDataUri: media.url};
  }
);

