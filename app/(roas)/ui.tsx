'use client'

import { useState } from 'react'

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

/** 라인 + 영역 스파크라인 (SVG) */
export function Sparkline({ data, color = '#f97316' }: { data: number[]; color?: string }) {
  if (!data || data.length === 0) return <span className="text-gray-300">—</span>
  const w = 84
  const h = 26
  const pad = 2.5
  const max = Math.max(...data)
  const min = Math.min(...data, 0)
  const range = max - min || 1
  const id = `sg-${color.replace('#', '')}`

  const x = (i: number) =>
    data.length === 1 ? w / 2 : pad + (i * (w - pad * 2)) / (data.length - 1)
  const y = (v: number) => h - pad - ((v - min) / range) * (h - pad * 2)

  if (data.length === 1) {
    return (
      <svg width={w} height={h} className="inline-block align-middle">
        <circle cx={w / 2} cy={y(data[0])} r={2.5} fill={color} />
      </svg>
    )
  }

  const line = data.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ')
  const area = `${pad},${h - pad} ${line} ${(w - pad).toFixed(1)},${h - pad}`

  return (
    <svg width={w} height={h} className="inline-block align-middle overflow-visible">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#${id})`} />
      <polyline
        points={line}
        fill="none"
        stroke={color}
        strokeWidth="1.6"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}

const TONES: Record<string, { bg: string; fg: string }> = {
  emerald: { bg: 'bg-emerald-50', fg: 'text-emerald-600' },
  blue: { bg: 'bg-blue-50', fg: 'text-blue-600' },
  violet: { bg: 'bg-violet-50', fg: 'text-violet-600' },
  orange: { bg: 'bg-orange-50', fg: 'text-orange-600' },
  gray: { bg: 'bg-gray-100', fg: 'text-gray-500' },
}

/** 요약 카드 (아이콘 배지 + 큰 숫자) */
export function Card({
  label,
  value,
  loading,
  accent,
  pending,
  sub,
  icon,
  tone = 'gray',
}: {
  label: string
  value: string
  loading?: boolean
  accent?: 'pos' | 'neg'
  pending?: boolean
  sub?: string
  icon?: React.ReactNode
  tone?: keyof typeof TONES
}) {
  const color =
    accent === 'pos' ? 'text-emerald-600' : accent === 'neg' ? 'text-red-500' : 'text-gray-900'
  const t = TONES[tone]
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-gray-500">{label}</span>
        {icon && (
          <span className={`w-8 h-8 rounded-xl grid place-items-center ${t.bg} ${t.fg}`}>{icon}</span>
        )}
      </div>
      {loading ? (
        <div className="h-8 w-28 bg-gray-100 rounded-lg animate-pulse" />
      ) : pending ? (
        <div className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-400 py-1">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" /> 승인 대기중
        </div>
      ) : (
        <div className={`text-[28px] leading-8 font-bold tracking-tight ${color}`}>{value}</div>
      )}
      {sub && !loading && <div className="text-xs text-gray-400 mt-1.5">{sub}</div>}
    </div>
  )
}

/** 앱 아이콘 아바타 (이미지 실패 시 이니셜) */
export function AppIcon({
  name,
  src,
  size = 32,
}: {
  name: string
  src?: string
  size?: number
}) {
  const [err, setErr] = useState(false)
  const initial = (name || '?').trim().charAt(0).toUpperCase()
  const palette = ['bg-orange-100 text-orange-700', 'bg-blue-100 text-blue-700', 'bg-emerald-100 text-emerald-700', 'bg-violet-100 text-violet-700', 'bg-rose-100 text-rose-700']
  const tone = palette[initial.charCodeAt(0) % palette.length]
  const style = { width: size, height: size }

  if (src && !err) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={name}
        width={size}
        height={size}
        onError={() => setErr(true)}
        className="rounded-[22%] object-cover ring-1 ring-black/5 shrink-0"
        style={style}
        loading="lazy"
      />
    )
  }
  return (
    <span
      className={`rounded-[22%] grid place-items-center text-xs font-bold ring-1 ring-black/5 shrink-0 ${tone}`}
      style={style}
    >
      {initial}
    </span>
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
        <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-blue-100 bg-blue-50/70 px-4 py-3 text-sm text-blue-800">
          <span className="mt-0.5">⏳</span>
          <span>
            <b>구글 애즈 토큰 승인 대기중</b> — 광고비·순수익·ROAS는 승인 후 자동으로 채워집니다.
            현재는 <b>애드몹 실수익</b>만 표시됩니다.
          </span>
        </div>
      )}
      {admobSample && (
        <div className="mb-5 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          ⚠️ 애드몹이 아직 연결되지 않아 <b>샘플 데이터</b>로 표시 중입니다.
        </div>
      )}
    </>
  )
}

/* 카드용 미니 아이콘 (인라인 SVG) */
export const Icons = {
  revenue: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  cost: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" />
    </svg>
  ),
  profit: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 17l6-6 4 4 8-8" strokeLinecap="round" strokeLinejoin="round" /><path d="M17 7h4v4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  roas: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" /><path d="M9 15l6-6M9.5 9.5h.01M14.5 14.5h.01" strokeLinecap="round" />
    </svg>
  ),
}
