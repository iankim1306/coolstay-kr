import { MetadataRoute } from 'next'
import { COUNTRIES } from '@/lib/destinations'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://coolstay.kr'
  const now = new Date()

  const koCountry = COUNTRIES.map(country => ({
    url: `${base}/${country.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
    alternates: {
      languages: {
        ko: `${base}/${country.slug}`,
        en: `${base}/en/${country.slug}`,
      },
    },
  }))

  const koCity = COUNTRIES.flatMap(country =>
    country.cities.map(city => ({
      url: `${base}/${country.slug}/${city.nameEn}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
      alternates: {
        languages: {
          ko: `${base}/${country.slug}/${city.nameEn}`,
          en: `${base}/en/${country.slug}/${city.nameEn}`,
        },
      },
    }))
  )

  const enCountry = COUNTRIES.map(country => ({
    url: `${base}/en/${country.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
    alternates: {
      languages: {
        ko: `${base}/${country.slug}`,
        en: `${base}/en/${country.slug}`,
      },
    },
  }))

  const enCity = COUNTRIES.flatMap(country =>
    country.cities.map(city => ({
      url: `${base}/en/${country.slug}/${city.nameEn}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
      alternates: {
        languages: {
          ko: `${base}/${country.slug}/${city.nameEn}`,
          en: `${base}/en/${country.slug}/${city.nameEn}`,
        },
      },
    }))
  )

  return [...koCountry, ...koCity, ...enCountry, ...enCity]
}
