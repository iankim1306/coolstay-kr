// 애드몹 API — 일자별 앱 광고수익 조회 (networkReport)
// 자격증명이 없으면 샘플 데이터로 폴백한다.
import { getAccessToken } from './oauth'
import { eachDay, type AppRow } from './types'

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

/** 앱별 성과 조회 (networkReport, dimension=APP). 실패/미설정 시 null */
export async function fetchAdmobByApp(
  startDate: string,
  endDate: string
): Promise<AppRow[] | null> {
  if (!admobConfigured()) return null

  const token = await getAccessToken()
  if (!token) return null

  const publisherId = process.env.ADMOB_PUBLISHER_ID!

  const body = {
    reportSpec: {
      dateRange: { startDate: ymd(startDate), endDate: ymd(endDate) },
      dimensions: ['APP'],
      metrics: [
        'ESTIMATED_EARNINGS',
        'IMPRESSIONS',
        'CLICKS',
        'AD_REQUESTS',
        'MATCHED_REQUESTS',
        'IMPRESSION_CTR',
        'MATCH_RATE',
        'IMPRESSION_RPM', // = AdMob UI의 eCPM (1000 노출당 추정수익)
      ],
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
      console.error('[roas/admob/app] 조회 실패:', res.status, await res.text())
      return null
    }

    const rows = (await res.json()) as Array<{
      row?: {
        dimensionValues?: { APP?: { value?: string; displayLabel?: string } }
        metricValues?: Record<
          string,
          { microsValue?: string; integerValue?: string; doubleValue?: number }
        >
      }
    }>

    const apps: AppRow[] = []
    for (const item of rows) {
      const r = item.row
      if (!r?.dimensionValues?.APP) continue
      const m = r.metricValues ?? {}
      const int = (k: string) => Number(m[k]?.integerValue ?? 0)
      const micros = (k: string) => Number(m[k]?.microsValue ?? 0) / 1_000_000
      const dbl = (k: string) => Number(m[k]?.doubleValue ?? 0)
      apps.push({
        appId: r.dimensionValues.APP.value ?? '',
        appName: r.dimensionValues.APP.displayLabel || r.dimensionValues.APP.value || '(이름 없음)',
        earnings: round2(micros('ESTIMATED_EARNINGS')),
        impressions: int('IMPRESSIONS'),
        clicks: int('CLICKS'),
        adRequests: int('AD_REQUESTS'),
        matchedRequests: int('MATCHED_REQUESTS'),
        ctr: dbl('IMPRESSION_CTR'),
        matchRate: dbl('MATCH_RATE'),
        ecpm: round2(micros('IMPRESSION_RPM')),
      })
    }
    apps.sort((a, b) => b.earnings - a.earnings)
    return apps
  } catch (err) {
    console.error('[roas/admob/app] 예외:', err)
    return null
  }
}

function round2(n: number): number {
  return Math.round(n * 100) / 100
}

/** 앱별 샘플 — 데모용 (실데이터 미연결 시) */
export function sampleAdmobByApp(): AppRow[] {
  const names = [
    'FIRE Calculator',
    '음력 달력',
    '큰글씨 돋보기',
    'RSU Calculator',
    'Dividend Tracker',
  ]
  return names.map((name, i) => {
    const impressions = 1200 - i * 180
    const clicks = Math.round(impressions * (0.02 + i * 0.003))
    const adRequests = Math.round(impressions / (0.55 + i * 0.05))
    const earnings = round2((impressions / 1000) * (1.2 + i * 0.15))
    return {
      appId: `sample-${i}`,
      appName: name,
      earnings,
      impressions,
      clicks,
      adRequests,
      matchedRequests: Math.round(adRequests * (0.9 - i * 0.05)),
      ctr: clicks / impressions,
      matchRate: 0.9 - i * 0.05,
      ecpm: round2((earnings / impressions) * 1000),
    }
  })
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
