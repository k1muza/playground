'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { useMemo } from 'react';
import { Book, Code, FileText, Home, Search, Feather, Shield } from 'lucide-react';
import { useFirebase, useCollection, useMemoFirebase, useUser } from '@/firebase';
import type { Problem, Submission } from '@/lib/data';
import { collection, query, collectionGroup, where } from 'firebase/firestore';
import { Progress } from '@/components/ui/progress';

const links = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/courses', label: 'Courses', icon: Book },
  { href: '/problems', label: 'Problems', icon: Code },
  { href: '/lessons', label: 'Lessons', icon: FileText },
  { href: '/search', label: 'Search', icon: Search },
  { href: '/admin', label: 'Admin', icon: Shield },
];

function OverallProgress() {
    const { firestore, user } = useFirebase();

    const problemsQuery = useMemoFirebase(
      () => (firestore ? query(collection(firestore, 'problems')) : null),
      [firestore]
    );
    const { data: problems, isLoading: isLoadingProblems } = useCollection<Problem>(problemsQuery);
  
    const submissionsQuery = useMemoFirebase(
      () =>
        user && firestore
          ? query(collectionGroup(firestore, 'submissions'), where('userId', '==', user.uid))
          : null,
      [user, firestore]
    );
    const { data: submissions, isLoading: isLoadingSubmissions } = useCollection<Submission>(submissionsQuery);

    const { overallPercentage, totalPoints } = useMemo(() => {
        if (!problems || !submissions) {
            return { overallPercentage: 0, totalPoints: 0 };
        }

        const solvedProblemSlugs = new Set(submissions.filter(s => s.isCorrect).map(s => s.problemId));

        let completedPoints = 0;
        let totalPoints = 0;

        problems.forEach(problem => {
            const difficultyWeight = problem.difficulty || 1;
            totalPoints += difficultyWeight;
            if (solvedProblemSlugs.has(problem.slug)) {
                completedPoints += difficultyWeight;
            }
        });

        const percentage = totalPoints > 0 ? Math.round((completedPoints / totalPoints) * 100) : 0;
        
        return { overallPercentage: percentage, totalPoints };

    }, [problems, submissions]);

    if (isLoadingProblems || isLoadingSubmissions || totalPoints === 0) {
        return null;
    }

    return (
        <div className="w-48 hidden lg:block">
            <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-muted-foreground">Overall Progress</span>
                <span className="text-xs font-bold">{overallPercentage}%</span>
            </div>
            <Progress value={overallPercentage} className="h-2" />
        </div>
    )
}


export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2.5 font-bold text-lg flex-shrink-0">
          <Feather className="h-7 w-7 text-primary" />
          <span className="font-headline">LearnVerse</span>
        </Link>
        <nav className="hidden items-center gap-1 text-sm font-medium md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={clsx(
                'flex items-center gap-2 rounded-md px-3 py-2 transition-colors hover:bg-accent hover:text-accent-foreground',
                (pathname === l.href || (l.href !== '/' && pathname.startsWith(l.href))) &&
                  'bg-accent text-accent-foreground'
              )}
            >
              <l.icon className="h-4 w-4" />
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex-1 flex justify-end">
            <OverallProgress />
        </div>
      </div>
    </header>
  );
}
