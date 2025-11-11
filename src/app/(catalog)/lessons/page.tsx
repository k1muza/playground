'use client';

import { useMemo } from 'react';
import Container from '@/components/container';
import LessonCard from '@/components/lesson-card';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import type { Lesson } from '@/lib/lessons';
import { Skeleton } from '@/components/ui/skeleton';

function LessonListSkeleton() {
    return (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-[190px] w-full" />
            ))}
        </div>
    )
}

export default function LessonsPage() {
  const { firestore } = useFirebase();

  const lessonsQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, 'lessons')) : null),
    [firestore]
  );
  const { data: lessons, isLoading } = useCollection<Lesson>(lessonsQuery);

  return (
    <Container className="py-10">
      <h1 className="text-3xl font-bold font-headline">Lessons</h1>
      <p className="mt-2 text-muted-foreground">
        Short, focused reads to deepen your understanding of core concepts.
      </p>
      {isLoading ? (
        <LessonListSkeleton />
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {lessons?.map((l) => (
            <LessonCard key={l.slug} lesson={l} />
          ))}
        </div>
      )}
    </Container>
  );
}
