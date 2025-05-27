import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-blog-posts.ts';
import '@/ai/flows/generate-blog-post.ts';
import '@/ai/flows/generate-blog-image-flow.ts'; // Added new image generation flow
