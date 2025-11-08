
'use client';

import { useState } from 'react';
import Container from '@/components/container';
import { problems } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import TopicBadge from '@/components/topic-badge';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { PlayIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Problem } from '@/lib/data';

function CodeRunner({ problem }: { problem: Problem }) {
  const [code, setCode] = useState(
    `# Write your solution for "${problem.title}" here.\n`
  );
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRunCode = async () => {
    setIsLoading(true);
    setOutput('');
    try {
      const response = await fetch('/api/run-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      if (!response.ok) {
        throw new Error('Failed to run code');
      }
      const result = await response.json();
      setOutput(result.output);
    } catch (error) {
      setOutput(
        error instanceof Error ? error.message : 'An unknown error occurred.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold font-headline mb-4">Solution</h2>
      <Textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter your Python code here"
        className="font-code text-sm h-64 bg-background"
      />
      <Button onClick={handleRunCode} disabled={isLoading} className="mt-4">
        <PlayIcon className="mr-2 h-4 w-4" />
        {isLoading ? 'Running...' : 'Run Code'}
      </Button>
      {output && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Output</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="p-4 bg-secondary rounded-md text-sm font-code whitespace-pre-wrap">
              {output}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


export default function ProblemDetail({ params }: { params: { slug: string } }) {
  const p = problems.find((i) => i.slug === params.slug);
  if (!p) return notFound();

  return (
    <Container className="py-8 lg:py-12">
      <article className="container-prose mx-auto">
        <div className="flex items-center gap-4 mb-4">
          <Badge
            variant={
              p.difficulty === 'Easy'
                ? 'secondary'
                : p.difficulty === 'Medium'
                ? 'default'
                : 'destructive'
            }
            className={
              p.difficulty === 'Medium'
                ? 'bg-amber-500 hover:bg-amber-500/80'
                : ''
            }
          >
            {p.difficulty}
          </Badge>
          <div className="flex flex-wrap gap-1.5">
            {p.tags.map((t) => (
              <TopicBadge key={t} label={t} />
            ))}
          </div>
        </div>
        <h1 className="text-4xl font-bold font-headline">{p.title}</h1>
        <hr className="my-6" />
        <p className="font-code text-sm whitespace-pre-wrap">{p.body}</p>
        
        <CodeRunner problem={p} />

        <div className="mt-12 rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold font-headline">Hint</h2>
          <p className="mt-2 text-muted-foreground">
            Think about the right data structure for the job. How can you
            optimize lookups?
          </p>
        </div>
      </article>
    </Container>
  );
}
