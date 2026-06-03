// 구글 애즈 API — 일자별 광고비 조회
// 자격증명/개발자 토큰이 없으면 샘플 데이터로 폴백한다(심사 중에도 화면이 돌아가게).
import { getAccessToken } from './oauth'
import { eachDay } from './types'

const API_VERSION = 'v18'

/** 구글 애즈 실데이터를 쓸 수 있는 상태인지 */
export function adsConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_ADS_DEVELOPER_TOKEN &&
      process.env.GOOGLE_ADS_CUSTOMER_ID &&
      process.env.GOOGLE_OAUTH_REFRESH_TOKEN
  )
}

/** 일자별 광고비 맵 { 'YYYY-MM-DD': cost } 반환. 실패/미설정 시 null */
export async function fetchAdsCost(
  startDate: string,
  endDate: string
): Promise<Record<string, number> | null> {
  if (!adsConfigured()) return null

  const token = await getAccessToken()
  if (!token) return null

  const customerId = process.env.GOOGLE_ADS_CUSTOMER_ID!.replace(/-/g, '')
  const loginCustomerId = process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID?.replace(/-/g, '')

  // GAQL: 세그먼트 날짜별 비용. metrics.cost_micros 는 1,000,000 = 1단위 통화
  const query = `
    SELECT segments.date, metrics.cost_micros
    FROM campaign
    WHERE segments.date BETWEEN '${startDate}' AND '${endDate}'
  `.trim()

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    'developer-token': process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
    'Content-Type': 'application/json',
  }
  if (loginCustomerId) headers['login-customer-id'] = loginCustomerId

  try {
    const res = await fetch(
      `https://googleads.googleapis.com/${API_VERSION}/customers/${customerId}/googleAds:searchStream`,
      { method: 'POST', headers, body: JSON.stringify({ query }) }
    )

    if (!res.ok) {
      console.error('[roas/ads] 조회 실패:', res.status, await res.text())
      return null
    }

    // searchStream 은 배열 형태로 청크를 돌려줌
    const chunks = (await res.json()) as Array<{
      results?: Array<{
        segments?: { date?: string }
        metrics?: { costMicros?: string }
      }>
    }>

    const map: Record<string, number> = {}
    for (const d of eachDay(startDate, endDate)) map[d] = 0
    for (const chunk of chunks) {
      for (const row of chunk.results ?? []) {
        const date = row.segments?.date
        const micros = Number(row.metrics?.costMicros ?? 0)
        if (date) map[date] = (map[date] ?? 0) + micros / 1_000_000
      }
    }
    return map
  } catch (err) {
    console.error('[roas/ads] 예외:', err)
    return null
  }
}

/** 결정적 샘플 데이터(날짜 기반) — 데모/심사용. 통화: USD 가정 */
export function sampleAdsCost(startDate: string, endDate: string): Record<string, number> {
  const map: Record<string, number> = {}
  for (const d of eachDay(startDate, endDate)) {
    const seed = Number(d.replace(/-/g, '')) % 97
    map[d] = Math.round((8 + seed * 0.42) * 100) / 100 // 약 $8~$48
  }
  return map
}
