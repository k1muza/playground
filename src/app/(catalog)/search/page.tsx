'use client';

import { useMemo, useState } from 'react';
import Container from '@/components/container';
import CourseCard from '@/components/course-card';
import ProblemCard from '@/components/problem-card';
import LessonCard from '@/components/lesson-card';
import { courses, lessons } from '@/lib/data';
import { Input } from '@/components/ui/input';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import type { Problem } from '@/lib/data';

export default function SearchPage() {
  const [q, setQ] = useState('');
  const { firestore } = useFirebase();

  const problemsQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, 'problems')) : null),
    [firestore]
  );
  const { data: problems } = useCollection<Problem>(problemsQuery);

  const results = useMemo(() => {
    if (!q) {
      return { courses: [], problems: [], lessons: [] };
    }
    const term = q.toLowerCase();
    return {
      courses: courses.filter((c) =>
        (c.title + c.description + c.topics.join(' ')).toLowerCase().includes(term)
      ),
      problems: (problems || []).filter((p) =>
        (p.title + p.summary + p.tags.join(' ')).toLowerCase().includes(term)
      ),
      lessons: lessons.filter((a) =>
        (a.title + a.excerpt + a.tags.join(' ')).toLowerCase().includes(term)
      ),
    };
  }, [q, problems]);

  const hasResults =
    results.courses.length > 0 ||
    results.problems.length > 0 ||
    results.lessons.length > 0;

  return (
    <Container className="py-10">
      <h1 className="text-3xl font-bold font-headline">Search</h1>
      <Input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search courses, problems, lessons..."
        className="mt-4 w-full max-w-xl"
        autoFocus
      />

      {q && !hasResults && (
        <div className="mt-8 text-center text-muted-foreground">
          <p>No results found for "{q}".</p>
          <p className="text-sm">Try another search term.</p>
        </div>
      )}

      {(results.courses.length > 0 || results.problems.length > 0 || results.lessons.length > 0) && (
        <div className="mt-10 grid gap-12 lg:grid-cols-3 lg:gap-8">
          {results.courses.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-4 font-headline">Courses</h2>
              <div className="space-y-4">
                {results.courses.map((c) => (
                  <CourseCard key={c.slug} course={c} />
                ))}
              </div>
            </section>
          )}

          {results.problems.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-4 font-headline">Problems</h2>
              <div className="space-y-4">
                {results.problems.map((p) => (
                  <ProblemCard key={p.slug} problem={p} />
                ))}
              </div>
            </section>
          )}

          {results.lessons.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-4 font-headline">Lessons</h2>
              <div className="space-y-4">
                {results.lessons.map((a) => (
                  <LessonCard key={a.slug} lesson={a} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </Container>
  );
}
