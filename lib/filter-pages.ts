// 롱테일 키워드 필터 페이지 정의
// /[country]/[city]/under-100, /[country]/[city]/rating-9 등

import type { Hotel } from './hotels'
import { getHotelsByCity, getAllCityKeys } from './hotels'

export type FilterDef = {
  slug: string
  label: string         // "100불 미만"
  longLabel: string     // "100달러 미만 호텔"
  intro: (cityName: string) => string
  filter: (h: Hotel) => boolean
  score: (h: Hotel) => number
  /** 환경적으로 의미가 없을 경우 자동 제외할 도시 — null이면 전부 적용 */
  exclude?: string[]
}

const ratingScore = (h: Hotel) => {
  const r = parseFloat(h.rating_average) || 0
  const n = parseInt(h.number_of_reviews) || 0
  return r * Math.log(n + 1)
}

export const FILTERS: FilterDef[] = [
  // 가격대
  {
    slug: 'under-50',
    label: '50불 미만',
    longLabel: '50달러 미만 호텔',
    intro: (c) => `${c}에서 1박 50달러 미만으로 묵을 수 있는 호텔. 평점 7.5+ 검증된 가성비 숙소만 모았습니다.`,
    filter: (h) => {
      const p = parseFloat(h.rates_from) || 0
      return p > 0 && p < 50 && (parseFloat(h.rating_average) || 0) >= 7.5
    },
    score: ratingScore,
  },
  {
    slug: 'under-100',
    label: '100불 미만',
    longLabel: '100달러 미만 호텔',
    intro: (c) => `${c}에서 1박 100달러 이내 가성비 호텔 추천. 위치 좋고 평점 8.0+ 호텔 위주.`,
    filter: (h) => {
      const p = parseFloat(h.rates_from) || 0
      return p > 0 && p < 100 && (parseFloat(h.rating_average) || 0) >= 7.5
    },
    score: ratingScore,
  },
  {
    slug: 'under-200',
    label: '200불 미만',
    longLabel: '200달러 미만 호텔',
    intro: (c) => `${c} 1박 200달러 이내 중급 호텔. 4성급 평점 8.0+ 위주로 선별했습니다.`,
    filter: (h) => {
      const p = parseFloat(h.rates_from) || 0
      return p > 0 && p < 200 && (parseFloat(h.rating_average) || 0) >= 8.0
    },
    score: ratingScore,
  },
  // 평점
  {
    slug: 'rating-9',
    label: '평점 9+',
    longLabel: '평점 9점 이상 호텔',
    intro: (c) => `${c}에서 실제 투숙객 평점 9.0 이상을 받은 최고 호텔만 모았습니다. 리뷰 100개 이상 검증.`,
    filter: (h) => (parseFloat(h.rating_average) || 0) >= 9.0 && (parseInt(h.number_of_reviews) || 0) >= 100,
    score: (h) => parseFloat(h.rating_average) * Math.log((parseInt(h.number_of_reviews) || 0) + 1),
  },
  {
    slug: 'rating-8',
    label: '평점 8+',
    longLabel: '평점 8점 이상 호텔',
    intro: (c) => `${c} 평점 8.0+ 안전 선택. 리뷰 50개 이상 검증된 호텔만.`,
    filter: (h) => (parseFloat(h.rating_average) || 0) >= 8.0 && (parseInt(h.number_of_reviews) || 0) >= 50,
    score: ratingScore,
  },
  // 리뷰 수
  {
    slug: 'most-reviewed',
    label: '리뷰 많은',
    longLabel: '리뷰 많은 인기 호텔',
    intro: (c) => `${c}에서 가장 많은 리뷰가 쌓인 검증된 호텔. 한국인이 가장 많이 다녀가는 곳들입니다.`,
    filter: (h) => (parseInt(h.number_of_reviews) || 0) >= 500 && (parseFloat(h.rating_average) || 0) >= 7.5,
    score: (h) => parseInt(h.number_of_reviews) || 0,
  },
]

export const FILTER_MAP: Record<string, FilterDef> = Object.fromEntries(FILTERS.map(f => [f.slug, f]))

export function getFilter(slug: string): FilterDef | null {
  return FILTER_MAP[slug] ?? null
}

export function getFilteredHotels(countrySlug: string, citySlug: string, filter: FilterDef, limit = 20): Hotel[] {
  const hotels = getHotelsByCity(countrySlug, citySlug)
  return hotels
    .filter(filter.filter)
    .sort((a, b) => filter.score(b) - filter.score(a))
    .slice(0, limit)
}

/** 모든 (도시 × 필터) 조합 — 3개 이상 매칭되어야 페이지 생성 */
export function getAllFilterCombos(): Array<{
  countrySlug: string
  citySlug: string
  filter: FilterDef
  count: number
}> {
  const result: Array<{ countrySlug: string; citySlug: string; filter: FilterDef; count: number }> = []
  for (const key of getAllCityKeys()) {
    const [countrySlug, citySlug] = key.split('/')
    const hotels = getHotelsByCity(countrySlug, citySlug)
    for (const filter of FILTERS) {
      const matched = hotels.filter(filter.filter).length
      if (matched >= 5) {
        result.push({ countrySlug, citySlug, filter, count: matched })
      }
    }
  }
  return result
}

export function getAvailableFilters(countrySlug: string, citySlug: string): FilterDef[] {
  const hotels = getHotelsByCity(countrySlug, citySlug)
  return FILTERS.filter((f) => hotels.filter(f.filter).length >= 5)
}
