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
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import type { Problem } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';

type Difficulty = 'All' | 'Easy' | 'Medium' | 'Hard';

function ProblemListSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-[180px] w-full" />
      ))}
    </div>
  );
}

export default function ProblemsPage() {
  const [q, setQ] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('All');
  const { firestore } = useFirebase();

  const problemsQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, 'problems')) : null),
    [firestore]
  );
  const { data: problems, isLoading } = useCollection<Problem>(problemsQuery);

  const filtered = useMemo(() => {
    if (!problems) return [];
    return problems.filter((p) => {
      const matchesQ = [p.title, p.summary, ...p.tags]
        .join(' ')
        .toLowerCase()
        .includes(q.toLowerCase());
      const matchesD = difficulty === 'All' || p.difficulty === difficulty;
      return matchesQ && matchesD;
    });
  }, [q, difficulty, problems]);

  return (
    <Container className="py-10">
      <h1 className="text-3xl font-bold font-headline">Practice Problems</h1>
      <p className="mt-2 text-muted-foreground">
        Apply your knowledge with a curated set of practice problems.
      </p>
      <div className="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search problems by title or tag..."
          className="w-full sm:max-w-sm"
        />
        <Select
          value={difficulty}
          onValueChange={(value) => setDifficulty(value as Difficulty)}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            {(['All', 'Easy', 'Medium', 'Hard'] as Difficulty[]).map((d) => (
              <SelectItem key={d} value={d}>
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="mt-8">
        {isLoading ? (
          <ProblemListSkeleton />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <ProblemCard key={p.slug} problem={p} />
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}
    