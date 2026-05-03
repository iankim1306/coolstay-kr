import { MetadataRoute } from 'next'

// Sitemap index — references split sitemaps
export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://coolstay.kr'
  const now = new Date()

  // Top-level URLs (homepage, EN homepage)
  return [
    {
      url: base,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
      alternates: {
        languages: {
          ko: base,
          en: `${base}/en`,
        },
      },
    },
    {
      url: `${base}/en`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
      alternates: {
        languages: {
          ko: base,
          en: `${base}/en`,
        },
      },
    },
  ]
}
