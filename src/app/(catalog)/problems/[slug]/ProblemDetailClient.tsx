
"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Container from "@/components/container";
import { Badge } from "@/components/ui/badge";
import TopicBadge from "@/components/topic-badge";
import { Button } from "@/components/ui/button";
import { PlayIcon, Loader2, CheckCircle, XCircle, Rocket, Info, ArrowRight, Wand2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Problem, TestCase, Submission, Category } from "@/lib/data";
import { categories } from "@/lib/data";
import type { PyodideInterface } from "pyodide";
import ReactMarkdown from "react-markdown";

import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { githubDark } from "@uiw/codemirror-theme-github";

import { useFirebase, useDoc, useCollection, useMemoFirebase } from "@/firebase";
import { collection, addDoc, doc, query, where, orderBy, limit } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import Confetti from "react-confetti";
import { suggestSolution } from "@/ai/flows/suggest-solution";

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

// Sort categories once by the 'order' property
const sortedCategories = [...categories].sort((a, b) => a.order - b.order);


function ProblemDetailSkeleton() {
  return (
    <div className="grid h-full grid-cols-1 gap-4 overflow-hidden p-4 md:grid-cols-2">
      <div className="h-full overflow-y-auto">
        <Skeleton className="h-6 w-16 mb-4" />
        <Skeleton className="h-10 w-3/4 mb-4" />
        <hr className="my-6" />
        <div className="space-y-4">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-5/6" />
          <Skeleton className="h-6 w-full" />
        </div>
      </div>
      <div className="h-full overflow-y-auto">
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
    () => (firestore ? collection(firestore, "problems", slug, "testCases") : null),
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
        let parsedInput: unknown;
        try {
          parsedInput = JSON.parse(tc.input);
        } catch {
          parsedInput = tc.input;
        }

        let parsedOutput: unknown;
        try {
          parsedOutput = JSON.parse(tc.output);
        } catch {
          parsedOutput = tc.output;
        }


        return (
          <div key={tc.id}>
            <p className="font-semibold">Example {i + 1}:</p>
            <pre className="mt-2 p-3 bg-secondary rounded-md text-sm font-code">
              <strong>Input:</strong>{" "}
              {slug === "two-sum" && Array.isArray(parsedInput)
                ? `nums = ${JSON.stringify((parsedInput as any[])[0])}, target = ${(parsedInput as any[])[1]}`
                : JSON.stringify(parsedInput)}
              {"\n"}
              <strong>Output:</strong> {JSON.stringify(parsedOutput)}
            </pre>
          </div>
        );
      })}
    </div>
  );
}

function AiSuggestion({
  problem,
  userCode,
}: {
  problem: Problem;
  userCode: string;
}) {
  const [suggestion, setSuggestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetSuggestion = async () => {
    setIsLoading(true);
    setError(null);
    setSuggestion('');
    try {
      const result = await suggestSolution({
        problemBody: problem.body,
        userCode: userCode,
      });
      setSuggestion(result.suggestion);
    } catch (e) {
      console.error('AI suggestion failed:', e);
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-primary" />
            AI Suggestion
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!suggestion && !isLoading && !error && (
            <>
              <p className="text-sm text-muted-foreground mb-4">
                Get an AI-powered suggestion for a more elegant or efficient solution.
              </p>
              <Button onClick={handleGetSuggestion} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Get Suggestion'
                )}
              </Button>
            </>
          )}

          {isLoading && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <p>Generating suggestion...</p>
            </div>
          )}

          {error && (
            <div className="text-destructive text-sm">
              <p>Sorry, something went wrong:</p>
              <pre className="mt-2 whitespace-pre-wrap font-code">{error}</pre>
            </div>
          )}

          {suggestion && (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown
                 components={{
                  code: ({node, ...props}) => <code className="font-code" {...props} />,
                }}
              >
                {suggestion}
              </ReactMarkdown>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function CodeRunner({
  problem,
  testCases,
  slug,
  nextProblemSlug,
}: {
  problem: Problem;
  testCases: TestCase[];
  slug: string;
  nextProblemSlug: string | null;
}) {
  const router = useRouter();
  const [code, setCode] = useState(problem.templateCode);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [consoleOutput, setConsoleOutput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRunningCode, setIsRunningCode] = useState(false);
  const [isPyodideLoading, setIsPyodideLoading] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const pyodideRef = useRef<PyodideInterface | null>(null);

  const { firestore, user } = useFirebase();
  const isLoading = isSubmitting || isRunningCode;
  
  // Query for the user's most recent submission to this problem
  const latestSubmissionQuery = useMemoFirebase(
    () =>
      user && firestore
        ? query(
            collection(firestore, "problems", slug, "submissions"),
            where("userId", "==", user.uid),
            orderBy("submittedAt", "desc"),
            limit(1)
          )
        : null,
    [firestore, user, slug]
  );
  const { data: latestSubmissionData, isLoading: isSubmissionLoading } = useCollection<Submission>(latestSubmissionQuery);

  const hasSubmissions = useMemo(() => (latestSubmissionData?.length ?? 0) > 0, [latestSubmissionData]);

  useEffect(() => {
    if (!isSubmissionLoading) {
      if (latestSubmissionData && latestSubmissionData.length > 0) {
        setCode(latestSubmissionData[0].code);
      } else {
        setCode(problem.templateCode);
      }
    }
  }, [latestSubmissionData, isSubmissionLoading, problem.templateCode]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const pyodide = await window.loadPyodide();
        if (cancelled) return;
        pyodideRef.current = pyodide;
        setIsPyodideLoading(false);
      } catch (error) {
        if (cancelled) return;
        console.error("Failed to load Pyodide:", error);
        setConsoleOutput("Error: Could not load Python interpreter.");
        setIsPyodideLoading(false);
      }
    };

    if (window.loadPyodide) {
      load();
    } else {
      const script = document.querySelector('script[src*="pyodide.js"]');
      const onLoad = () => load();
      script?.addEventListener("load", onLoad);
      return () => {
        cancelled = true;
        script?.removeEventListener("load", onLoad);
      };
    }

    return () => { cancelled = true; };
  }, []);

  const cmExtensions = useMemo(() => [python()], []);
  const cmStyle = useMemo(
    () => ({ fontFamily: "var(--font-code)", fontSize: "0.875rem" }),
    []
  );

  // ---------- helpers ----------

  const base64Encode = (obj: unknown) =>
    btoa(unescape(encodeURIComponent(JSON.stringify(obj))));


  const runPythonCode = async (codeToRun: string): Promise<[string, any]> => {
    const pyodide = pyodideRef.current;
    if (!pyodide) return ["Pyodide is not loaded yet.", null];

    let capturedOutput = "";
    let parsedLastJSON: any = null;

    const onBatch = (text: string) => {
      capturedOutput += text + "\n";
      // Try parse last non-empty line as JSON
      const trimmed = capturedOutput.trim().split("\n");
      for (let i = trimmed.length - 1; i >= 0; i--) {
        const line = trimmed[i].trim();
        if (!line) continue;
        try { parsedLastJSON = JSON.parse(line); break; } catch { /* ignore */ }
      }
    };

    pyodide.setStdout({ batched: onBatch });
    pyodide.setStderr({ batched: (t: string) => { capturedOutput += t + "\n"; } });

    try {
      await pyodide.loadPackagesFromImports(codeToRun);
      await pyodide.runPythonAsync(codeToRun);
    } catch (error) {
      capturedOutput += (error as Error).message;
    } finally {
      pyodide.setStdout({});
      pyodide.setStderr({});
    }

    return [capturedOutput.trim(), parsedLastJSON];
  };

  // Build a Python snippet that:
  // - imports user code
  // - decodes input/expected via base64 -> JSON
  // - calls solution(*args)/(**kwargs)/single
  // - compares using compare_mode
  const buildTestSnippet = (
    userCode: string,
    entryPoint: string,
    inputJSON: unknown,
    expectedJSON: unknown,
    compareMode?: string
  ) => {
    const b64Input = base64Encode(inputJSON);
    const b64Expected = base64Encode(expectedJSON);
    // compareMode examples:
    //   undefined or "ordered"
    //   "unordered_list"
    //   "set"
    //   "multiset"
    //   "float_tol:1e-6"
    return `
${userCode}

import json, base64, math, collections

def _b64_to_obj(b64s):
    return json.loads(base64.b64decode(b64s).decode())

def _call_solution(inp):
    # array -> *args, object -> **kwargs, else -> single positional
    if isinstance(inp, list):
        return ${entryPoint}(*inp)
    elif isinstance(inp, dict):
        return ${entryPoint}(**inp)
    else:
        return ${entryPoint}(inp)

def _norm_unordered_list(v):
    if isinstance(v, list):
        try:
            return sorted(v)
        except TypeError:
            return sorted([json.dumps(x, sort_keys=True) for x in v])
    return v

def _as_set(v):
    try:
        return set(v)
    except TypeError:
        return set([json.dumps(x, sort_keys=True) for x in v])

def _as_multiset(v):
    try:
        return collections.Counter(v)
    except TypeError:
        return collections.Counter([json.dumps(x, sort_keys=True) for x in v])

def _floatclose(a, b, tol):
    try:
        return abs(float(a) - float(b)) <= tol
    except Exception:
        return False

inp = _b64_to_obj("${b64Input}")
expected = _b64_to_obj("${b64Expected}")
actual = None
passed = False
err = None

try:
    actual = _call_solution(inp)
    mode = ${JSON.stringify(compareMode || "ordered")}
    if mode == "unordered_list":
        passed = (_norm_unordered_list(actual) == _norm_unordered_list(expected))
    elif mode == "set":
        passed = (_as_set(actual) == _as_set(expected))
    elif mode == "multiset":
        passed = (_as_multiset(actual) == _as_multiset(expected))
    elif isinstance(mode, str) and mode.startswith("float_tol:"):
        try:
            tol = float(mode.split(":")[1])
        except Exception:
            tol = 1e-6
        passed = _floatclose(actual, expected, tol)
    else:
        # deterministic structural equality
        try:
            passed = (json.dumps(actual, sort_keys=True) == json.dumps(expected, sort_keys=True))
        except TypeError:
            # fallback for non-JSON-serializables
            passed = (actual == expected)
except Exception as e:
    err = str(e)

print(json.dumps({
    "input": inp,
    "expected": expected,
    "actual": actual if err is None else ("Execution Error: " + err),
    "passed": False if err is not None else bool(passed)
}))
`.trim();
  };

  const handleRunCode = async () => {
    setIsRunningCode(true);
    setTestResults([]);
    setConsoleOutput("");
    const [output] = await runPythonCode(code);
    setConsoleOutput(output || "(No console output)");
    setIsRunningCode(false);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setTestResults([]);
    setConsoleOutput("");

    if (!testCases?.length) {
      setConsoleOutput("No test cases found for this problem.");
      setIsSubmitting(false);
      return;
    }

    try {
      const results: TestResult[] = [];
      let allPassed = true;

      for (const tc of testCases) {
        // Parse once
        let inp: unknown, out: unknown;
        try { inp = JSON.parse(tc.input); } catch { inp = tc.input; }
        try { out = JSON.parse(tc.output); } catch { out = tc.output; }

        // Optional comparison mode on each test case (string)
        // Examples: "unordered_list", "set", "multiset", "float_tol:1e-6", "ordered"
        const compareMode: string | undefined = (tc as any).compare;

        const snippet = buildTestSnippet(code, problem.entryPoint, inp, out, compareMode);
        const [capturedOutput, resultJson] = await runPythonCode(snippet);

        if (resultJson) {
          const tr: TestResult = {
            input: JSON.stringify(resultJson.input),
            expected: JSON.stringify(resultJson.expected),
            actual:
              typeof resultJson.actual === "string"
                ? resultJson.actual
                : JSON.stringify(resultJson.actual),
            passed: !!resultJson.passed,
          };
          results.push(tr);
          if (!tr.passed) allPassed = false;
        } else {
          allPassed = false;
          results.push({
            input: JSON.stringify(inp),
            expected: JSON.stringify(out),
            actual: `Execution Error: ${capturedOutput || "Unknown error"}`,
            passed: false,
          });
        }
      }

      setTestResults(results);

      if (allPassed) {
        // Check if there was already a correct submission
        const alreadySolved = latestSubmissionData?.some(s => s.isCorrect) ?? false;
        
        if (!alreadySolved) {
          setShowConfetti(true);
        }
        setShowSuccessModal(true);

        if (user && firestore) {
          try {
            const submissionsRef = collection(firestore, "problems", slug, "submissions");
            await addDoc(submissionsRef, {
              problemId: slug,
              userId: user.uid,
              code: code,
              submittedAt: new Date().toISOString(),
              isCorrect: true,
            });
          } catch (e) {
            console.error("Error saving submission to Firestore:", e);
          }
        }
      }
    } catch (error) {
      setConsoleOutput((error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onCodeChange = useCallback((value: string) => setCode(value), []);
  
  const handleGoToNextProblem = () => {
    if (nextProblemSlug) {
      router.push(`/problems/${nextProblemSlug}`);
    }
    setShowSuccessModal(false);
  };


  return (
    <div>
      {showConfetti && (
        <Confetti
          recycle={false}
          numberOfPieces={400}
          onConfettiComplete={() => setShowConfetti(false)}
        />
      )}
      <h2 className="text-2xl font-bold font-headline mb-4">Solution</h2>

      <div className="rounded-md border bg-background font-code text-sm overflow-hidden code-editor">
        <CodeMirror
          value={code}
          height="320px"
          extensions={cmExtensions}
          onChange={onCodeChange}
          theme={githubDark}
          style={cmStyle}
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button onClick={handleRunCode} disabled={isLoading || isPyodideLoading || isSubmissionLoading}>
          {isPyodideLoading || isSubmissionLoading ? (
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

        <Button
          onClick={handleSubmit}
          disabled={isLoading || isPyodideLoading || !user || isSubmissionLoading}
          variant="secondary"
          title={!user ? "Sign in to submit" : undefined}
        >
          {isPyodideLoading || isSubmissionLoading ? (
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
        {nextProblemSlug && (
           <Button asChild variant="outline" className="ml-auto">
             <Link href={`/problems/${nextProblemSlug}`}>
                Next Problem
               <ArrowRight className="ml-2 h-4 w-4" />
             </Link>
           </Button>
         )}
      </div>

      {(testResults.length > 0 || consoleOutput) && (
        <Tabs
          defaultValue={testResults.length > 0 ? "test-results" : "console"}
          className="mt-4"
        >
          <TabsList>
            <TabsTrigger value="test-results" disabled={testResults.length === 0}>
              Test Results
            </TabsTrigger>
            <TabsTrigger value="console" disabled={!consoleOutput}>
              Console
            </TabsTrigger>
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
                      <Badge variant={result.passed ? "secondary" : "destructive"}>
                        {result.passed ? "Passed" : "Failed"}
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

      {hasSubmissions && (
        <AiSuggestion problem={problem} userCode={code} />
      )}

      <AlertDialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Congratulations!</AlertDialogTitle>
            <AlertDialogDescription>
              You've passed all the test cases. Your submission has been saved.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Practice</AlertDialogCancel>
            {nextProblemSlug ? (
              <AlertDialogAction onClick={handleGoToNextProblem}>
                Next Problem <ArrowRight className="ml-2 h-4 w-4" />
              </AlertDialogAction>
            ) : (
              <AlertDialogAction onClick={() => setShowSuccessModal(false)}>
                Finish
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}


export default function ProblemDetailClient({ slug }: { slug: string }) {
  const { firestore } = useFirebase();

  // Fetch the current problem
  const problemRef = useMemoFirebase(
    () => (firestore ? doc(firestore, "problems", slug) : null),
    [firestore, slug]
  );
  const { data: p, isLoading: isProblemLoading } = useDoc<Problem>(problemRef);

  // Fetch all problems for navigation
  const problemsQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, "problems")) : null),
    [firestore]
  );
  const { data: allProblems, isLoading: areProblemsLoading } = useCollection<Problem>(problemsQuery);

  // Fetch test cases for the current problem
  const testCasesQuery = useMemoFirebase(
    () => (firestore ? collection(firestore, "problems", slug, "testCases") : null),
    [firestore, slug]
  );
  const { data: testCases, isLoading: areTestCasesLoading } =
    useCollection<TestCase>(testCasesQuery);

  const { sortedProblems, nextProblemSlug } = useMemo(() => {
    if (!allProblems) return { sortedProblems: [], nextProblemSlug: null };
    
    const problemGroups: { [key: string]: Problem[] } = {};
    allProblems.forEach((problem) => {
      const catSlug = problem.categorySlug;
      if (!catSlug) return;
      if (!problemGroups[catSlug]) {
        problemGroups[catSlug] = [];
      }
      problemGroups[catSlug].push(problem);
    });

    for (const catSlug in problemGroups) {
      problemGroups[catSlug].sort((a, b) => a.difficulty - b.difficulty);
    }
    
    const sortedProblems: Problem[] = [];
    sortedCategories.forEach(category => {
      if (problemGroups[category.slug]) {
        sortedProblems.push(...problemGroups[category.slug]);
      }
    });

    const currentIndex = sortedProblems.findIndex(prob => prob.slug === slug);
    const nextProblem = currentIndex !== -1 && currentIndex < sortedProblems.length - 1 ? sortedProblems[currentIndex + 1] : null;

    return { sortedProblems, nextProblemSlug: nextProblem?.slug || null };

  }, [allProblems, slug]);
  
  const loading = isProblemLoading || areTestCasesLoading || areProblemsLoading;

  if (loading) {
    return <ProblemDetailSkeleton />;
  }

  if (!p) {
    // Client components can't call notFound(); render a friendly fallback
    return (
      <Container className="py-16">
        <Card>
          <CardContent className="p-8">
            <h1 className="text-2xl font-bold mb-2">Problem not found</h1>
            <p className="text-muted-foreground">
              We couldn’t find a problem with slug “{slug}”.
            </p>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <div className="grid h-full grid-cols-1 gap-4 overflow-hidden p-4 md:grid-cols-2">
      <div className="h-full overflow-y-auto pr-4">
        <article className="container-prose">
          <div className="flex items-center gap-2">
            <h1 className="text-4xl font-bold font-headline">{p.title}</h1>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Info className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="space-y-2 p-2 max-w-xs">
                    <Badge
                      variant={
                        p.difficulty <= 3
                          ? "secondary"
                          : p.difficulty > 3 && p.difficulty <= 6
                            ? "default"
                            : "destructive"
                      }
                      className={p.difficulty > 3 && p.difficulty <= 6 ? "bg-amber-500 hover:bg-amber-500/80" : ""}
                    >
                      Difficulty: {p.difficulty}
                    </Badge>
                    <div className="flex flex-wrap gap-1.5">
                      {p.tags.map((t: string) => (
                        <TopicBadge key={t} label={t} />
                      ))}
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <hr className="my-6" />

          <ReactMarkdown
            className="prose dark:prose-invert max-w-none"
            components={{
              code: ({node, ...props}) => <code className="font-code" {...props} />,
            }}
          >
            {p.body}
          </ReactMarkdown>

          <TestCasesDisplay slug={slug} />
        </article>
      </div>

      <div className="h-full overflow-y-auto pl-4">
        {testCases && <CodeRunner problem={p} testCases={testCases} slug={slug} nextProblemSlug={nextProblemSlug}/>}
      </div>
    </div>
  );
}
