import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import "../globals.css";
import { organizationJsonLd, websiteJsonLd, ldJson } from "@/lib/jsonld";
import { COUNTRIES } from "@/lib/destinations";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const GA_ID = "G-CVRE4H4QDX";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://coolstay.kr"),
  title: "쿨스테이 - 해외 호텔 최저가 비교 | 아고다 특가",
  description: "일본·태국·베트남·발리·필리핀·대만 21개 도시 6,000개+ 호텔을 아고다 실시간 최저가로 비교하세요. 오사카·도쿄·방콕·발리·다낭 인기 도시 가성비 호텔부터 5성급 럭셔리·풀빌라까지 한 곳에서. 무료 취소·즉시 예약 확정·평균 7% 추가 할인.",
  openGraph: {
    siteName: "쿨스테이",
    locale: "ko_KR",
    type: "website",
    url: "https://coolstay.kr",
    title: "쿨스테이 - 해외 호텔 최저가 비교 | 아고다 특가",
    description: "일본·동남아 21개 도시 6,000개 호텔 아고다 실시간 최저가 비교. 오사카·방콕·발리·다낭 인기 도시 가성비 호텔부터 5성급 풀빌라까지. 무료 취소·즉시 확정·최대 7% 추가 할인.",
  },
  twitter: {
    card: "summary_large_image",
    site: "@coolstay_kr",
    title: "쿨스테이 - 해외 호텔 최저가 비교",
    description: "일본·동남아 21개 도시 6,000개 호텔 아고다 실시간 최저가 비교. 무료 취소·즉시 예약 확정·최대 7% 추가 할인.",
  },
  verification: {
    other: {
      "agd-partner-manual-verification": "",
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={geist.variable}>
      <head>
        <meta name="google-site-verification" content="1UVK4e-DptUMt3rLxv8LUvndSIwJouKhNK4fvsGeNCQ" />
        <meta name="naver-site-verification" content="e6e8ffb8591a2e8765957e38334cdb8dd9d9ca00" />
        <meta name="msvalidate.01" content="" />
        <meta name="yandex-verification" content="" />

        <script {...ldJson(organizationJsonLd())} />
        <script {...ldJson(websiteJsonLd())} />

      </head>
      <body className="min-h-screen bg-white text-gray-900">
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}', { send_page_view: true });
          `}
        </Script>
        <Script id="ota-click-tracker" strategy="afterInteractive">
          {`
            (function() {
              var OTA_MAP = [
                { host: 'agoda.com',      name: 'agoda'   },
                { host: 'trip.com',       name: 'trip'    },
                { host: 'booking.com',    name: 'booking' },
                { host: 'hotels.com',     name: 'hotels'  },
              ];
              document.addEventListener('click', function(e) {
                var target = e.target;
                while (target && target !== document) {
                  if (target.tagName === 'A' && target.href) {
                    var href = target.href;
                    for (var i = 0; i < OTA_MAP.length; i++) {
                      if (href.indexOf(OTA_MAP[i].host) !== -1) {
                        var ota = OTA_MAP[i].name;
                        if (window.gtag) {
                          var hidMatch = href.match(/hid=(\\d+)/);
                          var cityMatch = href.match(/city=(\\d+)/);
                          // GA4 권장 이벤트명: select_content (어필리 클릭 추적용)
                          window.gtag('event', 'ota_click', {
                            ota: ota,
                            link_url: href,
                            page_path: window.location.pathname,
                            hotel_id: hidMatch ? hidMatch[1] : null,
                            city_id: cityMatch ? cityMatch[1] : null,
                            link_type: hidMatch ? 'hotel' : (cityMatch ? 'city_search' : 'search'),
                          });
                          // 레거시 이벤트 유지 (Agoda만 따로 보고 싶을 때)
                          if (ota === 'agoda') {
                            window.gtag('event', 'agoda_click', {
                              link_url: href,
                              page_path: window.location.pathname,
                              hotel_id: hidMatch ? hidMatch[1] : null,
                              city_id: cityMatch ? cityMatch[1] : null,
                              link_type: hidMatch ? 'hotel' : (cityMatch ? 'city_search' : 'other'),
                            });
                          }
                        }
                        return;
                      }
                    }
                  }
                  target = target.parentNode;
                }
              }, true);
            })();
          `}
        </Script>
        {/* 상단 띠 */}
        <div className="bg-orange-500 text-white text-center text-xs py-1.5 font-medium">
          지금 예약하면 최대 7% 추가 할인 — 아고다 실시간 특가 진행중
        </div>

        <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <a href="/" className="text-xl font-bold">
              <span className="text-orange-500">COOL</span><span className="text-gray-800">STAY</span>
            </a>
            <nav className="hidden sm:flex gap-5 text-sm text-gray-500">
              <a href="/japan" className="hover:text-orange-500 transition-colors">일본</a>
              <a href="/thailand" className="hover:text-orange-500 transition-colors">태국</a>
              <a href="/vietnam" className="hover:text-orange-500 transition-colors">베트남</a>
              <a href="/philippines" className="hover:text-orange-500 transition-colors">필리핀</a>
              <a href="/indonesia" className="hover:text-orange-500 transition-colors">인도네시아</a>
              <a href="/taiwan" className="hover:text-orange-500 transition-colors">대만</a>
            </nav>
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <a
                href="https://www.agoda.com/?cid=1962399"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-orange-500 text-white text-sm px-4 py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
              >
                아고다 특가
              </a>
            </div>
          </div>
        </header>

        <main>{children}</main>

        <footer className="bg-gray-900 text-gray-400 mt-20">
          <div className="max-w-6xl mx-auto px-4 py-12">
            {/* 국가 × 도시 그리드 — 전체 21개 도시 internal link */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 text-sm mb-8">
              {COUNTRIES.map((country) => (
                <div key={country.slug}>
                  <h4 className="text-white font-semibold mb-3">
                    <a href={`/${country.slug}`} className="hover:text-orange-400">
                      {country.name} 호텔
                    </a>
                  </h4>
                  <ul className="space-y-1.5 text-xs">
                    {country.cities.map((c) => (
                      <li key={c.nameEn}>
                        <a
                          href={`/${country.slug}/${c.nameEn}`}
                          className="hover:text-white"
                        >
                          {c.name} 호텔
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* 인기 테마 — 도시×테마 조합 */}
            <div className="border-t border-gray-800 pt-6 mb-6">
              <h4 className="text-white font-semibold mb-3 text-sm">인기 테마</h4>
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs">
                <a href="/japan/osaka/5-star" className="hover:text-white">오사카 5성급</a>
                <a href="/japan/tokyo/luxury" className="hover:text-white">도쿄 럭셔리</a>
                <a href="/japan/kyoto/onsen" className="hover:text-white">교토 온천</a>
                <a href="/japan/sapporo/onsen" className="hover:text-white">삿포로 온천</a>
                <a href="/japan/okinawa/resort" className="hover:text-white">오키나와 리조트</a>
                <a href="/thailand/bangkok/rooftop" className="hover:text-white">방콕 루프탑</a>
                <a href="/thailand/phuket/resort" className="hover:text-white">푸켓 리조트</a>
                <a href="/thailand/chiangmai/boutique" className="hover:text-white">치앙마이 부티크</a>
                <a href="/vietnam/danang/ocean-view" className="hover:text-white">다낭 오션뷰</a>
                <a href="/vietnam/hoian/boutique" className="hover:text-white">호이안 부티크</a>
                <a href="/vietnam/nhatrang/resort" className="hover:text-white">나트랑 리조트</a>
                <a href="/indonesia/bali/luxury" className="hover:text-white">발리 럭셔리</a>
                <a href="/philippines/boracay/resort" className="hover:text-white">보라카이 리조트</a>
                <a href="/philippines/cebu/resort" className="hover:text-white">세부 리조트</a>
                <a href="/japan/fukuoka/budget" className="hover:text-white">후쿠오카 가성비</a>
                <a href="/japan/osaka/family" className="hover:text-white">오사카 가족호텔</a>
              </div>
            </div>

            {/* 소개 + 저작권 */}
            <div className="border-t border-gray-800 pt-6 text-xs">
              <p className="leading-relaxed mb-4 max-w-2xl">
                <span className="text-white font-semibold">쿨스테이</span>는
                일본·동남아 해외 호텔을 아고다 실시간 최저가로 찾아드립니다.
                무료 취소·즉시 예약 확정으로 편하게 여행하세요.
              </p>
              <p className="text-center text-gray-500">
                © 2026 COOLSTAY. 본 사이트는 제휴 링크를 포함하고 있습니다.
              </p>
            </div>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
