import Container from '@/components/container';
import { problems } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import TopicBadge from '@/components/topic-badge';

export async function generateStaticParams() {
  return problems.map((p) => ({
    slug: p.slug,
  }));
}

export default function ProblemDetail({ params }: { params: { slug:string } }) {
  const p = problems.find((i) => i.slug === params.slug);
  if (!p) return notFound();

  return (
    <Container className="py-8 lg:py-12">
      <article className="container-prose mx-auto">
        <div className="flex items-center gap-4 mb-4">
          <Badge
            variant={
              p.difficulty === 'Easy'
                ? 'secondary'
                : p.difficulty === 'Medium'
                ? 'default'
                : 'destructive'
            }
            className={p.difficulty === 'Medium' ? 'bg-amber-500 hover:bg-amber-500/80' : ''}
          >
            {p.difficulty}
          </Badge>
          <div className="flex flex-wrap gap-1.5">
            {p.tags.map((t) => (
              <TopicBadge key={t} label={t} />
            ))}
          </div>
        </div>
        <h1 className="text-4xl font-bold font-headline">{p.title}</h1>
        <hr className="my-6" />
        <p className="font-code text-sm whitespace-pre-wrap">{p.body}</p>
        <div className="mt-12 rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold font-headline">Hint</h2>
          <p className="mt-2 text-muted-foreground">
            Think about the right data structure for the job. How can you optimize lookups?
          </p>
        </div>
      </article>
    </Container>
  );
}
