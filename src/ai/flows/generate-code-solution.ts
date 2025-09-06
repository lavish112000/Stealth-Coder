'use server';

/**
 * @fileOverview Generates code solutions for coding problems using the Gemini API.
 *
 * - generateCodeSolution - A function that handles generating code solutions.
 * - GenerateCodeSolutionInput - The input type for the generateCodeSolution function.
 * - GenerateCodeSolutionOutput - The return type for the generateCodeSolution function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCodeSolutionInputSchema = z.object({
  problemDescription: z.string().describe('The description of the coding problem.'),
  language: z.string().optional().describe('The programming language to use for the solution.'),
});
export type GenerateCodeSolutionInput = z.infer<typeof GenerateCodeSolutionInputSchema>;

const GenerateCodeSolutionOutputSchema = z.object({
  highLevelExplanation: z.string().describe('A high-level explanation of the solution approach.'),
  code: z.string().describe('The complete code solution.'),
  lineByLineBreakdown: z.string().describe('A line-by-line breakdown of the code with comments.'),
});
export type GenerateCodeSolutionOutput = z.infer<typeof GenerateCodeSolutionOutputSchema>;

export async function generateCodeSolution(input: GenerateCodeSolutionInput): Promise<GenerateCodeSolutionOutput> {
  return generateCodeSolutionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCodeSolutionPrompt',
  input: {schema: GenerateCodeSolutionInputSchema},
  output: {schema: GenerateCodeSolutionOutputSchema},
  prompt: `You are an AI coding assistant that helps with interview questions by providing complete, correct solutions.

  Problem Description: {{{problemDescription}}}

  {{#if language}}Language: {{{language}}}{{/if}}

  Provide a high-level explanation of the approach, the complete code solution, and a line-by-line breakdown with comments explaining the logic.

  High-Level Explanation:
  Code:
  Line-by-Line Breakdown:`,
});

const generateCodeSolutionFlow = ai.defineFlow(
  {
    name: 'generateCodeSolutionFlow',
    inputSchema: GenerateCodeSolutionInputSchema,
    outputSchema: GenerateCodeSolutionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
