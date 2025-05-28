import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [googleAI()],
  // Using Gemini 1.5 Pro for higher quality text generation.
  // This may be slower and potentially more expensive than Flash models.
  model: 'googleai/gemini-1.5-pro-latest', 
});
