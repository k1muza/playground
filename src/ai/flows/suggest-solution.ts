'use server';
/**
 * @fileOverview A Genkit flow to suggest a more elegant solution to a coding problem.
 *
 * - suggestSolution - A function that takes a problem description and user's code and returns a suggestion.
 * - SuggestSolutionInput - The input type for the suggestSolution function.
 * - SuggestSolutionOutput - The return type for the suggestSolution function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SuggestSolutionInputSchema = z.object({
  problemBody: z.string().describe('The full description of the coding problem.'),
  userCode: z.string().describe("The user's submitted code for the problem."),
});
export type SuggestSolutionInput = z.infer<typeof SuggestSolutionInputSchema>;

const SuggestSolutionOutputSchema = z.object({
  suggestion: z
    .string()
    .describe('A more elegant or optimized solution, in Markdown format. This should include the code and an explanation of why it is better.'),
});
export type SuggestSolutionOutput = z.infer<
  typeof SuggestSolutionOutputSchema
>;

export async function suggestSolution(input: SuggestSolutionInput): Promise<SuggestSolutionOutput> {
  return suggestSolutionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestSolutionPrompt',
  input: { schema: SuggestSolutionInputSchema },
  output: { schema: SuggestSolutionOutputSchema },
  prompt: `You are an expert programmer and code reviewer. A user has submitted a solution to a coding problem.
Your task is to provide a more elegant or optimized solution and explain why it's better.

The problem description is as follows:
---
{{{problemBody}}}
---

The user's submitted code is:
---
'''python
{{{userCode}}}
'''
---

Please provide a more elegant or efficient solution. Your response should be in Markdown format.
Include the improved code in a Python code block, and provide a clear, concise explanation of the improvements (e.g., better time/space complexity, improved readability, more idiomatic Python).`,
});

const suggestSolutionFlow = ai.defineFlow(
  {
    name: 'suggestSolutionFlow',
    inputSchema: SuggestSolutionInputSchema,
    outputSchema: SuggestSolutionOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
