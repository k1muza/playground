import Link from 'next/link';
import TopicBadge from './topic-badge';
import type { Lesson } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';

export default function LessonCard({ lesson }: { lesson: Lesson }) {
  return (
    <Link href={`/lessons/${lesson.slug}`} className="block h-full">
      <Card className="h-full transition-all hover:shadow-md dark:hover:border-primary/30 dark:hover:shadow-primary/10">
        <CardHeader>
          <CardTitle className="text-lg">{lesson.title}</CardTitle>
          <CardDescription className="pt-1">{lesson.excerpt}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {lesson.tags.map((t: string) => (
              <TopicBadge key={t} label={t} />
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
