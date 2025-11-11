import Container from '@/components/container';
import LessonCard from '@/components/lesson-card';
import { lessons } from '@/lib/data';

export default function LessonsPage() {
  return (
    <Container className="py-10">
      <h1 className="text-3xl font-bold font-headline">Lessons</h1>
      <p className="mt-2 text-muted-foreground">
        Short, focused reads to deepen your understanding of core concepts.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {lessons.map((a) => (
          <LessonCard key={a.slug} lesson={a} />
        ))}
      </div>
    </Container>
  );
}
