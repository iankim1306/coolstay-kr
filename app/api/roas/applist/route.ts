import { NextResponse } from 'next/server'
import { fetchAppList, sampleAppList } from '@/lib/roas/admob'
import { resolveIcons } from '@/lib/roas/icons'
import { AppListResponse } from '@/lib/roas/types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const live = await fetchAppList()
  const apps = live ?? sampleAppList()

  // 아이콘 해석 (실데이터일 때만 — 샘플은 패키지가 가짜라 스킵)
  if (live) {
    const icons = await resolveIcons(
      apps.map((a) => ({ appId: a.appId, storeId: a.storeId, platform: a.platform }))
    )
    for (const a of apps) if (icons[a.appId]) a.iconUrl = icons[a.appId]
  }

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
