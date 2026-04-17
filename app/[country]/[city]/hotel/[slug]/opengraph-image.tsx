import { ImageResponse } from "next/og"
import { loadKoreanFonts } from "@/lib/og-font"
import { getCityData, getCountryData } from "@/lib/destinations"
import { getAllHotels, getHotel, hotelSlug, hotelPhotoUrl } from "@/lib/hotels"

export const alt = "호텔 최저가 - 쿨스테이"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export async function generateStaticParams() {
  return getAllHotels().map(({ countrySlug, citySlug, hotel }) => ({
    country: countrySlug,
    city: citySlug,
    slug: hotelSlug(hotel),
  }))
}

export default async function Image({
  params,
}: {
  params: Promise<{ country: string; city: string; slug: string }>
}) {
  const { country: countrySlug, city: citySlug, slug } = await params
  const hotel = getHotel(countrySlug, citySlug, slug)
  const city = getCityData(countrySlug, citySlug)
  const country = getCountryData(countrySlug)
  if (!hotel || !city || !country) return new Response("Not found", { status: 404 })

  const rating = parseFloat(hotel.rating_average) || 0
  const reviews = parseInt(hotel.number_of_reviews) || 0
  const stars = parseInt(hotel.star_rating) || 0
  const locationLine = `${country.name} · ${city.name}`
  const reviewLine = rating > 0 ? `평점 ${rating.toFixed(1)} · 리뷰 ${reviews.toLocaleString()}개` : ""
  const text =
    hotel.name + locationLine + reviewLine + "쿨스테이아고다COOLSTAY최저가성급"
  const fonts = await loadKoreanFonts(text, [400, 700])

  const photoUrl = hotel.photos[0] ? hotelPhotoUrl(hotel.photos[0], 1280) : null

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
          background: "#111827",
        }}
      >
        {photoUrl && (
          <img
            src={photoUrl}
            alt=""
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          />
        )}
        {/* 하단 어두운 그라데이션 */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.35) 40%, rgba(0,0,0,0.88) 100%)",
            display: "flex",
          }}
        />

        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            padding: 70,
            width: "100%",
            height: "100%",
          }}
        >
          {/* 상단: 로고 + 성급 */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", fontSize: 36, fontWeight: 700, letterSpacing: -1 }}>
              <span style={{ color: "#F97316" }}>COOL</span>
              <span style={{ color: "white" }}>STAY</span>
            </div>
            {stars > 0 && (
              <div
                style={{
                  display: "flex",
                  background: "rgba(0,0,0,0.55)",
                  border: "1px solid rgba(255,255,255,0.25)",
                  borderRadius: 999,
                  padding: "8px 20px",
                  fontSize: 26,
                  color: "#FDBA74",
                  fontWeight: 700,
                  letterSpacing: 3,
                }}
              >
                {"★".repeat(stars)}
              </div>
            )}
          </div>

          {/* 하단: 호텔 정보 */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
            <div
              style={{
                display: "flex",
                fontSize: 26,
                color: "#FDBA74",
                fontWeight: 700,
                marginBottom: 14,
              }}
            >
              📍 {locationLine}
            </div>
            <div
              style={{
                fontSize: 72,
                fontWeight: 700,
                lineHeight: 1.1,
                letterSpacing: -2,
                display: "flex",
                // 제목이 너무 길면 잘리지 않도록
                overflow: "hidden",
              }}
            >
              {hotel.name.slice(0, 40)}
            </div>

            {/* 평점 + CTA */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                marginTop: 28,
              }}
            >
              {rating > 0 && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    background: "#F97316",
                    padding: "14px 24px",
                    borderRadius: 14,
                    fontSize: 32,
                    fontWeight: 700,
                  }}
                >
                  ⭐ {rating.toFixed(1)}
                </div>
              )}
              {reviews > 0 && (
                <div style={{ display: "flex", fontSize: 26, fontWeight: 400, opacity: 0.9 }}>
                  리뷰 {reviews.toLocaleString()}개
                </div>
              )}
              <div style={{ flex: 1, display: "flex" }} />
              <div
                style={{
                  display: "flex",
                  fontSize: 24,
                  fontWeight: 700,
                  color: "#F97316",
                  background: "white",
                  padding: "14px 24px",
                  borderRadius: 14,
                }}
              >
                아고다 최저가 →
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts }
  )
}
