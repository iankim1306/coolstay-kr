'use client'

import { useEffect, useState } from 'react'
import type { RoasResponse, DateRangeKey } from '@/lib/roas/types'

const RANGES: { key: DateRangeKey; label: string }[] = [
  { key: 'today', label: '오늘' },
  { key: 'yesterday', label: '어제' },
  { key: '7d', label: '7일' },
  { key: '30d', label: '30일' },
]

export default function Dashboard() {
  const [range, setRange] = useState<DateRangeKey>('7d')
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
  const isSample =
    data && (data.source.ads === 'sample' || data.source.admob === 'sample')

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

      {/* 샘플 데이터 안내 배너 */}
      {isSample && (
        <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          ⚠️ 현재 <b>샘플 데이터</b>로 표시 중입니다
          {data && (
            <>
              {' '}
              (애즈: {data.source.ads === 'live' ? '연결됨' : '미연결'} · 애드몹:{' '}
              {data.source.admob === 'live' ? '연결됨' : '미연결'})
            </>
          )}
          . API 키를 연결하면 실제 데이터로 바뀝니다.
        </div>
      )}

      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          데이터를 불러오지 못했습니다: {error}
        </div>
      )}

      {/* 요약 카드 4개 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <Card label="광고비용" value={money(data?.totals.cost, cur)} loading={loading} />
        <Card label="앱 수익" value={money(data?.totals.revenue, cur)} loading={loading} />
        <Card
          label="순수익"
          value={money(data?.totals.profit, cur)}
          loading={loading}
          accent={
            data ? (data.totals.profit >= 0 ? 'pos' : 'neg') : undefined
          }
        />
        <Card
          label="ROAS"
          value={data ? `${data.totals.roas.toFixed(0)}%` : '—'}
          loading={loading}
          accent={data ? (data.totals.roas >= 100 ? 'pos' : 'neg') : undefined}
        />
      </div>

      {/* 일자별 막대(비용 vs 수익) */}
      {data && data.rows.length > 0 && <MiniChart data={data} cur={cur} />}

      {/* 일자별 테이블 */}
      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs">
              <th className="text-left font-medium px-4 py-2.5">날짜</th>
              <th className="text-right font-medium px-4 py-2.5">광고비용</th>
              <th className="text-right font-medium px-4 py-2.5">앱 수익</th>
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
                        {money(row.cost, cur)}
                      </td>
                      <td className="px-4 py-2.5 text-right text-gray-700">
                        {money(row.revenue, cur)}
                      </td>
                      <td
                        className={`px-4 py-2.5 text-right font-medium ${
                          row.profit >= 0 ? 'text-emerald-600' : 'text-red-600'
                        }`}
                      >
                        {money(row.profit, cur)}
                      </td>
                      <td
                        className={`px-4 py-2.5 text-right font-medium ${
                          row.roas >= 100 ? 'text-emerald-600' : 'text-red-600'
                        }`}
                      >
                        {row.roas.toFixed(0)}%
                      </td>
                    </tr>
                  ))}
          </tbody>
        </table>
      </div>

      {data && (
        <p className="text-xs text-gray-400 mt-3">
          기간 {data.range.startDate} ~ {data.range.endDate} · 갱신{' '}
          {new Date(data.generatedAt).toLocaleString('ko-KR')}
        </p>
      )}
    </div>
  )
}

function Card({
  label,
  value,
  loading,
  accent,
}: {
  label: string
  value: string
  loading: boolean
  accent?: 'pos' | 'neg'
}) {
  const color =
    accent === 'pos'
      ? 'text-emerald-600'
      : accent === 'neg'
        ? 'text-red-600'
        : 'text-gray-900'
  return (
    <div className="rounded-xl border border-gray-100 bg-white px-4 py-4 shadow-sm">
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      {loading ? (
        <div className="h-7 w-24 bg-gray-100 rounded animate-pulse" />
      ) : (
        <div className={`text-2xl font-bold ${color}`}>{value}</div>
      )}
    </div>
  )
}

function MiniChart({ data, cur }: { data: RoasResponse; cur: string }) {
  const max = Math.max(
    1,
    ...data.rows.map((r) => Math.max(r.cost, r.revenue))
  )
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 mb-6">
      <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-gray-300 inline-block" /> 광고비용
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-orange-400 inline-block" /> 앱 수익
        </span>
      </div>
      <div className="flex items-end gap-1 h-32">
        {data.rows.map((r) => (
          <div
            key={r.date}
            className="flex-1 flex items-end gap-0.5 group relative"
            title={`${r.date}\n비용 ${money(r.cost, cur)} · 수익 ${money(
              r.revenue,
              cur
            )}`}
          >
            <div
              className="flex-1 bg-gray-300 rounded-t"
              style={{ height: `${(r.cost / max) * 100}%` }}
            />
            <div
              className="flex-1 bg-orange-400 rounded-t"
              style={{ height: `${(r.revenue / max) * 100}%` }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

function money(n: number | undefined, currency: string): string {
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
