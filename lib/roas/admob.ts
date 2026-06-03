// 애드몹 API — 일자별 수익 / 앱별 성과 / 앱 목록 조회
// 호출마다 유저 인증(auth: accessToken + publisherId)을 받는다. 멀티유저.
import { eachDay, type AppRow, type AppMeta, type Currency, type AdmobAuth } from './types'

function ymd(date: string) {
  const [year, month, day] = date.split('-').map(Number)
  return { year, month, day }
}
function round2(n: number): number {
  return Math.round(n * 100) / 100
}
function ymdToIso(raw?: string): string | null {
  if (!raw || raw.length !== 8) return null
  return `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`
}

async function postReport(auth: AdmobAuth, body: unknown) {
  return fetch(
    `https://admob.googleapis.com/v1/accounts/${auth.publisherId}/networkReport:generate`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${auth.accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }
  )
}

/** 로그인 유저의 애드몹 게시자ID 조회 (accounts.list). 없으면 null */
export async function fetchPublisherId(accessToken: string): Promise<string | null> {
  try {
    const res = await fetch('https://admob.googleapis.com/v1/accounts', {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    if (!res.ok) {
      console.error('[roas/admob/accounts] 실패:', res.status, await res.text())
      return null
    }
    const j = (await res.json()) as { account?: Array<{ name?: string; publisherId?: string }> }
    const acc = j.account?.[0]
    if (acc?.publisherId) return acc.publisherId
    // name = "accounts/pub-XXXX"
    const m = acc?.name?.match(/accounts\/(pub-\w+)/)
    return m?.[1] ?? null
  } catch (err) {
    console.error('[roas/admob/accounts] 예외:', err)
    return null
  }
}

/** 일자별 수익 맵 { 'YYYY-MM-DD': revenue }. 실패 시 null */
export async function fetchAdmobRevenue(
  startDate: string,
  endDate: string,
  currency: Currency,
  auth: AdmobAuth
): Promise<Record<string, number> | null> {
  const body = {
    reportSpec: {
      dateRange: { startDate: ymd(startDate), endDate: ymd(endDate) },
      dimensions: ['DATE'],
      metrics: ['ESTIMATED_EARNINGS'],
      localizationSettings: { currencyCode: currency },
    },
  }
  try {
    const res = await postReport(auth, body)
    if (!res.ok) {
      console.error('[roas/admob] 조회 실패:', res.status, await res.text())
      return null
    }
    const rows = (await res.json()) as Array<{
      row?: {
        dimensionValues?: { DATE?: { value?: string } }
        metricValues?: { ESTIMATED_EARNINGS?: { microsValue?: string } }
      }
    }>
    const map: Record<string, number> = {}
    for (const d of eachDay(startDate, endDate)) map[d] = 0
    for (const item of rows) {
      const date = ymdToIso(item.row?.dimensionValues?.DATE?.value)
      const micros = Number(item.row?.metricValues?.ESTIMATED_EARNINGS?.microsValue ?? 0)
      if (date) map[date] = (map[date] ?? 0) + micros / 1_000_000
    }
    return map
  } catch (err) {
    console.error('[roas/admob] 예외:', err)
    return null
  }
}

/** 앱별 성과 (APP+DATE → 스파크라인 포함). 실패 시 null */
export async function fetchAdmobByApp(
  startDate: string,
  endDate: string,
  currency: Currency,
  auth: AdmobAuth
): Promise<AppRow[] | null> {
  const days = eachDay(startDate, endDate)
  const body = {
    reportSpec: {
      dateRange: { startDate: ymd(startDate), endDate: ymd(endDate) },
      dimensions: ['APP', 'DATE'],
      metrics: ['ESTIMATED_EARNINGS', 'IMPRESSIONS', 'CLICKS', 'AD_REQUESTS', 'MATCHED_REQUESTS'],
      localizationSettings: { currencyCode: currency },
    },
  }
  try {
    const res = await postReport(auth, body)
    if (!res.ok) {
      console.error('[roas/admob/app] 조회 실패:', res.status, await res.text())
      return null
    }
    const rows = (await res.json()) as Array<{
      row?: {
        dimensionValues?: {
          APP?: { value?: string; displayLabel?: string }
          DATE?: { value?: string }
        }
        metricValues?: Record<string, { microsValue?: string; integerValue?: string }>
      }
    }>

    type Acc = {
      name: string
      earnings: number
      impressions: number
      clicks: number
      adRequests: number
      matchedRequests: number
      daily: Record<string, number>
    }
    const accs = new Map<string, Acc>()
    for (const item of rows) {
      const app = item.row?.dimensionValues?.APP
      if (!app) continue
      const id = app.value ?? ''
      const m = item.row?.metricValues ?? {}
      const int = (k: string) => Number(m[k]?.integerValue ?? 0)
      const micros = (k: string) => Number(m[k]?.microsValue ?? 0) / 1_000_000
      const date = ymdToIso(item.row?.dimensionValues?.DATE?.value)
      let acc = accs.get(id)
      if (!acc) {
        acc = { name: app.displayLabel || id || '(이름 없음)', earnings: 0, impressions: 0, clicks: 0, adRequests: 0, matchedRequests: 0, daily: {} }
        accs.set(id, acc)
      }
      const e = micros('ESTIMATED_EARNINGS')
      acc.earnings += e
      acc.impressions += int('IMPRESSIONS')
      acc.clicks += int('CLICKS')
      acc.adRequests += int('AD_REQUESTS')
      acc.matchedRequests += int('MATCHED_REQUESTS')
      if (date) acc.daily[date] = (acc.daily[date] ?? 0) + e
    }

    const apps: AppRow[] = []
    for (const [id, a] of accs) {
      const earnings = round2(a.earnings)
      apps.push({
        appId: id,
        appName: a.name,
        earnings,
        impressions: a.impressions,
        clicks: a.clicks,
        adRequests: a.adRequests,
        matchedRequests: a.matchedRequests,
        ctr: a.impressions > 0 ? a.clicks / a.impressions : 0,
        matchRate: a.adRequests > 0 ? a.matchedRequests / a.adRequests : 0,
        ecpm: a.impressions > 0 ? round2((earnings / a.impressions) * 1000) : 0,
        spark: days.map((d) => round2(a.daily[d] ?? 0)),
      })
    }
    apps.sort((a, b) => b.earnings - a.earnings)
    return apps
  } catch (err) {
    console.error('[roas/admob/app] 예외:', err)
    return null
  }
}

/** 앱 목록 (accounts.apps.list). 실패 시 null */
export async function fetchAppList(auth: AdmobAuth): Promise<AppMeta[] | null> {
  try {
    const out: AppMeta[] = []
    let pageToken = ''
    do {
      const url = new URL(`https://admob.googleapis.com/v1/accounts/${auth.publisherId}/apps`)
      url.searchParams.set('pageSize', '1000')
      if (pageToken) url.searchParams.set('pageToken', pageToken)
      const res = await fetch(url, { headers: { Authorization: `Bearer ${auth.accessToken}` } })
      if (!res.ok) {
        console.error('[roas/admob/list] 조회 실패:', res.status, await res.text())
        return null
      }
      const json = (await res.json()) as {
        apps?: Array<{
          appId?: string
          platform?: string
          appApprovalState?: string
          manualAppInfo?: { displayName?: string }
          linkedAppInfo?: { displayName?: string; appStoreId?: string }
        }>
        nextPageToken?: string
      }
      for (const a of json.apps ?? []) {
        out.push({
          appId: a.appId ?? '',
          appName: a.linkedAppInfo?.displayName || a.manualAppInfo?.displayName || a.appId || '(이름 없음)',
          platform: a.platform ?? '-',
          storeId: a.linkedAppInfo?.appStoreId ?? '-',
          approvalState: a.appApprovalState ?? '-',
          linked: Boolean(a.linkedAppInfo?.appStoreId),
        })
      }
      pageToken = json.nextPageToken ?? ''
    } while (pageToken)
    return out
  } catch (err) {
    console.error('[roas/admob/list] 예외:', err)
    return null
  }
}

/* ───────────────────────── 샘플 데이터 (비로그인 데모) ───────────────────────── */

export function sampleAdmobByApp(startDate: string, endDate: string): AppRow[] {
  const days = eachDay(startDate, endDate)
  const names = ['FIRE Calculator', '음력 달력', '큰글씨 돋보기', 'RSU Calculator', 'Dividend Tracker']
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
      spark: days.map((d) => {
        const seed = Number(d.replace(/-/g, '')) % (17 + i * 3)
        return round2((earnings / days.length) * (0.6 + seed / 20))
      }),
    }
  })
}

export function sampleAppList(): AppMeta[] {
  const apps = [
    ['FIRE Calculator', 'com.example.firecalculator'],
    ['음력 달력', 'com.example.luna'],
    ['큰글씨 돋보기', 'com.example.magnifier'],
    ['RSU Calculator', 'com.example.rsucalc'],
    ['Dividend Tracker', 'com.example.dividend'],
  ]
  return apps.map(([appName, storeId], i) => ({
    appId: `sample-${i}`,
    appName,
    platform: 'ANDROID',
    storeId,
    approvalState: 'APPROVED',
    linked: true,
  }))
}

export function sampleAdmobRevenue(startDate: string, endDate: string): Record<string, number> {
  const map: Record<string, number> = {}
  for (const d of eachDay(startDate, endDate)) {
    const seed = Number(d.replace(/-/g, '')) % 89
    map[d] = Math.round((10 + seed * 0.55) * 100) / 100
  }
  return map
}
