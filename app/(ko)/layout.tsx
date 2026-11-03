import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import "../globals.css";
import { organizationJsonLd, websiteJsonLd, ldJson } from "@/lib/jsonld";
import { CATEGORIES } from "@/lib/stay";

// 2026-11-03 개편: 해외 호텔 제휴(아고다) → 국내 숙박·여행 지원 정보 사이트.
// 옛 해외 호텔 페이지는 주소를 살려 두되 vercel.json 의 X-Robots-Tag 로 검색 제외.

const GA_ID = "G-CVRE4H4QDX";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://coolstay.kr"),
  title: "쿨스테이 — 국내 숙박·여행 지원 제도와 알뜰 여행 정보",
  description:
    "숙박 할인권·근로자 휴가지원·문화누리카드 같은 여행 지원 제도, 숙박 예약 취소·환불 기준, 숙소 안전 수칙, 계절별 국내 여행 계획을 공식 자료 기준으로 정리합니다.",
  openGraph: {
    siteName: "쿨스테이",
    locale: "ko_KR",
    type: "website",
    url: "https://coolstay.kr",
    title: "쿨스테이 — 국내 숙박·여행 지원 정보",
    description: "여행 지원 제도, 숙박 취소·환불 기준, 숙소 안전 수칙을 공식 자료 기준으로 정리합니다.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={geist.variable}>
      <head>
        <meta name="google-adsense-account" content="ca-pub-5445161370907020" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5445161370907020"
          crossOrigin="anonymous"
        ></script>
        <meta name="google-site-verification" content="1UVK4e-DptUMt3rLxv8LUvndSIwJouKhNK4fvsGeNCQ" />
        <meta name="naver-site-verification" content="e6e8ffb8591a2e8765957e38334cdb8dd9d9ca00" />
        <script {...ldJson(organizationJsonLd())} />
        <script {...ldJson(websiteJsonLd())} />
      </head>
      <body className="min-h-screen bg-white text-gray-900">
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}', { send_page_view: true });
          `}
        </Script>

        <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
            <a href="/" className="shrink-0 text-xl font-bold">
              <span className="text-teal-600">COOL</span>
              <span className="text-gray-800">STAY</span>
            </a>
            <nav className="flex gap-4 overflow-x-auto whitespace-nowrap text-sm text-gray-600">
              <a href="/info" className="font-semibold text-gray-900 hover:text-teal-700">전체 글</a>
              {CATEGORIES.slice(0, 4).map((c) => (
                <a key={c.slug} href={`/info#${c.slug}`} className="hidden hover:text-teal-700 sm:inline">
                  {c.key}
                </a>
              ))}
              <a href="/about" className="hover:text-teal-700">소개</a>
            </nav>
          </div>
        </header>

        <main>{children}</main>

        <footer className="mt-20 bg-gray-900 text-gray-400">
          <div className="mx-auto max-w-5xl px-4 py-12 text-sm">
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
              {CATEGORIES.map((c) => (
                <a key={c.slug} href={`/info#${c.slug}`} className="hover:text-white">
                  {c.key}
                </a>
              ))}
            </div>
            <div className="mt-8 border-t border-gray-800 pt-6 text-xs leading-relaxed">
              <p className="max-w-2xl">
                <span className="font-semibold text-white">쿨스테이</span>는 국내 숙박·여행 지원 제도와 숙소 예약·안전 정보를 공식
                자료 기준으로 정리하는 정보 사이트입니다. 신청 조건과 요금은 각 기관 공고와 숙소 약관을 꼭 확인하세요.
              </p>
              <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1">
                <a href="/about" className="hover:text-white">소개</a>
                <a href="/privacy" className="hover:text-white">개인정보처리방침</a>
                <a href="/contact" className="hover:text-white">문의</a>
              </p>
              <p className="mt-4 text-gray-500">© 2026 COOLSTAY</p>
            </div>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
