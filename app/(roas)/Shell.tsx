'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import type { DateRangeKey, Currency } from '@/lib/roas/types'

/* ───────── 공유 상태 (기간 + 통화 + 로그인) — 페이지 이동해도 유지 ───────── */
type Auth = { loggedIn: boolean; email: string | null; hasAdmob: boolean }
type Ctx = {
  range: DateRangeKey
  setRange: (r: DateRangeKey) => void
  currency: Currency
  setCurrency: (c: Currency) => void
  auth: Auth | null // null = 아직 로딩
}
const RoasCtx = createContext<Ctx | null>(null)
export function useRoas(): Ctx {
  const c = useContext(RoasCtx)
  if (!c) throw new Error('useRoas must be used within Shell')
  return c
}

const I = {
  dash: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" /><rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" />
    </svg>
  ),
  apps: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="2" /><rect x="14" y="3" width="7" height="7" rx="2" /><rect x="3" y="14" width="7" height="7" rx="2" /><rect x="14" y="14" width="7" height="7" rx="2" />
    </svg>
  ),
  cal: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M3 10h18M8 2v4M16 2v4" />
    </svg>
  ),
  info: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" />
    </svg>
  ),
}
const NAV = [
  { href: '/roas', label: '대시보드', icon: I.dash },
  { href: '/roas/apps', label: '앱 관리', icon: I.apps },
  { href: '/roas/calendar', label: '수익 캘린더', icon: I.cal },
  { href: '/roas/about', label: '소개 / About', icon: I.info },
]
const RANGES: { key: DateRangeKey; label: string }[] = [
  { key: 'today', label: '오늘' },
  { key: 'yesterday', label: '어제' },
  { key: '7d', label: '7일' },
  { key: '30d', label: '30일' },
]

function GoogleMark() {
  return (
    <svg width="15" height="15" viewBox="0 0 48 48">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  )
}

export default function Shell({ children }: { children: React.ReactNode }) {
  const [range, setRange] = useState<DateRangeKey>('7d')
  const [currency, setCurrency] = useState<Currency>('USD')
  const [auth, setAuth] = useState<Auth | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    const r = localStorage.getItem('roas.range') as DateRangeKey | null
    const c = localStorage.getItem('roas.currency') as Currency | null
    if (r) setRange(r)
    if (c) setCurrency(c)
  }, [])
  useEffect(() => { localStorage.setItem('roas.range', range) }, [range])
  useEffect(() => { localStorage.setItem('roas.currency', currency) }, [currency])

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((j: Auth) => setAuth(j))
      .catch(() => setAuth({ loggedIn: false, email: null, hasAdmob: false }))
  }, [])

  return (
    <RoasCtx.Provider value={{ range, setRange, currency, setCurrency, auth }}>
      <div className="flex min-h-screen">
        {/* 사이드바 */}
        <aside className="hidden md:flex w-56 shrink-0 flex-col bg-gray-900 text-gray-300">
          <div className="px-5 py-5 flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 grid place-items-center text-white font-extrabold text-sm shadow-lg shadow-orange-900/30">
              R
            </span>
            <span className="text-base font-bold text-white tracking-tight">ROAS 대시보드</span>
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

            <div className="pt-4 mt-3 border-t border-gray-800">
              <div className="px-3 pb-1 text-[11px] uppercase tracking-wide text-gray-500">Google Ads</div>
              {['캠페인', '키워드'].map((t) => (
                <div key={t} className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-gray-600 cursor-not-allowed">
                  <span className="flex items-center gap-3">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    {t}
                  </span>
                  <span className="text-[10px] bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded">대기중</span>
                </div>
              ))}
            </div>
          </nav>
          <div className="px-4 py-4 border-t border-gray-800">
            {auth?.loggedIn ? (
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-[11px] text-gray-500">로그인</div>
                  <div className="text-xs text-gray-300 truncate">{auth.email ?? '내 계정'}</div>
                </div>
                <a href="/api/auth/logout" className="text-[11px] text-gray-400 hover:text-white shrink-0">로그아웃</a>
              </div>
            ) : (
              <div className="text-[11px] text-gray-500">로그인하면 내 애드몹 데이터</div>
            )}
          </div>
        </aside>

        {/* 본문 */}
        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-20 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 flex items-center gap-3 flex-wrap">
            <span className="md:hidden font-bold text-gray-900"><span className="text-orange-500">ROAS</span></span>
            <div className="flex-1" />
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
              {RANGES.map((r) => (
                <button key={r.key} onClick={() => setRange(r.key)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${range === r.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                  {r.label}
                </button>
              ))}
            </div>
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
              {(['USD', 'KRW'] as Currency[]).map((c) => (
                <button key={c} onClick={() => setCurrency(c)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${currency === c ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                  {c === 'USD' ? '$ USD' : '₩ KRW'}
                </button>
              ))}
            </div>
            {/* 로그인 버튼 */}
            {auth && !auth.loggedIn && (
              <a href="/api/auth/login"
                className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 shadow-sm">
                <GoogleMark /> 구글로 로그인
              </a>
            )}
            {auth?.loggedIn && (
              <span className="hidden sm:flex items-center gap-2 text-xs text-gray-600">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> {auth.email}
              </span>
            )}
          </header>

          {/* 로그인 게이트 배너 */}
          {auth && !auth.loggedIn && (
            <div className="bg-orange-50 border-b border-orange-100 px-4 sm:px-6 py-2.5 text-sm text-orange-800 flex items-center gap-2 flex-wrap">
              <span>👋 지금은 <b>샘플 데이터</b>입니다. 내 실제 애드몹 수익을 보려면</span>
              <a href="/api/auth/login" className="inline-flex items-center gap-1.5 bg-white border border-orange-200 rounded-md px-2.5 py-1 font-medium hover:bg-orange-100">
                <GoogleMark /> 구글로 로그인
              </a>
            </div>
          )}
          {auth?.loggedIn && !auth.hasAdmob && (
            <div className="bg-amber-50 border-b border-amber-100 px-4 sm:px-6 py-2.5 text-sm text-amber-800">
              ⚠️ 이 구글 계정에 연결된 <b>애드몹 게시자 계정을 찾지 못했어요.</b> 애드몹을 쓰는 계정으로 다시 로그인해 주세요.
            </div>
          )}

          <main className="flex-1 p-4 sm:p-6 max-w-6xl w-full">{children}</main>
        </div>
      </div>
    </RoasCtx.Provider>
  )
}
