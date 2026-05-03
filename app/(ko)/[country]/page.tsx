import Link from "next/link";
import { notFound } from "next/navigation";
import { getCountryData, COUNTRIES } from "@/lib/destinations";
import { breadcrumbJsonLd, ldJson } from "@/lib/jsonld";

export async function generateStaticParams() {
  return COUNTRIES.map(c => ({ country: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ country: string }> }) {
  const { country: slug } = await params;
  const country = getCountryData(slug);
  if (!country) return {};
  const cityNames = country.cities.map(c => c.name).join('·');
  const visaShort = country.countryInfo?.visa?.split('.')[0] || '';
  const seasonShort = country.countryInfo?.bestSeason?.split('.')[0] || '';
  const longDesc = `${country.name} 호텔 추천 — ${cityNames} ${country.cities.length}개 도시 호텔 아고다 실시간 최저가 비교. ${visaShort}. ${seasonShort}. 3성급 가성비부터 5성급 럭셔리·풀빌라·온천·료칸까지 모든 가격대. 무료 취소·즉시 예약 확정·평균 7% 추가 할인.`;
  const shortDesc = `${country.name} ${cityNames} ${country.cities.length}개 도시 호텔 아고다 실시간 최저가. 가성비부터 럭셔리까지. 무료 취소·즉시 확정·최대 7% 추가 할인.`;

  return {
    title: `${country.name} 호텔 최저가 비교 | 아고다 특가`,
    description: longDesc,
    openGraph: { title: `${country.name} 호텔 최저가 비교 | 아고다 특가`, description: shortDesc, url: `https://coolstay.kr/${slug}` },
    twitter: { card: 'summary_large_image', title: `${country.name} 호텔 최저가 비교`, description: shortDesc },
    alternates: {
      canonical: `https://coolstay.kr/${slug}`,
      languages: {
        ko: `https://coolstay.kr/${slug}`,
        en: `https://coolstay.kr/en/${slug}`,
        'x-default': `https://coolstay.kr/${slug}`,
      },
    },
  };
}

export default async function CountryPage({ params }: { params: Promise<{ country: string }> }) {
  const { country: slug } = await params;
  const country = getCountryData(slug);
  if (!country) notFound();

  const breadcrumb = breadcrumbJsonLd([
    { name: "홈", url: "https://coolstay.kr/" },
    { name: country.name, url: `https://coolstay.kr/${slug}` },
  ]);

  return (
    <div>
      <script {...ldJson(breadcrumb)} />
      {/* 헤더 */}
      <section className="relative bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-25"
          style={{ backgroundImage: `url(${country.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        <div className="relative max-w-6xl mx-auto px-4 py-16 sm:py-24">
          <nav className="text-sm text-gray-400 mb-4">
            <Link href="/" className="hover:text-white">홈</Link>
            <span className="mx-2">&gt;</span>
            <span className="text-white">{country.name}</span>
          </nav>
          <p className="text-orange-400 text-sm font-semibold tracking-widest mb-3 uppercase">
            {country.desc}
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold mb-4">
            {country.name} 호텔 최저가
          </h1>
          <p className="text-gray-300 text-lg mb-8 max-w-xl">
            아고다에서 {country.name} 숙소를 최저가로 비교하고 즉시 예약하세요
          </p>
          <a
            href={`https://www.agoda.com/search?country=${country.nameEn}&cid=1962399`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-orange-500 text-white text-lg px-8 py-4 rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-xl shadow-orange-500/30"
          >
            아고다에서 {country.name} 호텔 검색
          </a>
        </div>
      </section>

      {/* 도시 목록 */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        <h2 className="text-2xl font-bold mb-2">{country.name} 인기 도시</h2>
        <p className="text-gray-400 mb-8">도시를 선택해 최저가 호텔을 확인하세요</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {country.cities.map(city => (
            <Link key={city.nameEn} href={`/${slug}/${city.nameEn}`}
              className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:border-orange-200 transition-all"
            >
              <div className="relative h-48 overflow-hidden">
                <img src={city.img} alt={city.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4">
                  <div className="text-white font-bold text-2xl">{city.name}</div>
                  <div className="text-white/70 text-sm">{city.desc}</div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex gap-1.5 flex-wrap mb-3">
                  {city.tags.map(tag => (
                    <span key={tag} className="text-xs bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full font-medium">#{tag}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">최저가 비교</span>
                  <span className="text-orange-500 font-semibold text-sm group-hover:translate-x-1 transition-transform inline-block">
                    보기 →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 여행 정보 가이드 */}
      {country.countryInfo && (
        <section className="bg-gray-50 py-14">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl font-bold mb-2">{country.name} 여행 정보</h2>
            <p className="text-gray-400 mb-8">출발 전 꼭 확인하세요</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                <div className="text-2xl mb-2">✈️</div>
                <div className="text-sm font-semibold text-gray-700 mb-1">직항 정보</div>
                <p className="text-xs text-gray-500 leading-relaxed">{country.countryInfo.flight}</p>
              </div>
              <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                <div className="text-2xl mb-2">💴</div>
                <div className="text-sm font-semibold text-gray-700 mb-1">통화 · 환율</div>
                <p className="text-xs text-gray-500 leading-relaxed">{country.countryInfo.currency}</p>
              </div>
              <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                <div className="text-2xl mb-2">🛂</div>
                <div className="text-sm font-semibold text-gray-700 mb-1">비자 정보</div>
                <p className="text-xs text-gray-500 leading-relaxed">{country.countryInfo.visa}</p>
              </div>
              <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                <div className="text-2xl mb-2">🌤️</div>
                <div className="text-sm font-semibold text-gray-700 mb-1">추천 시즌</div>
                <p className="text-xs text-gray-500 leading-relaxed">{country.countryInfo.bestSeason}</p>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">💡</span>
                <span className="font-semibold text-gray-700">{country.name} 여행 꿀팁</span>
              </div>
              <ul className="space-y-2">
                {country.countryInfo.tips.map((tip, i) => (
                  <li key={i} className="flex gap-2 text-sm text-gray-600">
                    <span className="text-orange-400 font-bold shrink-0">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 py-14">
        <div className="max-w-6xl mx-auto px-4 text-center text-white">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">{country.name} 아고다 특가 지금 확인</h2>
          <p className="text-white/80 mb-6">최대 7% 추가 할인 · 무료 취소 · 즉시 예약 확정</p>
          <a
            href={`https://www.agoda.com/search?country=${country.nameEn}&cid=1962399`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-orange-600 font-bold text-lg px-10 py-4 rounded-xl hover:bg-gray-100 transition-colors shadow-lg"
          >
            아고다 특가 보러가기
          </a>
        </div>
      </section>

      {/* 다른 국가 */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        <h2 className="text-2xl font-bold mb-6">다른 나라 호텔도 비교하기</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {COUNTRIES.filter(c => c.slug !== slug).map(c => (
            <Link key={c.slug} href={`/${c.slug}`}
              className="group relative rounded-xl overflow-hidden aspect-video"
            >
              <img src={c.img} alt={c.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-3">
                <div className="text-white font-bold text-lg">{c.name}</div>
                <div className="text-white/60 text-xs">{c.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
