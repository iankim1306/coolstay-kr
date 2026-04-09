import { MetadataRoute } from 'next'
import { COUNTRIES } from '@/lib/destinations'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://coolstay.kr'

  const countryPages = COUNTRIES.map(country => ({
    url: `${base}/${country.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const cityPages = COUNTRIES.flatMap(country =>
    country.cities.map(city => ({
      url: `${base}/${country.slug}/${city.nameEn}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }))
  )

  return [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    ...countryPages,
    ...cityPages,
  ]
}
