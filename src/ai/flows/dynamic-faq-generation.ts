/**
 * @fileOverview Dynamic FAQ generation flow using Genkit.
 *
 * - generateFAQAnswerFlow - A flow that generates answers to FAQs about SD Auto services.
 * - FAQInput - The input type for the generateFAQAnswer function.
 * - FAQOutput - The return type for the generateFAQAnswer function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FAQInputSchema = z.object({
  question: z.string().describe('The question to be answered.'),
  context: z.string().describe('Context about SD Auto services.'),
});
export type FAQInput = z.infer<typeof FAQInputSchema>;

const FAQOutputSchema = z.object({
  answer: z.string().describe('The answer to the question.'),
});
export type FAQOutput = z.infer<typeof FAQOutputSchema>;

const faqPrompt = ai.definePrompt({
  name: 'faqPrompt',
  input: {schema: FAQInputSchema},
  output: {schema: FAQOutputSchema},
  prompt: `You are an AI assistant providing answers to frequently asked questions about SD Auto services.
  Use the context provided to answer the question accurately and helpfully.

  Context: {{{context}}}

  Question: {{{question}}}
  Answer:`, // Keep it concise, since this is an FAQ.
});

export const generateFAQAnswerFlow = ai.defineFlow(
  {
    name: 'generateFAQAnswerFlow',
    inputSchema: FAQInputSchema,
    outputSchema: FAQOutputSchema,
  },
  async input => {
    const {output} = await faqPrompt(input);
    return output!;
  }
);
