// Google Indexing API
// 환경변수 GOOGLE_INDEXING_SA_JSON에 서비스 계정 JSON (전체) 저장
// Search Console에서 도메인 소유권을 해당 서비스 계정에 부여 필요

interface ServiceAccount {
  client_email: string
  private_key: string
}

/** JWT 생성 (Google OAuth 2.0 server-to-server) */
async function getAccessToken(sa: ServiceAccount): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  const header = { alg: 'RS256', typ: 'JWT' }
  const payload = {
    iss: sa.client_email,
    scope: 'https://www.googleapis.com/auth/indexing',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  }

  const enc = (obj: object) =>
    Buffer.from(JSON.stringify(obj)).toString('base64url')

  const unsigned = `${enc(header)}.${enc(payload)}`

  // RSA-SHA256 서명 (Node crypto)
  const { createSign } = await import('crypto')
  const signer = createSign('RSA-SHA256')
  signer.update(unsigned)
  const signature = signer.sign(sa.private_key, 'base64url')
  const jwt = `${unsigned}.${signature}`

  // 토큰 교환
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  })
  const tokenJson = await tokenRes.json()
  if (!tokenJson.access_token) {
    throw new Error(`OAuth failed: ${JSON.stringify(tokenJson)}`)
  }
  return tokenJson.access_token
}

/** 단일 URL을 Google에 색인 요청 */
export async function notifyGoogleIndexing(
  url: string,
  type: 'URL_UPDATED' | 'URL_DELETED' = 'URL_UPDATED'
): Promise<{ ok: boolean; status: number }> {
  const saJson = process.env.GOOGLE_INDEXING_SA_JSON
  if (!saJson) {
    console.warn('[GoogleIndexing] GOOGLE_INDEXING_SA_JSON not set, skipping')
    return { ok: false, status: 0 }
  }

  let sa: ServiceAccount
  try {
    sa = JSON.parse(saJson)
  } catch {
    console.error('[GoogleIndexing] invalid service account JSON')
    return { ok: false, status: 0 }
  }

  try {
    const token = await getAccessToken(sa)
    const res = await fetch('https://indexing.googleapis.com/v3/urlNotifications:publish', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url, type }),
    })
    return { ok: res.ok, status: res.status }
  } catch (err) {
    console.error('[GoogleIndexing] failed:', err)
    return { ok: false, status: 0 }
  }
}

/** 배치 (Google API rate limit: 200 req/day per project) */
export async function notifyGoogleIndexingBatch(urls: string[]): Promise<{ ok: number; failed: number }> {
  let ok = 0
  let failed = 0
  for (const url of urls) {
    const r = await notifyGoogleIndexing(url)
    if (r.ok) ok++
    else failed++
    // 너무 빠르면 rate limit 걸림
    await new Promise(r => setTimeout(r, 100))
  }
  return { ok, failed }
}
