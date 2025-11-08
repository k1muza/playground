import Link from 'next/link';
import TopicBadge from './topic-badge';
import type { Course } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';

export default function CourseCard({ course }: { course: Course }) {
  return (
    <Link href={`/courses/${course.slug}`} className="block h-full">
      <Card className="h-full transition-all hover:shadow-md dark:hover:border-primary/30 dark:hover:shadow-primary/10">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <CardTitle className="text-lg">{course.title}</CardTitle>
            <Badge variant="secondary">{course.level}</Badge>
          </div>
          <CardDescription className="pt-1">{course.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {course.topics.slice(0, 4).map((t: string) => (
              <TopicBadge key={t} label={t} />
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
