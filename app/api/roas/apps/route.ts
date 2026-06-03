import { NextRequest, NextResponse } from 'next/server'
import { fetchAdmobByApp, sampleAdmobByApp } from '@/lib/roas/admob'
import { DateRangeKey, AppsResponse, Currency, CURRENCIES, resolveRange } from '@/lib/roas/types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const VALID: DateRangeKey[] = ['today', 'yesterday', '7d', '30d']

export async function GET(req: NextRequest) {
  const key = (req.nextUrl.searchParams.get('range') ?? '7d') as DateRangeKey
  const rangeKey: DateRangeKey = VALID.includes(key) ? key : '7d'
  const cq = (req.nextUrl.searchParams.get('currency') ?? 'USD') as Currency
  const currency: Currency = CURRENCIES.includes(cq) ? cq : 'USD'
  const { startDate, endDate, label } = resolveRange(rangeKey)

  const live = await fetchAdmobByApp(startDate, endDate, currency)
  const apps = live ?? sampleAdmobByApp(startDate, endDate)

  const body: AppsResponse = {
    range: { startDate, endDate, label },
    currency,
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
