import { NextRequest, NextResponse } from 'next/server'
import { fetchAdsCost, sampleAdsCost } from '@/lib/roas/google-ads'
import { fetchAdmobRevenue, sampleAdmobRevenue } from '@/lib/roas/admob'
import {
  DateRangeKey,
  RoasResponse,
  DailyRowComputed,
  resolveRange,
  eachDay,
} from '@/lib/roas/types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const VALID: DateRangeKey[] = ['today', 'yesterday', '7d', '30d']

export async function GET(req: NextRequest) {
  const key = (req.nextUrl.searchParams.get('range') ?? '7d') as DateRangeKey
  const rangeKey: DateRangeKey = VALID.includes(key) ? key : '7d'
  const { startDate, endDate, label } = resolveRange(rangeKey)

  // 실데이터 시도 → 실패/미설정 시 샘플로 폴백 (둘은 독립적으로 판정)
  const [liveCost, liveRev] = await Promise.all([
    fetchAdsCost(startDate, endDate),
    fetchAdmobRevenue(startDate, endDate),
  ])

  const costMap = liveCost ?? sampleAdsCost(startDate, endDate)
  const revMap = liveRev ?? sampleAdmobRevenue(startDate, endDate)

  const rows: DailyRowComputed[] = eachDay(startDate, endDate).map((date) => {
    const cost = round2(costMap[date] ?? 0)
    const revenue = round2(revMap[date] ?? 0)
    const profit = round2(revenue - cost)
    const roas = cost > 0 ? round2((revenue / cost) * 100) : 0
    return { date, cost, revenue, profit, roas }
  })

  const totalCost = round2(rows.reduce((s, r) => s + r.cost, 0))
  const totalRev = round2(rows.reduce((s, r) => s + r.revenue, 0))

  const body: RoasResponse = {
    range: { startDate, endDate, label },
    currency: process.env.ROAS_CURRENCY ?? 'USD',
    totals: {
      cost: totalCost,
      revenue: totalRev,
      profit: round2(totalRev - totalCost),
      roas: totalCost > 0 ? round2((totalRev / totalCost) * 100) : 0,
    },
    rows,
    source: {
      ads: liveCost ? 'live' : 'sample',
      admob: liveRev ? 'live' : 'sample',
    },
    generatedAt: new Date().toISOString(),
  }

  return NextResponse.json(body, {
    headers: {
      'Cache-Control': 'private, no-store',
      'X-Roas-Source': `ads:${body.source.ads},admob:${body.source.admob}`,
    },
  })
}

function round2(n: number): number {
  return Math.round(n * 100) / 100
}
