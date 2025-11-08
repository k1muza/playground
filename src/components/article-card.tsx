import Link from 'next/link';
import TopicBadge from './topic-badge';
import type { Article } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';

export default function ArticleCard({ article }: { article: Article }) {
  return (
    <Link href={`/articles/${article.slug}`} className="block h-full">
      <Card className="h-full transition-all hover:shadow-md dark:hover:border-primary/30 dark:hover:shadow-primary/10">
        <CardHeader>
          <CardTitle className="text-lg">{article.title}</CardTitle>
          <CardDescription className="pt-1">{article.excerpt}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {article.tags.map((t: string) => (
              <TopicBadge key={t} label={t} />
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
