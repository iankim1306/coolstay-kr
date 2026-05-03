import { MetadataRoute } from 'next'
import { getAllThemeCombos } from '@/lib/themes'
import { getAllFilterCombos } from '@/lib/filter-pages'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://coolstay.kr'
  const now = new Date()

  const combos = getAllThemeCombos()

  const koThemes = combos.map(({ countrySlug, citySlug, theme }) => ({
    url: `${base}/${countrySlug}/${citySlug}/${theme.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.85,
    alternates: {
      languages: {
        ko: `${base}/${countrySlug}/${citySlug}/${theme.slug}`,
        en: `${base}/en/${countrySlug}/${citySlug}/${theme.slug}`,
      },
    },
  }))

  const enThemes = combos.map(({ countrySlug, citySlug, theme }) => ({
    url: `${base}/en/${countrySlug}/${citySlug}/${theme.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.75,
    alternates: {
      languages: {
        ko: `${base}/${countrySlug}/${citySlug}/${theme.slug}`,
        en: `${base}/en/${countrySlug}/${citySlug}/${theme.slug}`,
      },
    },
  }))

  // 가격대/평점 필터 페이지 (한국어만, 영어판 미생성)
  const filterCombos = getAllFilterCombos()
  const koFilters = filterCombos.map(({ countrySlug, citySlug, filter }) => ({
    url: `${base}/${countrySlug}/${citySlug}/filter/${filter.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [...koThemes, ...enThemes, ...koFilters]
}
