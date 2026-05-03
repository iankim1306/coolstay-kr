import Link from "next/link";
import { notFound } from "next/navigation";
import { getCityData, getCountryData, COUNTRIES } from "@/lib/destinations";
import { getHotelsByCity, hotelSlug, hotelPhotoUrl } from "@/lib/hotels";
import { getAvailableThemes } from "@/lib/themes";
import { CITY_NAME_EN, COUNTRY_NAME_EN, tagEn } from "@/lib/i18n";
import { CITY_DESC_EN, CITY_TRAVEL_INFO_EN } from "@/lib/destinations-en";
import { breadcrumbJsonLd, ldJson } from "@/lib/jsonld";

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
  const name = CITY_NAME_EN[citySlug] || city.nameEn;
  const desc = CITY_DESC_EN[citySlug] || city.desc;
  return {
    title: `${name} Hotels — Lowest Prices on Agoda`,
    description: `Compare ${name} hotels at the lowest Agoda prices. ${desc}. Free cancellation, instant confirmation.`,
    alternates: {
      languages: {
        ko: `https://coolstay.kr/${countrySlug}/${citySlug}`,
        en: `https://coolstay.kr/en/${countrySlug}/${citySlug}`,
        'x-default': `https://coolstay.kr/${countrySlug}/${citySlug}`,
      },
    },
  };
}

const THEME_LABEL_EN: Record<string, string> = {
  '5-star': '5-Star', '4-star': '4-Star', luxury: 'Luxury', family: 'Family',
  budget: 'Budget', resort: 'Resort', boutique: 'Boutique', onsen: 'Onsen',
  'ocean-view': 'Ocean View', rooftop: 'Rooftop',
};

const THEME_EMOJI: Record<string, string> = {
  '5-star': '⭐', '4-star': '✨', luxury: '💎', family: '👨‍👩‍👧',
  budget: '💰', resort: '🏖️', boutique: '🎨', onsen: '♨️',
  'ocean-view': '🌊', rooftop: '🌇',
};

export default async function EnCityPage({ params }: { params: Promise<{ country: string; city: string }> }) {
  const { country: countrySlug, city: citySlug } = await params;
  const city = getCityData(countrySlug, citySlug);
  const country = getCountryData(countrySlug);
  if (!city || !country) notFound();

  const name = CITY_NAME_EN[citySlug] || city.nameEn;
  const countryName = COUNTRY_NAME_EN[countrySlug] || country.nameEn;
  const desc = CITY_DESC_EN[citySlug] || city.desc;
  const info = CITY_TRAVEL_INFO_EN[citySlug];

  const topHotels = getHotelsByCity(countrySlug, citySlug).slice(0, 10);
  const availableThemes = getAvailableThemes(countrySlug, citySlug);

  const breadcrumb = breadcrumbJsonLd([
    { name: 'Home', url: 'https://coolstay.kr/en' },
    { name: countryName, url: `https://coolstay.kr/en/${countrySlug}` },
    { name, url: `https://coolstay.kr/en/${countrySlug}/${citySlug}` },
  ]);

  return (
    <div>
      <script {...ldJson(breadcrumb)} />
      <section className="relative bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-30"
          style={{ backgroundImage: `url(${city.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        <div className="relative max-w-6xl mx-auto px-4 py-16 sm:py-24">
          <nav className="text-sm text-gray-400 mb-4">
            <Link href="/en" className="hover:text-white">Home</Link>
            <span className="mx-2">&gt;</span>
            <Link href={`/en/${countrySlug}`} className="hover:text-white">{countryName}</Link>
            <span className="mx-2">&gt;</span>
            <span className="text-white">{name}</span>
          </nav>
          <h1 className="text-3xl sm:text-5xl font-bold mb-3">{name} Hotels — Lowest Prices</h1>
          <p className="text-gray-300 text-lg mb-4">{desc}</p>
          <div className="flex gap-2 flex-wrap mb-8">
            {city.tags.map(tag => (
              <span key={tag} className="bg-white/10 text-white text-sm px-3 py-1 rounded-full border border-white/20">#{tagEn(tag)}</span>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <a href={city.agodaLink} target="_blank" rel="noopener noreferrer"
              className="inline-block bg-orange-500 text-white text-lg px-8 py-4 rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-xl shadow-orange-500/30">
              Check Agoda Lowest Price
            </a>
            <a href={`https://www.agoda.com/search?city=${city.agodaCityId}&cid=1962399`} target="_blank" rel="noopener noreferrer"
              className="inline-block bg-white/10 text-white text-lg px-8 py-4 rounded-xl font-bold hover:bg-white/20 transition-colors border border-white/20">
              Search by Date
            </a>
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-5 flex justify-center gap-8 sm:gap-16 text-center text-sm">
          {[
            { num: 'Up to 7%', label: 'Extra Off' },
            { num: 'Free', label: 'Cancellation' },
            { num: 'Instant', label: 'Confirmation' },
            { num: '4.8★', label: 'Avg. Rating' },
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
          <div className="flex-1">
            <img src={city.img} alt={`${name} hotels`} className="w-full rounded-2xl mb-8 h-72 object-cover" />

            {/* Themes */}
            {availableThemes.length > 0 && (
              <div className="mb-10">
                <h2 className="text-xl font-bold mb-4">{name} Top 10 Hotels by Theme</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {availableThemes.map(t => (
                    <Link key={t.slug} href={`/en/${countrySlug}/${citySlug}/${t.slug}`}
                      className="group flex items-center gap-3 bg-white border border-gray-100 rounded-xl p-4 hover:border-orange-200 hover:shadow transition-all">
                      <span className="text-2xl">{THEME_EMOJI[t.slug] || '🏨'}</span>
                      <div className="min-w-0">
                        <div className="font-semibold text-sm text-gray-800 line-clamp-1">{name} {THEME_LABEL_EN[t.slug] || t.label}</div>
                        <div className="text-xs text-orange-500 group-hover:translate-x-1 transition-transform">View Top 10 →</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Top Hotels */}
            {topHotels.length > 0 && (
              <div className="mb-10">
                <h2 className="text-xl font-bold mb-4">{name} Top 10 Popular Hotels</h2>
                <div className="space-y-3">
                  {topHotels.map((h, i) => (
                    <Link key={h.hotel_id} href={`/en/${countrySlug}/${citySlug}/hotel/${hotelSlug(h)}`}
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
                          <span className="text-gray-400">{parseInt(h.number_of_reviews).toLocaleString()} reviews</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Travel Info */}
            {info && (
              <div className="mb-10">
                <h2 className="text-xl font-bold mb-5">{name} Travel Info</h2>
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-2"><span className="text-xl">✈️</span><h3 className="font-bold text-gray-800">Airport → City</h3></div>
                    <p className="text-sm text-gray-600 leading-relaxed">{info.airport}</p>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-2"><span className="text-xl">🌤️</span><h3 className="font-bold text-gray-800">Best Season</h3></div>
                    <p className="text-sm text-gray-600 leading-relaxed">{info.bestSeason}</p>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-3"><span className="text-xl">🏨</span><h3 className="font-bold text-gray-800">Hotel Areas</h3></div>
                    <div className="space-y-3">
                      {info.areas.map(area => (
                        <div key={area.name} className="flex gap-3">
                          <span className="text-orange-500 font-bold text-sm whitespace-nowrap mt-0.5">{area.name}</span>
                          <p className="text-sm text-gray-600">{area.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100">
                    <div className="flex items-center gap-2 mb-2"><span className="text-xl">💰</span><h3 className="font-bold text-gray-800">Average Price</h3></div>
                    <p className="text-sm text-gray-600 leading-relaxed">{info.avgPrice}</p>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-3"><span className="text-xl">💡</span><h3 className="font-bold text-gray-800">Traveler Tips</h3></div>
                    <ul className="space-y-2">
                      {info.tips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="text-orange-400 font-bold mt-0.5 flex-shrink-0">·</span>{tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="sticky top-20 space-y-4">
              <div className="bg-white border-2 border-orange-200 rounded-2xl p-6 shadow-lg">
                <div className="text-center mb-5">
                  <p className="text-sm font-bold text-gray-800 mb-1">{name} Lowest Price</p>
                  <p className="text-xs text-gray-400">Real-time price comparison</p>
                </div>
                <a href={city.agodaLink} target="_blank" rel="noopener noreferrer"
                  className="block w-full bg-orange-500 text-white text-center py-4 rounded-xl font-bold text-lg hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/30 mb-3">
                  Check Lowest Price
                </a>
                <ul className="space-y-2 text-xs text-gray-500">
                  <li className="flex items-center gap-2"><span className="text-green-500 font-bold">✓</span> Up to 7% extra off</li>
                  <li className="flex items-center gap-2"><span className="text-green-500 font-bold">✓</span> Free cancellation</li>
                  <li className="flex items-center gap-2"><span className="text-green-500 font-bold">✓</span> Instant confirmation</li>
                  <li className="flex items-center gap-2"><span className="text-green-500 font-bold">✓</span> No booking fees</li>
                </ul>
              </div>

              {country.cities.filter(c => c.nameEn !== citySlug).length > 0 && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-sm text-gray-700 mb-3">Other Cities in {countryName}</h3>
                  <div className="space-y-2">
                    {country.cities.filter(c => c.nameEn !== citySlug).map(c => (
                      <Link key={c.nameEn} href={`/en/${countrySlug}/${c.nameEn}`}
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-orange-500 transition-colors">
                        <span>→</span> {CITY_NAME_EN[c.nameEn] || c.nameEn} Hotels
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <Link href={`/en/${countrySlug}`}
                className="block text-center bg-gray-100 rounded-xl py-3 text-sm text-gray-600 hover:bg-gray-200 transition-colors">
                View all {countryName} cities →
              </Link>
            </div>
          </div>
        </div>
      </div>

      <section className="bg-gradient-to-r from-orange-500 to-orange-600 py-14">
        <div className="max-w-6xl mx-auto px-4 text-center text-white">
          <h2 className="text-2xl font-bold mb-2">{name} hotels — best price on Agoda</h2>
          <p className="text-white/80 mb-6">Book now and save up to 7% extra</p>
          <a href={city.agodaLink} target="_blank" rel="noopener noreferrer"
            className="inline-block bg-white text-orange-600 font-bold text-lg px-10 py-4 rounded-xl hover:bg-gray-100 transition-colors">
            View {name} Hotels on Agoda
          </a>
        </div>
      </section>
    </div>
  );
}
