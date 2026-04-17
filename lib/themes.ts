import type { Hotel } from './hotels'
import { getHotelsByCity, getAllCityKeys } from './hotels'

export type ThemeSlug = '5-star' | '4-star' | 'luxury' | 'family' | 'budget'

export type ThemeDef = {
  slug: ThemeSlug
  name: string        // 한글 테마명 (예: "5성급")
  label: string       // URL/상단 라벨 (예: "5성급 호텔")
  emoji: string
  /** "오사카 5성급 호텔" 식으로 조합되는 테마 설명용 키워드 */
  keyword: string
  /** 메타 description용 한 줄 설명 */
  intro: (cityName: string) => string
  /** 이 테마에 해당하는 호텔인지 */
  filter: (h: Hotel) => boolean
  /** 정렬: 높을수록 상위 */
  score: (h: Hotel) => number
}

const starScore = (h: Hotel) => {
  const r = parseFloat(h.rating_average) || 0
  const n = parseInt(h.number_of_reviews) || 0
  return r * Math.log(n + 1)
}

const priceNum = (h: Hotel) => {
  const p = parseFloat(h.rates_from)
  return isNaN(p) || p <= 0 ? 0 : p
}

export const THEMES: ThemeDef[] = [
  {
    slug: '5-star',
    name: '5성급',
    label: '5성급 호텔',
    emoji: '⭐',
    keyword: '5성급 호텔',
    intro: (c) => `${c}의 5성급 럭셔리 호텔을 실제 투숙객 리뷰 기준으로 추천합니다. 아고다 실시간 최저가를 한눈에 비교해 보세요.`,
    filter: (h) => h.star_rating === '5',
    score: starScore,
  },
  {
    slug: '4-star',
    name: '4성급',
    label: '4성급 호텔',
    emoji: '🏨',
    keyword: '4성급 호텔',
    intro: (c) => `${c}의 4성급 호텔 중 가성비와 평점이 우수한 곳을 모았습니다. 출장·여행·가족 여행에 두루 어울리는 선택지예요.`,
    filter: (h) => h.star_rating === '4',
    score: starScore,
  },
  {
    slug: 'luxury',
    name: '럭셔리',
    label: '럭셔리 호텔',
    emoji: '💎',
    keyword: '럭셔리 호텔',
    intro: (c) => `${c} 최고급 럭셔리 호텔 리스트. 5성급 중에서도 시그니처급으로 평가받는 곳들만 선별했습니다.`,
    filter: (h) => h.star_rating === '5' && (parseFloat(h.rating_average) || 0) >= 8.5,
    score: (h) => (parseFloat(h.rating_average) || 0) * 10 + Math.log(priceNum(h) + 1),
  },
  {
    slug: 'family',
    name: '가족여행',
    label: '가족호텔',
    emoji: '👨‍👩‍👧',
    keyword: '가족 호텔',
    intro: (c) => `${c} 아이와 함께 가기 좋은 가족형 호텔·리조트 모음. 넓은 객실과 편의시설이 잘 갖춰진 곳들을 우선 배치했습니다.`,
    filter: (h) => {
      const type = (h.accommodation_type || '').toLowerCase()
      const rooms = parseInt(h.rooms) || 0
      const isFamilyType = type.includes('hotel') || type.includes('resort') || type.includes('apartment')
      return isFamilyType && rooms >= 80 && (parseFloat(h.rating_average) || 0) >= 7.5
    },
    score: (h) => {
      const rating = parseFloat(h.rating_average) || 0
      const rooms = parseInt(h.rooms) || 0
      return rating * 2 + Math.log(rooms + 1)
    },
  },
  {
    slug: 'budget',
    name: '가성비',
    label: '가성비 호텔',
    emoji: '💰',
    keyword: '가성비 호텔',
    intro: (c) => `${c} 가성비 좋은 호텔 추천. 저렴한 가격대지만 평점 7.5 이상으로 검증된 숙소만 모았어요.`,
    filter: (h) => {
      const rating = parseFloat(h.rating_average) || 0
      const stars = parseInt(h.star_rating) || 0
      return rating >= 7.5 && stars <= 3 && stars >= 2
    },
    score: (h) => {
      const rating = parseFloat(h.rating_average) || 0
      const reviews = parseInt(h.number_of_reviews) || 0
      const price = priceNum(h)
      // 낮은 가격 + 높은 평점 + 많은 리뷰가 유리
      const priceFactor = price > 0 ? 1 / Math.log(price + 10) : 0.1
      return rating * Math.log(reviews + 1) * (0.5 + priceFactor)
    },
  },
]

export const THEME_MAP: Record<string, ThemeDef> = Object.fromEntries(
  THEMES.map((t) => [t.slug, t])
)

export function getTheme(slug: string): ThemeDef | null {
  return THEME_MAP[slug] ?? null
}

/** 특정 도시 + 테마의 상위 호텔 목록 */
export function getThemedHotels(
  countrySlug: string,
  citySlug: string,
  theme: ThemeDef,
  limit: number = 10
): Hotel[] {
  const hotels = getHotelsByCity(countrySlug, citySlug)
  return hotels
    .filter(theme.filter)
    .sort((a, b) => theme.score(b) - theme.score(a))
    .slice(0, limit)
}

/** 모든 (도시 × 테마) 조합 — sitemap / generateStaticParams 용 */
export function getAllThemeCombos(): Array<{
  countrySlug: string
  citySlug: string
  theme: ThemeDef
  count: number
}> {
  const result: Array<{ countrySlug: string; citySlug: string; theme: ThemeDef; count: number }> = []
  for (const key of getAllCityKeys()) {
    const [countrySlug, citySlug] = key.split('/')
    const hotels = getHotelsByCity(countrySlug, citySlug)
    for (const theme of THEMES) {
      const matched = hotels.filter(theme.filter).length
      // 3개 미만이면 리스트로서 가치가 낮아 제외 (404 대신 생성 안 함)
      if (matched >= 3) {
        result.push({ countrySlug, citySlug, theme, count: matched })
      }
    }
  }
  return result
}

/** 특정 도시에서 유효한 테마만 — 시티 페이지의 테마 네비에 사용 */
export function getAvailableThemes(countrySlug: string, citySlug: string): ThemeDef[] {
  const hotels = getHotelsByCity(countrySlug, citySlug)
  return THEMES.filter((t) => hotels.filter(t.filter).length >= 3)
}
