/**
 * OG 이미지용 한글 폰트 로더
 * Google Fonts CSS API를 통해 텍스트에 필요한 글리프만 받아오는 subset 방식.
 * 빌드 시(또는 요청 시) fetch 되어 ImageResponse의 fonts 옵션에 전달.
 */

type Weight = 400 | 700

const FAMILY = "Noto Sans KR"

async function fetchCss(text: string, weight: Weight): Promise<string> {
  const url =
    `https://fonts.googleapis.com/css2?family=${encodeURIComponent(FAMILY)}:wght@${weight}` +
    `&text=${encodeURIComponent(text)}&display=swap`
  // Satori(next/og)는 TTF/OTF만 지원. 구형 Android UA를 쓰면 Google Fonts가 TTF를 리턴한다.
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Linux; U; Android 2.3.3) AppleWebKit/533.1",
    },
  })
  if (!res.ok) throw new Error(`Google Fonts CSS fetch failed: ${res.status}`)
  return res.text()
}

function extractFontUrl(css: string): string {
  // truetype / opentype / woff (순서대로 시도) — satori는 ttf/otf 선호
  const ttf = css.match(/src:\s*url\((https:\/\/[^)]+?)\)\s*format\(['"]?truetype['"]?\)/)
  if (ttf) return ttf[1]
  const otf = css.match(/src:\s*url\((https:\/\/[^)]+?)\)\s*format\(['"]?opentype['"]?\)/)
  if (otf) return otf[1]
  // fallback: 그냥 첫 url()
  const any = css.match(/src:\s*url\((https:\/\/[^)]+?)\)/)
  if (any) return any[1]
  throw new Error("Font URL not found in Google Fonts CSS")
}

/**
 * 주어진 텍스트에 쓰이는 글리프만 담은 woff2 ArrayBuffer 반환.
 * @param text  렌더할 문자열 (한글 + 영문 + 숫자 혼합 가능)
 * @param weight  400(Regular) / 700(Bold)
 */
export async function loadKoreanFont(text: string, weight: Weight = 700): Promise<ArrayBuffer> {
  const css = await fetchCss(text, weight)
  const fontUrl = extractFontUrl(css)
  const fontRes = await fetch(fontUrl)
  if (!fontRes.ok) throw new Error(`font fetch failed: ${fontRes.status}`)
  return fontRes.arrayBuffer()
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
