
'use client';

import { useTransition } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProblemSchema, type Problem } from '@/lib/data';
import Container from '@/components/container';
import { useFirebase } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { PlusCircle, Trash2, Database } from 'lucide-react';
import { seedProblems } from '@/actions/seed-problems';

// We use the same schema for the form as for the Firestore data,
// with test cases as strings.
const FormSchema = ProblemSchema.omit({
  tags: true,
}).extend({
  tags: z.string().min(1, 'At least one tag is required.'),
});

type FormValues = z.infer<typeof FormSchema>;

function Seeder() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleSeed = () => {
    startTransition(async () => {
      try {
        const result = await seedProblems();
        if (result.success) {
          toast({
            title: 'Success!',
            description: result.message,
          });
        } else {
          throw new Error(result.message);
        }
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Seeding Failed',
          description: error instanceof Error ? error.message : 'An unknown error occurred.',
        });
      }
    });
  };

  return (
    <div className="mb-6 flex items-center justify-between rounded-lg border p-4">
      <div>
        <h2 className="font-semibold">Seed Database</h2>
        <p className="text-sm text-muted-foreground">
          Populate the Firestore `problems` collection with the default set of problems.
        </p>
      </div>
      <Button onClick={handleSeed} disabled={isPending} variant="outline">
        <Database className="mr-2 h-4 w-4" />
        {isPending ? 'Seeding...' : 'Seed Problems'}
      </Button>
    </div>
  );
}

export default function AddProblemPage() {
  const { firestore } = useFirebase();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      slug: '',
      title: '',
      summary: '',
      difficulty: 'Easy',
      tags: '',
      body: '',
      templateCode: 'def solution():\n  pass',
      testCases: [{ input: '[]', output: 'null' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'testCases',
  });

  const onSubmit = async (data: FormValues) => {
    if (!firestore) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Firestore is not available. Cannot save problem.',
      });
      return;
    }

    try {
      // Form data is already in the correct stringified format for Firestore.
      // We just need to split the tags string into an array.
      const problemData = {
        ...data,
        tags: data.tags.split(',').map((tag) => tag.trim()),
      };

      // We still validate against the Zod schema to be safe.
      ProblemSchema.parse(problemData);

      const problemRef = doc(firestore, 'problems', problemData.slug);
      await setDoc(problemRef, problemData);

      toast({
        title: 'Success!',
        description: `Problem "${problemData.title}" has been saved.`,
      });

      router.push(`/problems/${problemData.slug}`);
    } catch (error) {
      console.error('Error saving problem:', error);
      let description = 'An unexpected error occurred.';
      if (error instanceof z.ZodError) {
        description = 'Data validation failed. Check the console for details.';
      } else if (error instanceof Error) {
        description = error.message;
      }
      toast({
        variant: 'destructive',
        title: 'Failed to Save Problem',
        description,
      });
    }
  };

  return (
    <Container className="py-10">
      <h1 className="text-3xl font-bold font-headline mb-6">Admin</h1>
      <Seeder />
      <h2 className="text-2xl font-bold font-headline mb-4">Add New Problem</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Problem Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Two Sum" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., two-sum" {...field} />
                    </FormControl>
                    <FormDescription>
                      URL-friendly identifier for the problem.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="summary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Summary</FormLabel>
                    <FormControl>
                      <Textarea placeholder="A brief one-sentence summary of the problem." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="body"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Problem Body</FormLabel>
                    <FormControl>
                      <Textarea placeholder="The full problem description. You can use markdown." rows={8} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="difficulty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Difficulty</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a difficulty" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Easy">Easy</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="Hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Array, Hash Map, Two Pointers" {...field} />
                      </FormControl>
                      <FormDescription>
                        Comma-separated list of tags.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Code & Tests</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="templateCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Template Code</FormLabel>
                    <FormControl>
                      <Textarea placeholder="def solution():" rows={10} className="font-code" {...field} />
                    </FormControl>
                     <FormDescription>
                        The boilerplate Python code provided to the user.
                      </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <FormLabel>Test Cases</FormLabel>
                <div className="space-y-4 mt-2">
                  {fields.map((field, index) => (
                    <Card key={field.id} className="p-4 bg-secondary">
                       <div className="flex justify-between items-center mb-2">
                        <p className="font-medium">Test Case {index + 1}</p>
                         <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => remove(index)}
                          disabled={fields.length <= 1}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`testCases.${index}.input`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Input (JSON)</FormLabel>
                            <FormControl>
                              <Textarea placeholder='e.g., "[[1, 2, 3], 5]"' className="font-code" {...field} />
                            </FormControl>
                            <FormDescription>A JSON string representing an array of arguments.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`testCases.${index}.output`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Expected Output (JSON)</FormLabel>
                            <FormControl>
                              <Textarea placeholder='e.g., "[0, 2]"' className="font-code" {...field} />
                            </FormControl>
                            <FormDescription>The expected JSON return value.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      </div>
                    </Card>
                  ))}
                </div>
                 <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ input: '[]', output: 'null' })}
                  className="mt-4"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Test Case
                </Button>
              </div>

            </CardContent>
          </Card>

          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Saving...' : 'Save Problem'}
          </Button>
        </form>
      </Form>
    </Container>
  );
}
