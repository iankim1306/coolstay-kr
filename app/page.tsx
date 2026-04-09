import Link from "next/link";

const REGIONS = [
  { name: "강원", slug: "강원", img: "https://images.unsplash.com/photo-1580137189272-c9379f8864fd?w=400&h=300&fit=crop", desc: "속초 · 강릉 · 평창" },
  { name: "제주", slug: "제주", img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&h=300&fit=crop", desc: "제주시 · 서귀포" },
  { name: "경기", slug: "경기", img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop", desc: "가평 · 양평 · 포천" },
  { name: "부산", slug: "부산", img: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=400&h=300&fit=crop", desc: "해운대 · 광안리" },
  { name: "경남", slug: "경남", img: "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=400&h=300&fit=crop", desc: "통영 · 거제 · 남해" },
  { name: "전남", slug: "전남", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop", desc: "여수 · 순천 · 완도" },
  { name: "충남", slug: "충남", img: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=400&h=300&fit=crop", desc: "태안 · 보령 · 서산" },
  { name: "경북", slug: "경북", img: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400&h=300&fit=crop", desc: "경주 · 포항 · 안동" },
];

const POPULAR = [
  { kw: "강릉 커플 펜션", region: "강원" },
  { kw: "제주 풀빌라", region: "제주" },
  { kw: "가평 글램핑", region: "경기" },
  { kw: "속초 오션뷰 호텔", region: "강원" },
  { kw: "여수 바다뷰 펜션", region: "전남" },
  { kw: "거제 풀빌라", region: "경남" },
  { kw: "경주 한옥 숙소", region: "경북" },
  { kw: "해운대 호텔", region: "부산" },
];

export default function HomePage() {
  return (
    <div>
      {/* 히어로 */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-4 py-16 sm:py-24 text-center">
          <p className="text-orange-400 text-sm font-semibold tracking-wide mb-3">
            전국 3,000+ 숙소 가격 비교
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold mb-4 leading-tight">
            최저가 숙소, 1초만에 비교
          </h1>
          <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
            펜션 · 호텔 · 풀빌라 · 글램핑 — 같은 숙소, 가장 싼 가격을 찾아드립니다
          </p>
          <a
            href="https://www.booking.com/?lang=ko"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-orange-500 text-white text-lg px-8 py-4 rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/30"
          >
            실시간 초특가 보기
          </a>
          <div className="flex justify-center gap-8 mt-10 text-sm text-gray-400">
            <div className="flex items-center gap-1.5">
              <span className="text-green-400">&#10003;</span> 가격비교 무료
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-green-400">&#10003;</span> 예약 수수료 0원
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-green-400">&#10003;</span> 무료 취소 가능
            </div>
          </div>
        </div>
      </section>

      {/* 신뢰 지표 */}
      <section className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-6 flex justify-center gap-8 sm:gap-16 text-center text-sm">
          <div>
            <div className="text-2xl font-bold text-gray-900">3,000+</div>
            <div className="text-gray-400">등록 숙소</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">17개</div>
            <div className="text-gray-400">전국 지역</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">40%</div>
            <div className="text-gray-400">최대 할인</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">4.8</div>
            <div className="text-gray-400">평균 평점</div>
          </div>
        </div>
      </section>

      {/* 지역 카드 */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-2">지역별 숙소 찾기</h2>
        <p className="text-gray-400 mb-6">인기 여행지의 숙소를 비교해보세요</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {REGIONS.map((r) => (
            <Link
              key={r.slug}
              href={`/stay/${r.slug}`}
              className="group relative rounded-xl overflow-hidden aspect-[4/3]"
            >
              <img
                src={r.img}
                alt={r.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-4">
                <div className="text-white font-bold text-lg">{r.name}</div>
                <div className="text-white/70 text-xs">{r.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA 중간 배너 */}
      <section className="bg-orange-50 border-y border-orange-100">
        <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">지금 Booking.com 특가 확인하세요</h3>
            <p className="text-gray-500 text-sm mt-1">무료 취소 가능 · 예약 수수료 없음 · 최저가 보장</p>
          </div>
          <a
            href="https://www.booking.com/?lang=ko"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-orange-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-orange-600 transition-colors whitespace-nowrap"
          >
            특가 확인하기
          </a>
        </div>
      </section>

      {/* 인기 검색 */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-2">인기 검색 키워드</h2>
        <p className="text-gray-400 mb-6">다른 여행자들이 많이 찾는 숙소</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {POPULAR.map((p) => (
            <Link
              key={p.kw}
              href={`/stay/${p.region}`}
              className="bg-gray-50 rounded-xl px-4 py-4 hover:bg-orange-50 hover:border-orange-200 border border-gray-100 transition-colors"
            >
              <div className="font-medium text-sm text-gray-800">{p.kw}</div>
              <div className="text-xs text-orange-500 mt-1">숙소 보기 &rarr;</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
