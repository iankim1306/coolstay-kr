import Link from "next/link";
import { notFound } from "next/navigation";
import { getCityData, getCountryData } from "@/lib/destinations";
import { hotelSlug, hotelPhotoUrl, agodaHotelLink } from "@/lib/hotels";
import {
  getTheme,
  getThemedHotels,
  getAllThemeCombos,
  getAvailableThemes,
  THEMES,
} from "@/lib/themes";
import { breadcrumbJsonLd, itemListJsonLd, ldJson } from "@/lib/jsonld";

export async function generateStaticParams() {
  return getAllThemeCombos().map(({ countrySlug, citySlug, theme }) => ({
    country: countrySlug,
    city: citySlug,
    theme: theme.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string; city: string; theme: string }>;
}) {
  const { country, city, theme: themeSlug } = await params;
  const theme = getTheme(themeSlug);
  const cityData = getCityData(country, city);
  const countryData = getCountryData(country);
  if (!theme || !cityData || !countryData) return {};
  const cityName = cityData.name;
  return {
    title: `${cityName} ${theme.keyword} TOP 10 - ${countryData.name} 여행 | 쿨스테이`,
    description: `${cityName} ${theme.keyword} 추천 리스트. 실제 투숙객 리뷰 기반으로 엄선한 TOP 10과 아고다 실시간 최저가를 한 곳에서 비교하세요.`,
    alternates: {
      canonical: `https://coolstay.kr/${country}/${city}/${themeSlug}`,
    },
  };
}

export default async function ThemePage({
  params,
}: {
  params: Promise<{ country: string; city: string; theme: string }>;
}) {
  const { country, city, theme: themeSlug } = await params;
  const theme = getTheme(themeSlug);
  const countryData = getCountryData(country);
  const cityData = getCityData(country, city);
  if (!theme || !countryData || !cityData) notFound();

  const hotels = getThemedHotels(country, city, theme, 10);
  if (hotels.length < 3) notFound();

  const otherThemes = getAvailableThemes(country, city).filter((t) => t.slug !== theme.slug);

  const pageUrl = `https://coolstay.kr/${country}/${city}/${themeSlug}`;
  const breadcrumb = breadcrumbJsonLd([
    { name: "홈", url: "https://coolstay.kr/" },
    { name: countryData.name, url: `https://coolstay.kr/${country}` },
    { name: cityData.name, url: `https://coolstay.kr/${country}/${city}` },
    { name: `${cityData.name} ${theme.label}`, url: pageUrl },
  ]);
  const itemList = itemListJsonLd(
    hotels,
    country,
    city,
    pageUrl,
    `${cityData.name} ${theme.keyword} TOP ${hotels.length}`
  );

  return (
    <div className="bg-white">
      <script {...ldJson(breadcrumb)} />
      <script {...ldJson(itemList)} />
      {/* 헤더 */}
      <section className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-12 sm:py-16">
          <nav className="text-sm text-white/70 mb-4">
            <Link href="/" className="hover:text-white">홈</Link>
            <span className="mx-2">&gt;</span>
            <Link href={`/${country}`} className="hover:text-white">{countryData.name}</Link>
            <span className="mx-2">&gt;</span>
            <Link href={`/${country}/${city}`} className="hover:text-white">{cityData.name}</Link>
            <span className="mx-2">&gt;</span>
            <span className="text-white">{theme.label}</span>
          </nav>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">{theme.emoji}</span>
            <h1 className="text-3xl sm:text-4xl font-bold">
              {cityData.name} {theme.keyword} TOP {hotels.length}
            </h1>
          </div>
          <p className="text-white/90 text-base leading-relaxed max-w-3xl">
            {theme.intro(cityData.name)}
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* 다른 테마 네비 */}
        {otherThemes.length > 0 && (
          <div className="mb-8">
            <p className="text-xs text-gray-400 mb-2">다른 테마로 보기</p>
            <div className="flex flex-wrap gap-2">
              {otherThemes.map((t) => (
                <Link
                  key={t.slug}
                  href={`/${country}/${city}/${t.slug}`}
                  className="text-sm bg-gray-50 hover:bg-orange-50 hover:text-orange-600 border border-gray-200 hover:border-orange-200 rounded-full px-4 py-1.5 transition-colors"
                >
                  <span className="mr-1">{t.emoji}</span>
                  {cityData.name} {t.label}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 호텔 리스트 */}
        <div className="space-y-4">
          {hotels.map((h, i) => {
            const rating = parseFloat(h.rating_average) || 0;
            const reviews = parseInt(h.number_of_reviews) || 0;
            const stars = parseInt(h.star_rating) || 0;
            const rank = i + 1;
            return (
              <article
                key={h.hotel_id}
                className="flex flex-col sm:flex-row bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg hover:border-orange-200 transition-all"
              >
                {/* 썸네일 */}
                <Link
                  href={`/${country}/${city}/hotel/${hotelSlug(h)}`}
                  className="sm:w-72 flex-shrink-0 relative h-52 sm:h-auto overflow-hidden group"
                >
                  {h.photos[0] && (
                    <img
                      src={hotelPhotoUrl(h.photos[0], 800)}
                      alt={h.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                  <div className="absolute top-3 left-3 bg-orange-500 text-white font-bold text-sm rounded-lg px-3 py-1 shadow-lg">
                    #{rank}
                  </div>
                </Link>

                {/* 본문 */}
                <div className="flex-1 p-5 flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {stars > 0 && (
                        <span className="text-orange-400 text-xs">
                          {"★".repeat(stars)}
                          <span className="text-gray-200">{"★".repeat(5 - stars)}</span>
                        </span>
                      )}
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        {h.accommodation_type}
                      </span>
                    </div>
                    <Link
                      href={`/${country}/${city}/hotel/${hotelSlug(h)}`}
                      className="block"
                    >
                      <h2 className="text-lg sm:text-xl font-bold text-gray-900 hover:text-orange-500 transition-colors line-clamp-2">
                        {h.name}
                      </h2>
                    </Link>
                    <p className="text-xs text-gray-500 mt-1 mb-2 line-clamp-1">
                      📍 {h.address}
                    </p>
                    <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                      {h.description_ko}
                    </p>
                  </div>

                  {/* 우측: 평점 + CTA */}
                  <div className="sm:w-40 flex-shrink-0 flex sm:flex-col items-end sm:items-stretch gap-3 justify-between">
                    {rating > 0 && (
                      <div className="text-right sm:text-center bg-orange-50 rounded-xl px-3 py-2 border border-orange-100">
                        <div className="text-xl font-bold text-orange-600">{rating.toFixed(1)}</div>
                        <div className="text-[10px] text-gray-500">리뷰 {reviews.toLocaleString()}</div>
                      </div>
                    )}
                    <a
                      href={agodaHotelLink(h.hotel_id)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-orange-500 hover:bg-orange-600 text-white text-center text-sm font-bold px-4 py-2.5 rounded-xl transition-colors shadow-sm shadow-orange-500/30 whitespace-nowrap"
                    >
                      최저가 보기
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* 하단 설명 */}
        <div className="mt-10 bg-gray-50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-2">
            {cityData.name} {theme.keyword} 고르는 팁
          </h2>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>✔ <b>평점 8.0 이상</b>이면 실패할 확률이 낮습니다.</li>
            <li>✔ 리뷰 수가 많을수록 평점의 신뢰도가 높습니다.</li>
            <li>✔ 아고다 <b>무료 취소 가능</b> 요금 필터를 켜고 비교하세요.</li>
            <li>✔ 2~3개월 전 예약 시 얼리버드 할인 적용되는 경우가 많습니다.</li>
          </ul>
        </div>

        {/* 주변 도시 다른 테마 */}
        <div className="mt-10">
          <h2 className="text-lg font-bold text-gray-800 mb-3">
            {cityData.name} 다른 테마
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {THEMES.filter((t) => t.slug !== theme.slug).map((t) => (
              <Link
                key={t.slug}
                href={`/${country}/${city}/${t.slug}`}
                className="bg-white border border-gray-100 hover:border-orange-200 hover:shadow rounded-xl p-4 transition-all"
              >
                <div className="text-2xl mb-1">{t.emoji}</div>
                <div className="text-sm font-semibold text-gray-800">
                  {cityData.name} {t.label}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
