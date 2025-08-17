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
  problemDescription: z.string().describe('The description of the coding problem.'),
  code: z.string().describe('The code to provide feedback on.'),
});
export type GetCodeFeedbackInput = z.infer<typeof GetCodeFeedbackInputSchema>;

const GetCodeFeedbackOutputSchema = z.object({
  highLevelExplanation: z.string().describe('A high-level explanation of the code solution.'),
  lineByLineBreakdown: z.string().describe('A line-by-line breakdown of the code.'),
});
export type GetCodeFeedbackOutput = z.infer<typeof GetCodeFeedbackOutputSchema>;

export async function getCodeFeedback(input: GetCodeFeedbackInput): Promise<GetCodeFeedbackOutput> {
  return getCodeFeedbackFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getCodeFeedbackPrompt',
  input: {schema: GetCodeFeedbackInputSchema},
  output: {schema: GetCodeFeedbackOutputSchema},
  prompt: `You are an AI code assistant that helps users understand and explain a solution to a coding problem.

  Problem Description: {{{problemDescription}}}

  Code: {{{code}}}

  Provide a high-level explanation of the code's approach and then a line-by-line breakdown.
  High-Level Explanation:
  Line-by-Line Breakdown:`,
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
