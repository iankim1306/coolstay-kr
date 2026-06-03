import { NextRequest, NextResponse } from 'next/server'
import { fetchPublisherId } from '@/lib/roas/admob'
import { SESSION_COOKIE, newSessionId, saveSession } from '@/lib/roas/session'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const origin = req.nextUrl.origin
  const code = req.nextUrl.searchParams.get('code')
  const state = req.nextUrl.searchParams.get('state')
  const savedState = req.cookies.get('roas_oauth_state')?.value

  const fail = (reason: string) => {
    const res = NextResponse.redirect(`${origin}/roas?login=error&reason=${reason}`)
    res.cookies.delete('roas_oauth_state')
    return res
  }

  if (!code || !state || !savedState || state !== savedState) return fail('state')

  // 1) code → tokens
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_OAUTH_CLIENT_ID ?? '',
      client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET ?? '',
      code,
      grant_type: 'authorization_code',
      redirect_uri: `${origin}/api/auth/callback`,
    }),
  })
  if (!tokenRes.ok) {
    console.error('[auth/callback] token 교환 실패:', tokenRes.status, await tokenRes.text())
    return fail('token')
  }
  const tokens = (await tokenRes.json()) as {
    access_token: string
    refresh_token?: string
  }
  if (!tokens.refresh_token) return fail('norefresh')

  // 2) 이메일 조회
  let email = ''
  try {
    const ui = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    })
    if (ui.ok) email = ((await ui.json()) as { email?: string }).email ?? ''
  } catch {
    // 이메일 없어도 진행
  }

  // 3) 애드몹 게시자ID 자동 조회
  const publisherId = (await fetchPublisherId(tokens.access_token)) ?? ''

  // 4) 세션 저장 + 쿠키
  const sid = newSessionId()
  await saveSession(sid, { refreshToken: tokens.refresh_token, publisherId, email })

  const dest = publisherId ? `${origin}/roas?login=ok` : `${origin}/roas?login=noadmob`
  const res = NextResponse.redirect(dest)
  res.cookies.delete('roas_oauth_state')
  res.cookies.set(SESSION_COOKIE, sid, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 60,
  })
  return res
}
