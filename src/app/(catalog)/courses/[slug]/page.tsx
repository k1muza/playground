import Container from '@/components/container';
import Sidebar from '@/components/sidebar';
import { courses } from '@/lib/data';
import { notFound } from 'next/navigation';
import { generateCourseToc } from '@/ai/flows/generate-course-toc';
import TopicBadge from '@/components/topic-badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

async function AiCourseToc({ courseContent }: { courseContent: string }) {
  try {
    const tocResult = await generateCourseToc({ courseContent });
    return (
      <Card className="mb-8 bg-secondary">
        <CardHeader className="flex-row items-center gap-3">
          <Lightbulb className="h-6 w-6 text-primary" />
          <CardTitle className="text-lg m-0">AI Generated Outline</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap font-mono">
            {tocResult.tableOfContents}
          </p>
        </CardContent>
      </Card>
    );
  } catch (error) {
    console.error('AI TOC generation failed:', error);
    return null; // Don't render anything if AI fails
  }
}

export async function generateStaticParams() {
  return courses.map((c) => ({
    slug: c.slug,
  }));
}

export default async function CourseDetail({
  params,
}: {
  params: { slug: string };
}) {
  const course = courses.find((c) => c.slug === params.slug);
  if (!course) return notFound();

  const allContent = course.lessons.map((l) => l.content).join('\n\n');

  return (
    <Container className="py-8">
      <div className="grid gap-8 md:grid-cols-[16rem,1fr] lg:grid-cols-[18rem,1fr]">
        <Sidebar
          sections={course.lessons.map((l) => ({ id: l.id, title: l.title }))}
        />
        <div className="min-w-0">
          <div className="flex flex-wrap gap-1.5 mb-4">
            {course.topics.map((t) => (
              <TopicBadge key={t} label={t} />
            ))}
          </div>
          <article className="container-prose">
            <h1 className="mb-2 text-4xl font-bold font-headline">{course.title}</h1>
            <p className="mb-8 text-lg text-muted-foreground">
              {course.description}
            </p>

            <AiCourseToc courseContent={allContent} />

            {course.lessons.map((l, index) => (
              <section id={l.id} key={l.id} className="scroll-mt-24">
                {index > 0 && <hr className="my-12"/>}
                <ReactMarkdown
                  className="prose dark:prose-invert max-w-none"
                  components={{
                    code: ({ node, ...props }) => <code className="font-code" {...props} />,
                  }}
                >
                  {l.content}
                </ReactMarkdown>
              </section>
            ))}
          </article>
        </div>
      </div>
    </Container>
  );
}
