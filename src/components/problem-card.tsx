import Link from 'next/link';
import TopicBadge from './topic-badge';
import type { Problem } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';

export default function ProblemCard({ problem }: { problem: Problem }) {
  return (
    <Link href={`/problems/${problem.slug}`} className="block h-full">
      <Card className="h-full transition-all hover:shadow-md dark:hover:border-primary/30 dark:hover:shadow-primary/10">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <CardTitle className="text-base font-medium">{problem.title}</CardTitle>
            <Badge
              variant={
                problem.difficulty === 'Easy'
                  ? 'secondary'
                  : problem.difficulty === 'Medium'
                  ? 'default'
                  : 'destructive'
              }
              className={
                problem.difficulty === 'Medium' ? 'bg-amber-500 hover:bg-amber-500/80' : ''
              }
            >
              {problem.difficulty}
            </Badge>
          </div>
          <CardDescription className="pt-1 text-xs">{problem.summary}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {problem.tags.map((t: string) => (
              <TopicBadge key={t} label={t} />
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
