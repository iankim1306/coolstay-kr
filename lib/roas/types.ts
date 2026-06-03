// ROAS 대시보드 공용 타입 & 날짜 헬퍼

/** 하루치 집계 한 줄 */
export type DailyRow = {
  date: string // YYYY-MM-DD
  cost: number // 광고비 (구글 애즈)
  revenue: number // 앱 수익 (애드몹)
}

/** ROAS가 계산된 하루치 행 */
export type DailyRowComputed = DailyRow & {
  profit: number // 순수익 = revenue - cost
  roas: number // ROAS(%) = revenue / cost * 100 (cost 0이면 0)
}

/** API 응답 전체 */
export type RoasResponse = {
  range: { startDate: string; endDate: string; label: string }
  currency: string
  totals: {
    cost: number
    revenue: number
    profit: number
    roas: number
  }
  rows: DailyRowComputed[]
  /** 실데이터인지(both API 연결됨) / 일부 샘플인지 표시 */
  source: {
    ads: 'live' | 'sample'
    admob: 'live' | 'sample'
  }
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
