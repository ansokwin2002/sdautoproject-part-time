import { appRoute } from '@genkit-ai/next';
import { generateFAQAnswerFlow } from '@/ai/flows/dynamic-faq-generation';

export const POST = appRoute(generateFAQAnswerFlow);
