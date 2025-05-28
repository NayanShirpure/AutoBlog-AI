import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [googleAI()],
  // Using Gemini 2.0 Flash for fast and efficient text generation.
  model: 'googleai/gemini-2.0-flash', 
});
