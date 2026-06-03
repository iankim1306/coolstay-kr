'use client'

export function money(n: number | null | undefined, currency: string): string {
  if (n == null) return '—'
  try {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency,
      maximumFractionDigits: currency === 'KRW' ? 0 : 2,
    }).format(n)
  } catch {
    return `${n.toFixed(2)} ${currency}`
  }
}

export function pct(n: number): string {
  return `${(n * 100).toFixed(1)}%`
}

export function num(n: number): string {
  return n.toLocaleString('ko-KR')
}

/** 작은 막대 스파크라인 (SVG) */
export function Sparkline({ data, color = '#fb923c' }: { data: number[]; color?: string }) {
  if (!data || data.length === 0) return <span className="text-gray-300">—</span>
  const max = Math.max(1, ...data)
  const w = 72
  const h = 22
  const bw = w / data.length
  return (
    <svg width={w} height={h} className="inline-block align-middle">
      {data.map((v, i) => {
        const bh = Math.max(1, (v / max) * h)
        return (
          <rect
            key={i}
            x={i * bw + 0.5}
            y={h - bh}
            width={Math.max(1, bw - 1)}
            height={bh}
            rx={0.5}
            fill={color}
            opacity={0.85}
          />
        )
      })}
    </svg>
  )
}

/** 요약 카드 */
export function Card({
  label,
  value,
  loading,
  accent,
  pending,
  sub,
}: {
  label: string
  value: string
  loading?: boolean
  accent?: 'pos' | 'neg'
  pending?: boolean
  sub?: string
}) {
  const color =
    accent === 'pos' ? 'text-emerald-600' : accent === 'neg' ? 'text-red-600' : 'text-gray-900'
  return (
    <div className="rounded-xl border border-gray-100 bg-white px-4 py-4 shadow-sm">
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      {loading ? (
        <div className="h-7 w-24 bg-gray-100 rounded animate-pulse" />
      ) : pending ? (
        <div className="text-sm font-medium text-gray-400 py-1.5">승인 대기중</div>
      ) : (
        <div className={`text-2xl font-bold ${color}`}>{value}</div>
      )}
      {sub && !loading && <div className="text-xs text-gray-400 mt-1">{sub}</div>}
    </div>
  )
}

export function SourceBanner({
  adsPending,
  admobSample,
}: {
  adsPending?: boolean
  admobSample?: boolean
}) {
  return (
    <>
      {adsPending && (
        <div className="mb-5 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
          ⏳ <b>구글 애즈 토큰 승인 대기중</b> — 광고비·순수익·ROAS는 승인 후 자동으로 채워집니다.
          현재는 <b>애드몹 실수익</b>만 표시됩니다.
        </div>
      )}
      {admobSample && (
        <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          ⚠️ 애드몹이 아직 연결되지 않아 <b>샘플 데이터</b>로 표시 중입니다.
        </div>
      )}
    </>
  )
}
