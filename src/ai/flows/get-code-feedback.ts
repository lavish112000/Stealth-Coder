'use server';

/**
 * @fileOverview Provides real-time feedback and suggestions on code from the Gemini API.
 *
 * - getCodeFeedback - A function that handles the code feedback process.
 * - GetCodeFeedbackInput - The input type for the getCodeFeedback function.
 * - GetCodeFeedbackOutput - The return type for the getCodeFeedback function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetCodeFeedbackInputSchema = z.object({
  code: z.string().describe('The code to provide feedback on.'),
  problemDescription: z.string().describe('The description of the coding problem.'),
});
export type GetCodeFeedbackInput = z.infer<typeof GetCodeFeedbackInputSchema>;

const GetCodeFeedbackOutputSchema = z.object({
  feedback: z.string().describe('The feedback on the code.'),
  suggestions: z.string().describe('Suggestions for improving the code.'),
});
export type GetCodeFeedbackOutput = z.infer<typeof GetCodeFeedbackOutputSchema>;

export async function getCodeFeedback(input: GetCodeFeedbackInput): Promise<GetCodeFeedbackOutput> {
  return getCodeFeedbackFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getCodeFeedbackPrompt',
  input: {schema: GetCodeFeedbackInputSchema},
  output: {schema: GetCodeFeedbackOutputSchema},
  prompt: `You are an AI code assistant that provides feedback and suggestions on code.

  Problem Description: {{{problemDescription}}}

  Code: {{{code}}}

  Provide feedback on the code and suggestions for improving it.
  Feedback:
  Suggestions:`,
});

const getCodeFeedbackFlow = ai.defineFlow(
  {
    name: 'getCodeFeedbackFlow',
    inputSchema: GetCodeFeedbackInputSchema,
    outputSchema: GetCodeFeedbackOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
