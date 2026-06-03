// ROAS 대시보드 공용 타입 & 날짜 헬퍼

/** 하루치 집계 한 줄 */
export type DailyRow = {
  date: string // YYYY-MM-DD
  cost: number // 광고비 (구글 애즈)
  revenue: number // 앱 수익 (애드몹)
}

/** ROAS가 계산된 하루치 행.
 *  광고 애즈 미연결(토큰 승인 전)이면 cost/profit/roas 는 null = "대기중". */
export type DailyRowComputed = {
  date: string
  revenue: number // 앱 수익 (애드몹) — 항상 값 있음
  cost: number | null // 광고비 (구글 애즈) — 미연결 시 null
  profit: number | null // 순수익 — cost 없으면 null
  roas: number | null // ROAS(%) — cost 없으면 null
}

/** API 응답 전체 */
export type RoasResponse = {
  range: { startDate: string; endDate: string; label: string }
  currency: string
  totals: {
    cost: number | null
    revenue: number
    profit: number | null
    roas: number | null
  }
  rows: DailyRowComputed[]
  /** 구글 애즈 토큰 승인 대기 상태(광고비 데이터 없음) */
  adsPending: boolean
  /** 데이터 출처. ads: 연결됨/승인대기, admob: 실데이터/샘플 */
  source: {
    ads: 'live' | 'pending'
    admob: 'live' | 'sample'
  }
  generatedAt: string
}

/** 통화 코드 (애드몹 localizationSettings로 서버 변환) */
export type Currency = 'USD' | 'KRW'
export const CURRENCIES: Currency[] = ['USD', 'KRW']

/** 애드몹 호출 인증 컨텍스트 (로그인 유저별) */
export type AdmobAuth = { accessToken: string; publisherId: string }

/** 앱별 성과 한 줄 (애드몹 APP 단위) */
export type AppRow = {
  appId: string
  appName: string
  earnings: number // 수익
  impressions: number // 노출
  clicks: number // 클릭
  adRequests: number // 광고 요청
  matchedRequests: number // 매칭된 요청
  ctr: number // 노출 CTR (0~1)
  matchRate: number // 일치율 (0~1)
  ecpm: number // eCPM (수익/노출*1000)
  spark: number[] // 일자별 수익 시계열 (스파크라인용, 오래된→최신)
}

/** 앱별 성과 API 응답 */
export type AppsResponse = {
  range: { startDate: string; endDate: string; label: string }
  currency: string
  apps: AppRow[]
  source: 'live' | 'sample'
  generatedAt: string
}

/** 앱 메타데이터 (앱 관리 페이지) */
export type AppMeta = {
  appId: string
  appName: string
  platform: string // ANDROID / IOS
  storeId: string // 패키지명 또는 앱스토어 ID
  approvalState: string // 승인 상태
  linked: boolean // 스토어 연결 여부
  iconUrl?: string // 스토어 아이콘 URL (있으면)
}

export type AppListResponse = {
  apps: AppMeta[]
  source: 'live' | 'sample'
  generatedAt: string
}

export type DateRangeKey = 'today' | 'yesterday' | '7d' | '30d'

/** KST(GMT+9) 기준 '오늘'을 가리키는 Date — 서버가 UTC여도 한국 날짜로 맞춤.
 *  반환값의 연/월/일(getFullYear 등)이 한국 기준 오늘이 되도록 보정한다. */
export function kstToday(): Date {
  const now = new Date()
  // UTC 기준 절대시각 + 9시간 → 그 값을 로컬로 읽으면 한국 날짜가 됨
  const kstMs = now.getTime() + now.getTimezoneOffset() * 60_000 + 9 * 60 * 60_000
  return new Date(kstMs)
}

export function fmtDate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** range 키 → 시작/끝 날짜 + 한글 라벨 */
export function resolveRange(key: DateRangeKey): {
  startDate: string
  endDate: string
  label: string
} {
  const today = kstToday()
  const end = new Date(today)
  const start = new Date(today)
  let label = ''

  switch (key) {
    case 'today':
      label = '오늘'
      break
    case 'yesterday':
      start.setDate(start.getDate() - 1)
      end.setDate(end.getDate() - 1)
      label = '어제'
      break
    case '7d':
      start.setDate(start.getDate() - 6)
      label = '최근 7일'
      break
    case '30d':
      start.setDate(start.getDate() - 29)
      label = '최근 30일'
      break
  }
  return { startDate: fmtDate(start), endDate: fmtDate(end), label }
}

/** 시작~끝 사이 모든 날짜 배열 (YYYY-MM-DD) */
export function eachDay(startDate: string, endDate: string): string[] {
  const out: string[] = []
  const cur = new Date(startDate + 'T00:00:00Z')
  const end = new Date(endDate + 'T00:00:00Z')
  while (cur <= end) {
    out.push(fmtDate(new Date(cur.getTime())))
    cur.setUTCDate(cur.getUTCDate() + 1)
  }
  return out
}
