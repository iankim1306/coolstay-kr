'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import type { DateRangeKey, Currency } from '@/lib/roas/types'

/* ───────── 공유 상태 (기간 + 통화) — 페이지 이동해도 유지 ───────── */
type Ctx = {
  range: DateRangeKey
  setRange: (r: DateRangeKey) => void
  currency: Currency
  setCurrency: (c: Currency) => void
}
const RoasCtx = createContext<Ctx | null>(null)
export function useRoas(): Ctx {
  const c = useContext(RoasCtx)
  if (!c) throw new Error('useRoas must be used within Shell')
  return c
}

const NAV = [
  { href: '/roas', label: '대시보드', icon: '▦' },
  { href: '/roas/apps', label: '앱 관리', icon: '▤' },
  { href: '/roas/calendar', label: '수익 캘린더', icon: '▩' },
]
const RANGES: { key: DateRangeKey; label: string }[] = [
  { key: 'today', label: '오늘' },
  { key: 'yesterday', label: '어제' },
  { key: '7d', label: '7일' },
  { key: '30d', label: '30일' },
]

export default function Shell({ children }: { children: React.ReactNode }) {
  const [range, setRange] = useState<DateRangeKey>('7d')
  const [currency, setCurrency] = useState<Currency>('USD')
  const pathname = usePathname()

  // localStorage 복원/저장
  useEffect(() => {
    const r = localStorage.getItem('roas.range') as DateRangeKey | null
    const c = localStorage.getItem('roas.currency') as Currency | null
    if (r) setRange(r)
    if (c) setCurrency(c)
  }, [])
  useEffect(() => {
    localStorage.setItem('roas.range', range)
  }, [range])
  useEffect(() => {
    localStorage.setItem('roas.currency', currency)
  }, [currency])

  return (
    <RoasCtx.Provider value={{ range, setRange, currency, setCurrency }}>
      <div className="flex min-h-screen">
        {/* 사이드바 */}
        <aside className="hidden md:flex w-56 shrink-0 flex-col bg-gray-900 text-gray-300">
          <div className="px-5 py-5 text-lg font-bold text-white">
            <span className="text-orange-400">ROAS</span> 대시보드
          </div>
          <nav className="flex-1 px-3 space-y-1">
            {NAV.map((n) => {
              const active = pathname === n.href
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    active ? 'bg-orange-500 text-white' : 'hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <span className="text-base">{n.icon}</span>
                  {n.label}
                </Link>
              )
            })}

            {/* 구글 애즈 — 승인 대기 섹션 (미리보기) */}
            <div className="pt-4 mt-3 border-t border-gray-800">
              <div className="px-3 pb-1 text-[11px] uppercase tracking-wide text-gray-500">
                Google Ads
              </div>
              {['캠페인', '키워드'].map((t) => (
                <div
                  key={t}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-gray-600 cursor-not-allowed"
                >
                  <span className="flex items-center gap-3">
                    <span className="text-base">▷</span>
                    {t}
                  </span>
                  <span className="text-[10px] bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded">
                    대기중
                  </span>
                </div>
              ))}
            </div>
          </nav>
          <div className="px-5 py-4 text-[11px] text-gray-500 border-t border-gray-800">
            애드몹 실데이터 · 개인용
          </div>
        </aside>

        {/* 본문 */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* 상단바 */}
          <header className="sticky top-0 z-20 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 flex items-center gap-3 flex-wrap">
            {/* 모바일 로고 */}
            <span className="md:hidden font-bold text-gray-900">
              <span className="text-orange-500">ROAS</span>
            </span>
            <div className="flex-1" />
            {/* 기간 토글 */}
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
              {RANGES.map((r) => (
                <button
                  key={r.key}
                  onClick={() => setRange(r.key)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    range === r.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
            {/* 통화 토글 */}
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
              {(['USD', 'KRW'] as Currency[]).map((c) => (
                <button
                  key={c}
                  onClick={() => setCurrency(c)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    currency === c ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {c === 'USD' ? '$ USD' : '₩ KRW'}
                </button>
              ))}
            </div>
          </header>

          <main className="flex-1 p-4 sm:p-6 max-w-6xl w-full">{children}</main>
        </div>
      </div>
    </RoasCtx.Provider>
  )
}
