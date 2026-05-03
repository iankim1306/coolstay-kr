import Link from "next/link";
import { notFound } from "next/navigation";
import { getCityData, getCountryData, COUNTRIES } from "@/lib/destinations";
import { getHotelsByCity, hotelSlug, hotelPhotoUrl } from "@/lib/hotels";
import { getAvailableThemes } from "@/lib/themes";
import { getAvailableFilters } from "@/lib/filter-pages";
import { breadcrumbJsonLd, touristDestinationJsonLd, ldJson } from "@/lib/jsonld";
import { NEARBY_CITIES } from "@/lib/nearby-cities";
import CityHotelList from "@/components/CityHotelList"
import CityDateSearch from "@/components/CityDateSearch";

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
    alternates: {
      canonical: `https://coolstay.kr/${countrySlug}/${citySlug}`,
      languages: {
        ko: `https://coolstay.kr/${countrySlug}/${citySlug}`,
        en: `https://coolstay.kr/en/${countrySlug}/${citySlug}`,
        'x-default': `https://coolstay.kr/${countrySlug}/${citySlug}`,
      },
    },
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
  const allHotels = getHotelsByCity(countrySlug, citySlug);
  const topHotels = allHotels.slice(0, 10);
  const availableThemes = getAvailableThemes(countrySlug, citySlug);
  const availableFilters = getAvailableFilters(countrySlug, citySlug);

  const cityUrl = `https://coolstay.kr/${countrySlug}/${citySlug}`;
  const breadcrumb = breadcrumbJsonLd([
    { name: "홈", url: "https://coolstay.kr/" },
    { name: country.name, url: `https://coolstay.kr/${countrySlug}` },
    { name: city.name, url: cityUrl },
  ]);

  const touristLd = touristDestinationJsonLd({
    cityName: city.name,
    countryName: country.name,
    url: cityUrl,
    description: `${city.name}는 ${city.desc}로 유명한 ${country.name} 인기 여행지입니다. 아고다 최저가 호텔을 한눈에 비교하세요.`,
    image: city.img,
    hotels: allHotels,
  });

  return (
    <div>
      <script {...ldJson(breadcrumb)} />
      <script {...ldJson(touristLd)} />
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

            {/* 테마별 호텔 리스트 (SEO 랜딩) */}
            {availableThemes.length > 0 && (
              <div className="mb-10">
                <h2 className="text-xl font-bold mb-4">{city.name} 테마별 호텔 TOP 10</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {availableThemes.map(t => (
                    <Link
                      key={t.slug}
                      href={`/${countrySlug}/${citySlug}/${t.slug}`}
                      className="group flex items-center gap-3 bg-white border border-gray-100 rounded-xl p-4 hover:border-orange-200 hover:shadow transition-all"
                    >
                      <span className="text-2xl">{t.emoji}</span>
                      <div className="min-w-0">
                        <div className="font-semibold text-sm text-gray-800 line-clamp-1">
                          {city.name} {t.label}
                        </div>
                        <div className="text-xs text-orange-500 group-hover:translate-x-1 transition-transform">
                          TOP 10 보기 →
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* 인기 호텔 TOP 10 — 실시간 가격 포함 */}
            {topHotels.length > 0 && (
              <CityHotelList
                hotels={topHotels.map(h => ({
                  hotel_id: h.hotel_id,
                  name: h.name,
                  address: h.address,
                  star_rating: h.star_rating,
                  rating_average: h.rating_average,
                  number_of_reviews: h.number_of_reviews,
                  photo: h.photos[0] ? hotelPhotoUrl(h.photos[0], 600) : '',
                  href: `/${countrySlug}/${citySlug}/hotel/${hotelSlug(h)}`,
                }))}
                cityName={city.name}
              />
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

            {/* 여행 정보 — SEO 핵심 콘텐츠 */}
            {city.travelInfo && (
              <div className="mb-10">
                <h2 className="text-xl font-bold mb-5">{city.name} 여행 정보</h2>
                <div className="space-y-4">
                  {/* 공항 접근성 */}
                  <div className="bg-gray-50 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">✈️</span>
                      <h3 className="font-bold text-gray-800">공항 → 시내 이동</h3>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{city.travelInfo.airport}</p>
                  </div>

                  {/* 추천 시즌 */}
                  <div className="bg-gray-50 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">🌤️</span>
                      <h3 className="font-bold text-gray-800">추천 여행 시즌</h3>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{city.travelInfo.bestSeason}</p>
                  </div>

                  {/* 호텔 추천 지역 */}
                  <div className="bg-gray-50 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xl">🏨</span>
                      <h3 className="font-bold text-gray-800">지역별 호텔 특징</h3>
                    </div>
                    <div className="space-y-3">
                      {city.travelInfo.areas.map(area => (
                        <div key={area.name} className="flex gap-3">
                          <span className="text-orange-500 font-bold text-sm whitespace-nowrap mt-0.5">{area.name}</span>
                          <p className="text-sm text-gray-600">{area.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 평균 가격 */}
                  <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">💰</span>
                      <h3 className="font-bold text-gray-800">평균 호텔 가격</h3>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{city.travelInfo.avgPrice}</p>
                  </div>

                  {/* 한국인 여행 팁 */}
                  <div className="bg-gray-50 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xl">💡</span>
                      <h3 className="font-bold text-gray-800">한국인 여행자 꿀팁</h3>
                    </div>
                    <ul className="space-y-2">
                      {city.travelInfo.tips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="text-orange-400 font-bold mt-0.5 flex-shrink-0">·</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
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

            {/* 가격대 / 평점 필터 페이지 (롱테일) */}
            {availableFilters.length > 0 && (
              <div className="mb-10">
                <h2 className="text-xl font-bold mb-4">{city.name} 호텔, 조건별로 보기</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {availableFilters.map(f => (
                    <Link key={f.slug} href={`/${countrySlug}/${citySlug}/filter/${f.slug}`}
                      className="group flex items-center justify-between bg-white border border-gray-100 rounded-xl px-4 py-3 hover:border-orange-200 hover:shadow transition-all">
                      <div className="font-semibold text-sm text-gray-800">{city.name} {f.label}</div>
                      <span className="text-xs text-orange-500 group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* 근처 도시 — Internal linking */}
            {NEARBY_CITIES[citySlug] && NEARBY_CITIES[citySlug].length > 0 && (
              <div className="mb-10">
                <h2 className="text-xl font-bold mb-4">{city.name}과 함께 가면 좋은 도시</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {NEARBY_CITIES[citySlug].map(nc => {
                    const ncCountry = COUNTRIES.find(co => co.slug === nc.country);
                    const ncCity = ncCountry?.cities.find(c => c.nameEn === nc.city);
                    if (!ncCity) return null;
                    return (
                      <Link key={nc.city} href={`/${nc.country}/${nc.city}`}
                        className="group bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg hover:border-orange-200 transition-all">
                        <div className="relative h-32 overflow-hidden">
                          <img src={ncCity.img} alt={ncCity.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          <div className="absolute bottom-2 left-3">
                            <div className="text-white font-bold text-base">{ncCity.name}</div>
                            <div className="text-white/80 text-xs">{nc.distance}</div>
                          </div>
                        </div>
                        <div className="p-3 text-xs text-orange-500 font-medium">{ncCity.name} 호텔 보기 →</div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

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
              {/* 날짜 선택 딥링크 */}
              <CityDateSearch cityId={city.agodaCityId} cityName={city.name} />

              {/* 바로 가기 카드 */}
              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                <a
                  href={city.agodaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-orange-50 text-orange-600 text-center py-3 rounded-xl font-semibold text-sm hover:bg-orange-100 transition-colors mb-3"
                >
                  날짜 없이 전체 보기 →
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
