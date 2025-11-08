'use server';

/**
 * @fileOverview This file defines a Genkit flow to generate a dynamic table of contents for a course using AI.
 *
 * - generateCourseToc - A function that takes course content as input and returns a table of contents.
 * - GenerateCourseTocInput - The input type for the generateCourseToc function.
 * - GenerateCourseTocOutput - The return type for the generateCourseToc function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCourseTocInputSchema = z.object({
  courseContent: z.string().describe('The complete content of the course.'),
});
export type GenerateCourseTocInput = z.infer<typeof GenerateCourseTocInputSchema>;

const GenerateCourseTocOutputSchema = z.object({
  tableOfContents: z.string().describe('The generated table of contents for the course.'),
});
export type GenerateCourseTocOutput = z.infer<typeof GenerateCourseTocOutputSchema>;

export async function generateCourseToc(input: GenerateCourseTocInput): Promise<GenerateCourseTocOutput> {
  return generateCourseTocFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCourseTocPrompt',
  input: {schema: GenerateCourseTocInputSchema},
  output: {schema: GenerateCourseTocOutputSchema},
  prompt: `You are an AI assistant designed to generate a table of contents for a given course content.

  Given the following course content, create a detailed and well-structured table of contents that allows learners to easily navigate through the lessons and understand the course structure.

  Course Content:
  {{courseContent}}

  Table of Contents:`,
});

const generateCourseTocFlow = ai.defineFlow(
  {
    name: 'generateCourseTocFlow',
    inputSchema: GenerateCourseTocInputSchema,
    outputSchema: GenerateCourseTocOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
