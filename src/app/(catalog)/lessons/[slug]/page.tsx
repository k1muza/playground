import Container from '@/components/container';
import { lessons } from '@/lib/data';
import { notFound } from 'next/navigation';
import TopicBadge from '@/components/topic-badge';
import ReactMarkdown from 'react-markdown';

export async function generateStaticParams() {
  return lessons.map((a) => ({
    slug: a.slug,
  }));
}

export default function LessonDetail({ params }: { params: { slug: string } }) {
  const a = lessons.find((i) => i.slug === params.slug);
  if (!a) return notFound();

  return (
    <Container className="py-8 lg:py-12">
      <article className="container-prose mx-auto">
        <div className="flex flex-wrap gap-1.5 mb-4">
          {a.tags.map((t) => (
            <TopicBadge key={t} label={t} />
          ))}
        </div>
        <h1 className="text-4xl font-bold font-headline">{a.title}</h1>
        <p className="text-lg text-muted-foreground mt-2">{a.excerpt}</p>
        <div className="mt-8">
          <ReactMarkdown
            className="prose dark:prose-invert max-w-none"
            components={{
              code: ({ node, ...props }) => <code className="font-code" {...props} />,
            }}
          >
            {a.body}
          </ReactMarkdown>
        </div>
      </article>
    </Container>
  );
}
