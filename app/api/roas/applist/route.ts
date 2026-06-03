import { NextResponse } from 'next/server'
import { fetchAppList, sampleAppList } from '@/lib/roas/admob'
import { AppListResponse } from '@/lib/roas/types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const live = await fetchAppList()
  const apps = live ?? sampleAppList()

  const body: AppListResponse = {
    apps,
    source: live ? 'live' : 'sample',
    generatedAt: new Date().toISOString(),
  }

  return NextResponse.json(body, {
    headers: {
      'Cache-Control': 'private, no-store',
      'X-Roas-Source': `admobAppList:${body.source}`,
    },
  })
}
