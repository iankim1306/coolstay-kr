import { NextRequest, NextResponse } from 'next/server'
import { SESSION_COOKIE, readSession } from '@/lib/roas/session'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const s = await readSession(req.cookies.get(SESSION_COOKIE)?.value)
  return NextResponse.json(
    {
      loggedIn: Boolean(s),
      email: s?.email ?? null,
      hasAdmob: Boolean(s?.publisherId),
    },
    { headers: { 'Cache-Control': 'private, no-store' } }
  )
}
