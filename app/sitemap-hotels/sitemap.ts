import { MetadataRoute } from 'next'
import { getAllHotels, hotelSlug } from '@/lib/hotels'

// Note: Next.js will generate sitemap-N.xml chunks automatically when entries > 50,000
// Our ~6,300 hotel pages (KO + EN) fit comfortably under that limit
export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://coolstay.kr'
  const now = new Date()

  const all = getAllHotels()

  const koHotels = all.map(({ countrySlug, citySlug, hotel }) => ({
    url: `${base}/${countrySlug}/${citySlug}/hotel/${hotelSlug(hotel)}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
    alternates: {
      languages: {
        ko: `${base}/${countrySlug}/${citySlug}/hotel/${hotelSlug(hotel)}`,
        en: `${base}/en/${countrySlug}/${citySlug}/hotel/${hotelSlug(hotel)}`,
      },
    },
  }))

  const enHotels = all.map(({ countrySlug, citySlug, hotel }) => ({
    url: `${base}/en/${countrySlug}/${citySlug}/hotel/${hotelSlug(hotel)}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
    alternates: {
      languages: {
        ko: `${base}/${countrySlug}/${citySlug}/hotel/${hotelSlug(hotel)}`,
        en: `${base}/en/${countrySlug}/${citySlug}/hotel/${hotelSlug(hotel)}`,
      },
    },
  }))

  return [...koHotels, ...enHotels]
}
