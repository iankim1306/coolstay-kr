// 구글 OAuth2 access token 발급 (refresh token → access token)
// 구글 애즈 / 애드몹이 같은 GCP 프로젝트·같은 refresh token을 공유한다.

type TokenCache = { token: string; exp: number } | null
let cache: TokenCache = null

/** 환경변수에서 OAuth 자격증명이 모두 있는지 */
export function hasGoogleOAuth(): boolean {
  return Boolean(
    process.env.GOOGLE_OAUTH_CLIENT_ID &&
      process.env.GOOGLE_OAUTH_CLIENT_SECRET &&
      process.env.GOOGLE_OAUTH_REFRESH_TOKEN
  )
}

/** access token 발급 (5분 캐시). 자격증명 없으면 null */
export async function getAccessToken(): Promise<string | null> {
  if (!hasGoogleOAuth()) return null
  if (cache && cache.exp > Date.now() + 30_000) return cache.token

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_OAUTH_CLIENT_ID!,
      client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET!,
      refresh_token: process.env.GOOGLE_OAUTH_REFRESH_TOKEN!,
      grant_type: 'refresh_token',
    }),
  })

  if (!res.ok) {
    console.error('[roas/oauth] token refresh 실패:', res.status, await res.text())
    return null
  }

  const json = (await res.json()) as { access_token: string; expires_in: number }
  cache = {
    token: json.access_token,
    exp: Date.now() + json.expires_in * 1000,
  }
  return cache.token
}
