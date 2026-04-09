import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "쿨스테이 - 국내 숙박 최저가 비교",
  description: "전국 펜션, 호텔, 풀빌라, 글램핑 숙소를 한눈에 비교하세요. 최저가 보장.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={geist.variable}>
      <head>
        <script dangerouslySetInnerHTML={{__html: `(function(){var script=document.createElement("script");script.async=1;script.src='https://emrldtp.com/NTE2NzQ4.js?t=516748';document.head.appendChild(script);})();`}} />
      </head>
      <body className="min-h-screen bg-white text-gray-900">
        {/* 상단 띠 */}
        <div className="bg-orange-500 text-white text-center text-xs py-1.5 font-medium">
          지금 예약하면 최대 40% 할인 — Booking.com 특가 진행중
        </div>

        <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <a href="/" className="text-xl font-bold">
              <span className="text-orange-500">COOL</span><span className="text-gray-800">STAY</span>
            </a>
            <nav className="hidden sm:flex gap-5 text-sm text-gray-500">
              <a href="/stay/강원" className="hover:text-orange-500 transition-colors">강원</a>
              <a href="/stay/제주" className="hover:text-orange-500 transition-colors">제주</a>
              <a href="/stay/경기" className="hover:text-orange-500 transition-colors">경기</a>
              <a href="/stay/부산" className="hover:text-orange-500 transition-colors">부산</a>
              <a href="/stay/경남" className="hover:text-orange-500 transition-colors">경남</a>
              <a href="/stay/전남" className="hover:text-orange-500 transition-colors">전남</a>
            </nav>
            <a
              href="https://www.booking.com/?lang=ko"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-orange-500 text-white text-sm px-4 py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
            >
              최저가 확인
            </a>
          </div>
        </header>

        <main>{children}</main>

        <footer className="bg-gray-900 text-gray-400 mt-20">
          <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-sm">
              <div>
                <h4 className="text-white font-semibold mb-3">인기 지역</h4>
                <ul className="space-y-2">
                  <li><a href="/stay/강원" className="hover:text-white">강원 숙소</a></li>
                  <li><a href="/stay/제주" className="hover:text-white">제주 숙소</a></li>
                  <li><a href="/stay/부산" className="hover:text-white">부산 숙소</a></li>
                  <li><a href="/stay/경기" className="hover:text-white">경기 숙소</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-3">숙소 유형</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-white">펜션</a></li>
                  <li><a href="#" className="hover:text-white">호텔</a></li>
                  <li><a href="#" className="hover:text-white">풀빌라</a></li>
                  <li><a href="#" className="hover:text-white">글램핑</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-3">상황별</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-white">커플 여행</a></li>
                  <li><a href="#" className="hover:text-white">가족 여행</a></li>
                  <li><a href="#" className="hover:text-white">반려동물 동반</a></li>
                  <li><a href="#" className="hover:text-white">오션뷰</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-3">쿨스테이</h4>
                <p className="text-xs leading-relaxed">
                  전국 숙박시설 가격을 비교하고 최저가로 예약하세요.
                  한국관광공사 데이터 기반 신뢰할 수 있는 정보를 제공합니다.
                </p>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-6 text-xs text-center">
              © 2026 COOLSTAY. 본 사이트는 제휴 링크를 포함하고 있습니다.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
