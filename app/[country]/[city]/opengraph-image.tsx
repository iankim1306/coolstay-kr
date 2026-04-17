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
  const text = title + subtitle + tagStr + "쿨스테이아고다COOLSTAY최저가무료취소추가할인"
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
        <img
          src={city.img}
          alt=""
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 55%, rgba(0,0,0,0.85) 100%)",
            display: "flex",
          }}
        />

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
                fontSize: 26,
                color: "#FDBA74",
                fontWeight: 700,
                marginBottom: 16,
                letterSpacing: 1,
              }}
            >
              {city.country} · {subtitle}
            </div>
            <div
              style={{
                fontSize: 120,
                fontWeight: 700,
                lineHeight: 1,
                letterSpacing: -4,
              }}
            >
              {title}
            </div>
            {tagStr && (
              <div
                style={{
                  display: "flex",
                  marginTop: 28,
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
                marginTop: 16,
                fontSize: 24,
                fontWeight: 400,
                opacity: 0.75,
              }}
            >
              아고다 최저가 비교 · 무료 취소 가능
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts }
  )
}
