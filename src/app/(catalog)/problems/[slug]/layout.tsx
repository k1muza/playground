
'use client';

import { ReactNode, useMemo } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarTrigger,
  SidebarContent,
} from '@/components/ui/sidebar';
import { useFirebase, useCollection, useMemoFirebase, useUser } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import type { Problem } from '@/lib/data';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import type { Solution } from '@/lib/data';

const difficultyOrder: { [key: string]: number } = {
  'Easy': 1,
  'Medium': 2,
  'Hard': 3,
};

function ProblemList() {
  const pathname = usePathname();
  const { firestore, user } = useFirebase();

  // Fetch all problems
  const problemsQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, 'problems')) : null),
    [firestore]
  );
  const { data: problems, isLoading: isLoadingProblems } = useCollection<Problem>(problemsQuery);

  // Fetch user's solutions if they are logged in
  const solutionsQuery = useMemoFirebase(
    () => (user && firestore ? collection(firestore, 'users', user.uid, 'solutions') : null),
    [user, firestore]
  );
  const { data: solutions, isLoading: isLoadingSolutions } = useCollection<Solution>(solutionsQuery);

  // Create a set of solved problem IDs for quick lookup
  const solvedProblemSlugs = useMemo(() => {
    if (!solutions) return new Set();
    return new Set(solutions.filter(s => s.isCorrect).map(s => s.problemId));
  }, [solutions]);


  const categorizedProblems = useMemo(() => {
    if (!problems) return {};

    const categories: { [key: string]: Problem[] } = {};

    problems.forEach((problem) => {
      problem.tags.forEach((tag) => {
        if (!categories[tag]) {
          categories[tag] = [];
        }
        categories[tag].push(problem);
      });
    });

    // Sort problems within each category by difficulty
    for (const category in categories) {
      categories[category].sort((a, b) => {
        return (difficultyOrder[a.difficulty] || 4) - (difficultyOrder[b.difficulty] || 4);
      });
    }

    return categories;
  }, [problems]);

  if (isLoadingProblems || isLoadingSolutions) {
    return <p>Loading problems...</p>;
  }

  const sortedCategories = Object.keys(categorizedProblems).sort();

  return (
    <Accordion type="multiple" className="w-full">
      {sortedCategories.map((category) => (
        <AccordionItem value={category} key={category}>
          <AccordionTrigger className="px-2 py-1.5 text-sm font-medium hover:no-underline hover:bg-accent rounded-md">
            {category}
          </AccordionTrigger>
          <AccordionContent>
            <ul className="pl-4 pt-2 flex flex-col gap-1">
              {categorizedProblems[category].map((problem) => (
                <li key={problem.slug}>
                  <Link href={`/problems/${problem.slug}`}>
                    <div
                      className={`
                        flex justify-between items-center text-xs p-1.5 rounded-md
                        ${pathname === `/problems/${problem.slug}`
                          ? 'bg-primary/20 text-primary-foreground'
                          : 'hover:bg-accent'
                        }
                      `}
                    >
                      <span className="truncate flex-1 flex items-center gap-2">
                        {solvedProblemSlugs.has(problem.slug) && (
                          <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                        )}
                        {problem.title}
                      </span>
                      <span
                        className={`
                          text-xs ml-2
                          ${problem.difficulty === 'Easy' ? 'text-green-500' : ''}
                          ${problem.difficulty === 'Medium' ? 'text-yellow-500' : ''}
                          ${problem.difficulty === 'Hard' ? 'text-red-500' : ''}
                        `}
                      >
                        {problem.difficulty}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}


export default function ProblemLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="relative flex h-[calc(100vh-4rem)]">
        <Sidebar collapsible="icon">
          <SidebarHeader>
            <div className="flex items-center justify-between p-2">
              <span className="font-semibold text-lg group-data-[collapsible=icon]:hidden">Problems</span>
              <SidebarTrigger />
            </div>
          </SidebarHeader>
          <SidebarContent>
            <div className="p-2 group-data-[collapsible=icon]:hidden">
              <ProblemList />
            </div>
          </SidebarContent>
        </Sidebar>
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
}
