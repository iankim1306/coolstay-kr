import { ImageResponse } from "next/og"
import { loadKoreanFonts } from "@/lib/og-font"
import { getCountryData, COUNTRIES } from "@/lib/destinations"

export const alt = "국가별 호텔 최저가 - 쿨스테이"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export async function generateStaticParams() {
  return COUNTRIES.map((c) => ({ country: c.slug }))
}

export default async function Image({
  params,
}: {
  params: Promise<{ country: string }>
}) {
  const { country: countrySlug } = await params
  const country = getCountryData(countrySlug)
  if (!country) return new Response("Not found", { status: 404 })

  const title = `${country.name} 호텔 최저가`
  const subtitle = country.desc
  const text = title + subtitle + "쿨스테이아고다COOLSTAY최대추가할인무료취소즉시예약확정"
  const fonts = await loadKoreanFonts(text, [400, 700])

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          padding: 80,
          fontFamily: "Noto Sans KR",
          color: "white",
          background:
            "linear-gradient(135deg, #0F172A 0%, #1E293B 45%, #0F172A 100%)",
        }}
      >
        {/* 오렌지 글로우 */}
        <div
          style={{
            position: "absolute",
            top: -200,
            right: -200,
            width: 600,
            height: 600,
            borderRadius: "100%",
            background: "radial-gradient(circle, rgba(249,115,22,0.55) 0%, rgba(249,115,22,0) 70%)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -150,
            left: -150,
            width: 450,
            height: 450,
            borderRadius: "100%",
            background: "radial-gradient(circle, rgba(234,88,12,0.35) 0%, rgba(234,88,12,0) 70%)",
            display: "flex",
          }}
        />

        {/* 로고 */}
        <div
          style={{
            display: "flex",
            fontSize: 40,
            fontWeight: 700,
            letterSpacing: -1,
            position: "relative",
          }}
        >
          <span style={{ color: "#F97316" }}>COOL</span>
          <span style={{ color: "white" }}>STAY</span>
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 30,
              color: "#FDBA74",
              fontWeight: 700,
              marginBottom: 18,
              letterSpacing: 3,
            }}
          >
            {subtitle}
          </div>
          <div
            style={{
              fontSize: 120,
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: -4,
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 32,
              fontSize: 28,
              fontWeight: 400,
              opacity: 0.9,
            }}
          >
            아고다 최저가 · 무료 취소 · 즉시 예약 확정
          </div>
        </div>
      </div>
    ),
    { ...size, fonts }
  )
}
