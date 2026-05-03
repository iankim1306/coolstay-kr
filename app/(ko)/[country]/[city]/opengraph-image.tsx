import { ImageResponse } from "next/og"
import { loadKoreanFonts } from "@/lib/og-font"
import { getCityData, COUNTRIES } from "@/lib/destinations"

export const alt = "도시별 호텔 최저가 - 쿨스테이"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export async function generateStaticParams() {
  return COUNTRIES.flatMap((c) => c.cities.map((ci) => ({ country: c.slug, city: ci.nameEn })))
}

export default async function Image({
  params,
}: {
  params: Promise<{ country: string; city: string }>
}) {
  const { country, city: citySlug } = await params
  const city = getCityData(country, citySlug)
  if (!city) return new Response("Not found", { status: 404 })

  const title = `${city.name} 호텔`
  const subtitle = city.desc
  const tagStr = city.tags.slice(0, 4).join(" · ")
  const text = title + subtitle + tagStr + city.country + "쿨스테이아고다COOLSTAY최저가무료취소추가할인비교"
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
            "linear-gradient(135deg, #1E293B 0%, #334155 50%, #0F172A 100%)",
        }}
      >
        {/* 오렌지 글로우 (왼쪽 아래) */}
        <div
          style={{
            position: "absolute",
            bottom: -220,
            left: -220,
            width: 650,
            height: 650,
            borderRadius: "100%",
            background: "radial-gradient(circle, rgba(249,115,22,0.6) 0%, rgba(249,115,22,0) 70%)",
            display: "flex",
          }}
        />
        {/* 작은 글로우 (오른쪽 위) */}
        <div
          style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 350,
            height: 350,
            borderRadius: "100%",
            background: "radial-gradient(circle, rgba(253,186,116,0.25) 0%, rgba(253,186,116,0) 70%)",
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
              fontSize: 28,
              color: "#FDBA74",
              fontWeight: 700,
              marginBottom: 18,
              letterSpacing: 2,
            }}
          >
            📍 {city.country} · {subtitle}
          </div>
          <div
            style={{
              fontSize: 140,
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: -5,
              display: "flex",
            }}
          >
            {title}
          </div>
          {tagStr && (
            <div
              style={{
                display: "flex",
                marginTop: 32,
                fontSize: 28,
                fontWeight: 400,
                opacity: 0.92,
              }}
            >
              #{tagStr.replace(/ · /g, "  #")}
            </div>
          )}
          <div
            style={{
              display: "flex",
              marginTop: 18,
              fontSize: 24,
              fontWeight: 400,
              opacity: 0.75,
            }}
          >
            아고다 최저가 비교 · 무료 취소 가능
          </div>
        </div>
      </div>
    ),
    { ...size, fonts }
  )
}
