import { MetadataRoute } from 'next';
import { courses, lessons } from '@/lib/data';
import { initializeFirebase } from '@/firebase';
import { getDocs, collection } from 'firebase/firestore';

const BASE_URL = 'https://learnverse.dev';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { firestore } = initializeFirebase();

  const courseUrls = courses.map((c) => ({
    url: `${BASE_URL}/courses/${c.slug}`,
    lastModified: new Date(),
    priority: 0.8,
  }));

  const problemDocs = await getDocs(collection(firestore, 'problems'));
  const problemUrls = problemDocs.docs.map((doc) => ({
    url: `${BASE_URL}/problems/${doc.id}`,
    lastModified: new Date(),
    priority: 0.6,
  }));

  const lessonUrls = lessons.map((a) => ({
    url: `${BASE_URL}/lessons/${a.slug}`,
    lastModified: new Date(),
    priority: 0.7,
  }));

  const staticUrls: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), priority: 1.0 },
    { url: `${BASE_URL}/courses`, lastModified: new Date(), priority: 0.9 },
    { url: `${BASE_URL}/problems`, lastModified: new Date(), priority: 0.9 },
    { url: `${BASE_URL}/lessons`, lastModified: new Date(), priority: 0.9 },
    { url: `${BASE_URL}/search`, lastModified: new Date(), priority: 0.5 },
  ];

  return [...staticUrls, ...courseUrls, ...problemUrls, ...lessonUrls];
}
