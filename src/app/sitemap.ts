import { MetadataRoute } from 'next';
import { courses, problems, articles } from '@/lib/data';

const BASE_URL = 'https://learnverse.dev';

export default function sitemap(): MetadataRoute.Sitemap {
  const courseUrls = courses.map((c) => ({
    url: `${BASE_URL}/courses/${c.slug}`,
    lastModified: new Date(),
    priority: 0.8,
  }));

  const problemUrls = problems.map((p) => ({
    url: `${BASE_URL}/problems/${p.slug}`,
    lastModified: new Date(),
    priority: 0.6,
  }));

  const articleUrls = articles.map((a) => ({
    url: `${BASE_URL}/articles/${a.slug}`,
    lastModified: new Date(),
    priority: 0.7,
  }));

  const staticUrls: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), priority: 1.0 },
    { url: `${BASE_URL}/courses`, lastModified: new Date(), priority: 0.9 },
    { url: `${BASE_URL}/problems`, lastModified: new Date(), priority: 0.9 },
    { url: `${BASE_URL}/articles`, lastModified: new Date(), priority: 0.9 },
    { url: `${BASE_URL}/search`, lastModified: new Date(), priority: 0.5 },
  ];

  return [...staticUrls, ...courseUrls, ...problemUrls, ...articleUrls];
}
