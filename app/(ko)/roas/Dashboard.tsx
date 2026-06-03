'use client'

import { useEffect, useState } from 'react'
import type { RoasResponse, AppsResponse, DateRangeKey } from '@/lib/roas/types'

const RANGES: { key: DateRangeKey; label: string }[] = [
  { key: 'today', label: '오늘' },
  { key: 'yesterday', label: '어제' },
  { key: '7d', label: '7일' },
  { key: '30d', label: '30일' },
]

export default function Dashboard() {
  const [range, setRange] = useState<DateRangeKey>('7d')

  return (
    <div>
      {/* 날짜 범위 토글 */}
      <div className="flex gap-2 mb-5">
        {RANGES.map((r) => (
          <button
            key={r.key}
            onClick={() => setRange(r.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              range === r.key
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      <Summary range={range} />
      <AppTable range={range} />
    </div>
  )
}

/* ───────────────────────── 요약(카드 + 차트 + 일자 테이블) ───────────────────────── */
function Summary({ range }: { range: DateRangeKey }) {
  const [data, setData] = useState<RoasResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let alive = true
    setLoading(true)
    setError(null)
    fetch(`/api/roas?range=${range}`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then((json: RoasResponse) => alive && setData(json))
      .catch((e) => alive && setError(String(e)))
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [range])

  const cur = data?.currency ?? 'USD'
  const pending = data?.adsPending

  return (
    <div>
      {/* 안내 배너 */}
      {data?.adsPending && (
        <div className="mb-5 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
          ⏳ <b>구글 애즈 토큰 승인 대기중</b> — 광고비·순수익·ROAS는 승인 후 자동으로 채워집니다.
          현재는 <b>애드몹 실수익</b>만 표시됩니다.
        </div>
      )}
      {data && data.source.admob === 'sample' && (
        <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          ⚠️ 애드몹이 아직 연결되지 않아 <b>샘플 데이터</b>로 표시 중입니다.
        </div>
      )}
      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          데이터를 불러오지 못했습니다: {error}
        </div>
      )}

      {/* 요약 카드 4개 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <Card label="앱 수익" value={money(data?.totals.revenue, cur)} loading={loading} />
        <Card
          label="광고비용"
          value={money(data?.totals.cost, cur)}
          loading={loading}
          pending={pending}
        />
        <Card
          label="순수익"
          value={money(data?.totals.profit, cur)}
          loading={loading}
          pending={pending}
          accent={
            data && data.totals.profit != null
              ? data.totals.profit >= 0
                ? 'pos'
                : 'neg'
              : undefined
          }
        />
        <Card
          label="ROAS"
          value={data?.totals.roas != null ? `${data.totals.roas.toFixed(0)}%` : '—'}
          loading={loading}
          pending={pending}
          accent={
            data && data.totals.roas != null
              ? data.totals.roas >= 100
                ? 'pos'
                : 'neg'
              : undefined
          }
        />
      </div>

      {data && data.rows.length > 0 && <MiniChart data={data} cur={cur} />}

      {/* 일자별 테이블 */}
      <div className="overflow-x-auto rounded-xl border border-gray-100 mb-10">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs">
              <th className="text-left font-medium px-4 py-2.5">날짜</th>
              <th className="text-right font-medium px-4 py-2.5">앱 수익</th>
              <th className="text-right font-medium px-4 py-2.5">광고비용</th>
              <th className="text-right font-medium px-4 py-2.5">순수익</th>
              <th className="text-right font-medium px-4 py-2.5">ROAS</th>
            </tr>
          </thead>
          <tbody>
            {loading && !data
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-t border-gray-100">
                    <td colSpan={5} className="px-4 py-3">
                      <div className="h-4 bg-gray-100 rounded animate-pulse" />
                    </td>
                  </tr>
                ))
              : data?.rows
                  .slice()
                  .reverse()
                  .map((row) => (
                    <tr key={row.date} className="border-t border-gray-100">
                      <td className="px-4 py-2.5 text-gray-700">{row.date}</td>
                      <td className="px-4 py-2.5 text-right text-gray-700">
                        {money(row.revenue, cur)}
                      </td>
                      <td className="px-4 py-2.5 text-right text-gray-400">
                        {row.cost == null ? '대기중' : money(row.cost, cur)}
                      </td>
                      <td
                        className={`px-4 py-2.5 text-right font-medium ${
                          row.profit == null
                            ? 'text-gray-400'
                            : row.profit >= 0
                              ? 'text-emerald-600'
                              : 'text-red-600'
                        }`}
                      >
                        {row.profit == null ? '—' : money(row.profit, cur)}
                      </td>
                      <td
                        className={`px-4 py-2.5 text-right font-medium ${
                          row.roas == null
                            ? 'text-gray-400'
                            : row.roas >= 100
                              ? 'text-emerald-600'
                              : 'text-red-600'
                        }`}
                      >
                        {row.roas == null ? '—' : `${row.roas.toFixed(0)}%`}
                      </td>
                    </tr>
                  ))}
          </tbody>
        </table>
      </div>

      {data && (
        <p className="text-xs text-gray-400 -mt-7 mb-10">
          기간 {data.range.startDate} ~ {data.range.endDate} · 갱신{' '}
          {new Date(data.generatedAt).toLocaleString('ko-KR')}
        </p>
      )}
    </div>
  )
}

/* ───────────────────────── 앱별 성과 테이블 ───────────────────────── */
function AppTable({ range }: { range: DateRangeKey }) {
  const [data, setData] = useState<AppsResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    setLoading(true)
    fetch(`/api/roas/apps?range=${range}`)
      .then((r) => r.json())
      .then((json: AppsResponse) => alive && setData(json))
      .catch(() => {})
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [range])

  const cur = data?.currency ?? 'USD'

  return (
    <section>
      <div className="flex items-baseline justify-between mb-3">
        <h2 className="text-lg font-bold text-gray-900">앱별 성과 분석</h2>
        {data && (
          <span className="text-xs text-gray-400">
            {data.apps.length}개 앱 · 애드몹 실데이터
          </span>
        )}
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="w-full text-sm whitespace-nowrap">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs">
              <th className="text-left font-medium px-4 py-2.5">앱</th>
              <th className="text-right font-medium px-4 py-2.5">수익</th>
              <th className="text-right font-medium px-4 py-2.5">광고비</th>
              <th className="text-right font-medium px-4 py-2.5">노출</th>
              <th className="text-right font-medium px-4 py-2.5">클릭</th>
              <th className="text-right font-medium px-4 py-2.5">eCPM</th>
              <th className="text-right font-medium px-4 py-2.5">일치율</th>
              <th className="text-right font-medium px-4 py-2.5">CTR</th>
            </tr>
          </thead>
          <tbody>
            {loading && !data
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-t border-gray-100">
                    <td colSpan={8} className="px-4 py-3">
                      <div className="h-4 bg-gray-100 rounded animate-pulse" />
                    </td>
                  </tr>
                ))
              : data?.apps.map((a) => (
                  <tr key={a.appId} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-2.5 font-medium text-gray-800 max-w-[200px] truncate">
                      {a.appName}
                    </td>
                    <td className="px-4 py-2.5 text-right text-emerald-600 font-medium">
                      {money(a.earnings, cur)}
                    </td>
                    <td className="px-4 py-2.5 text-right text-gray-400">대기중</td>
                    <td className="px-4 py-2.5 text-right text-gray-600">
                      {a.impressions.toLocaleString()}
                    </td>
                    <td className="px-4 py-2.5 text-right text-gray-600">
                      {a.clicks.toLocaleString()}
                    </td>
                    <td className="px-4 py-2.5 text-right text-gray-600">{money(a.ecpm, cur)}</td>
                    <td className="px-4 py-2.5 text-right text-gray-600">{pct(a.matchRate)}</td>
                    <td className="px-4 py-2.5 text-right text-gray-600">{pct(a.ctr)}</td>
                  </tr>
                ))}
            {data && data.apps.length === 0 && (
              <tr className="border-t border-gray-100">
                <td colSpan={8} className="px-4 py-8 text-center text-gray-400">
                  이 기간에 데이터가 있는 앱이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-400 mt-2">
        광고비 칸은 구글 애즈 토큰 승인 후 앱별로 매칭되어 채워집니다.
      </p>
    </section>
  )
}

/* ───────────────────────── 공용 컴포넌트 ───────────────────────── */
function Card({
  label,
  value,
  loading,
  accent,
  pending,
}: {
  label: string
  value: string
  loading: boolean
  accent?: 'pos' | 'neg'
  pending?: boolean
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
    </div>
  )
}

function MiniChart({ data, cur }: { data: RoasResponse; cur: string }) {
  const max = Math.max(1, ...data.rows.map((r) => Math.max(r.cost ?? 0, r.revenue)))
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 mb-6">
      <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-orange-400 inline-block" /> 앱 수익
        </span>
        {!data.adsPending && (
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-gray-300 inline-block" /> 광고비용
          </span>
        )}
      </div>
      <div className="flex items-end gap-1 h-32">
        {data.rows.map((r) => (
          <div
            key={r.date}
            className="flex-1 flex items-end gap-0.5 group relative"
            title={`${r.date}\n수익 ${money(r.revenue, cur)}${
              r.cost == null ? '' : ` · 비용 ${money(r.cost, cur)}`
            }`}
          >
            <div
              className="flex-1 bg-orange-400 rounded-t"
              style={{ height: `${(r.revenue / max) * 100}%` }}
            />
            {!data.adsPending && (
              <div
                className="flex-1 bg-gray-300 rounded-t"
                style={{ height: `${((r.cost ?? 0) / max) * 100}%` }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function money(n: number | null | undefined, currency: string): string {
  if (n == null) return '—'
  try {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(n)
  } catch {
    return `${n.toFixed(2)} ${currency}`
  }
}

function pct(n: number): string {
  return `${(n * 100).toFixed(1)}%`
}
