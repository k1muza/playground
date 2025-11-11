
import LessonDetailClient from "./LessonDetailClient";

type PageProps = { params: Promise<{ slug: string }> };

export default async function Page({ params }: PageProps) {
  const { slug } = await params; // ✅ Next 15: params is async
  return <LessonDetailClient slug={slug} />;
}
