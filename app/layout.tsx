import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { organizationJsonLd, websiteJsonLd, ldJson } from "@/lib/jsonld";

const GA_ID = "G-CVRE4H4QDX";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://coolstay.kr"),
  title: "쿨스테이 - 해외 호텔 최저가 비교 | 아고다 특가",
  description: "일본, 태국, 베트남, 발리, 필리핀, 대만 호텔을 아고다 최저가로 비교하세요. 무료 취소, 즉시 예약 확정.",
  openGraph: {
    siteName: "쿨스테이",
    locale: "ko_KR",
    type: "website",
    url: "https://coolstay.kr",
  },
  twitter: {
    card: "summary_large_image",
    site: "@coolstay_kr",
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

        <script {...ldJson(organizationJsonLd())} />
        <script {...ldJson(websiteJsonLd())} />

        <script dangerouslySetInnerHTML={{__html: `(function(){var script=document.createElement("script");script.async=1;script.src='https://emrldtp.com/NTE2NzQ4.js?t=516748';document.head.appendChild(script);})();`}} />
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
        <Script id="agoda-click-tracker" strategy="afterInteractive">
          {`
            document.addEventListener('click', function(e) {
              var target = e.target;
              while (target && target !== document) {
                if (target.tagName === 'A' && target.href && target.href.indexOf('agoda.com') !== -1) {
                  if (window.gtag) {
                    var hidMatch = target.href.match(/hid=(\\d+)/);
                    var cityMatch = target.href.match(/city=(\\d+)/);
                    window.gtag('event', 'agoda_click', {
                      link_url: target.href,
                      page_path: window.location.pathname,
                      hotel_id: hidMatch ? hidMatch[1] : null,
                      city_id: cityMatch ? cityMatch[1] : null,
                      link_type: hidMatch ? 'hotel' : (cityMatch ? 'city_search' : 'other'),
                    });
                  }
                  return;
                }
                target = target.parentNode;
              }
            }, true);
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
            <a
              href="https://www.agoda.com/?cid=1962399"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-orange-500 text-white text-sm px-4 py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
            >
              아고다 특가
            </a>
          </div>
        </header>

        <main>{children}</main>

        <footer className="bg-gray-900 text-gray-400 mt-20">
          <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-sm">
              <div>
                <h4 className="text-white font-semibold mb-3">인기 여행지</h4>
                <ul className="space-y-2">
                  <li><a href="/japan" className="hover:text-white">일본 호텔</a></li>
                  <li><a href="/thailand" className="hover:text-white">태국 호텔</a></li>
                  <li><a href="/vietnam" className="hover:text-white">베트남 호텔</a></li>
                  <li><a href="/indonesia" className="hover:text-white">인도네시아 호텔</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-3">인기 도시</h4>
                <ul className="space-y-2">
                  <li><a href="/japan/osaka" className="hover:text-white">오사카 호텔</a></li>
                  <li><a href="/thailand/bangkok" className="hover:text-white">방콕 호텔</a></li>
                  <li><a href="/vietnam/danang" className="hover:text-white">다낭 호텔</a></li>
                  <li><a href="/indonesia/bali" className="hover:text-white">발리 호텔</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-3">테마별</h4>
                <ul className="space-y-2">
                  <li><a href="/japan/kyoto" className="hover:text-white">커플 여행</a></li>
                  <li><a href="/indonesia/bali" className="hover:text-white">신혼여행 풀빌라</a></li>
                  <li><a href="/japan/osaka" className="hover:text-white">가성비 호텔</a></li>
                  <li><a href="/thailand/phuket" className="hover:text-white">비치 리조트</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-3">쿨스테이</h4>
                <p className="text-xs leading-relaxed">
                  일본·동남아 해외 호텔을 아고다 최저가로 비교하세요.
                  무료 취소·즉시 예약 확정으로 편하게 여행하세요.
                </p>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-6 text-xs text-center">
              © 2026 COOLSTAY. 본 사이트는 제휴 링크를 포함하고 있습니다.
            </div>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
