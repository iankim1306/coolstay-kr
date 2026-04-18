/**
 * OG 이미지용 한글 폰트 로더
 * - 빌드 시 수천 페이지가 OG 이미지를 prerender하므로, 폰트는 weight별 1회만 fetch하고
 *   메모리에 캐시한다. (text별 subset fetch는 제거 — Vercel 빌드 ETIMEDOUT 원인)
 * - Google Fonts CSS API에 구형 Android UA를 써서 TTF URL을 얻는다. (satori TTF 전용)
 */

type Weight = 400 | 700

const FAMILY = "Noto Sans KR"
const TIMEOUT_MS = 15000
const MAX_RETRY = 3

// weight별 캐시 (Promise를 캐시해서 동시 호출에도 1회만 fetch)
const fontCache: Partial<Record<Weight, Promise<ArrayBuffer>>> = {}

async function fetchWithRetry(url: string, init?: RequestInit): Promise<Response> {
  let lastErr: unknown
  for (let attempt = 0; attempt < MAX_RETRY; attempt++) {
    try {
      const res = await fetch(url, {
        ...init,
        signal: AbortSignal.timeout(TIMEOUT_MS),
      })
      if (res.ok) return res
      lastErr = new Error(`HTTP ${res.status}`)
    } catch (err) {
      lastErr = err
    }
    // exponential backoff: 500ms, 1000ms, 2000ms
    await new Promise((r) => setTimeout(r, 500 * Math.pow(2, attempt)))
  }
  throw lastErr ?? new Error("fetchWithRetry: unknown error")
}

async function fetchCss(weight: Weight): Promise<string> {
  const url =
    `https://fonts.googleapis.com/css2?family=${encodeURIComponent(FAMILY)}:wght@${weight}` +
    `&subset=korean&display=swap`
  const res = await fetchWithRetry(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Linux; U; Android 2.3.3) AppleWebKit/533.1",
    },
  })
  return res.text()
}

function extractFontUrl(css: string): string {
  const ttf = css.match(/src:\s*url\((https:\/\/[^)]+?)\)\s*format\(['"]?truetype['"]?\)/)
  if (ttf) return ttf[1]
  const otf = css.match(/src:\s*url\((https:\/\/[^)]+?)\)\s*format\(['"]?opentype['"]?\)/)
  if (otf) return otf[1]
  const any = css.match(/src:\s*url\((https:\/\/[^)]+?)\)/)
  if (any) return any[1]
  throw new Error("Font URL not found in Google Fonts CSS")
}

async function fetchFontBuffer(weight: Weight): Promise<ArrayBuffer> {
  const css = await fetchCss(weight)
  const fontUrl = extractFontUrl(css)
  const res = await fetchWithRetry(fontUrl)
  return res.arrayBuffer()
}

/**
 * 한글 폰트 ArrayBuffer 반환. weight별 1회만 fetch (메모리 캐시).
 * text 인자는 호환성 위해 유지하지만 사용하지 않음 (전체 korean subset 로드).
 */
export async function loadKoreanFont(_text: string, weight: Weight = 700): Promise<ArrayBuffer> {
  if (!fontCache[weight]) {
    fontCache[weight] = fetchFontBuffer(weight).catch((err) => {
      // 실패 시 캐시 무효화해서 다음 호출에 재시도 가능하게
      delete fontCache[weight]
      throw err
    })
  }
  return fontCache[weight]!
}

/** 여러 굵기를 한 번에 로드 */
export async function loadKoreanFonts(text: string, weights: Weight[] = [400, 700]) {
  const fonts = await Promise.all(weights.map((w) => loadKoreanFont(text, w)))
  return weights.map((w, i) => ({
    name: "Noto Sans KR",
    data: fonts[i],
    weight: w as Weight,
    style: "normal" as const,
  }))
}
