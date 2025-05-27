
// src/ai/flows/generate-blog-image-flow.ts
'use server';
/**
 * @fileOverview An AI agent for generating blog post images (hero or inline).
 *
 * - generateBlogImage - A function that handles the image generation.
 * - GenerateBlogImageInput - The input type for the generateBlogImage function.
 * - GenerateBlogImageOutput - The return type for the generateBlogImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBlogImageInputSchema = z.object({
  prompt: z.string().describe('The prompt for image generation. This could be a general theme (e.g., for a hero image based on title) or a specific description for an inline image.'),
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
    // Log the prompt being used for image generation for debugging
    // console.log(`Generating image with prompt: "${input.prompt}"`);

    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-exp', 
      prompt: input.prompt, // Use the provided prompt directly
      config: {
        responseModalities: ['TEXT', 'IMAGE'], 
        // Optional: Add safety settings if needed, though default should be fine for most blog images
        // safetySettings: [
        //   { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_LOW_AND_ABOVE' },
        // ],
      },
    });

    if (!media?.url) {
      // console.error('Image generation failed or returned no media URL for prompt:', input.prompt);
      throw new Error('Image generation failed or returned no media URL.');
    }
    
    // console.log(`Image generated successfully for prompt: "${input.prompt}"`);
    return {imageDataUri: media.url};
  }
);
