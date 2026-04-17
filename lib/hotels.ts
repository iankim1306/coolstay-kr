import hotelsData from './hotels.json'

export type Hotel = {
  hotel_id: string
  name: string
  chain: string | null
  address: string
  zipcode: string
  city: string
  state: string
  country: string
  star_rating: string
  longitude: string
  latitude: string
  checkin: string
  checkout: string
  rooms: string
  floors: string
  year_opened: string
  year_renovated: string
  photos: string[]
  overview_en: string
  rates_from: string
  rates_currency: string
  city_id: string
  country_id: string
  number_of_reviews: string
  rating_average: string
  accommodation_type: string
  description_ko: string
}

const AGODA_CID = '1962399'

/**
 * 호텔명을 URL slug로 변환
 * 예: "Hotel Hankyu RESPIRE OSAKA" → "hotel-hankyu-respire-osaka"
 */
export function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)
}

/**
 * 호텔 전체 slug (slug + hotel_id): URL 고유성 보장
 * 예: "hotel-hankyu-respire-osaka-2027"
 */
export function hotelSlug(hotel: Hotel): string {
  return `${toSlug(hotel.name)}-${hotel.hotel_id}`
}

/**
 * slug로부터 hotel_id 추출 (URL 파싱용)
 * "hotel-hankyu-respire-osaka-2027" → "2027"
 */
export function extractHotelId(slug: string): string | null {
  const match = slug.match(/-(\d+)$/)
  return match ? match[1] : null
}

/**
 * 아고다 호텔 직접 예약 링크
 */
export function agodaHotelLink(hotelId: string): string {
  return `https://www.agoda.com/partners/partnersearch.aspx?hid=${hotelId}&cid=${AGODA_CID}`
}

/**
 * 아고다 사진 URL을 고해상도 버전으로 변환
 * - http → https
 * - ?s=312x → ?s=1024x (원본에 가까운 사이즈)
 */
export function hotelPhotoUrl(url: string, width: number = 1024): string {
  if (!url) return url
  return url
    .replace(/^http:\/\//, 'https://')
    .replace(/([?&])s=\d+x/, `$1s=${width}x`)
}

/**
 * 도시별 호텔 목록
 */
export function getHotelsByCity(countrySlug: string, citySlug: string): Hotel[] {
  const key = `${countrySlug}/${citySlug}`
  return (hotelsData as Record<string, Hotel[]>)[key] ?? []
}

/**
 * 호텔 단일 조회 (slug로)
 */
export function getHotel(countrySlug: string, citySlug: string, slug: string): Hotel | null {
  const hotels = getHotelsByCity(countrySlug, citySlug)
  const hotelId = extractHotelId(slug)
  if (!hotelId) return null
  return hotels.find(h => h.hotel_id === hotelId) ?? null
}

/**
 * 전체 도시 키 목록 ("japan/osaka" 형태)
 */
export function getAllCityKeys(): string[] {
  return Object.keys(hotelsData as Record<string, Hotel[]>)
}

/**
 * 전체 호텔 (sitemap 생성용)
 */
export function getAllHotels(): Array<{ countrySlug: string; citySlug: string; hotel: Hotel }> {
  const result: Array<{ countrySlug: string; citySlug: string; hotel: Hotel }> = []
  for (const [key, hotels] of Object.entries(hotelsData as Record<string, Hotel[]>)) {
    const [countrySlug, citySlug] = key.split('/')
    for (const hotel of hotels) {
      result.push({ countrySlug, citySlug, hotel })
    }
  }
  return result
}
