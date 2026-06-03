'use client'

import { useEffect, useMemo, useState } from 'react'
import type { RoasResponse, AppsResponse, AppListResponse } from '@/lib/roas/types'
import { useRoas } from '../Shell'
import { AppIcon, Card, Icons, SourceBanner, Sparkline, money, num, pct } from '../ui'

type Tab = 'all' | 'revenue' | 'efficiency'
const TABS: { key: Tab; label: string }[] = [
  { key: 'all', label: '전체 보기' },
  { key: 'revenue', label: '수익성' },
  { key: 'efficiency', label: '광고 효율' },
]

export default function Overview() {
  const { range, currency } = useRoas()
  const [data, setData] = useState<RoasResponse | null>(null)
  const [apps, setApps] = useState<AppsResponse | null>(null)
  const [icons, setIcons] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<Tab>('all')

  useEffect(() => {
    let alive = true
    setLoading(true)
    Promise.all([
      fetch(`/api/roas?range=${range}&currency=${currency}`).then((r) => r.json()),
      fetch(`/api/roas/apps?range=${range}&currency=${currency}`).then((r) => r.json()),
    ])
      .then(([d, a]: [RoasResponse, AppsResponse]) => {
        if (!alive) return
        setData(d)
        setApps(a)
      })
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [range, currency])

  // 아이콘 맵 (앱 목록에서 appId→iconUrl) — 한 번만
  useEffect(() => {
    let alive = true
    fetch('/api/roas/applist')
      .then((r) => r.json())
      .then((j: AppListResponse) => {
        if (!alive) return
        const m: Record<string, string> = {}
        for (const a of j.apps) if (a.iconUrl) m[a.appId] = a.iconUrl
        setIcons(m)
      })
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [])

  const cur = data?.currency ?? currency
  const pending = data?.adsPending

  return (
    <div>
      <SourceBanner adsPending={data?.adsPending} admobSample={data?.source.admob === 'sample'} />

      {/* 요약 카드 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-7">
        <Card label="앱 수익" value={money(data?.totals.revenue, cur)} loading={loading} icon={Icons.revenue} tone="emerald" />
        <Card label="광고비용" value={money(data?.totals.cost, cur)} loading={loading} pending={pending} icon={Icons.cost} tone="blue" />
        <Card
          label="순수익"
          value={money(data?.totals.profit, cur)}
          loading={loading}
          pending={pending}
          icon={Icons.profit}
          tone="violet"
          accent={data?.totals.profit != null ? (data.totals.profit >= 0 ? 'pos' : 'neg') : undefined}
        />
        <Card
          label="ROAS"
          value={data?.totals.roas != null ? `${data.totals.roas.toFixed(0)}%` : '—'}
          loading={loading}
          pending={pending}
          icon={Icons.roas}
          tone="orange"
          accent={data?.totals.roas != null ? (data.totals.roas >= 100 ? 'pos' : 'neg') : undefined}
        />
      </div>

      {data && data.rows.length > 0 && <MiniChart data={data} cur={cur} />}

      {/* 앱별 성과 */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-gray-900">앱별 성과 분석</h2>
        {apps && <span className="text-xs text-gray-400">{apps.apps.length}개 앱 · 애드몹 실데이터</span>}
      </div>

      <div className="flex gap-1 mb-3 bg-gray-100 rounded-lg p-1 w-fit">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              tab === t.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <AppTable apps={apps} loading={loading} cur={cur} tab={tab} icons={icons} />
      <p className="text-xs text-gray-400 mt-2">
        ⓘ <b>광고 CTR</b> = 앱 내 애드몹 광고 클릭률(애드몹 실데이터). 구글 애즈 전환율·CPC는 토큰 승인 후 별도 표시.
      </p>
    </div>
  )
}

function AppTable({
  apps,
  loading,
  cur,
  tab,
  icons,
}: {
  apps: AppsResponse | null
  loading: boolean
  cur: string
  tab: Tab
  icons: Record<string, string>
}) {
  const cols = useMemo(
    () =>
      tab === 'revenue'
        ? (['수익', '광고비', '순수익', 'eCPM', '추이'] as const)
        : tab === 'efficiency'
          ? (['수익', '노출', '클릭', '일치율', '광고 CTR'] as const)
          : (['수익', '광고비', '노출', '클릭', 'eCPM', '일치율', '광고 CTR', '추이'] as const),
    [tab]
  )

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
      <table className="w-full text-sm whitespace-nowrap">
        <thead>
          <tr className="bg-gray-50/80 text-gray-500 text-xs">
            <th className="text-left font-medium px-4 py-3">앱</th>
            {cols.map((c) => (
              <th key={c} className="text-right font-medium px-4 py-3">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading && !apps
            ? Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="border-t border-gray-50">
                  <td colSpan={cols.length + 1} className="px-4 py-3.5">
                    <div className="h-5 bg-gray-100 rounded animate-pulse" />
                  </td>
                </tr>
              ))
            : apps?.apps.map((a, i) => (
                <tr key={a.appId} className="border-t border-gray-50 hover:bg-orange-50/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-300 w-4 tabular-nums">{i + 1}</span>
                      <AppIcon name={a.appName} src={icons[a.appId]} />
                      <span className="font-medium text-gray-800 max-w-[220px] truncate">{a.appName}</span>
                    </div>
                  </td>
                  {cols.map((c) => {
                    switch (c) {
                      case '수익':
                        return (
                          <td key={c} className="px-4 py-3 text-right text-emerald-600 font-semibold tabular-nums">
                            {money(a.earnings, cur)}
                          </td>
                        )
                      case '광고비':
                      case '순수익':
                        return (
                          <td key={c} className="px-4 py-3 text-right text-gray-300">
                            대기중
                          </td>
                        )
                      case '노출':
                        return <td key={c} className="px-4 py-3 text-right text-gray-600 tabular-nums">{num(a.impressions)}</td>
                      case '클릭':
                        return <td key={c} className="px-4 py-3 text-right text-gray-600 tabular-nums">{num(a.clicks)}</td>
                      case 'eCPM':
                        return <td key={c} className="px-4 py-3 text-right text-gray-600 tabular-nums">{money(a.ecpm, cur)}</td>
                      case '일치율':
                        return <td key={c} className="px-4 py-3 text-right text-gray-600 tabular-nums">{pct(a.matchRate)}</td>
                      case '광고 CTR':
                        return <td key={c} className="px-4 py-3 text-right text-gray-600 tabular-nums">{pct(a.ctr)}</td>
                      case '추이':
                        return (
                          <td key={c} className="px-4 py-3 text-right">
                            <Sparkline data={a.spark} />
                          </td>
                        )
                    }
                  })}
                </tr>
              ))}
          {apps && apps.apps.length === 0 && (
            <tr className="border-t border-gray-50">
              <td colSpan={cols.length + 1} className="px-4 py-10 text-center text-gray-400">
                이 기간에 데이터가 있는 앱이 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

function MiniChart({ data, cur }: { data: RoasResponse; cur: string }) {
  const max = Math.max(1, ...data.rows.map((r) => Math.max(r.cost ?? 0, r.revenue)))
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 mb-8 shadow-sm">
      <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-400 inline-block" /> 앱 수익
        </span>
        {!data.adsPending && (
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-gray-300 inline-block" /> 광고비용
          </span>
        )}
      </div>
      <div className="flex items-end gap-1 h-36">
        {data.rows.map((r) => (
          <div
            key={r.date}
            className="flex-1 flex items-end gap-0.5 relative group"
            title={`${r.date}\n수익 ${money(r.revenue, cur)}${r.cost == null ? '' : ` · 비용 ${money(r.cost, cur)}`}`}
          >
            <div
              className="flex-1 bg-gradient-to-t from-orange-400 to-orange-300 rounded-t-md group-hover:from-orange-500 group-hover:to-orange-400 transition-colors"
              style={{ height: `${(r.revenue / max) * 100}%` }}
            />
            {!data.adsPending && (
              <div className="flex-1 bg-gray-200 rounded-t-md" style={{ height: `${((r.cost ?? 0) / max) * 100}%` }} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
