import type { Hotel } from './hotels'
import { hotelPhotoUrl, hotelSlug } from './hotels'

const SITE = 'https://coolstay.kr'
const BRAND = '쿨스테이'

type BreadcrumbItem = { name: string; url: string }

export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  }
}

export function hotelJsonLd(
  hotel: Hotel,
  countrySlug: string,
  citySlug: string,
  cityName: string,
  countryName: string
) {
  const url = `${SITE}/${countrySlug}/${citySlug}/hotel/${hotelSlug(hotel)}`
  const rating = parseFloat(hotel.rating_average) || 0
  const reviews = parseInt(hotel.number_of_reviews) || 0
  const stars = parseInt(hotel.star_rating) || 0
  const price = parseFloat(hotel.rates_from) || 0

  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Hotel',
    '@id': url,
    name: hotel.name,
    url,
    description: hotel.description_ko?.slice(0, 500) || `${cityName} ${hotel.name}`,
    image: hotel.photos.slice(0, 5).map((p) => hotelPhotoUrl(p, 1280)),
    address: {
      '@type': 'PostalAddress',
      streetAddress: hotel.address,
      addressLocality: cityName,
      addressRegion: hotel.state || undefined,
      postalCode: hotel.zipcode || undefined,
      addressCountry: countryName,
    },
    telephone: undefined,
    priceRange: price > 0 ? `${hotel.rates_currency || 'USD'} ${Math.round(price)}~` : undefined,
  }

  if (stars > 0) {
    data.starRating = { '@type': 'Rating', ratingValue: stars, bestRating: 5 }
  }

  if (rating > 0 && reviews > 0) {
    data.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: rating.toFixed(1),
      bestRating: 10,
      worstRating: 1,
      ratingCount: reviews,
      reviewCount: reviews,
    }
  }

  if (hotel.latitude && hotel.longitude) {
    const lat = parseFloat(hotel.latitude)
    const lng = parseFloat(hotel.longitude)
    if (!isNaN(lat) && !isNaN(lng)) {
      data.geo = { '@type': 'GeoCoordinates', latitude: lat, longitude: lng }
    }
  }

  if (hotel.checkin) data.checkinTime = hotel.checkin
  if (hotel.checkout) data.checkoutTime = hotel.checkout

  return data
}

export function itemListJsonLd(
  hotels: Hotel[],
  countrySlug: string,
  citySlug: string,
  listUrl: string,
  listName: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: listName,
    url: listUrl,
    numberOfItems: hotels.length,
    itemListElement: hotels.map((h, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${SITE}/${countrySlug}/${citySlug}/hotel/${hotelSlug(h)}`,
      name: h.name,
    })),
  }
}

export function faqJsonLd(items: Array<{ q: string; a: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.q,
      acceptedAnswer: { '@type': 'Answer', text: it.a },
    })),
  }
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: BRAND,
    alternateName: 'COOLSTAY',
    url: SITE,
    logo: `${SITE}/icon.svg`,
    description: '일본·동남아 해외 호텔을 아고다 최저가로 비교하는 한국어 예약 사이트',
  }
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: BRAND,
    alternateName: 'COOLSTAY',
    url: SITE,
    inLanguage: 'ko-KR',
  }
}

/** TouristDestination + AggregateRating for city pages */
export function touristDestinationJsonLd({
  cityName,
  countryName,
  url,
  description,
  image,
  hotels,
}: {
  cityName: string
  countryName: string
  url: string
  description: string
  image: string
  hotels: Hotel[]
}) {
  // Aggregate rating across all hotels in this city
  const validHotels = hotels.filter(h => parseFloat(h.rating_average) > 0 && parseInt(h.number_of_reviews) > 0)
  const totalReviews = validHotels.reduce((sum, h) => sum + parseInt(h.number_of_reviews), 0)
  const weightedSum = validHotels.reduce(
    (sum, h) => sum + parseFloat(h.rating_average) * parseInt(h.number_of_reviews),
    0
  )
  const avgRating = totalReviews > 0 ? (weightedSum / totalReviews) : 0

  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    name: cityName,
    url,
    description,
    image,
    touristType: ['Couples', 'Families', 'Honeymooners', 'Solo travelers'],
    includesAttraction: undefined,
  }

  if (totalReviews > 0 && avgRating > 0) {
    data.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: avgRating.toFixed(1),
      bestRating: 10,
      worstRating: 1,
      ratingCount: totalReviews,
      reviewCount: totalReviews,
      itemReviewed: { '@type': 'Place', name: cityName, address: countryName },
    }
  }

  return data
}

/** Place schema for individual attractions */
export function attractionJsonLd(name: string, description: string, cityName: string, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    name,
    description,
    url,
    address: { '@type': 'PostalAddress', addressLocality: cityName },
  }
}

/** Hotel review (single) — synthesized from aggregate data */
export function hotelReviewJsonLd(hotel: Hotel, cityName: string, url: string) {
  const rating = parseFloat(hotel.rating_average) || 0
  if (rating < 7) return null
  const ratingLabel =
    rating >= 9 ? '최고' : rating >= 8 ? '매우 좋음' : '좋음'
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': 'Hotel',
      name: hotel.name,
      address: { '@type': 'PostalAddress', addressLocality: cityName },
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: rating.toFixed(1),
      bestRating: 10,
      worstRating: 1,
    },
    name: `${hotel.name} ${ratingLabel}`,
    author: { '@type': 'Organization', name: 'COOLSTAY' },
    reviewBody: `${hotel.name}은 실제 투숙객 ${parseInt(hotel.number_of_reviews).toLocaleString()}명 리뷰 평균 ${rating.toFixed(1)}점을 받은 ${cityName} 호텔입니다.`,
    publisher: { '@type': 'Organization', name: 'COOLSTAY', url: SITE },
  }
}

/** SearchAction for site-wide search */
export function searchActionJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: SITE,
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${SITE}/api/search?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  }
}

/** <script type="application/ld+json"> 용 prop helper */
export function ldJson(data: unknown) {
  return {
    type: 'application/ld+json',
    dangerouslySetInnerHTML: { __html: JSON.stringify(data) },
  }
}
