import Link from "next/link";
import { notFound } from "next/navigation";
import { getCityData, getCountryData, COUNTRIES } from "@/lib/destinations";
import { getHotelsByCity, hotelSlug, agodaHotelLink } from "@/lib/hotels";

export async function generateStaticParams() {
  return COUNTRIES.flatMap(country =>
    country.cities.map(city => ({
      country: country.slug,
      city: city.nameEn,
    }))
  );
}

export async function generateMetadata({ params }: { params: Promise<{ country: string; city: string }> }) {
  const { country: countrySlug, city: citySlug } = await params;
  const city = getCityData(countrySlug, citySlug);
  if (!city) return {};
  return {
    title: `${city.name} 호텔 최저가 | 아고다 특가 추천`,
    description: `${city.name} 호텔을 아고다 최저가로 비교하세요. ${city.desc}. ${city.tags.join(', ')} 여행자에게 인기. 무료 취소 가능.`,
  };
}

const THEMES = [
  { label: '커플 추천', tag: '커플', emoji: '💑' },
  { label: '신혼여행', tag: '신혼', emoji: '💍' },
  { label: '가족 여행', tag: '가족', emoji: '👨‍👩‍👧' },
  { label: '혼자 여행', tag: '혼자', emoji: '🎒' },
  { label: '풀빌라', tag: '풀빌라', emoji: '🏊' },
  { label: '가성비 숙소', tag: '가성비', emoji: '💰' },
];

export default async function CityPage({ params }: { params: Promise<{ country: string; city: string }> }) {
  const { country: countrySlug, city: citySlug } = await params;
  const city = getCityData(countrySlug, citySlug);
  const country = getCountryData(countrySlug);
  if (!city || !country) notFound();

  const matchedThemes = THEMES.filter(t => city.tags.includes(t.tag));
  const topHotels = getHotelsByCity(countrySlug, citySlug).slice(0, 10);

  return (
    <div>
      {/* 헤더 */}
      <section className="relative bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-30"
          style={{ backgroundImage: `url(${city.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        <div className="relative max-w-6xl mx-auto px-4 py-16 sm:py-24">
          <nav className="text-sm text-gray-400 mb-4">
            <Link href="/" className="hover:text-white">홈</Link>
            <span className="mx-2">&gt;</span>
            <Link href={`/${countrySlug}`} className="hover:text-white">{country.name}</Link>
            <span className="mx-2">&gt;</span>
            <span className="text-white">{city.name}</span>
          </nav>
          <h1 className="text-3xl sm:text-5xl font-bold mb-3">
            {city.name} 호텔 최저가
          </h1>
          <p className="text-gray-300 text-lg mb-4">{city.desc}</p>
          <div className="flex gap-2 flex-wrap mb-8">
            {city.tags.map(tag => (
              <span key={tag} className="bg-white/10 text-white text-sm px-3 py-1 rounded-full border border-white/20">
                #{tag}
              </span>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={city.agodaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-orange-500 text-white text-lg px-8 py-4 rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-xl shadow-orange-500/30"
            >
              아고다 최저가 확인
            </a>
            <a
              href={`https://www.agoda.com/search?city=${city.agodaCityId}&cid=1962399`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-white/10 text-white text-lg px-8 py-4 rounded-xl font-bold hover:bg-white/20 transition-colors border border-white/20"
            >
              날짜 선택 후 예약
            </a>
          </div>
        </div>
      </section>

      {/* 신뢰 지표 */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-5 flex justify-center gap-8 sm:gap-16 text-center text-sm">
          {[
            { num: "최대 7%", label: "추가 할인" },
            { num: "무료", label: "취소 가능" },
            { num: "즉시", label: "예약 확정" },
            { num: "4.8★", label: "평균 평점" },
          ].map(item => (
            <div key={item.label}>
              <div className="text-xl font-bold text-orange-500">{item.num}</div>
              <div className="text-gray-400">{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* 메인 콘텐츠 */}
          <div className="flex-1">
            {/* 대표 이미지 */}
            <img src={city.img} alt={`${city.name} 호텔`}
              className="w-full rounded-2xl mb-8 h-72 object-cover"
            />

            {/* 인기 호텔 TOP 10 */}
            {topHotels.length > 0 && (
              <div className="mb-10">
                <div className="flex items-end justify-between mb-4">
                  <h2 className="text-xl font-bold">{city.name} 인기 호텔 TOP {topHotels.length}</h2>
                  <span className="text-xs text-gray-400">실제 리뷰 기준</span>
                </div>
                <div className="space-y-4">
                  {topHotels.map((hotel, i) => {
                    const rating = parseFloat(hotel.rating_average) || 0;
                    const reviews = parseInt(hotel.number_of_reviews) || 0;
                    const stars = parseInt(hotel.star_rating) || 0;
                    return (
                      <Link
                        key={hotel.hotel_id}
                        href={`/${countrySlug}/${citySlug}/hotel/${hotelSlug(hotel)}`}
                        className="group flex gap-4 bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg hover:border-orange-200 transition-all"
                      >
                        <div className="relative w-32 sm:w-48 h-32 sm:h-40 flex-shrink-0 overflow-hidden">
                          {hotel.photos[0] && (
                            <img
                              src={hotel.photos[0]}
                              alt={hotel.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          )}
                          <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold w-7 h-7 rounded-full flex items-center justify-center shadow">
                            {i + 1}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0 py-3 pr-3 flex flex-col justify-between">
                          <div>
                            {stars > 0 && (
                              <div className="text-orange-400 text-xs mb-1">
                                {"★".repeat(stars)}
                                <span className="text-gray-200">{"★".repeat(5 - stars)}</span>
                              </div>
                            )}
                            <h3 className="font-bold text-gray-800 line-clamp-2 group-hover:text-orange-500 transition-colors text-sm sm:text-base mb-1">
                              {hotel.name}
                            </h3>
                            <p className="text-xs text-gray-400 line-clamp-1">
                              📍 {hotel.address}
                            </p>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            {rating > 0 && (
                              <div className="flex items-center gap-2">
                                <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
                                  {rating.toFixed(1)}
                                </span>
                                <span className="text-xs text-gray-500">
                                  리뷰 {reviews.toLocaleString()}
                                </span>
                              </div>
                            )}
                            <span className="text-orange-500 text-xs font-semibold group-hover:translate-x-1 transition-transform">
                              자세히 보기 →
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 여행 테마 */}
            {matchedThemes.length > 0 && (
              <div className="mb-10">
                <h2 className="text-xl font-bold mb-4">{city.name} 추천 여행 테마</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {matchedThemes.map(theme => (
                    <a
                      key={theme.tag}
                      href={city.agodaLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl p-4 hover:bg-orange-50 hover:border-orange-200 transition-colors"
                    >
                      <span className="text-2xl">{theme.emoji}</span>
                      <div>
                        <div className="font-semibold text-sm text-gray-800">{theme.label}</div>
                        <div className="text-xs text-orange-500">호텔 보기 →</div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* 도시 소개 */}
            <div className="mb-10">
              <h2 className="text-xl font-bold mb-4">{city.name} 숙소 추천 가이드</h2>
              <div className="bg-gray-50 rounded-2xl p-6 text-sm text-gray-600 leading-relaxed space-y-3">
                <p>
                  <strong className="text-gray-800">{city.name}</strong>은(는) {city.desc}로 유명한 인기 여행지입니다.
                  아고다에서 {city.name} 호텔을 검색하면 다양한 가격대의 숙소를 한눈에 비교할 수 있습니다.
                </p>
                <p>
                  {city.tags.includes('커플') && `커플 여행자에게 인기 있는 ${city.name}은 로맨틱한 분위기의 숙소가 많습니다. `}
                  {city.tags.includes('신혼') && `신혼여행지로도 유명한 ${city.name}에서는 프리미엄 풀빌라와 리조트를 합리적인 가격에 예약할 수 있습니다. `}
                  {city.tags.includes('가성비') && `가성비를 중시하는 여행자라면 ${city.name}의 다양한 경제형 호텔을 추천합니다. `}
                  {city.tags.includes('풀빌라') && `${city.name}의 풀빌라는 프라이빗한 풀장과 함께 최고의 휴양을 즐길 수 있어 인기입니다. `}
                </p>
                <p>
                  아고다는 {city.name} 지역 내 수천 개의 숙소를 보유하고 있으며,
                  실시간 최저가 비교와 즉시 예약 확정 서비스를 제공합니다.
                  무료 취소 가능한 상품도 많아 유연한 여행 계획이 가능합니다.
                </p>
              </div>
            </div>

            {/* 예약 팁 */}
            <div className="mb-10">
              <h2 className="text-xl font-bold mb-4">아고다 예약 꿀팁</h2>
              <div className="space-y-3">
                {[
                  { icon: '🗓️', tip: '2~3개월 전 예약 시 얼리버드 할인 최대 적용' },
                  { icon: '💳', tip: '아고다캐시 적립으로 다음 여행에도 할인 가능' },
                  { icon: '🔍', tip: '무료 취소 필터로 취소 걱정 없이 예약' },
                  { icon: '📱', tip: '아고다 앱 전용 특가로 추가 할인 가능' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
                    <span className="text-xl">{item.icon}</span>
                    <p className="text-sm text-gray-600">{item.tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 사이드바 */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="sticky top-20 space-y-4">
              {/* 예약 카드 */}
              <div className="bg-white border-2 border-orange-200 rounded-2xl p-6 shadow-lg">
                <div className="text-center mb-5">
                  <p className="text-sm font-bold text-gray-800 mb-1">{city.name} 아고다 최저가</p>
                  <p className="text-xs text-gray-400">실시간 가격 비교</p>
                </div>
                <a
                  href={city.agodaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-orange-500 text-white text-center py-4 rounded-xl font-bold text-lg hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/30 mb-3"
                >
                  최저가 확인하기
                </a>
                <ul className="space-y-2 text-xs text-gray-500">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500 font-bold">✓</span> 최대 7% 추가 할인
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500 font-bold">✓</span> 무료 취소 가능
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500 font-bold">✓</span> 즉시 예약 확정
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500 font-bold">✓</span> 예약 수수료 없음
                  </li>
                </ul>
              </div>

              {/* 같은 나라 다른 도시 */}
              {country.cities.filter(c => c.nameEn !== citySlug).length > 0 && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-sm text-gray-700 mb-3">{country.name} 다른 도시</h3>
                  <div className="space-y-2">
                    {country.cities.filter(c => c.nameEn !== citySlug).map(c => (
                      <Link key={c.nameEn} href={`/${countrySlug}/${c.nameEn}`}
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-orange-500 transition-colors"
                      >
                        <span>→</span> {c.name} 호텔
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* 국가 페이지 링크 */}
              <Link href={`/${countrySlug}`}
                className="block text-center bg-gray-100 rounded-xl py-3 text-sm text-gray-600 hover:bg-gray-200 transition-colors"
              >
                {country.name} 전체 도시 보기 →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 CTA */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 py-14">
        <div className="max-w-6xl mx-auto px-4 text-center text-white">
          <h2 className="text-2xl font-bold mb-2">{city.name} 호텔, 아고다가 가장 저렴합니다</h2>
          <p className="text-white/80 mb-6">지금 예약하면 최대 7% 추가 할인</p>
          <a
            href={city.agodaLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-orange-600 font-bold text-lg px-10 py-4 rounded-xl hover:bg-gray-100 transition-colors"
          >
            아고다 {city.name} 호텔 보기
          </a>
        </div>
      </section>
    </div>
  );
}
