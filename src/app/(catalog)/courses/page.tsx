import Container from '@/components/container';
import CourseCard from '@/components/course-card';
import { courses } from '@/lib/data';

export default function CoursesPage() {
  return (
    <Container className="py-10">
      <h1 className="text-3xl font-bold font-headline">Courses</h1>
      <p className="mt-2 text-muted-foreground">
        Curated learning paths to help you master core topics in data structures and algorithms.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((c) => (
          <CourseCard key={c.slug} course={c} />
        ))}
      </div>
    </Container>
  );
}
