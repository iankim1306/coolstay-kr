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

  // 별점(aggregateRating)은 넣지 않는다 — 서치콘솔 리뷰 스니펫 오류(2026-11-06)

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

/**
 * 허브 페이지(/near, /guide, /blog)가 자기 하위 페이지를 열거하는 목록.
 * 답변엔진이 "쿨스테이에 어떤 페이지가 있나"를 한 번에 읽게 하는 용도.
 */
export function linkListJsonLd(
  listName: string,
  listUrl: string,
  items: Array<{ name: string; url: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: listName,
    url: listUrl,
    numberOfItems: items.length,
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      url: it.url,
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
    description: '국내 숙박·여행 지원 제도와 숙소 예약·안전 정보를 공식 자료 기준으로 정리하는 정보 사이트',
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

  // TouristDestination 에는 별점을 붙일 수 없다(서치콘솔 '<parent_node>' 오류)
  void avgRating

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
// 자체 작성 리뷰는 구글 리뷰 스니펫 대상이 아니라 끈다(2026-11-06 서치콘솔 오류)
export function hotelReviewJsonLd(_hotel: Hotel, _cityName: string, _url: string): Record<string, unknown> | null {
  return null
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
