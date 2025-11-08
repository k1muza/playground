'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Container from '@/components/container';
import { problems } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import TopicBadge from '@/components/topic-badge';
import { Button } from '@/components/ui/button';
import { PlayIcon, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Problem } from '@/lib/data';
import type { PyodideInterface } from 'pyodide';

import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { githubDark } from '@uiw/codemirror-theme-github';

declare global {
  interface Window {
    loadPyodide: () => Promise<PyodideInterface>;
  }
}

type TestResult = {
  input: string;
  expected: string;
  actual: string;
  passed: boolean;
};

function CodeRunner({ problem }: { problem: Problem }) {
  const [code, setCode] = useState(problem.templateCode);
  const [output, setOutput] = useState<TestResult[]>([]);
  const [consoleOutput, setConsoleOutput] = useState('');
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
        setConsoleOutput('Error: Could not load Python interpreter.');
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
      setConsoleOutput('Pyodide is not loaded yet.');
      return;
    }
    setIsLoading(true);
    setOutput([]);
    setConsoleOutput('');

    let capturedOutput = '';
    pyodide.setStdout({
      batched: (text: string) => {
        capturedOutput += text + '\n';
      }
    });
    pyodide.setStderr({
      batched: (text: string) => {
        capturedOutput += text + '\n';
      }
    });

    try {
      await pyodide.loadPackagesFromImports(code);
      const testResults: TestResult[] = [];
      for (const testCase of problem.testCases) {
        const inputStr = JSON.stringify(testCase.input).slice(1, -1);
        const testCode = `
${code}
import json

# The result of the user's function
actual_result = solution(${inputStr})

# Convert Python result to JSON string for comparison
def custom_serializer(obj):
    if isinstance(obj, (list, tuple)):
        # Sort lists of numbers/simple types if order doesn't matter for the problem
        # For Two Sum, the order of indices can vary.
        if "${problem.slug}" == "two-sum":
             return sorted(obj)
    return obj

# For two-sum, we need to sort both actual and expected before comparing
if "${problem.slug}" == "two-sum":
    expected_sorted = sorted(json.loads('${JSON.stringify(testCase.output)}'))
    actual_sorted = sorted(actual_result) if isinstance(actual_result, list) else actual_result
    passed = actual_sorted == expected_sorted
    actual_for_print = actual_sorted
    expected_for_print = expected_sorted
else:
    expected_json = '${JSON.stringify(testCase.output)}'
    actual_json = json.dumps(actual_result, default=custom_serializer)
    passed = actual_json == expected_json
    actual_for_print = actual_result
    expected_for_print = json.loads(expected_json)


print(json.dumps({
    "input": ${JSON.stringify(testCase.input)},
    "expected": expected_for_print,
    "actual": actual_for_print,
    "passed": passed
}))
        `;
        
        // This is a workaround to get the result from the python script
        let caseResult: TestResult | null = null;
        pyodide.setStdout({
            batched: (text: string) => {
                try {
                    const res = JSON.parse(text);
                    caseResult = {
                        input: JSON.stringify(res.input),
                        expected: JSON.stringify(res.expected),
                        actual: JSON.stringify(res.actual),
                        passed: res.passed,
                    };
                } catch {
                   capturedOutput += text + '\n';
                }
            }
        });

        await pyodide.runPythonAsync(testCode);
        if (caseResult) {
            testResults.push(caseResult);
        }
      }
      setOutput(testResults);
      setConsoleOutput(capturedOutput.trim() || '(No console output)');
    } catch (error) {
      const err = error as Error;
      setConsoleOutput(capturedOutput + err.message);
    } finally {
      setIsLoading(false);
      pyodide.setStdout({});
      pyodide.setStderr({});
    }
  };

  const onCodeChange = useCallback((value: string) => {
    setCode(value);
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold font-headline mb-4">Solution</h2>
      <div className="rounded-md border bg-background font-code text-sm overflow-hidden code-editor">
        <CodeMirror
          value={code}
          height="320px"
          extensions={[python()]}
          onChange={onCodeChange}
          theme={githubDark}
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
      {(output.length > 0 || consoleOutput) && (
        <Tabs defaultValue="test-results" className="mt-4">
          <TabsList>
            <TabsTrigger value="test-results">Test Results</TabsTrigger>
            <TabsTrigger value="console">Console</TabsTrigger>
          </TabsList>
          <TabsContent value="test-results">
            <Card>
              <CardContent className="p-4 space-y-4">
                {output.map((result, i) => (
                  <div key={i} className="p-4 rounded-md bg-secondary font-code text-sm">
                    <div className="flex items-center gap-2 mb-2">
                      {result.passed ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      <span className="font-semibold">Test Case {i + 1}</span>
                      <Badge variant={result.passed ? 'secondary' : 'destructive'}>
                        {result.passed ? 'Passed' : 'Failed'}
                      </Badge>
                    </div>
                    <p><strong>Input:</strong> {result.input}</p>
                    <p><strong>Expected:</strong> {result.expected}</p>
                    <p><strong>Actual:</strong> {result.actual}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="console">
            <Card>
              <CardContent className="p-0">
                <pre className="p-4 bg-secondary rounded-md text-sm font-code whitespace-pre-wrap">
                  {consoleOutput}
                </pre>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}


export default function ProblemDetail({ params }: { params: { slug: string } }) {
  const p = problems.find((i) => i.slug === params.slug);
  if (!p) return notFound();

  return (
    <Container className="py-8 lg:py-12">
      <div className="grid gap-12 lg:grid-cols-2">
        <article className="container-prose">
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

          <div className="mt-8 space-y-4">
            {p.testCases.map((tc, i) => (
                <div key={i}>
                    <p className="font-semibold">Example {i + 1}:</p>
                    <pre className="mt-2 p-3 bg-secondary rounded-md text-sm font-code">
                        <strong>Input:</strong> {p.slug === 'two-sum' ? `nums = ${JSON.stringify(tc.input[0])}, target = ${tc.input[1]}` : JSON.stringify(tc.input)
}<br />
                        <strong>Output:</strong> {JSON.stringify(tc.output)}
                    </pre>
                </div>
            ))}
          </div>

          <div className="mt-12 rounded-lg border bg-card p-6">
            <h2 className="text-xl font-semibold font-headline">Hint</h2>
            <p className="mt-2 text-muted-foreground">
              Think about the right data structure for the job. How can you
              optimize lookups?
            </p>
          </div>
        </article>
        
        <div className="code-editor">
          <CodeRunner problem={p} />
        </div>
      </div>
    </Container>
  );
}
