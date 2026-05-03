import Link from "next/link";
import { notFound } from "next/navigation";
import { getGuide, GUIDES } from "@/lib/guides";
import { getCityData, getCountryData } from "@/lib/destinations";
import { getHotelsByCity, hotelSlug, hotelPhotoUrl } from "@/lib/hotels";
import { breadcrumbJsonLd, faqJsonLd, ldJson } from "@/lib/jsonld";

export async function generateStaticParams() {
  return GUIDES.map(g => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};
  return {
    title: guide.title,
    description: guide.metaDescription,
    keywords: guide.keywords,
    alternates: {
      canonical: `https://coolstay.kr/guide/${slug}`,
    },
  };
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const city = getCityData(guide.countryKey, guide.cityKey);
  const country = getCountryData(guide.countryKey);
  const topHotels = getHotelsByCity(guide.countryKey, guide.cityKey).slice(0, 5);

  const breadcrumb = breadcrumbJsonLd([
    { name: "홈", url: "https://coolstay.kr/" },
    { name: "여행 가이드", url: "https://coolstay.kr/guide" },
    { name: guide.h1, url: `https://coolstay.kr/guide/${slug}` },
  ]);

  const faqLd = faqJsonLd(guide.faq);

  return (
    <article className="bg-white">
      <script {...ldJson(breadcrumb)} />
      <script {...ldJson(faqLd)} />

      {/* 헤더 */}
      <section className="relative bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-white overflow-hidden">
        {city && (
          <div className="absolute inset-0 opacity-25"
            style={{ backgroundImage: `url(${city.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          />
        )}
        <div className="relative max-w-4xl mx-auto px-4 py-16 sm:py-24">
          <nav className="text-sm text-gray-400 mb-4">
            <Link href="/" className="hover:text-white">홈</Link>
            <span className="mx-2">&gt;</span>
            <span className="text-white">여행 가이드</span>
          </nav>
          <p className="text-orange-400 text-sm font-semibold tracking-widest mb-3 uppercase">완벽 가이드</p>
          <h1 className="text-3xl sm:text-5xl font-bold mb-4 leading-tight">{guide.h1}</h1>
          <p className="text-gray-300 text-base leading-relaxed">{guide.intro}</p>
          <div className="mt-6 flex items-center gap-4 text-xs text-gray-400">
            <span>📅 마지막 업데이트: {new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: 'long' }).format(new Date())}</span>
            <span>•</span>
            <span>📖 약 {Math.ceil((guide.intro.length + guide.sections.reduce((sum, s) => sum + s.content.length, 0)) / 500)}분 읽기</span>
          </div>
        </div>
      </section>

      {/* 본문 */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="prose prose-lg max-w-none">
          {guide.sections.map((section, i) => (
            <section key={i} className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">{section.h2}</h2>
              <p className="text-gray-700 leading-relaxed text-base whitespace-pre-line"
                dangerouslySetInnerHTML={{
                  __html: section.content
                    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-orange-600">$1</strong>')
                }}
              />
              {section.bullets && section.bullets.length > 0 && (
                <ul className="mt-4 space-y-2 bg-orange-50 border border-orange-100 rounded-xl p-5">
                  {section.bullets.map((b, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-orange-500 font-bold mt-0.5">→</span>
                      <span dangerouslySetInnerHTML={{ __html: b.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }} />
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        {/* 추천 호텔 */}
        {city && topHotels.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{city.name} 추천 호텔 TOP 5</h2>
            <p className="text-gray-500 text-sm mb-6">아고다 평점 + 리뷰 수 기준 상위 5개</p>
            <div className="space-y-3">
              {topHotels.map((h, i) => (
                <Link key={h.hotel_id} href={`/${guide.countryKey}/${guide.cityKey}/hotel/${hotelSlug(h)}`}
                  className="group flex gap-4 bg-white border border-gray-100 rounded-xl p-3 hover:shadow-lg hover:border-orange-200 transition-all">
                  <div className="text-2xl font-bold text-orange-500 w-8 text-center self-center">{i + 1}</div>
                  {h.photos[0] && (
                    <img src={hotelPhotoUrl(h.photos[0], 200)} alt={h.name}
                      className="w-24 h-24 object-cover rounded-lg flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-gray-800 line-clamp-2 mb-1">{h.name}</div>
                    <div className="text-xs text-gray-500 line-clamp-1 mb-2">📍 {h.address}</div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="bg-orange-500 text-white px-1.5 py-0.5 rounded font-bold">{parseFloat(h.rating_average).toFixed(1)}</span>
                      <span className="text-gray-400">리뷰 {parseInt(h.number_of_reviews).toLocaleString()}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Link href={`/${guide.countryKey}/${guide.cityKey}`}
                className="inline-block text-sm text-orange-500 hover:text-orange-600 font-semibold">
                {city.name} 전체 호텔 보기 →
              </Link>
            </div>
          </section>
        )}

        {/* 시즌 노트 */}
        <section className="mt-12 bg-orange-50 border border-orange-100 rounded-2xl p-6">
          <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
            <span className="text-xl">🌤️</span>최적 여행 시즌
          </h3>
          <p className="text-sm text-gray-700 leading-relaxed">{guide.bestSeasonNote}</p>
        </section>

        {/* FAQ */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">자주 묻는 질문</h2>
          <div className="space-y-3">
            {guide.faq.map((item, i) => (
              <details key={i} className="bg-gray-50 rounded-xl p-5 group">
                <summary className="font-semibold text-gray-800 cursor-pointer list-none flex justify-between items-center">
                  <span>Q. {item.q}</span>
                  <span className="text-orange-500 group-open:rotate-180 transition-transform">▾</span>
                </summary>
                <p className="text-sm text-gray-600 mt-3 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 text-center text-white">
          <h3 className="text-xl font-bold mb-2">{city?.name} 호텔, 아고다 최저가 비교</h3>
          <p className="text-white/80 text-sm mb-4">실시간 가격 · 무료 취소 · 즉시 확정</p>
          <Link href={`/${guide.countryKey}/${guide.cityKey}`}
            className="inline-block bg-white text-orange-600 font-bold px-8 py-3 rounded-xl hover:bg-gray-100 transition-colors">
            {city?.name} 호텔 보기
          </Link>
        </section>
      </div>
    </article>
  );
}
