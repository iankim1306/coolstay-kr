import Link from "next/link";
import { notFound } from "next/navigation";
import { getCityData, getCountryData } from "@/lib/destinations";
import { hotelSlug, hotelPhotoUrl, agodaHotelLink } from "@/lib/hotels";
import {
  getFilter,
  getFilteredHotels,
  getAllFilterCombos,
  getAvailableFilters,
  FILTERS,
} from "@/lib/filter-pages";
import { breadcrumbJsonLd, itemListJsonLd, ldJson } from "@/lib/jsonld";

export async function generateStaticParams() {
  return getAllFilterCombos().map(({ countrySlug, citySlug, filter }) => ({
    country: countrySlug,
    city: citySlug,
    filter: filter.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string; city: string; filter: string }>;
}) {
  const { country, city, filter: filterSlug } = await params;
  const filter = getFilter(filterSlug);
  const cityData = getCityData(country, city);
  if (!filter || !cityData) return {};
  return {
    title: `${cityData.name} ${filter.longLabel} TOP 20 | 쿨스테이`,
    description: `${cityData.name} ${filter.longLabel} 추천 리스트. 평점·가격 검증된 호텔 20개와 아고다 실시간 최저가 비교.`,
    alternates: {
      canonical: `https://coolstay.kr/${country}/${city}/filter/${filterSlug}`,
    },
  };
}

export default async function FilterPage({
  params,
}: {
  params: Promise<{ country: string; city: string; filter: string }>;
}) {
  const { country, city, filter: filterSlug } = await params;
  const filter = getFilter(filterSlug);
  const countryData = getCountryData(country);
  const cityData = getCityData(country, city);
  if (!filter || !countryData || !cityData) notFound();

  const hotels = getFilteredHotels(country, city, filter, 20);
  if (hotels.length < 5) notFound();

  const otherFilters = getAvailableFilters(country, city).filter((f) => f.slug !== filter.slug);
  const pageUrl = `https://coolstay.kr/${country}/${city}/filter/${filterSlug}`;

  const breadcrumb = breadcrumbJsonLd([
    { name: "홈", url: "https://coolstay.kr/" },
    { name: countryData.name, url: `https://coolstay.kr/${country}` },
    { name: cityData.name, url: `https://coolstay.kr/${country}/${city}` },
    { name: `${cityData.name} ${filter.label}`, url: pageUrl },
  ]);
  const itemList = itemListJsonLd(
    hotels,
    country,
    city,
    pageUrl,
    `${cityData.name} ${filter.longLabel} TOP ${hotels.length}`
  );

  return (
    <div className="bg-white">
      <script {...ldJson(breadcrumb)} />
      <script {...ldJson(itemList)} />

      <section className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-12 sm:py-16">
          <nav className="text-sm text-white/70 mb-4">
            <Link href="/" className="hover:text-white">홈</Link>
            <span className="mx-2">&gt;</span>
            <Link href={`/${country}`} className="hover:text-white">{countryData.name}</Link>
            <span className="mx-2">&gt;</span>
            <Link href={`/${country}/${city}`} className="hover:text-white">{cityData.name}</Link>
            <span className="mx-2">&gt;</span>
            <span className="text-white">{filter.label}</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            {cityData.name} {filter.longLabel} TOP {hotels.length}
          </h1>
          <p className="text-white/90 text-base leading-relaxed max-w-3xl">{filter.intro(cityData.name)}</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {otherFilters.length > 0 && (
          <div className="mb-8">
            <p className="text-xs text-gray-400 mb-2">다른 조건으로 보기</p>
            <div className="flex flex-wrap gap-2">
              {otherFilters.map((f) => (
                <Link key={f.slug} href={`/${country}/${city}/filter/${f.slug}`}
                  className="text-sm bg-gray-50 hover:bg-orange-50 hover:text-orange-600 border border-gray-200 hover:border-orange-200 rounded-full px-4 py-1.5 transition-colors">
                  {cityData.name} {f.label}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-4">
          {hotels.map((h, i) => {
            const rating = parseFloat(h.rating_average) || 0;
            const reviews = parseInt(h.number_of_reviews) || 0;
            const stars = parseInt(h.star_rating) || 0;
            const price = parseFloat(h.rates_from) || 0;
            return (
              <article key={h.hotel_id}
                className="flex flex-col sm:flex-row bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg hover:border-orange-200 transition-all">
                <Link href={`/${country}/${city}/hotel/${hotelSlug(h)}`}
                  className="sm:w-72 flex-shrink-0 relative h-52 sm:h-auto overflow-hidden group">
                  {h.photos[0] && (
                    <img src={hotelPhotoUrl(h.photos[0], 800)} alt={h.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  )}
                  <div className="absolute top-3 left-3 bg-orange-500 text-white font-bold text-sm rounded-lg px-3 py-1 shadow-lg">#{i + 1}</div>
                </Link>
                <div className="flex-1 p-5 flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {stars > 0 && (
                        <span className="text-orange-400 text-xs">
                          {"★".repeat(stars)}<span className="text-gray-200">{"★".repeat(5 - stars)}</span>
                        </span>
                      )}
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{h.accommodation_type}</span>
                    </div>
                    <Link href={`/${country}/${city}/hotel/${hotelSlug(h)}`} className="block">
                      <h2 className="text-lg sm:text-xl font-bold text-gray-900 hover:text-orange-500 transition-colors line-clamp-2">{h.name}</h2>
                    </Link>
                    <p className="text-xs text-gray-500 mt-1 mb-2 line-clamp-1">📍 {h.address}</p>
                    <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{h.description_ko}</p>
                  </div>
                  <div className="sm:w-40 flex-shrink-0 flex sm:flex-col items-end sm:items-stretch gap-3 justify-between">
                    {rating > 0 && (
                      <div className="text-right sm:text-center bg-orange-50 rounded-xl px-3 py-2 border border-orange-100">
                        <div className="text-xl font-bold text-orange-600">{rating.toFixed(1)}</div>
                        <div className="text-[10px] text-gray-500">리뷰 {reviews.toLocaleString()}</div>
                        {price > 0 && <div className="text-xs font-semibold text-gray-700 mt-1">${Math.round(price)}~</div>}
                      </div>
                    )}
                    <a href={agodaHotelLink(h.hotel_id)} target="_blank" rel="noopener noreferrer"
                      className="bg-orange-500 hover:bg-orange-600 text-white text-center text-sm font-bold px-4 py-2.5 rounded-xl transition-colors shadow-sm shadow-orange-500/30 whitespace-nowrap">
                      최저가 보기
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-10 bg-gray-50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-2">{cityData.name} {filter.label} 호텔 고르기 팁</h2>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>✔ <b>평점 8.0 이상</b>이면 실패할 확률이 낮습니다.</li>
            <li>✔ 리뷰 수가 많을수록 평점의 신뢰도가 높습니다.</li>
            <li>✔ 아고다 <b>무료 취소 가능</b> 요금 필터를 켜고 비교하세요.</li>
            <li>✔ 2~3개월 전 예약 시 얼리버드 할인 적용되는 경우가 많습니다.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
