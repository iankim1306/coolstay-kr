import Link from "next/link";
import { notFound } from "next/navigation";
import {
  LANDMARKS,
  CATEGORY_LABEL,
  getLandmark,
  getLandmarksByCity,
  getNearbyHotels,
  formatDistance,
} from "@/lib/landmarks";
import { getCityData } from "@/lib/destinations";
import { hotelSlug, hotelPhotoUrl } from "@/lib/hotels";
import { breadcrumbJsonLd, faqJsonLd, itemListJsonLd, ldJson } from "@/lib/jsonld";

/** 빌드시점 정적 생성 — 런타임 ISR Write 0 (Vercel Hobby 한도 보호) */
export const dynamicParams = false;

export async function generateStaticParams() {
  return LANDMARKS.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const landmark = getLandmark(slug);
  if (!landmark) return {};

  const nearby = getNearbyHotels(landmark);
  const closest = nearby[0];
  const title = `${landmark.name} 근처 호텔 BEST 10 — 도보 거리·평점순 | 쿨스테이`;
  const description = closest
    ? `${landmark.name}에서 가까운 순으로 뽑은 숙소 ${nearby.length}곳. 가장 가까운 곳은 ${closest.hotel.name}(${formatDistance(closest.km)}·도보 ${closest.walkMin}분). 평점·리뷰 수와 실제 직선거리를 함께 확인하세요.`
    : `${landmark.name} 근처 숙소를 거리순으로 정리했습니다.`;

  return {
    title,
    description,
    keywords: [
      `${landmark.name} 근처 호텔`,
      `${landmark.shortName} 호텔`,
      `${landmark.shortName} 숙소`,
      `${landmark.cityName} ${landmark.shortName} 호텔 추천`,
      `${landmark.cityName} 호텔`,
    ],
    alternates: { canonical: `https://coolstay.kr/near/${slug}` },
    openGraph: {
      title,
      description,
      url: `https://coolstay.kr/near/${slug}`,
      type: "article",
    },
  };
}

export default async function NearLandmarkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const landmark = getLandmark(slug);
  if (!landmark) notFound();

  const nearby = getNearbyHotels(landmark);
  if (nearby.length === 0) notFound();

  const city = getCityData(landmark.countryKey, landmark.cityKey);
  const siblings = getLandmarksByCity(landmark.countryKey, landmark.cityKey, landmark.slug);
  const pageUrl = `https://coolstay.kr/near/${slug}`;

  const walkableCount = nearby.filter((n) => n.walkable).length;
  const closest = nearby[0];
  const bestRated = [...nearby].sort(
    (a, b) => (parseFloat(b.hotel.rating_average) || 0) - (parseFloat(a.hotel.rating_average) || 0)
  )[0];

  // 데이터에서 자동 생성되는 FAQ + 손으로 쓴 FAQ
  const faq = [
    {
      q: `${landmark.name}에서 가장 가까운 호텔은 어디인가요?`,
      a: `${closest.hotel.name}입니다. 직선거리 ${formatDistance(closest.km)}, 도보 약 ${closest.walkMin}분 거리이며 투숙객 평점은 ${parseFloat(closest.hotel.rating_average).toFixed(1)}점(리뷰 ${parseInt(closest.hotel.number_of_reviews).toLocaleString()}건)입니다.`,
    },
    {
      q: `${landmark.shortName} 근처에 걸어갈 수 있는 호텔이 많나요?`,
      a:
        walkableCount > 0
          ? `이 페이지의 ${nearby.length}곳 중 ${walkableCount}곳이 직선거리 1.5km 이내로, 걸어서 오갈 수 있는 거리입니다. 나머지는 택시·대중교통 기준 ${nearby[nearby.length - 1].driveMin}분 이내입니다.`
          : `도보권(1.5km 이내) 숙소는 없고, 가장 가까운 곳도 차로 약 ${closest.driveMin}분 거리입니다. 이 구역은 차량 이동을 전제로 숙소를 고르는 편이 낫습니다.`,
    },
    {
      q: `${landmark.shortName} 근처에서 평점이 가장 높은 숙소는 어디인가요?`,
      a: `${bestRated.hotel.name}로 평점 ${parseFloat(bestRated.hotel.rating_average).toFixed(1)}점(리뷰 ${parseInt(bestRated.hotel.number_of_reviews).toLocaleString()}건)입니다. ${landmark.name}에서 ${formatDistance(bestRated.km)} 떨어져 있습니다.`,
    },
    ...(landmark.faq ?? []),
  ];

  const breadcrumb = breadcrumbJsonLd([
    { name: "홈", url: "https://coolstay.kr/" },
    { name: `${landmark.cityName} 호텔`, url: `https://coolstay.kr/${landmark.countryKey}/${landmark.cityKey}` },
    { name: `${landmark.name} 근처 호텔`, url: pageUrl },
  ]);

  const itemList = itemListJsonLd(
    nearby.map((n) => n.hotel),
    landmark.countryKey,
    landmark.cityKey,
    pageUrl,
    `${landmark.name} 근처 호텔 BEST ${nearby.length}`
  );

  const placeLd = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: landmark.name,
    description: landmark.intro,
    url: pageUrl,
    address: { "@type": "PostalAddress", addressLocality: landmark.cityName },
    geo: { "@type": "GeoCoordinates", latitude: landmark.lat, longitude: landmark.lng },
  };

  return (
    <article className="bg-white">
      <script {...ldJson(breadcrumb)} />
      <script {...ldJson(itemList)} />
      <script {...ldJson(faqJsonLd(faq))} />
      <script {...ldJson(placeLd)} />

      {/* 헤더 */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 text-white overflow-hidden">
        {city && (
          <div
            className="absolute inset-0 opacity-20"
            style={{ backgroundImage: `url(${city.img})`, backgroundSize: "cover", backgroundPosition: "center" }}
          />
        )}
        <div className="relative max-w-4xl mx-auto px-4 py-14 sm:py-20">
          <nav className="text-sm text-gray-400 mb-4">
            <Link href="/" className="hover:text-white">홈</Link>
            <span className="mx-2">&gt;</span>
            <Link href={`/${landmark.countryKey}/${landmark.cityKey}`} className="hover:text-white">
              {landmark.cityName}
            </Link>
            <span className="mx-2">&gt;</span>
            <span className="text-white">{landmark.shortName} 근처 숙소</span>
          </nav>

          <div className="flex items-center gap-2 mb-3">
            <span className="bg-white/10 border border-white/20 text-white/90 text-xs px-2.5 py-1 rounded-full">
              {CATEGORY_LABEL[landmark.category]}
            </span>
            <span className="text-teal-300 text-xs font-semibold tracking-wider uppercase">
              GPS 거리 기준
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold mb-4 leading-tight">
            {landmark.name} 근처 호텔 BEST {nearby.length}
          </h1>
          <p className="text-gray-300 text-base leading-relaxed">{landmark.intro}</p>

          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-400">
            <span>📍 가장 가까운 숙소 {formatDistance(closest.km)} · 도보 {closest.walkMin}분</span>
            <span>•</span>
            <span>🚶 도보권(1.5km) {walkableCount}곳</span>
            <span>•</span>
            <span>
              📅 {new Intl.DateTimeFormat("ko-KR", { year: "numeric", month: "long" }).format(new Date())} 기준
            </span>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* 선정 기준 — 데이터 해자를 그대로 드러낸다 */}
        <section className="bg-slate-50 border border-slate-100 rounded-2xl p-5 mb-10">
          <h2 className="text-sm font-bold text-gray-800 mb-2">이 목록을 만든 방법</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            {landmark.name}의 실제 좌표({landmark.lat}, {landmark.lng})와 {landmark.cityName} 숙소
            데이터의 GPS 좌표를 대조해 <strong className="text-gray-800">직선거리가 가까운 순</strong>으로
            정렬했습니다. 평점 7.5점 이상 · 리뷰 50건 이상만 남겼습니다. 광고비를 받고 순서를 바꾸지 않습니다.
          </p>
          <p className="text-xs text-gray-400 mt-2">
            도보 시간은 직선거리에 우회계수(1.25)를 적용해 시속 4.5km로 환산한 값입니다. 실제 경로는
            지형·횡단보도에 따라 달라질 수 있습니다.
          </p>
        </section>

        {/* 호텔 목록 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            {landmark.shortName}에서 가까운 숙소
          </h2>
          <p className="text-gray-500 text-sm mb-6">가까운 순 · 거리는 직선거리 기준</p>

          <div className="space-y-3">
            {nearby.map((n, i) => {
              const h = n.hotel;
              const rating = parseFloat(h.rating_average) || 0;
              const reviews = parseInt(h.number_of_reviews) || 0;
              const stars = parseFloat(h.star_rating) || 0;
              return (
                <Link
                  key={h.hotel_id}
                  href={`/${landmark.countryKey}/${landmark.cityKey}/hotel/${hotelSlug(h)}`}
                  className="group flex gap-3 sm:gap-4 bg-white border border-gray-100 rounded-2xl p-3 hover:shadow-lg hover:border-teal-200 transition-all"
                >
                  <div className="w-7 sm:w-9 flex-shrink-0 flex items-start justify-center pt-1">
                    <span className="text-lg sm:text-2xl font-bold text-gray-300 group-hover:text-teal-500 transition-colors">
                      {i + 1}
                    </span>
                  </div>

                  {h.photos[0] && (
                    <img
                      src={hotelPhotoUrl(h.photos[0], 320)}
                      alt={`${h.name} — ${landmark.name} 근처 호텔`}
                      loading={i < 3 ? "eager" : "lazy"}
                      className="w-24 h-24 sm:w-32 sm:h-28 object-cover rounded-xl flex-shrink-0 bg-gray-100"
                    />
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 mb-1.5">
                      <h3 className="font-semibold text-sm sm:text-base text-gray-900 line-clamp-2 flex-1">
                        {h.name}
                      </h3>
                    </div>

                    {/* 거리 = 이 페이지의 핵심 정보 */}
                    <div className="flex flex-wrap items-center gap-1.5 mb-2">
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded-lg ${
                          n.walkable ? "bg-teal-50 text-teal-700" : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {n.walkable ? `🚶 도보 ${n.walkMin}분` : `🚗 차로 ${n.driveMin}분`}
                      </span>
                      <span className="text-xs text-gray-500">{formatDistance(n.km)}</span>
                      {stars > 0 && (
                        <span className="text-xs text-amber-500">
                          {"★".repeat(Math.floor(stars))}
                          <span className="text-gray-300">{"★".repeat(Math.max(0, 5 - Math.floor(stars)))}</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      {rating > 0 && (
                        <span className="bg-teal-600 text-white px-1.5 py-0.5 rounded font-bold">
                          {rating.toFixed(1)}
                        </span>
                      )}
                      {reviews > 0 && (
                        <span className="text-gray-400">리뷰 {reviews.toLocaleString()}건</span>
                      )}
                      <span className="ml-auto text-teal-600 font-semibold group-hover:underline hidden sm:inline">
                        숙소 보기 →
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* 교통 */}
        <section className="mt-12 grid sm:grid-cols-2 gap-4">
          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
              <span className="text-lg">🚇</span> 가는 방법
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">{landmark.access}</p>
          </div>
          <div className="bg-teal-50 border border-teal-100 rounded-2xl p-5">
            <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
              <span className="text-lg">💡</span> 이 근처에 묵는다면
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">{landmark.stayTip}</p>
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">자주 묻는 질문</h2>
          <div className="space-y-3">
            {faq.map((item, i) => (
              <details key={i} className="bg-gray-50 rounded-xl p-5 group">
                <summary className="font-semibold text-gray-800 cursor-pointer list-none flex justify-between items-center gap-4">
                  <span>Q. {item.q}</span>
                  <span className="text-teal-600 group-open:rotate-180 transition-transform">▾</span>
                </summary>
                <p className="text-sm text-gray-600 mt-3 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* 같은 도시 다른 랜드마크 */}
        {siblings.length > 0 && (
          <section className="mt-12">
            <h2 className="text-lg font-bold text-gray-900 mb-4">{landmark.cityName}의 다른 명소 근처 숙소</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {siblings.map((s) => (
                <Link
                  key={s.slug}
                  href={`/near/${s.slug}`}
                  className="border border-gray-100 rounded-xl p-4 hover:border-teal-200 hover:shadow-sm transition-all"
                >
                  <div className="text-xs text-gray-400 mb-1">{CATEGORY_LABEL[s.category]}</div>
                  <div className="font-semibold text-gray-800 text-sm">{s.name} 근처 호텔 →</div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 소프트 CTA — "최저가 확인"(하드) 폐기 */}
        <section className="mt-14 bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-8 text-center text-white">
          <h3 className="text-xl font-bold mb-2">
            {landmark.shortName} 말고 다른 곳도 보시나요?
          </h3>
          <p className="text-white/70 text-sm mb-5">
            {landmark.cityName} 전체 숙소를 지역·평점별로 모아뒀습니다.
          </p>
          <Link
            href={`/${landmark.countryKey}/${landmark.cityKey}`}
            className="inline-block bg-white text-slate-900 font-bold px-8 py-3 rounded-xl hover:bg-gray-100 transition-colors"
          >
            {landmark.cityName} 숙소 보러가기
          </Link>
        </section>
      </div>
    </article>
  );
}
