const AGODA_API_ENDPOINT = 'http://affiliateapi7643.agoda.com/affiliateservice/lt_v1'
const [SITE_ID, API_KEY] = (process.env.AGODA_API_KEY ?? ':').split(':')

export type AgodaHotelPrice = {
  hotelId: number
  hotelName: string
  dailyRate: number
  crossedOutRate: number
  discountPercentage: number
  currency: string
  reviewScore: number
  freeWifi: boolean
  includeBreakfast: boolean
  landingURL: string
  imageURL: string
}

/** 체크인 날짜 기본값: 오늘+14일 */
function defaultCheckin(): string {
  const d = new Date()
  d.setDate(d.getDate() + 14)
  return d.toISOString().slice(0, 10)
}

/** 체크아웃 날짜 기본값: 체크인+1 */
function defaultCheckout(checkin: string): string {
  const d = new Date(checkin)
  d.setDate(d.getDate() + 1)
  return d.toISOString().slice(0, 10)
}

/**
 * 특정 호텔 실시간 가격 조회
 */
export async function fetchHotelPrice(
  hotelId: string,
  checkin?: string,
  checkout?: string,
  currency = 'KRW'
): Promise<AgodaHotelPrice | null> {
  const cin = checkin ?? defaultCheckin()
  const cout = checkout ?? defaultCheckout(cin)

  const body = {
    criteria: {
      additional: {
        currency,
        language: 'ko-kr',
        occupancy: { numberOfAdult: 2, numberOfChildren: 0 },
      },
      checkInDate: cin,
      checkOutDate: cout,
      hotelId: [parseInt(hotelId)],
    },
  }

  try {
    const res = await fetch(AGODA_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Encoding': 'gzip,deflate',
        Authorization: `${SITE_ID}:${API_KEY}`,
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) return null
    const data = await res.json()
    if (data.error || !data.results?.length) return null
    return data.results[0] as AgodaHotelPrice
  } catch {
    return null
  }
}

/**
 * 도시 핫딜 TOP N 조회 (홈페이지용)
 */
export async function fetchCityHotDeals(
  cityId: number,
  maxResult = 6,
  currency = 'KRW'
): Promise<AgodaHotelPrice[]> {
  const cin = defaultCheckin()
  const cout = defaultCheckout(cin)

  const body = {
    criteria: {
      additional: {
        currency,
        language: 'ko-kr',
        maxResult,
        discountOnly: true,
        minimumReviewScore: 7,
        minimumStarRating: 3,
        sortBy: 'PriceAsc',
        occupancy: { numberOfAdult: 2, numberOfChildren: 0 },
      },
      checkInDate: cin,
      checkOutDate: cout,
      cityId,
    },
  }

  try {
    const res = await fetch(AGODA_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Encoding': 'gzip,deflate',
        Authorization: `${SITE_ID}:${API_KEY}`,
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) return []
    const data = await res.json()
    return data.results ?? []
  } catch {
    return []
  }
}
