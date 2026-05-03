import Link from "next/link";
import { notFound } from "next/navigation";
import { getCountryData, COUNTRIES } from "@/lib/destinations";
import { CITY_NAME_EN, COUNTRY_NAME_EN, tagEn } from "@/lib/i18n";
import { COUNTRY_DESC_EN, CITY_DESC_EN, COUNTRY_INFO_EN } from "@/lib/destinations-en";
import { breadcrumbJsonLd, ldJson } from "@/lib/jsonld";

export async function generateStaticParams() {
  return COUNTRIES.map(c => ({ country: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ country: string }> }) {
  const { country: slug } = await params;
  const country = getCountryData(slug);
  if (!country) return {};
  const name = COUNTRY_NAME_EN[slug] || country.nameEn;
  const info = COUNTRY_INFO_EN[slug];
  const cityList = COUNTRY_DESC_EN[slug] || '';
  const visaShort = info?.visa?.split('.')[0] || '';
  const seasonShort = info?.bestSeason?.split('.')[0] || '';
  const longDesc = `${name} hotels — compare ${country.cities.length} popular cities (${cityList}) at real-time Agoda lowest prices. ${visaShort}. ${seasonShort}. From 3-star budget to 5-star luxury, pool villas, ryokan, and resorts. Free cancellation, instant confirmation, up to 7% extra off.`;
  const shortDesc = `${name} hotels in ${country.cities.length} cities at the best Agoda prices. Free cancellation, instant confirmation, up to 7% extra off.`;

  return {
    title: `${name} Hotels — Compare Lowest Prices | Agoda Partner`,
    description: longDesc,
    openGraph: { title: `${name} Hotels — Compare Lowest Prices | Agoda Partner`, description: shortDesc, url: `https://coolstay.kr/en/${slug}` },
    twitter: { card: 'summary_large_image', title: `${name} Hotels — Lowest Prices`, description: shortDesc },
    alternates: {
      languages: {
        ko: `https://coolstay.kr/${slug}`,
        en: `https://coolstay.kr/en/${slug}`,
        'x-default': `https://coolstay.kr/${slug}`,
      },
    },
  };
}

export default async function EnCountryPage({ params }: { params: Promise<{ country: string }> }) {
  const { country: slug } = await params;
  const country = getCountryData(slug);
  if (!country) notFound();

  const name = COUNTRY_NAME_EN[slug] || country.nameEn;
  const desc = COUNTRY_DESC_EN[slug];
  const info = COUNTRY_INFO_EN[slug];

  const breadcrumb = breadcrumbJsonLd([
    { name: 'Home', url: 'https://coolstay.kr/en' },
    { name, url: `https://coolstay.kr/en/${slug}` },
  ]);

  return (
    <div>
      <script {...ldJson(breadcrumb)} />
      <section className="relative bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-25"
          style={{ backgroundImage: `url(${country.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        <div className="relative max-w-6xl mx-auto px-4 py-16 sm:py-24">
          <nav className="text-sm text-gray-400 mb-4">
            <Link href="/en" className="hover:text-white">Home</Link>
            <span className="mx-2">&gt;</span>
            <span className="text-white">{name}</span>
          </nav>
          <p className="text-orange-400 text-sm font-semibold tracking-widest mb-3 uppercase">{desc}</p>
          <h1 className="text-3xl sm:text-5xl font-bold mb-4">
            {name} Hotels — Lowest Prices
          </h1>
          <p className="text-gray-300 text-lg mb-8 max-w-xl">
            Compare {name} hotels at the best Agoda prices and book instantly
          </p>
          <a
            href={`https://www.agoda.com/search?country=${country.nameEn}&cid=1962399`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-orange-500 text-white text-lg px-8 py-4 rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-xl shadow-orange-500/30"
          >
            Search {name} Hotels on Agoda
          </a>
        </div>
      </section>

      {/* Cities */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        <h2 className="text-2xl font-bold mb-2">Popular Cities in {name}</h2>
        <p className="text-gray-400 mb-8">Pick a city to see hotel deals</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {country.cities.map(city => (
            <Link key={city.nameEn} href={`/en/${slug}/${city.nameEn}`}
              className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:border-orange-200 transition-all"
            >
              <div className="relative h-48 overflow-hidden">
                <img src={city.img} alt={CITY_NAME_EN[city.nameEn]}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4">
                  <div className="text-white font-bold text-2xl">{CITY_NAME_EN[city.nameEn] || city.nameEn}</div>
                  <div className="text-white/70 text-sm">{CITY_DESC_EN[city.nameEn] || city.desc}</div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex gap-1.5 flex-wrap mb-3">
                  {city.tags.map(tag => (
                    <span key={tag} className="text-xs bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full font-medium">#{tagEn(tag)}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Compare prices</span>
                  <span className="text-orange-500 font-semibold text-sm group-hover:translate-x-1 transition-transform inline-block">View →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Travel info */}
      {info && (
        <section className="bg-gray-50 py-14">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl font-bold mb-2">{name} Travel Info</h2>
            <p className="text-gray-400 mb-8">Essentials before you go</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                <div className="text-2xl mb-2">✈️</div>
                <div className="text-sm font-semibold text-gray-700 mb-1">Flight</div>
                <p className="text-xs text-gray-500 leading-relaxed">{info.flight}</p>
              </div>
              <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                <div className="text-2xl mb-2">💴</div>
                <div className="text-sm font-semibold text-gray-700 mb-1">Currency</div>
                <p className="text-xs text-gray-500 leading-relaxed">{info.currency}</p>
              </div>
              <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                <div className="text-2xl mb-2">🛂</div>
                <div className="text-sm font-semibold text-gray-700 mb-1">Visa</div>
                <p className="text-xs text-gray-500 leading-relaxed">{info.visa}</p>
              </div>
              <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                <div className="text-2xl mb-2">🌤️</div>
                <div className="text-sm font-semibold text-gray-700 mb-1">Best Season</div>
                <p className="text-xs text-gray-500 leading-relaxed">{info.bestSeason}</p>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">💡</span>
                <span className="font-semibold text-gray-700">{name} Travel Tips</span>
              </div>
              <ul className="space-y-2">
                {info.tips.map((tip, i) => (
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
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Check {name} Agoda Deals Now</h2>
          <p className="text-white/80 mb-6">Up to 7% extra off · Free cancellation · Instant confirmation</p>
          <a
            href={`https://www.agoda.com/search?country=${country.nameEn}&cid=1962399`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-orange-600 font-bold text-lg px-10 py-4 rounded-xl hover:bg-gray-100 transition-colors shadow-lg"
          >
            See Agoda Deals
          </a>
        </div>
      </section>

      {/* Other countries */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        <h2 className="text-2xl font-bold mb-6">Compare hotels in other countries</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {COUNTRIES.filter(c => c.slug !== slug).map(c => (
            <Link key={c.slug} href={`/en/${c.slug}`}
              className="group relative rounded-xl overflow-hidden aspect-video"
            >
              <img src={c.img} alt={COUNTRY_NAME_EN[c.slug]}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-3">
                <div className="text-white font-bold text-lg">{COUNTRY_NAME_EN[c.slug] || c.nameEn}</div>
                <div className="text-white/60 text-xs">{COUNTRY_DESC_EN[c.slug]}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
