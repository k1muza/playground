'use client';

import Container from '@/components/container';
import { notFound } from 'next/navigation';
import TopicBadge from '@/components/topic-badge';
import ReactMarkdown from 'react-markdown';
import { useFirebase, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { Lesson } from '@/lib/lessons';
import { Skeleton } from '@/components/ui/skeleton';

function LessonDetailSkeleton() {
  return (
    <Container className="py-8 lg:py-12">
      <div className="container-prose mx-auto">
        <Skeleton className="h-6 w-1/4 mb-4" />
        <Skeleton className="h-10 w-3/4 mb-2" />
        <Skeleton className="h-6 w-full mb-8" />
        <Skeleton className="h-48 w-full" />
      </div>
    </Container>
  );
}


export default function LessonDetail({ params }: { params: { slug: string } }) {
  const { firestore } = useFirebase();

  const lessonRef = useMemoFirebase(
    () => (firestore ? doc(firestore, 'lessons', params.slug) : null),
    [firestore, params.slug]
  );
  const { data: lesson, isLoading } = useDoc<Lesson>(lessonRef);

  if (isLoading) {
    return <LessonDetailSkeleton />;
  }

  if (!lesson) {
    return notFound();
  }

  return (
    <Container className="py-8 lg:py-12">
      <article className="container-prose mx-auto">
        <div className="flex flex-wrap gap-1.5 mb-4">
          {lesson.tags.map((t) => (
            <TopicBadge key={t} label={t} />
          ))}
        </div>
        <h1 className="text-4xl font-bold font-headline">{lesson.title}</h1>
        <p className="text-lg text-muted-foreground mt-2">{lesson.excerpt}</p>
        <div className="mt-8">
          <ReactMarkdown
            className="prose dark:prose-invert max-w-none"
            components={{
              code: ({ node, ...props }) => <code className="font-code" {...props} />,
            }}
          >
            {lesson.body}
          </ReactMarkdown>
        </div>
      </article>
    </Container>
  );
}
