import { ImageResponse } from "next/og"
import { loadKoreanFonts } from "@/lib/og-font"
import { getCityData } from "@/lib/destinations"
import { getTheme, getAllThemeCombos, getThemedHotels } from "@/lib/themes"

export const alt = "테마별 호텔 TOP 10 - 쿨스테이"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export async function generateStaticParams() {
  return getAllThemeCombos().map(({ countrySlug, citySlug, theme }) => ({
    country: countrySlug,
    city: citySlug,
    theme: theme.slug,
  }))
}

export default async function Image({
  params,
}: {
  params: Promise<{ country: string; city: string; theme: string }>
}) {
  const { country, city: citySlug, theme: themeSlug } = await params
  const theme = getTheme(themeSlug)
  const city = getCityData(country, citySlug)
  if (!theme || !city) return new Response("Not found", { status: 404 })

  const count = getThemedHotels(country, citySlug, theme, 10).length
  const title = `${city.name} ${theme.keyword}`
  const top = `TOP ${count}`
  const text =
    title + top + theme.emoji + "쿨스테이아고다COOLSTAY실제리뷰기준최저가무료취소"
  const fonts = await loadKoreanFonts(text, [400, 700])

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #F97316 0%, #EA580C 55%, #C2410C 100%)",
          padding: 80,
          color: "white",
          fontFamily: "Noto Sans KR",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -150,
            right: -150,
            width: 500,
            height: 500,
            borderRadius: "100%",
            background: "rgba(255,255,255,0.1)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -120,
            left: -120,
            width: 350,
            height: 350,
            borderRadius: "100%",
            background: "rgba(0,0,0,0.1)",
            display: "flex",
          }}
        />

        {/* 로고 */}
        <div style={{ display: "flex", fontSize: 40, fontWeight: 700, letterSpacing: -1 }}>
          <span style={{ color: "white" }}>COOL</span>
          <span style={{ color: "#FEF3C7" }}>STAY</span>
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ fontSize: 140, marginBottom: 20, display: "flex" }}>{theme.emoji}</div>
          <div style={{ fontSize: 28, fontWeight: 400, opacity: 0.9, display: "flex", marginBottom: 12 }}>
            {city.country} · {city.name}
          </div>
          <div
            style={{
              fontSize: 96,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: -3,
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 16,
              fontSize: 80,
              fontWeight: 700,
              color: "#FEF3C7",
              letterSpacing: -2,
            }}
          >
            {top}
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 26, fontWeight: 400, opacity: 0.9 }}>
          실제 투숙객 리뷰 기준 · 아고다 실시간 최저가
        </div>
      </div>
    ),
    { ...size, fonts }
  )
}
