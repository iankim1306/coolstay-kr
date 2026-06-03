// 애드몹 API — 일자별 앱 광고수익 조회 (networkReport)
// 자격증명이 없으면 샘플 데이터로 폴백한다.
import { getAccessToken } from './oauth'
import { eachDay } from './types'

/** 애드몹 실데이터를 쓸 수 있는 상태인지 */
export function admobConfigured(): boolean {
  return Boolean(
    process.env.ADMOB_PUBLISHER_ID && process.env.GOOGLE_OAUTH_REFRESH_TOKEN
  )
}

function ymd(date: string) {
  const [year, month, day] = date.split('-').map(Number)
  return { year, month, day }
}

/** 일자별 수익 맵 { 'YYYY-MM-DD': revenue } 반환. 실패/미설정 시 null */
export async function fetchAdmobRevenue(
  startDate: string,
  endDate: string
): Promise<Record<string, number> | null> {
  if (!admobConfigured()) return null

  const token = await getAccessToken()
  if (!token) return null

  const publisherId = process.env.ADMOB_PUBLISHER_ID! // pub-XXXXXXXXXXXXXXXX

  const body = {
    reportSpec: {
      dateRange: { startDate: ymd(startDate), endDate: ymd(endDate) },
      dimensions: ['DATE'],
      metrics: ['ESTIMATED_EARNINGS'],
    },
  }

  try {
    const res = await fetch(
      `https://admob.googleapis.com/v1/accounts/${publisherId}/networkReport:generate`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    )

    if (!res.ok) {
      console.error('[roas/admob] 조회 실패:', res.status, await res.text())
      return null
    }

    // 응답은 줄단위(JSON 배열): header / row* / footer
    const rows = (await res.json()) as Array<{
      row?: {
        dimensionValues?: { DATE?: { value?: string } }
        metricValues?: { ESTIMATED_EARNINGS?: { microsValue?: string } }
      }
    }>

    const map: Record<string, number> = {}
    for (const d of eachDay(startDate, endDate)) map[d] = 0
    for (const item of rows) {
      const raw = item.row?.dimensionValues?.DATE?.value // 'YYYYMMDD'
      const micros = Number(item.row?.metricValues?.ESTIMATED_EARNINGS?.microsValue ?? 0)
      if (raw && raw.length === 8) {
        const date = `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`
        map[date] = (map[date] ?? 0) + micros / 1_000_000
      }
    }
    return map
  } catch (err) {
    console.error('[roas/admob] 예외:', err)
    return null
  }
}

/** 결정적 샘플 수익 — 데모/심사용. 광고비보다 살짝 높게(흑자 느낌) */
export function sampleAdmobRevenue(startDate: string, endDate: string): Record<string, number> {
  const map: Record<string, number> = {}
  for (const d of eachDay(startDate, endDate)) {
    const seed = Number(d.replace(/-/g, '')) % 89
    map[d] = Math.round((10 + seed * 0.55) * 100) / 100 // 약 $10~$58
  }
  return map
}
