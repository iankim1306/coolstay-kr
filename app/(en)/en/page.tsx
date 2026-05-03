import Link from "next/link";
import { COUNTRIES } from "@/lib/destinations";
import { CITY_NAME_EN, COUNTRY_NAME_EN, tagEn } from "@/lib/i18n";
import { COUNTRY_DESC_EN, CITY_DESC_EN } from "@/lib/destinations-en";
import { fetchCityHotDeals } from "@/lib/agoda-api";

export const revalidate = 21600;

const POPULAR_KEYWORDS = [
  { kw: 'Osaka Budget Hotels', href: '/en/japan/osaka' },
  { kw: 'Bangkok Rooftop Hotels', href: '/en/thailand/bangkok' },
  { kw: 'Da Nang Resorts', href: '/en/vietnam/danang' },
  { kw: 'Bali Pool Villas', href: '/en/indonesia/bali' },
  { kw: 'Tokyo Shinjuku Hotels', href: '/en/japan/tokyo' },
  { kw: 'Phuket Beach Resorts', href: '/en/thailand/phuket' },
  { kw: 'Cebu Snorkeling Resorts', href: '/en/philippines/cebu' },
  { kw: 'Kyoto Couple Ryokan', href: '/en/japan/kyoto' },
  { kw: 'Taipei Budget Stays', href: '/en/taiwan/taipei' },
  { kw: 'Boracay Pool Villa', href: '/en/philippines/boracay' },
  { kw: 'Chiang Mai Boutique', href: '/en/thailand/chiangmai' },
  { kw: 'Fukuoka Short Trip', href: '/en/japan/fukuoka' },
];

export default async function EnHomePage() {
  const allCities = COUNTRIES.flatMap(c => c.cities).slice(0, 8);

  // 4-city hot deals parallel fetch
  const [osakaDeals, tokyoDeals, bangkokDeals, baliDeals] = await Promise.all([
    fetchCityHotDeals(9590, 6).catch(() => []),
    fetchCityHotDeals(5085, 6).catch(() => []),
    fetchCityHotDeals(9395, 6).catch(() => []),
    fetchCityHotDeals(17193, 6).catch(() => []),
  ]);

  const hotDealCities = [
    { name: 'Osaka', slug: '/en/japan/osaka', deals: osakaDeals },
    { name: 'Tokyo', slug: '/en/japan/tokyo', deals: tokyoDeals },
    { name: 'Bangkok', slug: '/en/thailand/bangkok', deals: bangkokDeals },
    { name: 'Bali', slug: '/en/indonesia/bali', deals: baliDeals },
  ].filter(c => c.deals.length > 0);

  const fmt = (n: number) => Math.round(n).toLocaleString('en-US');

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1600&h=900&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        <div className="relative max-w-6xl mx-auto px-4 py-20 sm:py-28 text-center">
          <p className="text-orange-400 text-sm font-semibold tracking-widest mb-4 uppercase">
            JAPAN · SOUTHEAST ASIA · WORLDWIDE
          </p>
          <h1 className="text-4xl sm:text-6xl font-bold mb-5 leading-tight">
            Asia Hotels at<br />
            <span className="text-orange-400">the Lowest Price</span>
          </h1>
          <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto">
            Live Agoda deals on Osaka, Bangkok, Bali, and Da Nang — free cancellation, instant confirmation
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://www.agoda.com/?cid=1962399"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-orange-500 text-white text-lg px-8 py-4 rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-xl shadow-orange-500/30"
            >
              See All Agoda Deals
            </a>
            <a href="#hotdeals"
              className="bg-white/10 text-white text-lg px-8 py-4 rounded-xl font-bold hover:bg-white/20 transition-colors border border-white/20"
            >
              Today&apos;s Deals 🔥
            </a>
          </div>
          <div className="flex justify-center gap-8 mt-10 text-sm text-gray-400">
            <span className="flex items-center gap-1.5"><span className="text-green-400">✓</span> Best Price Guarantee</span>
            <span className="flex items-center gap-1.5"><span className="text-green-400">✓</span> Free Cancellation</span>
            <span className="flex items-center gap-1.5"><span className="text-green-400">✓</span> 2.9M+ Properties</span>
          </div>
        </div>
      </section>

      {/* Trust indicators */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-6 flex justify-center gap-10 sm:gap-20 text-center text-sm">
          {[
            { num: '2.9M+', label: 'Properties' },
            { num: '6+', label: 'Asian Countries' },
            { num: '7%', label: 'Max Discount' },
            { num: '4.8★', label: 'Avg. Rating' },
          ].map(item => (
            <div key={item.label}>
              <div className="text-2xl font-bold text-gray-900">{item.num}</div>
              <div className="text-gray-400">{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Hot deals (simple grid version, no tabs for English MVP) */}
      {hotDealCities.length > 0 && (
        <section id="hotdeals" className="max-w-6xl mx-auto px-4 py-14">
          <div className="mb-2">
            <h2 className="text-2xl font-bold">🔥 Today&apos;s Hot Deals</h2>
          </div>
          <p className="text-gray-400 mb-7">Real-time Agoda lowest prices · refreshed every 6 hours</p>
          <div className="space-y-10">
            {hotDealCities.map(city => (
              <div key={city.name}>
                <div className="flex justify-between items-end mb-4">
                  <h3 className="text-lg font-bold">{city.name}</h3>
                  <Link href={city.slug} className="text-sm text-orange-500 hover:underline">View all →</Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {city.deals.slice(0, 6).map((d: any) => (
                    <a key={d.hotelId} href={d.landingURL} target="_blank" rel="noopener noreferrer"
                      className="block bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-all">
                      {d.imageURL && (
                        <div className="h-32 overflow-hidden">
                          <img src={d.imageURL} alt={d.hotelName} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="p-3">
                        <div className="text-xs text-gray-500 line-clamp-1 mb-1">{d.hotelName}</div>
                        <div className="text-sm font-bold text-orange-600">${fmt((d.dailyRate || 0) * 0.00074)}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Countries */}
      <section id="destinations" className="max-w-6xl mx-auto px-4 py-14">
        <h2 className="text-2xl font-bold mb-2">Find Hotels by Country</h2>
        <p className="text-gray-400 mb-7">Compare lowest prices in popular destinations</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
          {COUNTRIES.map(country => (
            <Link key={country.slug} href={`/en/${country.slug}`}
              className="group relative rounded-2xl overflow-hidden aspect-video shadow-sm"
            >
              <img src={country.img} alt={COUNTRY_NAME_EN[country.slug]}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-4">
                <div className="text-white font-bold text-xl">{COUNTRY_NAME_EN[country.slug] || country.nameEn}</div>
                <div className="text-white/70 text-xs mt-0.5">{COUNTRY_DESC_EN[country.slug]}</div>
              </div>
              <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                View
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular cities */}
      <section className="bg-gray-50 py-14">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-2">Popular Cities</h2>
          <p className="text-gray-400 mb-7">Most-loved Asian destinations</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {allCities.map(city => (
              <Link key={city.nameEn} href={`/en/${city.countryEn}/${city.nameEn}`}
                className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg hover:border-orange-200 transition-all group"
              >
                <div className="relative h-32 overflow-hidden">
                  <img src={city.img} alt={CITY_NAME_EN[city.nameEn]}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-2 left-3 text-white font-bold text-sm">{CITY_NAME_EN[city.nameEn] || city.nameEn}</div>
                </div>
                <div className="p-3">
                  <p className="text-xs text-gray-400 line-clamp-1">{CITY_DESC_EN[city.nameEn] || city.desc}</p>
                  <div className="flex gap-1 flex-wrap mt-2">
                    {city.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="text-xs bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded">#{tagEn(tag)}</span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 py-14">
        <div className="max-w-6xl mx-auto px-4 text-center text-white">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Check Agoda Deals Now</h2>
          <p className="text-white/80 mb-6">Up to 7% extra off · Free cancellation · Instant confirmation</p>
          <a
            href="https://www.agoda.com/?cid=1962399"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-orange-600 font-bold text-lg px-10 py-4 rounded-xl hover:bg-gray-100 transition-colors shadow-lg"
          >
            See Agoda Deals
          </a>
        </div>
      </section>

      {/* Popular keywords */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        <h2 className="text-2xl font-bold mb-2">Popular Searches</h2>
        <p className="text-gray-400 mb-6">What other travelers are booking</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {POPULAR_KEYWORDS.map(p => (
            <Link key={p.kw} href={p.href}
              className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-4 hover:bg-orange-50 hover:border-orange-200 transition-colors"
            >
              <div className="font-medium text-sm text-gray-800">{p.kw}</div>
              <div className="text-xs text-orange-500 mt-1">View hotels →</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
