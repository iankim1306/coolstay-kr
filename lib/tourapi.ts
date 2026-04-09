const BASE_URL = 'https://apis.data.go.kr/B551011/KorService2'
const API_KEY = process.env.TOUR_API_KEY!

// 지역코드 (areaCode)
export const AREA_CODES: Record<string, string> = {
  서울: '1',
  인천: '2',
  대전: '3',
  대구: '4',
  광주: '5',
  부산: '6',
  울산: '7',
  세종: '8',
  경기: '31',
  강원: '32',
  충북: '33',
  충남: '34',
  경북: '35',
  경남: '36',
  전북: '37',
  전남: '38',
  제주: '39',
}

// 숙박 목록 조회
export async function getStayList(params: {
  areaCode?: string
  sigunguCode?: string
  pageNo?: number
  numOfRows?: number
}) {
  const url = new URL(`${BASE_URL}/searchStay2`)
  url.searchParams.set('serviceKey', API_KEY)
  url.searchParams.set('MobileOS', 'ETC')
  url.searchParams.set('MobileApp', 'coolstay')
  url.searchParams.set('_type', 'json')
  url.searchParams.set('numOfRows', String(params.numOfRows ?? 20))
  url.searchParams.set('pageNo', String(params.pageNo ?? 1))
  if (params.areaCode) url.searchParams.set('areaCode', params.areaCode)
  if (params.sigunguCode) url.searchParams.set('sigunguCode', params.sigunguCode)

  const res = await fetch(url.toString(), { next: { revalidate: 86400 } })
  const data = await res.json()
  return data.response?.body?.items?.item ?? []
}

// 숙소 상세 정보 조회
export async function getStayDetail(contentId: string) {
  const url = new URL(`${BASE_URL}/detailCommon2`)
  url.searchParams.set('serviceKey', API_KEY)
  url.searchParams.set('MobileOS', 'ETC')
  url.searchParams.set('MobileApp', 'coolstay')
  url.searchParams.set('_type', 'json')
  url.searchParams.set('contentId', contentId)

  const res = await fetch(url.toString(), { next: { revalidate: 86400 } })
  const data = await res.json()
  return data.response?.body?.items?.item?.[0] ?? null
}

// 숙소 이미지 조회
export async function getStayImages(contentId: string) {
  const url = new URL(`${BASE_URL}/detailImage2`)
  url.searchParams.set('serviceKey', API_KEY)
  url.searchParams.set('MobileOS', 'ETC')
  url.searchParams.set('MobileApp', 'coolstay')
  url.searchParams.set('_type', 'json')
  url.searchParams.set('contentId', contentId)

  const res = await fetch(url.toString(), { next: { revalidate: 86400 } })
  const data = await res.json()
  return data.response?.body?.items?.item ?? []
}
