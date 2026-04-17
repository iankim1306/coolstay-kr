import Link from "next/link";
import { COUNTRIES } from "@/lib/destinations";

const POPULAR_KEYWORDS = [
  { kw: "오사카 가성비 호텔", href: "/japan/osaka" },
  { kw: "방콕 루프탑 호텔", href: "/thailand/bangkok" },
  { kw: "다낭 리조트 추천", href: "/vietnam/danang" },
  { kw: "발리 풀빌라 신혼", href: "/indonesia/bali" },
  { kw: "도쿄 신주쿠 호텔", href: "/japan/tokyo" },
  { kw: "푸켓 비치 리조트", href: "/thailand/phuket" },
  { kw: "세부 스노클링 리조트", href: "/philippines/cebu" },
  { kw: "교토 료칸 커플", href: "/japan/kyoto" },
  { kw: "타이베이 가성비 숙소", href: "/taiwan/taipei" },
  { kw: "보라카이 풀빌라", href: "/philippines/boracay" },
  { kw: "치앙마이 부티크 호텔", href: "/thailand/chiangmai" },
  { kw: "후쿠오카 단기 여행", href: "/japan/fukuoka" },
];

export default function HomePage() {
  const allCities = COUNTRIES.flatMap(c => c.cities).slice(0, 8);

  return (
    <div>
      {/* 히어로 */}
      <section className="relative bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20"
          style={{backgroundImage: 'url(https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1600&h=900&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center'}}
        />
        <div className="relative max-w-6xl mx-auto px-4 py-20 sm:py-32 text-center">
          <p className="text-orange-400 text-sm font-semibold tracking-widest mb-4 uppercase">
            일본 · 동남아 · 전세계 호텔 비교
          </p>
          <h1 className="text-4xl sm:text-6xl font-bold mb-5 leading-tight">
            해외 호텔 최저가,<br />
            <span className="text-orange-400">1초만에 비교</span>
          </h1>
          <p className="text-gray-300 text-lg mb-10 max-w-xl mx-auto">
            아고다 최저가로 오사카, 방콕, 발리, 다낭 숙소를 비교하세요
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://www.agoda.com/?cid=1962399"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-orange-500 text-white text-lg px-8 py-4 rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-xl shadow-orange-500/30"
            >
              아고다 최저가 확인
            </a>
            <a href="#destinations"
              className="bg-white/10 text-white text-lg px-8 py-4 rounded-xl font-bold hover:bg-white/20 transition-colors border border-white/20"
            >
              여행지 둘러보기
            </a>
          </div>
          <div className="flex justify-center gap-8 mt-10 text-sm text-gray-400">
            <span className="flex items-center gap-1.5"><span className="text-green-400">✓</span> 최저가 보장</span>
            <span className="flex items-center gap-1.5"><span className="text-green-400">✓</span> 무료 취소</span>
            <span className="flex items-center gap-1.5"><span className="text-green-400">✓</span> 290만개 숙소</span>
          </div>
        </div>
      </section>

      {/* 신뢰 지표 */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-6 flex justify-center gap-10 sm:gap-20 text-center text-sm">
          {[
            { num: "290만+", label: "전세계 숙소" },
            { num: "6개국+", label: "아시아 여행지" },
            { num: "7%", label: "아고다 최대 할인" },
            { num: "4.8★", label: "평균 평점" },
          ].map(item => (
            <div key={item.label}>
              <div className="text-2xl font-bold text-gray-900">{item.num}</div>
              <div className="text-gray-400">{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 국가별 */}
      <section id="destinations" className="max-w-6xl mx-auto px-4 py-14">
        <h2 className="text-2xl font-bold mb-2">나라별 호텔 찾기</h2>
        <p className="text-gray-400 mb-7">인기 여행지 최저가 숙소 비교</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
          {COUNTRIES.map(country => (
            <Link key={country.slug} href={`/${country.slug}`}
              className="group relative rounded-2xl overflow-hidden aspect-video shadow-sm"
            >
              <img src={country.img} alt={country.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-4">
                <div className="text-white font-bold text-xl">{country.name}</div>
                <div className="text-white/70 text-xs mt-0.5">{country.desc}</div>
              </div>
              <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                보기
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 인기 도시 */}
      <section className="bg-gray-50 py-14">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-2">인기 도시 호텔</h2>
          <p className="text-gray-400 mb-7">한국인이 가장 많이 찾는 해외 도시</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {allCities.map(city => (
              <Link key={city.nameEn} href={`/${city.countryEn}/${city.nameEn}`}
                className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg hover:border-orange-200 transition-all group"
              >
                <div className="relative h-32 overflow-hidden">
                  <img src={city.img} alt={city.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-2 left-3 text-white font-bold text-sm">{city.name}</div>
                </div>
                <div className="p-3">
                  <p className="text-xs text-gray-400 line-clamp-1">{city.desc}</p>
                  <div className="flex gap-1 flex-wrap mt-2">
                    {city.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="text-xs bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded">#{tag}</span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA 배너 */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 py-14">
        <div className="max-w-6xl mx-auto px-4 text-center text-white">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">아고다 특가 지금 확인하세요</h2>
          <p className="text-white/80 mb-6">최대 7% 추가 할인 · 무료 취소 · 즉시 예약 확정</p>
          <a
            href="https://www.agoda.com/?cid=1962399"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-orange-600 font-bold text-lg px-10 py-4 rounded-xl hover:bg-gray-100 transition-colors shadow-lg"
          >
            아고다 특가 보러가기
          </a>
        </div>
      </section>

      {/* 인기 검색 키워드 */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        <h2 className="text-2xl font-bold mb-2">인기 검색 키워드</h2>
        <p className="text-gray-400 mb-6">여행자들이 많이 찾는 숙소</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {POPULAR_KEYWORDS.map(p => (
            <Link key={p.kw} href={p.href}
              className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-4 hover:bg-orange-50 hover:border-orange-200 transition-colors"
            >
              <div className="font-medium text-sm text-gray-800">{p.kw}</div>
              <div className="text-xs text-orange-500 mt-1">호텔 보기 →</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
