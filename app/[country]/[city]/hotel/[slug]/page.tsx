import Link from "next/link";
import { notFound } from "next/navigation";
import { getCityData, getCountryData } from "@/lib/destinations";
import {
  getHotel,
  getHotelsByCity,
  getAllHotels,
  hotelSlug,
  agodaHotelLink,
  hotelPhotoUrl,
} from "@/lib/hotels";
import {
  breadcrumbJsonLd,
  hotelJsonLd,
  faqJsonLd,
  ldJson,
} from "@/lib/jsonld";

export async function generateStaticParams() {
  return getAllHotels().map(({ countrySlug, citySlug, hotel }) => ({
    country: countrySlug,
    city: citySlug,
    slug: hotelSlug(hotel),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string; city: string; slug: string }>;
}) {
  const { country, city, slug } = await params;
  const hotel = getHotel(country, city, slug);
  if (!hotel) return {};
  const cityData = getCityData(country, city);
  const cityName = cityData?.name ?? hotel.city;
  return {
    title: `${hotel.name} 최저가 | ${cityName} 호텔 예약 - 쿨스테이`,
    description: `${hotel.name} (${hotel.star_rating}성급) 실시간 최저가와 무료 취소 가능 옵션을 확인하세요. ${cityName} ${hotel.address}. 평점 ${hotel.rating_average}, 리뷰 ${hotel.number_of_reviews}개.`,
  };
}

export default async function HotelPage({
  params,
}: {
  params: Promise<{ country: string; city: string; slug: string }>;
}) {
  const { country, city, slug } = await params;
  const hotel = getHotel(country, city, slug);
  const countryData = getCountryData(country);
  const cityData = getCityData(country, city);
  if (!hotel || !countryData || !cityData) notFound();

  const bookingUrl = agodaHotelLink(hotel.hotel_id);
  const rating = parseFloat(hotel.rating_average) || 0;
  const reviews = parseInt(hotel.number_of_reviews) || 0;
  const stars = parseInt(hotel.star_rating) || 0;

  // 같은 도시 다른 호텔 4개 추천
  const siblings = getHotelsByCity(country, city)
    .filter((h) => h.hotel_id !== hotel.hotel_id)
    .slice(0, 4);

  // 구조화 데이터
  const breadcrumb = breadcrumbJsonLd([
    { name: "홈", url: "https://coolstay.kr/" },
    { name: countryData.name, url: `https://coolstay.kr/${country}` },
    { name: cityData.name, url: `https://coolstay.kr/${country}/${city}` },
    { name: hotel.name, url: `https://coolstay.kr/${country}/${city}/hotel/${hotelSlug(hotel)}` },
  ]);
  const hotelLd = hotelJsonLd(hotel, country, city, cityData.name, countryData.name);
  const faq = faqJsonLd([
    {
      q: `${hotel.name} 최저가는 어디서 확인하나요?`,
      a: `아고다에서 ${hotel.name}의 실시간 최저가와 무료 취소 가능 요금을 비교해 볼 수 있습니다. 쿨스테이 예약 링크를 통해 이동하시면 최대 7% 추가 할인이 적용됩니다.`,
    },
    {
      q: `${hotel.name} 체크인·체크아웃 시간은 어떻게 되나요?`,
      a: `${hotel.name}의 체크인 시간은 ${hotel.checkin || "15:00 이후"}, 체크아웃 시간은 ${hotel.checkout || "11:00 이전"}입니다. 일정에 따라 얼리 체크인·레이트 체크아웃 가능 여부는 호텔에 직접 문의해 주세요.`,
    },
    {
      q: `${hotel.name} 위치는 어디인가요?`,
      a: `${hotel.name}은 ${hotel.address}${hotel.zipcode ? `, ${hotel.zipcode}` : ""} (${cityData.name})에 위치한 ${stars ? `${stars}성급 ` : ""}${hotel.accommodation_type}입니다.`,
    },
    {
      q: `무료 취소가 가능한가요?`,
      a: `예약 시점과 요금제에 따라 다르지만 아고다에서 '무료 취소 가능' 필터를 적용하면 특정 기간까지 무료로 취소할 수 있는 요금을 선택할 수 있습니다.`,
    },
  ]);

  return (
    <div className="bg-white">
      <script {...ldJson(breadcrumb)} />
      <script {...ldJson(hotelLd)} />
      <script {...ldJson(faq)} />
      {/* 히어로: 대표 사진 */}
      <section className="relative">
        {/* 모바일: 가로 스와이프 갤러리 */}
        <div className="sm:hidden relative">
          <div
            className="flex overflow-x-auto snap-x snap-mandatory h-72 scrollbar-hide"
            style={{ scrollbarWidth: "none" }}
          >
            {hotel.photos.slice(0, 10).map((photo, i) => (
              <div
                key={i}
                className="relative flex-shrink-0 w-full h-full snap-center"
              >
                <img
                  src={hotelPhotoUrl(photo, 1024)}
                  alt={`${hotel.name} ${i + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full font-medium">
                  {i + 1} / {Math.min(hotel.photos.length, 10)}
                </div>
              </div>
            ))}
          </div>
          {/* 힌트 */}
          {hotel.photos.length > 1 && (
            <div className="absolute top-3 right-3 bg-black/60 text-white text-[10px] px-2 py-1 rounded-full flex items-center gap-1 pointer-events-none">
              <span>←</span>
              <span>밀어서 보기</span>
              <span>→</span>
            </div>
          )}
        </div>

        {/* 데스크탑: 그리드 (1 big + 4 small) */}
        <div className="hidden sm:grid grid-cols-4 gap-1 max-w-6xl mx-auto h-[440px]">
          <div className="col-span-2 relative overflow-hidden">
            {hotel.photos[0] && (
              <img
                src={hotelPhotoUrl(hotel.photos[0], 1280)}
                alt={hotel.name}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="col-span-2 grid grid-cols-2 gap-1">
            {hotel.photos.slice(1, 5).map((photo, i) => (
              <div key={i} className="relative overflow-hidden">
                <img
                  src={hotelPhotoUrl(photo, 800)}
                  alt={`${hotel.name} ${i + 2}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 브레드크럼 */}
        <nav className="text-sm text-gray-500 mb-4">
          <Link href="/" className="hover:text-orange-500">홈</Link>
          <span className="mx-2">&gt;</span>
          <Link href={`/${country}`} className="hover:text-orange-500">{countryData.name}</Link>
          <span className="mx-2">&gt;</span>
          <Link href={`/${country}/${city}`} className="hover:text-orange-500">{cityData.name}</Link>
          <span className="mx-2">&gt;</span>
          <span className="text-gray-700">{hotel.name}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* 메인 */}
          <div className="flex-1 min-w-0">
            {/* 호텔명 + 별점 + 평점 */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                {stars > 0 && (
                  <span className="text-orange-400 text-sm">
                    {"★".repeat(stars)}
                    <span className="text-gray-200">{"★".repeat(5 - stars)}</span>
                  </span>
                )}
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                  {hotel.accommodation_type}
                </span>
                {hotel.chain && (
                  <span className="text-xs bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full">
                    {hotel.chain}
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3">
                {hotel.name}
              </h1>
              <p className="text-gray-500 text-sm mb-4">
                📍 {hotel.address}, {hotel.city}{hotel.zipcode ? `, ${hotel.zipcode}` : ""}
              </p>

              {rating > 0 && (
                <div className="flex items-center gap-3 bg-gradient-to-r from-orange-50 to-white border border-orange-100 rounded-xl p-4">
                  <div className="bg-orange-500 text-white font-bold text-2xl rounded-xl w-16 h-16 flex items-center justify-center">
                    {rating.toFixed(1)}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">
                      {rating >= 9 ? "최고" : rating >= 8 ? "매우 좋음" : rating >= 7 ? "좋음" : "괜찮음"}
                    </div>
                    <div className="text-sm text-gray-500">
                      실제 투숙객 리뷰 {reviews.toLocaleString()}개
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 한국어 소개 */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-3">호텔 소개</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {hotel.description_ko}
              </p>
            </div>

            {/* 기본 정보 */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-3">기본 정보</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {hotel.checkin && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="text-xs text-gray-500 mb-1">체크인</div>
                    <div className="font-semibold text-gray-800">{hotel.checkin}</div>
                  </div>
                )}
                {hotel.checkout && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="text-xs text-gray-500 mb-1">체크아웃</div>
                    <div className="font-semibold text-gray-800">{hotel.checkout}</div>
                  </div>
                )}
                {hotel.rooms && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="text-xs text-gray-500 mb-1">객실 수</div>
                    <div className="font-semibold text-gray-800">{hotel.rooms}개</div>
                  </div>
                )}
                {hotel.year_opened && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="text-xs text-gray-500 mb-1">개장 연도</div>
                    <div className="font-semibold text-gray-800">{hotel.year_opened}년</div>
                  </div>
                )}
              </div>
            </div>

            {/* 예약 팁 */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-3">{hotel.name} 예약 꿀팁</h2>
              <div className="space-y-3">
                {[
                  { icon: "🗓️", tip: "2~3개월 전 예약 시 얼리버드 할인 적용" },
                  { icon: "🔍", tip: "아고다에서 무료 취소 가능 요금 필터 사용" },
                  { icon: "💳", tip: "아고다캐시 적립으로 다음 여행에도 할인" },
                  { icon: "📱", tip: "아고다 앱 전용 시크릿 딜 확인" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
                    <span className="text-xl">{item.icon}</span>
                    <p className="text-sm text-gray-600">{item.tip}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-3">{hotel.name} 자주 묻는 질문</h2>
              <div className="space-y-3">
                {[
                  {
                    q: `${hotel.name} 최저가는 어디서 확인하나요?`,
                    a: `아고다에서 ${hotel.name}의 실시간 최저가와 무료 취소 가능 요금을 비교해 볼 수 있습니다. 쿨스테이 예약 링크를 통해 이동하시면 최대 7% 추가 할인이 적용됩니다.`,
                  },
                  {
                    q: `${hotel.name} 체크인·체크아웃 시간은 어떻게 되나요?`,
                    a: `${hotel.name}의 체크인 시간은 ${hotel.checkin || "15:00 이후"}, 체크아웃 시간은 ${hotel.checkout || "11:00 이전"}입니다. 일정에 따라 얼리 체크인·레이트 체크아웃 가능 여부는 호텔에 직접 문의해 주세요.`,
                  },
                  {
                    q: `${hotel.name} 위치는 어디인가요?`,
                    a: `${hotel.name}은 ${hotel.address}${hotel.zipcode ? `, ${hotel.zipcode}` : ""} (${cityData.name})에 위치한 ${stars ? `${stars}성급 ` : ""}${hotel.accommodation_type}입니다.`,
                  },
                  {
                    q: `무료 취소가 가능한가요?`,
                    a: `예약 시점과 요금제에 따라 다르지만 아고다에서 '무료 취소 가능' 필터를 적용하면 특정 기간까지 무료로 취소할 수 있는 요금을 선택할 수 있습니다.`,
                  },
                ].map((item, i) => (
                  <details key={i} className="bg-gray-50 rounded-xl p-4 group">
                    <summary className="font-semibold text-gray-800 cursor-pointer list-none flex justify-between items-center">
                      <span>Q. {item.q}</span>
                      <span className="text-orange-500 group-open:rotate-180 transition-transform">▾</span>
                    </summary>
                    <p className="text-sm text-gray-600 mt-3 leading-relaxed">{item.a}</p>
                  </details>
                ))}
              </div>
            </div>

            {/* 주변 호텔 */}
            {siblings.length > 0 && (
              <div>
                <h2 className="text-xl font-bold mb-3">{cityData.name}의 다른 인기 호텔</h2>
                <div className="grid grid-cols-2 gap-4">
                  {siblings.map((h) => (
                    <Link
                      key={h.hotel_id}
                      href={`/${country}/${city}/hotel/${hotelSlug(h)}`}
                      className="group bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg hover:border-orange-200 transition-all"
                    >
                      {h.photos[0] && (
                        <div className="h-36 overflow-hidden">
                          <img
                            src={hotelPhotoUrl(h.photos[0], 600)}
                            alt={h.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}
                      <div className="p-3">
                        <div className="text-sm font-semibold text-gray-800 line-clamp-2 mb-1">
                          {h.name}
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-orange-500 font-bold">
                            {parseFloat(h.rating_average).toFixed(1)}
                          </span>
                          <span className="text-gray-400">
                            리뷰 {parseInt(h.number_of_reviews).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 사이드바: 예약 */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="sticky top-20 space-y-4">
              <div className="bg-white border-2 border-orange-200 rounded-2xl p-6 shadow-lg">
                <div className="text-center mb-4">
                  <p className="text-xs text-gray-400 mb-1">Agoda 실시간 최저가</p>
                  <p className="text-sm font-bold text-gray-800">{hotel.name}</p>
                </div>
                <a
                  href={bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-orange-500 text-white text-center py-4 rounded-xl font-bold text-base hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/30 mb-3"
                >
                  가격 확인 & 예약
                </a>
                <ul className="space-y-2 text-xs text-gray-500">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500 font-bold">✓</span> 최대 7% 추가 할인
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500 font-bold">✓</span> 무료 취소 가능 요금
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500 font-bold">✓</span> 즉시 예약 확정
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500 font-bold">✓</span> 예약 수수료 없음
                  </li>
                </ul>
              </div>

              <Link
                href={`/${country}/${city}`}
                className="block text-center bg-gray-100 rounded-xl py-3 text-sm text-gray-600 hover:bg-gray-200 transition-colors"
              >
                ← {cityData.name} 호텔 전체 보기
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 CTA */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 py-12 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-white">
          <h2 className="text-xl sm:text-2xl font-bold mb-2">
            {hotel.name} 아고다 최저가 확인
          </h2>
          <p className="text-white/80 text-sm mb-5">
            무료 취소 · 즉시 예약 확정 · 최대 7% 추가 할인
          </p>
          <a
            href={bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-orange-600 font-bold text-base px-8 py-3 rounded-xl hover:bg-gray-100 transition-colors"
          >
            지금 예약하기
          </a>
        </div>
      </section>
    </div>
  );
}
