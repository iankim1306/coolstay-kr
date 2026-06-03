'use client'

import { useEffect, useState } from 'react'
import type { RoasResponse } from '@/lib/roas/types'
import { useRoas } from '../../Shell'
import { money } from '../../ui'

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

export default function Calendar() {
  const { currency } = useRoas()
  const [data, setData] = useState<RoasResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    setLoading(true)
    fetch(`/api/roas?range=30d&currency=${currency}`)
      .then((r) => r.json())
      .then((j: RoasResponse) => alive && setData(j))
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [currency])

  const cur = data?.currency ?? currency
  const rows = data?.rows ?? []
  const max = Math.max(1, ...rows.map((r) => r.revenue))
  const total = rows.reduce((s, r) => s + r.revenue, 0)
  const best = rows.reduce<{ date: string; revenue: number } | null>(
    (b, r) => (!b || r.revenue > b.revenue ? r : b),
    null
  )

  // 첫 날의 요일만큼 앞쪽 빈칸 패딩
  const firstWeekday = rows.length ? new Date(rows[0].date + 'T00:00:00').getDay() : 0
  const cells: ({ date: string; revenue: number } | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...rows.map((r) => ({ date: r.date, revenue: r.revenue })),
  ]

  function shade(v: number): string {
    if (v <= 0) return 'bg-gray-100 text-gray-400'
    const t = v / max
    if (t > 0.75) return 'bg-orange-500 text-white'
    if (t > 0.5) return 'bg-orange-400 text-white'
    if (t > 0.25) return 'bg-orange-300 text-orange-900'
    return 'bg-orange-100 text-orange-800'
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 mb-6">
        <Stat label="기간 총 수익" value={loading ? '…' : money(total, cur)} />
        <Stat label="일 평균" value={loading ? '…' : money(rows.length ? total / rows.length : 0, cur)} />
        <Stat label="최고 수익일" value={loading || !best ? '…' : money(best.revenue, cur)} sub={best?.date} />
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-4">
        <div className="grid grid-cols-7 gap-1.5 mb-1.5">
          {WEEKDAYS.map((w) => (
            <div key={w} className="text-center text-xs text-gray-400 font-medium">
              {w}
            </div>
          ))}
        </div>
        {loading ? (
          <div className="grid grid-cols-7 gap-1.5">
            {Array.from({ length: 35 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-md bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-1.5">
            {cells.map((c, i) =>
              c === null ? (
                <div key={`pad-${i}`} className="aspect-square" />
              ) : (
                <div
                  key={c.date}
                  title={`${c.date} · ${money(c.revenue, cur)}`}
                  className={`aspect-square rounded-md flex flex-col items-center justify-center ${shade(
                    c.revenue
                  )}`}
                >
                  <span className="text-[11px] leading-none opacity-80">
                    {Number(c.date.slice(8, 10))}
                  </span>
                  <span className="text-[10px] leading-tight font-medium mt-0.5">
                    {c.revenue > 0 ? money(c.revenue, cur).replace(/\.\d+/, '') : ''}
                  </span>
                </div>
              )
            )}
          </div>
        )}
        {/* 범례 */}
        <div className="flex items-center justify-end gap-1.5 mt-3 text-xs text-gray-400">
          <span>적음</span>
          <span className="w-4 h-4 rounded bg-orange-100 inline-block" />
          <span className="w-4 h-4 rounded bg-orange-300 inline-block" />
          <span className="w-4 h-4 rounded bg-orange-400 inline-block" />
          <span className="w-4 h-4 rounded bg-orange-500 inline-block" />
          <span>많음</span>
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white px-4 py-4 shadow-sm">
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      {sub && <div className="text-xs text-gray-400 mt-1">{sub}</div>}
    </div>
  )
}
