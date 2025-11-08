import Container from '@/components/container';
import { articles } from '@/lib/data';
import { notFound } from 'next/navigation';
import { mdToHtml } from '@/lib/utils';
import TopicBadge from '@/components/topic-badge';

export async function generateStaticParams() {
  return articles.map((a) => ({
    slug: a.slug,
  }));
}

export default function ArticleDetail({ params }: { params: { slug: string } }) {
  const a = articles.find((i) => i.slug === params.slug);
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
        <div
          className="mt-8"
          dangerouslySetInnerHTML={{ __html: mdToHtml(a.body) }}
        />
      </article>
    </Container>
  );
}
