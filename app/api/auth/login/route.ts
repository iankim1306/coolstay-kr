import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const SCOPES = ['openid', 'email', 'https://www.googleapis.com/auth/admob.readonly'].join(' ')

export async function GET(req: NextRequest) {
  const origin = req.nextUrl.origin
  const state = crypto.randomUUID()

  const url = new URL('https://accounts.google.com/o/oauth2/v2/auth')
  url.searchParams.set('client_id', process.env.GOOGLE_OAUTH_CLIENT_ID ?? '')
  url.searchParams.set('redirect_uri', `${origin}/api/auth/callback`)
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('scope', SCOPES)
  url.searchParams.set('access_type', 'offline')
  url.searchParams.set('prompt', 'consent') // refresh token 매번 보장
  url.searchParams.set('include_granted_scopes', 'true')
  url.searchParams.set('state', state)

  const res = NextResponse.redirect(url.toString())
  res.cookies.set('roas_oauth_state', state, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 600,
  })
  return res
}
