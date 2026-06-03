// 앱 아이콘 해석 — 패키지명/번들ID로 스토어에서 아이콘 URL을 가져와 Redis에 캐시.
// 실패하면 null (UI는 이니셜 아바타로 폴백). Redis 미설정이어도 동작(캐시 없이).
import { getRedis } from '@/lib/redis'

const TTL_HIT = 60 * 60 * 24 * 30 // 30일
const TTL_MISS = 60 * 60 * 24 // 1일 (실패는 짧게)
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'

/** 여러 앱의 아이콘 URL을 병렬 해석 → { appId: iconUrl } */
export async function resolveIcons(
  items: { appId: string; storeId: string; platform: string }[]
): Promise<Record<string, string>> {
  const out: Record<string, string> = {}
  await Promise.all(
    items.map(async (it) => {
      if (!it.storeId || it.storeId === '-') return
      const url = await iconFor(it.storeId, it.platform)
      if (url) out[it.appId] = url
    })
  )
  return out
}

async function iconFor(storeId: string, platform: string): Promise<string | null> {
  const key = `roasicon:${storeId}`
  // 캐시 조회 (빈 문자열 = 미스 캐시)
  try {
    const cached = await getRedis().get<string>(key)
    if (cached != null) return cached === '' ? null : cached
  } catch {
    // Redis 미설정/실패 → 캐시 없이 진행
  }

  const url = await fetchIcon(storeId, platform)

  try {
    await getRedis().set(key, url ?? '', { ex: url ? TTL_HIT : TTL_MISS })
  } catch {
    // 캐시 저장 실패는 무시
  }
  return url
}

async function fetchIcon(storeId: string, platform: string): Promise<string | null> {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), 4500)
  try {
    if (platform === 'IOS') {
      const res = await fetch(
        `https://itunes.apple.com/lookup?bundleId=${encodeURIComponent(storeId)}`,
        { signal: ctrl.signal }
      )
      if (!res.ok) return null
      const j = (await res.json()) as { results?: Array<{ artworkUrl100?: string; artworkUrl512?: string }> }
      return j.results?.[0]?.artworkUrl512 ?? j.results?.[0]?.artworkUrl100 ?? null
    }
    // Android — Play Store 리스팅의 og:image
    const res = await fetch(
      `https://play.google.com/store/apps/details?id=${encodeURIComponent(storeId)}&hl=en`,
      { headers: { 'User-Agent': UA, 'Accept-Language': 'en' }, signal: ctrl.signal }
    )
    if (!res.ok) return null
    const html = await res.text()
    const m =
      html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i) ||
      html.match(/<meta\s+content="([^"]+)"\s+property="og:image"/i)
    return m?.[1] ?? null
  } catch {
    return null
  } finally {
    clearTimeout(timer)
  }
}
