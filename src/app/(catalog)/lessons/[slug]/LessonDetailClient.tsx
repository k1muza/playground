
'use client';

import Container from '@/components/container';
import TopicBadge from '@/components/topic-badge';
import ReactMarkdown from 'react-markdown';
import { useFirebase, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { Lesson } from '@/lib/lessons';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

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


export default function LessonDetailClient({ slug }: { slug: string }) {
  const { firestore } = useFirebase();

  const lessonRef = useMemoFirebase(
    () => (firestore ? doc(firestore, 'lessons', slug) : null),
    [firestore, slug]
  );
  const { data: lesson, isLoading } = useDoc<Lesson>(lessonRef);

  if (isLoading) {
    return <LessonDetailSkeleton />;
  }

  if (!lesson) {
    // Client components can't throw a 404 this way.
    // Instead, we render a "not found" message.
    return (
      <Container className="py-16">
        <Card>
          <CardContent className="p-8">
            <h1 className="text-2xl font-bold mb-2">Lesson not found</h1>
            <p className="text-muted-foreground">
              We couldn’t find a lesson with the slug “{slug}”. It might have been moved or deleted.
            </p>
          </CardContent>
        </Card>
      </Container>
    );
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
