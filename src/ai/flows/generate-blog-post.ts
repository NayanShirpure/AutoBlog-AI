
// src/ai/flows/generate-blog-post.ts
'use server';
/**
 * @fileOverview A blog post generator AI agent.
 *
 * - generateBlogPost - A function that handles the blog post generation process.
 * - GenerateBlogPostInput - The input type for the generateBlogPost function.
 * - GenerateBlogPostOutput - The return type for the generateBlogPost function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBlogPostInputSchema = z.object({
  title: z.string().describe('The title of the blog post.'),
});
export type GenerateBlogPostInput = z.infer<typeof GenerateBlogPostInputSchema>;

const GenerateBlogPostOutputSchema = z.object({
  content: z.string().describe('The generated blog post content in markdown format, potentially including image placeholders like [IMAGE_PLACEHOLDER: "prompt here"].'),
  tags: z.array(z.string()).describe('A list of 3-5 relevant tags or categories for the blog post (e.g., "Technology", "AI", "Web Development"). Tags should be concise and in title case if multiple words (e.g., "Artificial Intelligence" instead of "artificial intelligence").'),
});
export type GenerateBlogPostOutput = z.infer<typeof GenerateBlogPostOutputSchema>;

export async function generateBlogPost(input: GenerateBlogPostInput): Promise<GenerateBlogPostOutput> {
  return generateBlogPostFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBlogPostPrompt',
  input: {schema: GenerateBlogPostInputSchema},
  output: {schema: GenerateBlogPostOutputSchema},
  prompt: `Write a detailed, high-quality, SEO-optimized blog post of at least 1500 words titled \"{{{title}}}\".
The post must include:
1. An engaging introduction.
2. At least 7-10 distinct, well-developed sections covering the topic in depth. Provide comprehensive explanations, practical examples, data, or unique insights in each section.
3. Identify up to 1 (one) key moment or section within the blog post where a relevant, illustrative image would significantly enhance reader understanding or engagement. For this identified location, insert a placeholder in the format: [IMAGE_PLACEHOLDER: "A concise, descriptive prompt for an AI image generator. The image should visually represent this section's content. CRITICAL: Prioritize generating an image that is highly web-optimized for a very small file size (e.g., under 150KB if possible, use simpler styles if needed to achieve this). For example: 'A minimalist flat design graphic of a neural network, web-optimized for tiny file size' or 'A clean line art diagram showing the water cycle, optimized for fast loading and small file size'."]
4. A strong concluding section that summarizes key takeaways and offers a final thought.
5. Generate 3-5 tags that are highly relevant to the main subject matter and key concepts discussed in the blog post. These tags should be specific and help readers find posts on similar topics. For a post about "The Future of AI in Healthcare", good tags might be "Artificial Intelligence", "Healthcare Technology", "Machine Learning", "Medical Innovation". Tags should be suitable for categorizing the post on a blog and preferably in title case (e.g., "Artificial Intelligence" not "artificial intelligence").

Ensure the entire content is well-structured, informative, and engaging for the reader. Use markdown for all formatting.
Do not include a hero image placeholder; only include placeholders for inline images as described above.
The image prompts should be specific to the content of the section they are intended for.
Strive for natural integration of these image placeholders within the flow of the text.
Example of a placeholder:
This is a paragraph discussing the future of AI.
[IMAGE_PLACEHOLDER: "An advanced AI robot interacting with humans in a collaborative environment, highly web-optimized for very small file size"]
And the text continues after the placeholder.

The response should be a JSON object matching the output schema, including the 'content' (markdown blog post) and 'tags' (array of strings).
Ensure your response only contains the markdown content for the blog post within the 'content' field and the tags in the 'tags' field.`,
});

const generateBlogPostFlow = ai.defineFlow(
  {
    name: 'generateBlogPostFlow',
    inputSchema: GenerateBlogPostInputSchema,
    outputSchema: GenerateBlogPostOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

// Ensure this file is treated as a server module by Next.js
// The 'config' export for runtime was removed as it's not allowed in 'use server' files.
// The runtime for server actions and server-imported modules is typically Node.js by default in Next.js.
