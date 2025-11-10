'use client';

import { useMemo, useState } from 'react';
import Container from '@/components/container';
import ProblemCard from '@/components/problem-card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useFirebase, useCollection, useMemoFirebase, useUser } from '@/firebase';
import { collection, query, collectionGroup, where } from 'firebase/firestore';
import type { Problem, Submission } from '@/lib/data';
import { categories } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

function ProblemListSkeleton() {
  return (
    <div className="space-y-8">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i}>
          <Skeleton className="h-8 w-1/3 mb-4" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, j) => (
              <Skeleton key={j} className="h-[180px] w-full" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// Sort categories once by the 'order' property
const sortedCategories = [...categories].sort((a, b) => a.order - b.order);

export default function ProblemsPage() {
  const { firestore, user } = useFirebase();

  // Fetch all problems
  const problemsQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, 'problems')) : null),
    [firestore]
  );
  const { data: problems, isLoading: isLoadingProblems } = useCollection<Problem>(problemsQuery);

  // Fetch user's submissions
  const submissionsQuery = useMemoFirebase(
    () =>
      user && firestore
        ? query(collectionGroup(firestore, 'submissions'), where('userId', '==', user.uid))
        : null,
    [user, firestore]
  );
  const { data: submissions, isLoading: isLoadingSubmissions } = useCollection<Submission>(submissionsQuery);

  // Create a set of solved problem slugs for quick lookup
  const solvedProblemSlugs = useMemo(() => {
    if (!submissions) return new Set();
    return new Set(submissions.filter(s => s.isCorrect).map(s => s.problemId));
  }, [submissions]);

  const categorizedProblems = useMemo(() => {
    if (!problems) return {};
    const problemGroups: { [key: string]: Problem[] } = {};
    problems.forEach((problem) => {
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
    return problemGroups;
  }, [problems]);

  const isLoading = isLoadingProblems || isLoadingSubmissions;

  // Get a list of all category slugs to use as the default open accordions
  const allCategorySlugs = useMemo(() => sortedCategories.map(c => c.slug), []);

  return (
    <Container className="py-10">
      <h1 className="text-3xl font-bold font-headline">Practice Problems</h1>
      <p className="mt-2 text-muted-foreground">
        Apply your knowledge with a curated set of practice problems, grouped by topic.
      </p>
      
      <div className="mt-8">
        {isLoading ? (
          <ProblemListSkeleton />
        ) : (
          <Accordion type="multiple" className="w-full space-y-6" defaultValue={allCategorySlugs}>
            {sortedCategories.map((category) => {
              const problemsInCategory = categorizedProblems[category.slug];
              if (!problemsInCategory || problemsInCategory.length === 0) {
                return null;
              }

              return (
                <AccordionItem value={category.slug} key={category.slug} className="border-b-0">
                  <AccordionTrigger className="text-xl font-semibold font-headline hover:no-underline rounded-md px-4 py-2 bg-secondary">
                    {category.title}
                  </AccordionTrigger>
                  <AccordionContent className="pt-4">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {problemsInCategory.map((p) => (
                        <ProblemCard
                          key={p.slug}
                          problem={p}
                          isSolved={solvedProblemSlugs.has(p.slug)}
                        />
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        )}
      </div>
    </Container>
  );
}
