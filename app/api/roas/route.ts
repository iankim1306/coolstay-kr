import { NextRequest, NextResponse } from 'next/server'
import { fetchAdsCost } from '@/lib/roas/google-ads'
import { fetchAdmobRevenue, sampleAdmobRevenue } from '@/lib/roas/admob'
import {
  DateRangeKey,
  RoasResponse,
  DailyRowComputed,
  Currency,
  CURRENCIES,
  resolveRange,
  eachDay,
} from '@/lib/roas/types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const VALID: DateRangeKey[] = ['today', 'yesterday', '7d', '30d']

export async function GET(req: NextRequest) {
  const key = (req.nextUrl.searchParams.get('range') ?? '7d') as DateRangeKey
  const rangeKey: DateRangeKey = VALID.includes(key) ? key : '7d'
  const cq = (req.nextUrl.searchParams.get('currency') ?? 'USD') as Currency
  const currency: Currency = CURRENCIES.includes(cq) ? cq : 'USD'
  const { startDate, endDate, label } = resolveRange(rangeKey)

  const [liveCost, liveRev] = await Promise.all([
    fetchAdsCost(startDate, endDate),
    fetchAdmobRevenue(startDate, endDate, currency),
  ])

  // 광고비: 구글 애즈 미연결(토큰 승인 전)이면 가짜값 대신 null = "대기중"
  const adsLive = liveCost !== null
  // 수익: 애드몹 미설정이면 데모용 샘플 (지금은 실데이터)
  const revMap = liveRev ?? sampleAdmobRevenue(startDate, endDate)

  const rows: DailyRowComputed[] = eachDay(startDate, endDate).map((date) => {
    const revenue = round2(revMap[date] ?? 0)
    const cost = adsLive ? round2(liveCost![date] ?? 0) : null
    const profit = cost === null ? null : round2(revenue - cost)
    const roas = cost === null ? null : cost > 0 ? round2((revenue / cost) * 100) : 0
    return { date, revenue, cost, profit, roas }
  })

  const totalRev = round2(rows.reduce((s, r) => s + r.revenue, 0))
  const totalCost = adsLive
    ? round2(rows.reduce((s, r) => s + (r.cost ?? 0), 0))
    : null

  const body: RoasResponse = {
    range: { startDate, endDate, label },
    currency,
    totals: {
      cost: totalCost,
      revenue: totalRev,
      profit: totalCost === null ? null : round2(totalRev - totalCost),
      roas:
        totalCost === null ? null : totalCost > 0 ? round2((totalRev / totalCost) * 100) : 0,
    },
    rows,
    adsPending: !adsLive,
    source: {
      ads: adsLive ? 'live' : 'pending',
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
