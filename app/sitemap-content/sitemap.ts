import { MetadataRoute } from 'next'
import { LANDMARKS } from '@/lib/landmarks'
import { GUIDES } from '@/lib/guides'
import { POSTS } from '@/lib/blog'

/**
 * 콘텐츠 사이트맵 — 명소 근처 숙소(/near) · 여행 가이드(/guide) · 블로그(/blog).
 * 가이드·블로그는 원래 어느 사이트맵에도 없어 색인이 내부 링크에만 의존하고 있었다.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://coolstay.kr'
  const now = new Date()

  const hubs: MetadataRoute.Sitemap = [
    { url: `${base}/near`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/guide`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${base}/compare`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/en/guide`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
  ]

  const near = LANDMARKS.map((l) => ({
    url: `${base}/near/${l.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const guides = GUIDES.map((g) => ({
    url: `${base}/guide/${g.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
    alternates: { languages: { ko: `${base}/guide/${g.slug}`, en: `${base}/en/guide/${g.slug}` } },
  }))

  // 영문 가이드는 라우트(/en/guide)와 hreflang이 있는데 어느 사이트맵에도 없었다.
  const guidesEn = GUIDES.map((g) => ({
    url: `${base}/en/guide/${g.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
    alternates: { languages: { ko: `${base}/guide/${g.slug}`, en: `${base}/en/guide/${g.slug}` } },
  }))

  const posts = POSTS.map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...hubs, ...near, ...guides, ...guidesEn, ...posts]
}
