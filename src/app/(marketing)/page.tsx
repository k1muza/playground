'use client';
import Hero from '@/components/hero';
import Container from '@/components/container';
import CourseCard from '@/components/course-card';
import LessonCard from '@/components/lesson-card';
import ProblemCard from '@/components/problem-card';
import { courses, lessons } from '@/lib/data';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, limit } from 'firebase/firestore';
import type { Problem } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';

export default function Page() {
  const { firestore } = useFirebase();
  const problemsQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, 'problems'), limit(3)) : null),
    [firestore]
  );
  const { data: problems, isLoading } = useCollection<Problem>(problemsQuery);

  return (
    <>
      <Hero />
      <Container className="py-10 space-y-16">
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold font-headline">Popular Courses</h2>
            <Button variant="link" asChild>
              <Link href="/courses">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((c) => (
              <CourseCard key={c.slug} course={c} />
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold font-headline">Practice Problems</h2>
            <Button variant="link" asChild>
              <Link href="/problems">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-[180px] w-full" />)
            ) : (
              problems?.map((p) => (
                <ProblemCard key={p.slug} problem={p} />
              ))
            )}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold font-headline">Latest Lessons</h2>
            <Button variant="link" asChild>
              <Link href="/lessons">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {lessons.map((a) => (
              <LessonCard key={a.slug} lesson={a} />
            ))}
          </div>
        </section>
      </Container>
    </>
  );
}
