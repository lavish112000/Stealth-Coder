'use server';

/**
 * @fileOverview AI Code Generation Flow for Stealth Coder
 *
 * This module handles the core AI functionality of Stealth Coder by integrating
 * with Google Gemini AI to generate code solutions for programming problems.
 * It processes natural language problem descriptions and returns structured
 * code solutions with explanations.
 *
 * Key Features:
 * - Natural language problem understanding
 * - Multi-language code generation
 * - Structured output with explanations
 * - Server-side processing for security
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

/**
 * Input Schema for Code Generation
 * Defines the structure of input data for the AI code generation flow
 */
const GenerateCodeSolutionInputSchema = z.object({
  // Natural language description of the coding problem
  problemDescription: z.string().describe('The description of the coding problem.'),
  // Optional programming language specification
  language: z.string().optional().describe('The programming language to use for the solution.'),
});

/**
 * Type inference from the input schema
 * Provides TypeScript type safety for function parameters
 */
export type GenerateCodeSolutionInput = z.infer<typeof GenerateCodeSolutionInputSchema>;

/**
 * Output Schema for Code Generation
 * Defines the structure of the AI-generated response
 */
const GenerateCodeSolutionOutputSchema = z.object({
  // High-level overview of the solution approach
  highLevelExplanation: z.string().describe('A high-level explanation of the solution approach.'),
  // Complete, runnable code solution
  code: z.string().describe('The complete code solution.'),
  // Detailed line-by-line code explanation
  lineByLineBreakdown: z.string().describe('A line-by-line breakdown of the code with comments.'),
});

/**
 * Type inference from the output schema
 * Provides TypeScript type safety for return values
 */
export type GenerateCodeSolutionOutput = z.infer<typeof GenerateCodeSolutionOutputSchema>;

/**
 * Public Interface Function
 * Main entry point for code generation functionality
 * Wraps the internal flow for external consumption
 *
 * @param input - The problem description and optional language preference
 * @returns Promise resolving to structured code solution
 */
export async function generateCodeSolution(input: GenerateCodeSolutionInput): Promise<GenerateCodeSolutionOutput> {
  return generateCodeSolutionFlow(input);
}

/**
 * AI Prompt Definition
 * Configures the Google Gemini AI model with specific instructions
 * for generating coding interview solutions
 */
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

/**
 * AI Flow Definition
 * Defines the complete workflow for processing code generation requests
 * Orchestrates the prompt execution and response handling
 */
const generateCodeSolutionFlow = ai.defineFlow(
  {
    name: 'generateCodeSolutionFlow',
    inputSchema: GenerateCodeSolutionInputSchema,
    outputSchema: GenerateCodeSolutionOutputSchema,
  },
  /**
   * Flow Execution Function
   * Processes the input through the AI pipeline
   *
   * @param input - Structured input data
   * @returns Processed AI response with guaranteed output
   */
  async input => {
    // Execute the AI prompt with input data
    const {output} = await prompt(input);
    // Return the structured output (non-null assertion due to schema validation)
    return output!;
  }
);
