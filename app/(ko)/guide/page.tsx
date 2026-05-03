import Link from "next/link";
import { GUIDES } from "@/lib/guides";
import { getCityData } from "@/lib/destinations";

export const metadata = {
  title: "여행 가이드 — 도시별 호텔·일정 완벽 가이드 | 쿨스테이",
  description: "오사카·방콕·발리 등 인기 도시 호텔 추천과 여행 가이드. 지역별·예산별·시즌별 깊이있는 정보를 한곳에서.",
};

export default function GuideIndexPage() {
  return (
    <div className="bg-white">
      <section className="bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-4 py-16 sm:py-20">
          <p className="text-orange-400 text-sm font-semibold tracking-widest mb-3 uppercase">여행 가이드</p>
          <h1 className="text-3xl sm:text-5xl font-bold mb-4">도시별 호텔 추천 가이드</h1>
          <p className="text-gray-300 text-lg max-w-2xl">
            인기 도시별 호텔 선택 기준, 지역별 특징, 시즌별 가격 변동까지 완벽 정리.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {GUIDES.map(g => {
            const city = getCityData(g.countryKey, g.cityKey);
            return (
              <Link key={g.slug} href={`/guide/${g.slug}`}
                className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:border-orange-200 transition-all">
                <div className="relative h-48 overflow-hidden">
                  {city && (
                    <img src={city.img} alt={g.h1}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  <div className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">완벽 가이드</div>
                </div>
                <div className="p-5">
                  <h2 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-500 transition-colors">{g.h1}</h2>
                  <p className="text-sm text-gray-500 line-clamp-2">{g.metaDescription}</p>
                  <div className="mt-3 text-xs text-orange-500 font-semibold group-hover:translate-x-1 transition-transform inline-block">
                    가이드 읽기 →
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
