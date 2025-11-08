'use client';

import { useState, useEffect, useRef } from 'react';
import Container from '@/components/container';
import { problems } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import TopicBadge from '@/components/topic-badge';
import { Button } from '@/components/ui/button';
import { PlayIcon, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Problem } from '@/lib/data';
import type { PyodideInterface } from 'pyodide';

import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-python';


declare global {
  interface Window {
    loadPyodide: () => Promise<PyodideInterface>;
  }
}

function CodeRunner({ problem }: { problem: Problem }) {
  const [code, setCode] = useState(
    `# Write your solution for "${problem.title}" here.\ndef solution():\n  # Your code here\n  print("Hello, Python!")\n\nsolution()`
  );
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPyodideLoading, setIsPyodideLoading] = useState(true);
  const pyodideRef = useRef<PyodideInterface | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const pyodide = await window.loadPyodide();
        pyodideRef.current = pyodide;
        setIsPyodideLoading(false);
      } catch (error) {
        console.error('Failed to load Pyodide:', error);
        setOutput('Error: Could not load Python interpreter.');
        setIsPyodideLoading(false);
      }
    };
    
    if (window.loadPyodide) {
        load();
    } else {
        const script = document.querySelector('script[src*="pyodide.js"]');
        script?.addEventListener('load', load);
        return () => {
            script?.removeEventListener('load', load)
        }
    }
  }, []);

  const handleRunCode = async () => {
    const pyodide = pyodideRef.current;
    if (!pyodide) {
      setOutput('Pyodide is not loaded yet.');
      return;
    }
    setIsLoading(true);
    let capturedOutput = '';
    
    const stdoutCallback = (text: string) => {
        capturedOutput += text + '\n';
    }

    pyodide.setStdout({ batched: stdoutCallback });
    pyodide.setStderr({ batched: stdoutCallback });

    try {
      await pyodide.loadPackagesFromImports(code);
      await pyodide.runPythonAsync(code);
      setOutput(capturedOutput.trim() || '(No output)');
    } catch (error) {
      const err = error as Error;
      setOutput(capturedOutput + err.message);
    } finally {
      setIsLoading(false);
      pyodide.setStdout({});
      pyodide.setStderr({});
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold font-headline mb-4">Solution</h2>
        <div className="rounded-md border bg-background font-code text-sm p-4 h-80 overflow-auto code-editor">
            <Editor
                value={code}
                onValueChange={code => setCode(code)}
                highlight={code => highlight(code, languages.python, 'python')}
                padding={0}
                style={{
                    fontFamily: 'var(--font-code)',
                    fontSize: '0.875rem',
                }}
            />
        </div>
      <Button onClick={handleRunCode} disabled={isLoading || isPyodideLoading} className="mt-4">
        {isPyodideLoading ? (
            <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading Python...
            </>
        ) : isLoading ? (
            <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Running...
            </>
        ) : (
            <>
                <PlayIcon className="mr-2 h-4 w-4" />
                Run Code
            </>
        )}
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
