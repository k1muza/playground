import Container from '@/components/container';
import ArticleCard from '@/components/article-card';
import { articles } from '@/lib/data';

export default function ArticlesPage() {
  return (
    <Container className="py-10">
      <h1 className="text-3xl font-bold font-headline">Articles</h1>
      <p className="mt-2 text-muted-foreground">
        Short, focused reads to deepen your understanding of core concepts.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((a) => (
          <ArticleCard key={a.slug} article={a} />
        ))}
      </div>
    </Container>
  );
}
