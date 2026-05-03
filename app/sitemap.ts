import { MetadataRoute } from 'next'
import { COUNTRIES } from '@/lib/destinations'
import { getAllHotels, hotelSlug } from '@/lib/hotels'
import { getAllThemeCombos } from '@/lib/themes'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://coolstay.kr'

  // Korean URLs
  const koCountryPages = COUNTRIES.map(country => ({
    url: `${base}/${country.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
    alternates: {
      languages: {
        ko: `${base}/${country.slug}`,
        en: `${base}/en/${country.slug}`,
      },
    },
  }))

  const koCityPages = COUNTRIES.flatMap(country =>
    country.cities.map(city => ({
      url: `${base}/${country.slug}/${city.nameEn}`,
      lastModified: new Date(),
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

  const koHotelPages = getAllHotels().map(({ countrySlug, citySlug, hotel }) => ({
    url: `${base}/${countrySlug}/${citySlug}/hotel/${hotelSlug(hotel)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
    alternates: {
      languages: {
        ko: `${base}/${countrySlug}/${citySlug}/hotel/${hotelSlug(hotel)}`,
        en: `${base}/en/${countrySlug}/${citySlug}/hotel/${hotelSlug(hotel)}`,
      },
    },
  }))

  const koThemePages = getAllThemeCombos().map(({ countrySlug, citySlug, theme }) => ({
    url: `${base}/${countrySlug}/${citySlug}/${theme.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.85,
    alternates: {
      languages: {
        ko: `${base}/${countrySlug}/${citySlug}/${theme.slug}`,
        en: `${base}/en/${countrySlug}/${citySlug}/${theme.slug}`,
      },
    },
  }))

  // English URLs
  const enCountryPages = COUNTRIES.map(country => ({
    url: `${base}/en/${country.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
    alternates: {
      languages: {
        ko: `${base}/${country.slug}`,
        en: `${base}/en/${country.slug}`,
      },
    },
  }))

  const enCityPages = COUNTRIES.flatMap(country =>
    country.cities.map(city => ({
      url: `${base}/en/${country.slug}/${city.nameEn}`,
      lastModified: new Date(),
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

  const enHotelPages = getAllHotels().map(({ countrySlug, citySlug, hotel }) => ({
    url: `${base}/en/${countrySlug}/${citySlug}/hotel/${hotelSlug(hotel)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
    alternates: {
      languages: {
        ko: `${base}/${countrySlug}/${citySlug}/hotel/${hotelSlug(hotel)}`,
        en: `${base}/en/${countrySlug}/${citySlug}/hotel/${hotelSlug(hotel)}`,
      },
    },
  }))

  const enThemePages = getAllThemeCombos().map(({ countrySlug, citySlug, theme }) => ({
    url: `${base}/en/${countrySlug}/${citySlug}/${theme.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.75,
    alternates: {
      languages: {
        ko: `${base}/${countrySlug}/${citySlug}/${theme.slug}`,
        en: `${base}/en/${countrySlug}/${citySlug}/${theme.slug}`,
      },
    },
  }))

  return [
    {
      url: base,
      lastModified: new Date(),
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
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
      alternates: {
        languages: {
          ko: base,
          en: `${base}/en`,
        },
      },
    },
    ...koCountryPages,
    ...koCityPages,
    ...koThemePages,
    ...enCountryPages,
    ...enCityPages,
    ...enThemePages,
    ...koHotelPages,
    ...enHotelPages,
  ]
}
