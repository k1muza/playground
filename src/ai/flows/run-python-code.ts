'use server';

/**
 * @fileOverview This file defines a Genkit flow to simulate running Python code.
 *
 * - runPythonCode - A function that takes Python code as input and returns the simulated output.
 * - RunPythonCodeInput - The input type for the runPythonCode function.
 * - RunPythonCodeOutput - The return type for the runPythonCode function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const RunPythonCodeInputSchema = z.object({
  code: z.string().describe('The Python code to execute.'),
});
export type RunPythonCodeInput = z.infer<typeof RunPythonCodeInputSchema>;

const RunPythonCodeOutputSchema = z.object({
  output: z
    .string()
    .describe('The simulated stdout or error message from the code execution.'),
});
export type RunPythonCodeOutput = z.infer<typeof RunPythonCodeOutputSchema>;

export async function runPythonCode(
  input: RunPythonCodeInput
): Promise<RunPythonCodeOutput> {
  return runPythonCodeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'runPythonCodePrompt',
  input: { schema: RunPythonCodeInputSchema },
  output: { schema: RunPythonCodeOutputSchema },
  prompt: `You are a Python interpreter. Execute the following code and return its standard output. If the code produces an error, return the error message. Be realistic. Do not add any commentary.

Code:
'''python
{{code}}
'''`,
});

const runPythonCodeFlow = ai.defineFlow(
  {
    name: 'runPythonCodeFlow',
    inputSchema: RunPythonCodeInputSchema,
    outputSchema: RunPythonCodeOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
