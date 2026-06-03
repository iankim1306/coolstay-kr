import { NextRequest, NextResponse } from 'next/server'
import { fetchAdmobByApp, sampleAdmobByApp } from '@/lib/roas/admob'
import { DateRangeKey, AppsResponse, resolveRange } from '@/lib/roas/types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const VALID: DateRangeKey[] = ['today', 'yesterday', '7d', '30d']

export async function GET(req: NextRequest) {
  const key = (req.nextUrl.searchParams.get('range') ?? '7d') as DateRangeKey
  const rangeKey: DateRangeKey = VALID.includes(key) ? key : '7d'
  const { startDate, endDate, label } = resolveRange(rangeKey)

  const live = await fetchAdmobByApp(startDate, endDate)
  const apps = live ?? sampleAdmobByApp()

  const body: AppsResponse = {
    range: { startDate, endDate, label },
    currency: process.env.ROAS_CURRENCY ?? 'USD',
    apps,
    source: live ? 'live' : 'sample',
    generatedAt: new Date().toISOString(),
  }

  return NextResponse.json(body, {
    headers: {
      'Cache-Control': 'private, no-store',
      'X-Roas-Source': `admobApps:${body.source}`,
    },
  })
}
