import { NextRequest, NextResponse } from 'next/server'
import { SESSION_COOKIE, deleteSession } from '@/lib/roas/session'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  await deleteSession(req.cookies.get(SESSION_COOKIE)?.value)
  const res = NextResponse.redirect(`${req.nextUrl.origin}/roas`)
  res.cookies.delete(SESSION_COOKIE)
  return res
}
