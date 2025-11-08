

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Container from '@/components/container';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import TopicBadge from '@/components/topic-badge';
import { Button } from '@/components/ui/button';
import { PlayIcon, Loader2, CheckCircle, XCircle, Rocket } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Problem, TestCase } from '@/lib/data';
import type { PyodideInterface } from 'pyodide';

import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { githubDark } from '@uiw/codemirror-theme-github';

import { useFirebase, useDoc, useCollection, useMemoFirebase } from '@/firebase';
import { collection, addDoc, doc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

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

function CodeRunner({ problem, testCases }: { problem: Problem, testCases: TestCase[] }) {
  const [code, setCode] = useState(problem.templateCode);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [consoleOutput, setConsoleOutput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRunningCode, setIsRunningCode] = useState(false);
  const [isPyodideLoading, setIsPyodideLoading] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const pyodideRef = useRef<PyodideInterface | null>(null);

  const { firestore, user } = useFirebase();

  const isLoading = isSubmitting || isRunningCode;

  // Set initial code when problem changes
  useEffect(() => {
    setCode(problem.templateCode);
  }, [problem]);

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
        script?.removeEventListener('load', load);
      };
    }
  }, []);

  const runPythonCode = async (codeToRun: string): Promise<[string, any]> => {
    const pyodide = pyodideRef.current;
    if (!pyodide) {
      return ['Pyodide is not loaded yet.', null];
    }
  
    let capturedOutput = '';
    let executionResult: any = null;
  
    const stdoutCallback = (text: string) => {
        capturedOutput += text + '\n';
        // Try to parse the last line as JSON, as that's where our result is.
        const lines = text.trim().split('\n');
        const lastLine = lines[lines.length - 1];
        try {
            executionResult = JSON.parse(lastLine);
        } catch (e) {
            // Not a JSON line, ignore
        }
    };
  
    const stderrCallback = (text: string) => {
        capturedOutput += text + '\n';
    };
  
    pyodide.setStdout({ batched: stdoutCallback });
    pyodide.setStderr({ batched: stderrCallback });
  
    try {
      await pyodide.loadPackagesFromImports(codeToRun);
      await pyodide.runPythonAsync(codeToRun);
    } catch (error) {
      const err = error as Error;
      capturedOutput += err.message;
    } finally {
      // It's important to reset stdout/stderr to avoid memory leaks
      pyodide.setStdout({});
      pyodide.setStderr({});
    }
  
    // Return the full captured output, and the parsed JSON result if any
    return [capturedOutput.trim(), executionResult];
  };

  const handleRunCode = async () => {
    setIsRunningCode(true);
    setTestResults([]);
    setConsoleOutput('');
    const [output] = await runPythonCode(code);
    setConsoleOutput(output || '(No console output)');
    setIsRunningCode(false);
  };
  
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setTestResults([]);
    setConsoleOutput('');

    if (!testCases || testCases.length === 0) {
      setConsoleOutput('No test cases found for this problem.');
      setIsSubmitting(false);
      return;
    }

    try {
      const results: TestResult[] = [];
      let allPassed = true;

      for (const testCase of testCases) {
        // Parse the JSON string from Firestore
        const parsedInput = JSON.parse(testCase.input);
        const parsedOutput = JSON.parse(testCase.output);

        const inputStr = JSON.stringify(parsedInput).slice(1, -1);
        const testCode = `
${code}
import json

# The result of the user's function
actual_result = solution(${inputStr})

# Special sorting for two-sum problem
if "${problem.slug}" == "two-sum":
    expected_sorted = sorted(json.loads('${JSON.stringify(parsedOutput)}'))
    actual_sorted = sorted(actual_result) if isinstance(actual_result, list) else actual_result
    passed = actual_sorted == expected_sorted
    actual_for_print = actual_sorted
    expected_for_print = expected_sorted
else:
    expected_json = '${JSON.stringify(parsedOutput)}'
    try:
        # Compare JSON strings for deep equality
        actual_json = json.dumps(actual_result, sort_keys=True)
        passed = actual_json == json.dumps(json.loads(expected_json), sort_keys=True)
        actual_for_print = actual_result
        expected_for_print = json.loads(expected_json)
    except Exception as e:
        passed = False
        actual_for_print = str(e)
        expected_for_print = json.loads(expected_json)


# This JSON result is what we'll capture
print(json.dumps({
    "input": ${JSON.stringify(parsedInput)},
    "expected": expected_for_print,
    "actual": actual_for_print,
    "passed": passed
}))
        `;
        
        const [capturedOutput, resultJson] = await runPythonCode(testCode);

        if (resultJson) {
            results.push({
                input: JSON.stringify(resultJson.input),
                expected: JSON.stringify(resultJson.expected),
                actual: JSON.stringify(resultJson.actual),
                passed: resultJson.passed,
            });
            if (!resultJson.passed) {
              allPassed = false;
            }
        } else {
            allPassed = false;
            // Handle cases where the test code itself failed to run
             results.push({
                input: JSON.stringify(parsedInput),
                expected: JSON.stringify(parsedOutput),
                actual: `Execution Error: ${capturedOutput || 'Unknown error'}`,
                passed: false,
            });
        }
      }
      setTestResults(results);

      if (allPassed) {
        setShowSuccessModal(true);
        if (user && firestore) {
          try {
            const solutionsRef = collection(firestore, 'users', user.uid, 'solutions');
            await addDoc(solutionsRef, {
              problemId: problem.slug,
              userId: user.uid,
              solutionCode: code,
              submissionDate: new Date().toISOString(),
              isCorrect: true,
            });
          } catch (e) {
            console.error("Error saving solution to Firestore:", e);
            // Optionally notify the user that saving failed
          }
        }
      }

    } catch (error) {
      const err = error as Error;
      setConsoleOutput(err.message);
    } finally {
      setIsSubmitting(false);
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
      <div className="mt-4 flex gap-2">
        <Button onClick={handleRunCode} disabled={isLoading || isPyodideLoading}>
          {isPyodideLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : isRunningCode ? (
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
        <Button onClick={handleSubmit} disabled={isLoading || isPyodideLoading || !user} variant="secondary">
          {isPyodideLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Rocket className="mr-2 h-4 w-4" />
              Submit
            </>
          )}
        </Button>
      </div>

      {(testResults.length > 0 || consoleOutput) && (
        <Tabs defaultValue={testResults.length > 0 ? 'test-results' : 'console'} className="mt-4">
          <TabsList>
            <TabsTrigger value="test-results" disabled={testResults.length === 0}>Test Results</TabsTrigger>
            <TabsTrigger value="console" disabled={!consoleOutput}>Console</TabsTrigger>
          </TabsList>
          <TabsContent value="test-results">
            <Card>
              <CardContent className="p-4 space-y-4">
                {testResults.map((result, i) => (
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

      <AlertDialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Congratulations!</AlertDialogTitle>
            <AlertDialogDescription>
              You've passed all the test cases. Your solution has been saved.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowSuccessModal(false)}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function ProblemDetailSkeleton() {
  return (
    <div className="grid gap-12 lg:grid-cols-2">
      <article className="container-prose">
        <div className="flex items-center gap-4 mb-4">
          <Skeleton className="h-6 w-16" />
          <div className="flex flex-wrap gap-1.5">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-20" />
          </div>
        </div>
        <Skeleton className="h-10 w-3/4 mb-4" />
        <hr className="my-6" />
        <div className="space-y-4">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-5/6" />
          <Skeleton className="h-6 w-full" />
        </div>
      </article>
      <div className="sticky top-20 h-full">
        <Skeleton className="h-[320px] w-full" />
        <div className="mt-4 flex gap-2">
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-28" />
        </div>
      </div>
    </div>
  );
}

function TestCasesDisplay({ slug }: { slug: string }) {
  const { firestore } = useFirebase();

  const testCasesQuery = useMemoFirebase(
    () => (firestore ? collection(firestore, 'problems', slug, 'testCases') : null),
    [firestore, slug]
  );
  const { data: testCases, isLoading } = useCollection<TestCase>(testCasesQuery);

  if (isLoading) {
    return (
      <div className="mt-8 space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (!testCases) return null;

  return (
    <div className="mt-8 space-y-4">
      {testCases.map((tc, i) => {
        let parsedInput;
        try {
          parsedInput = JSON.parse(tc.input);
        } catch {
          parsedInput = tc.input;
        }
        
        return (
          <div key={tc.id}>
              <p className="font-semibold">Example {i + 1}:</p>
              <pre className="mt-2 p-3 bg-secondary rounded-md text-sm font-code">
                  <strong>Input:</strong> {slug === 'two-sum' && Array.isArray(parsedInput) ? `nums = ${JSON.stringify(parsedInput[0])}, target = ${parsedInput[1]}` : JSON.stringify(parsedInput)
}<br />
                  <strong>Output:</strong> {tc.output}
              </pre>
          </div>
        );
      })}
    </div>
  );
}


export default function ProblemDetail({ params: { slug } }: { params: { slug: string } }) {
  const { firestore } = useFirebase();

  const problemRef = useMemoFirebase(
    () => (firestore ? doc(firestore, 'problems', slug) : null),
    [firestore, slug]
  );
  const { data: p, isLoading: isProblemLoading } = useDoc<Problem>(problemRef);
  
  const testCasesQuery = useMemoFirebase(
    () => (firestore ? collection(firestore, 'problems', slug, 'testCases') : null),
    [firestore, slug]
  );
  const { data: testCases, isLoading: areTestCasesLoading } = useCollection<TestCase>(testCasesQuery);


  if (isProblemLoading || areTestCasesLoading) {
    return (
      <Container className="py-8 lg:py-12">
        <ProblemDetailSkeleton />
      </Container>
    );
  }

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
              {p.tags.map((t: string) => (
                <TopicBadge key={t} label={t} />
              ))}
            </div>
          </div>
          <h1 className="text-4xl font-bold font-headline">{p.title}</h1>
          <hr className="my-6" />
          <p className="font-code text-sm whitespace-pre-wrap">{p.body}</p>

          <TestCasesDisplay slug={p.slug} />

          <div className="mt-12 rounded-lg border bg-card p-6">
            <h2 className="text-xl font-semibold font-headline">Hint</h2>
            <p className="mt-2 text-muted-foreground">
              Think about the right data structure for the job. How can you
              optimize lookups?
            </p>
          </div>
        </article>
        
        <div className="sticky top-20 h-full">
          {testCases && <CodeRunner problem={p} testCases={testCases}/>}
        </div>
      </div>
    </Container>
  );
}

