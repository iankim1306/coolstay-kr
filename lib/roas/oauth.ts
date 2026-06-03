// 구글 OAuth2 access token 발급 (refresh token → access token)
// 유저별 refresh token을 지원 (멀티유저 로그인). refresh token마다 캐시.

const tokenCache = new Map<string, { token: string; exp: number }>()

/** refresh token으로 access token 발급 (토큰별 5분 캐시). 실패 시 null */
export async function accessTokenFromRefresh(refreshToken: string): Promise<string | null> {
  if (
    !process.env.GOOGLE_OAUTH_CLIENT_ID ||
    !process.env.GOOGLE_OAUTH_CLIENT_SECRET ||
    !refreshToken
  ) {
    return null
  }

  const c = tokenCache.get(refreshToken)
  if (c && c.exp > Date.now() + 30_000) return c.token

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_OAUTH_CLIENT_ID!,
      client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET!,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  })

  if (!res.ok) {
    console.error('[roas/oauth] token refresh 실패:', res.status, await res.text())
    return null
  }

  const json = (await res.json()) as { access_token: string; expires_in: number }
  tokenCache.set(refreshToken, { token: json.access_token, exp: Date.now() + json.expires_in * 1000 })
  return json.access_token
}

/** 환경변수에 소유자 OAuth 자격증명이 모두 있는지 */
export function hasGoogleOAuth(): boolean {
  return Boolean(
    process.env.GOOGLE_OAUTH_CLIENT_ID &&
      process.env.GOOGLE_OAUTH_CLIENT_SECRET &&
      process.env.GOOGLE_OAUTH_REFRESH_TOKEN
  )
}

/** 소유자(env) access token — 구글 애즈 등 서버 자체 호출용. 없으면 null */
export async function getAccessToken(): Promise<string | null> {
  if (!process.env.GOOGLE_OAUTH_REFRESH_TOKEN) return null
  return accessTokenFromRefresh(process.env.GOOGLE_OAUTH_REFRESH_TOKEN)
}
