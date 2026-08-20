import { getHotelsByCity, type Hotel } from '../hotels'
import type { Landmark, NearbyOptions } from './types'
import { JAPAN_LANDMARKS } from './data-japan'
import { ASIA_LANDMARKS } from './data-asia'

export type { Landmark, LandmarkCategory } from './types'
export { CATEGORY_LABEL } from './types'
export { LANDMARK_PHOTOS, landmarkPhoto, photoCredit } from './photos'
export type { PhotoCredit } from './photos'

export const LANDMARKS: Landmark[] = [...JAPAN_LANDMARKS, ...ASIA_LANDMARKS]

export function getLandmark(slug: string): Landmark | undefined {
  return LANDMARKS.find((l) => l.slug === slug)
}

/** 같은 도시의 다른 랜드마크 (내부 링크용) */
export function getLandmarksByCity(
  countryKey: string,
  cityKey: string,
  excludeSlug?: string
): Landmark[] {
  return LANDMARKS.filter(
    (l) => l.countryKey === countryKey && l.cityKey === cityKey && l.slug !== excludeSlug
  )
}

/** 도시 단위로 묶은 랜드마크 (인덱스 페이지용) */
export function getLandmarksGroupedByCity(): Array<{
  countryKey: string
  cityKey: string
  cityName: string
  landmarks: Landmark[]
}> {
  const map = new Map<string, { countryKey: string; cityKey: string; cityName: string; landmarks: Landmark[] }>()
  for (const l of LANDMARKS) {
    const key = `${l.countryKey}/${l.cityKey}`
    const entry = map.get(key)
    if (entry) entry.landmarks.push(l)
    else
      map.set(key, {
        countryKey: l.countryKey,
        cityKey: l.cityKey,
        cityName: l.cityName,
        landmarks: [l],
      })
  }
  return [...map.values()]
}

/* ------------------------------------------------------------------ */
/* GPS 근처 호텔 산출                                                   */
/* ------------------------------------------------------------------ */

const EARTH_RADIUS_KM = 6371

/** 두 좌표 간 직선거리(km) — Haversine */
export function distanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(a))
}

/**
 * 직선거리를 도보 분으로 환산.
 * 보행속도 4.5km/h + 우회계수 1.25 (직선거리는 실제 경로보다 짧으므로)
 */
export function walkMinutes(km: number): number {
  return Math.max(1, Math.round(((km * 1.25) / 4.5) * 60))
}

/** 직선거리를 차량 분으로 환산 (도심 평균 25km/h + 우회계수 1.3) */
export function driveMinutes(km: number): number {
  return Math.max(1, Math.round(((km * 1.3) / 25) * 60))
}

export type NearbyHotel = {
  hotel: Hotel
  km: number
  walkMin: number
  driveMin: number
  /** 도보로 갈 만한 거리인지 (1.5km 이내) */
  walkable: boolean
}

export type { NearbyOptions } from './types'

/**
 * 랜드마크 좌표 기준으로 가까운 순 호텔 목록.
 *
 * 선정 규칙(페이지에 그대로 노출한다):
 *   1) 평점 minRating 이상 + 리뷰 minReviews 건 이상 (품질 하한)
 *   2) 직선거리 maxKm 이내
 *   3) 가까운 순 정렬
 * 하한을 채우는 호텔이 limit보다 적으면 하한을 단계적으로 낮춰 채운다.
 */
export function getNearbyHotels(landmark: Landmark, options: NearbyOptions = {}): NearbyHotel[] {
  const limit = options.limit ?? 10
  const maxKm = options.maxKm ?? 8
  const minRating = options.minRating ?? 7.5
  const minReviews = options.minReviews ?? 50

  const all = getHotelsByCity(landmark.countryKey, landmark.cityKey)

  const withDistance = all
    .map((hotel) => {
      const lat = parseFloat(hotel.latitude)
      const lng = parseFloat(hotel.longitude)
      if (!isFinite(lat) || !isFinite(lng) || (lat === 0 && lng === 0)) return null
      const km = distanceKm(landmark.lat, landmark.lng, lat, lng)
      return { hotel, km }
    })
    .filter((x): x is { hotel: Hotel; km: number } => x !== null && x.km <= maxKm)
    .sort((a, b) => a.km - b.km)

  // 품질 하한을 단계적으로 완화하며 limit을 채운다
  const tiers: Array<{ rating: number; reviews: number }> = [
    { rating: minRating, reviews: minReviews },
    { rating: minRating - 0.5, reviews: Math.floor(minReviews / 2) },
    { rating: 0, reviews: 0 },
  ]

  let picked: Array<{ hotel: Hotel; km: number }> = []
  for (const tier of tiers) {
    picked = withDistance.filter(
      ({ hotel }) =>
        (parseFloat(hotel.rating_average) || 0) >= tier.rating &&
        (parseInt(hotel.number_of_reviews) || 0) >= tier.reviews
    )
    if (picked.length >= limit) break
  }

  return picked.slice(0, limit).map(({ hotel, km }) => ({
    hotel,
    km,
    walkMin: walkMinutes(km),
    driveMin: driveMinutes(km),
    walkable: km <= 1.5,
  }))
}

/** 거리 표기 ("450m" / "1.2km") */
export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round((km * 1000) / 10) * 10}m`
  return `${km.toFixed(1)}km`
}

/* ------------------------------------------------------------------ */
/* 좌표 → 가까운 명소 (호텔 상세페이지에서 /near 로 내부링크할 때 쓴다)   */
/* ------------------------------------------------------------------ */

export type NearbyLandmark = {
  landmark: Landmark
  km: number
  walkMin: number
  driveMin: number
  walkable: boolean
}

/**
 * 임의 좌표(=호텔 위치) 기준으로 같은 도시의 가까운 랜드마크 목록.
 * getNearbyHotels의 역방향. 호텔 7,800페이지 → /near 68페이지로 링크를 흘려보내
 * 새 롱테일 페이지의 색인을 앞당기는 용도.
 */
export function getLandmarksNearPoint(
  countryKey: string,
  cityKey: string,
  lat: number,
  lng: number,
  options: { limit?: number; maxKm?: number } = {}
): NearbyLandmark[] {
  const limit = options.limit ?? 4
  const maxKm = options.maxKm ?? 8
  if (!isFinite(lat) || !isFinite(lng) || (lat === 0 && lng === 0)) return []

  return LANDMARKS.filter((l) => l.countryKey === countryKey && l.cityKey === cityKey)
    .map((landmark) => {
      const km = distanceKm(lat, lng, landmark.lat, landmark.lng)
      return {
        landmark,
        km,
        walkMin: walkMinutes(km),
        driveMin: driveMinutes(km),
        walkable: km <= 1.5,
      }
    })
    .filter((x) => x.km <= maxKm)
    .sort((a, b) => a.km - b.km)
    .slice(0, limit)
}
