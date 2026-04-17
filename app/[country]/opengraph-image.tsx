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
  const text = title + subtitle + "쿨스테이아고다COOLSTAY최대추가할인무료취소"
  const fonts = await loadKoreanFonts(text, [400, 700])

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          fontFamily: "Noto Sans KR",
          color: "white",
        }}
      >
        {/* 배경 이미지 */}
        <img
          src={country.img}
          alt=""
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
        {/* 어두운 오버레이 */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.75) 100%)",
            display: "flex",
          }}
        />

        {/* 컨텐츠 */}
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            padding: 80,
            width: "100%",
            height: "100%",
          }}
        >
          <div style={{ display: "flex", fontSize: 40, fontWeight: 700, letterSpacing: -1 }}>
            <span style={{ color: "#F97316" }}>COOL</span>
            <span style={{ color: "white" }}>STAY</span>
          </div>

          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
            <div
              style={{
                display: "flex",
                fontSize: 28,
                color: "#FDBA74",
                fontWeight: 700,
                marginBottom: 16,
                letterSpacing: 2,
              }}
            >
              {subtitle}
            </div>
            <div
              style={{
                fontSize: 100,
                fontWeight: 700,
                lineHeight: 1.05,
                letterSpacing: -3,
              }}
            >
              {title}
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 28,
                fontSize: 28,
                fontWeight: 400,
                opacity: 0.9,
              }}
            >
              아고다 최저가 · 무료 취소 · 즉시 예약 확정
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts }
  )
}
