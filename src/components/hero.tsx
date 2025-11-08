import Link from 'next/link';
import Container from './container';
import { Button } from './ui/button';
import { BookOpen, Code } from 'lucide-react';

export default function Hero() {
  return (
    <section className="border-b bg-secondary py-16 md:py-24 lg:py-32">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl font-headline">
            Learn Data Structures & Algorithms the practical way
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Bite-sized lessons, curated problems, and clear walkthroughs.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/courses">
                <BookOpen />
                Browse Courses
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/problems">
                <Code />
                Practice Problems
              </Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
