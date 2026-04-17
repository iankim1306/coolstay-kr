import { ImageResponse } from "next/og"
import { loadKoreanFonts } from "@/lib/og-font"

export const alt = "쿨스테이 - 해외 호텔 최저가 비교"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image() {
  const text = "쿨스테이해외호텔최저가비교일본태국베트남발리필리핀대만아고다COOLSTAY"
  const fonts = await loadKoreanFonts(text, [400, 700])

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #F97316 0%, #EA580C 100%)",
          padding: 80,
          color: "white",
          fontFamily: "Noto Sans KR",
          position: "relative",
        }}
      >
        {/* 큰 동그란 장식 */}
        <div
          style={{
            position: "absolute",
            top: -200,
            right: -200,
            width: 600,
            height: 600,
            borderRadius: "100%",
            background: "rgba(255,255,255,0.08)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -150,
            left: -150,
            width: 400,
            height: 400,
            borderRadius: "100%",
            background: "rgba(255,255,255,0.06)",
            display: "flex",
          }}
        />

        {/* 로고 */}
        <div style={{ fontSize: 48, fontWeight: 700, letterSpacing: -1, display: "flex" }}>
          <span style={{ color: "white" }}>COOL</span>
          <span style={{ color: "#FEF3C7" }}>STAY</span>
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ fontSize: 88, fontWeight: 700, lineHeight: 1.1, letterSpacing: -2 }}>
            해외 호텔 최저가
          </div>
          <div style={{ fontSize: 88, fontWeight: 700, lineHeight: 1.1, letterSpacing: -2, marginTop: 8 }}>
            한번에 비교
          </div>
          <div style={{ fontSize: 36, fontWeight: 400, marginTop: 32, opacity: 0.95 }}>
            일본 · 태국 · 베트남 · 발리 · 필리핀 · 대만
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 28, fontWeight: 400, opacity: 0.85 }}>
          아고다 실시간 최저가 · 무료 취소 · 즉시 예약 확정
        </div>
      </div>
    ),
    { ...size, fonts }
  )
}
