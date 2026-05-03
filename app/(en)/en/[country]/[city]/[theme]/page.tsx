import Link from "next/link";
import { notFound } from "next/navigation";
import { getCityData, getCountryData } from "@/lib/destinations";
import { hotelSlug, hotelPhotoUrl, agodaHotelLink } from "@/lib/hotels";
import { getTheme, getThemedHotels, getAllThemeCombos, getAvailableThemes, THEMES } from "@/lib/themes";
import { CITY_NAME_EN, COUNTRY_NAME_EN } from "@/lib/i18n";
import { breadcrumbJsonLd, itemListJsonLd, ldJson } from "@/lib/jsonld";

export async function generateStaticParams() {
  return getAllThemeCombos().map(({ countrySlug, citySlug, theme }) => ({
    country: countrySlug,
    city: citySlug,
    theme: theme.slug,
  }));
}

const THEME_LABEL_EN: Record<string, { label: string; keyword: string; intro: (c: string) => string }> = {
  '5-star':    { label: '5-Star Hotels',  keyword: '5-Star Hotels',  intro: (c) => `Top-rated 5-star luxury hotels in ${c}, ranked by real guest reviews. Compare live Agoda lowest prices in one place.` },
  '4-star':    { label: '4-Star Hotels',  keyword: '4-Star Hotels',  intro: (c) => `${c}'s best 4-star hotels with strong value and ratings. Great for business, family, and leisure travel.` },
  luxury:      { label: 'Luxury Hotels',  keyword: 'Luxury Hotels',  intro: (c) => `${c}'s most luxurious 5-star hotels — only signature properties with 8.5+ ratings.` },
  family:      { label: 'Family Hotels',  keyword: 'Family Hotels',  intro: (c) => `Family-friendly hotels and resorts in ${c} with spacious rooms and great amenities.` },
  budget:      { label: 'Budget Hotels',  keyword: 'Budget Hotels',  intro: (c) => `Affordable hotels in ${c} with verified 7.5+ ratings. Great value for money.` },
  resort:      { label: 'Resorts',        keyword: 'Resorts',        intro: (c) => `Resort properties in ${c} with pools, gardens, and beachfront access. Perfect for vacations.` },
  boutique:    { label: 'Boutique Hotels',keyword: 'Boutique Hotels',intro: (c) => `Stylish boutique hotels in ${c} with unique design and intimate atmosphere.` },
  onsen:       { label: 'Onsen Hotels',   keyword: 'Onsen / Ryokan', intro: (c) => `Hot spring (onsen) and ryokan accommodations in ${c} for a traditional Japanese experience.` },
  'ocean-view':{ label: 'Ocean View',     keyword: 'Ocean View Hotels', intro: (c) => `${c} hotels with ocean views from rooms or lobby. Curated for travelers seeking the sea.` },
  rooftop:     { label: 'Rooftop Hotels', keyword: 'Rooftop Hotels', intro: (c) => `${c} hotels with rooftop bars or infinity pools. Best for couples and atmosphere lovers.` },
};

export async function generateMetadata({ params }: { params: Promise<{ country: string; city: string; theme: string }> }) {
  const { country, city, theme: themeSlug } = await params;
  const theme = getTheme(themeSlug);
  const cityData = getCityData(country, city);
  const countryData = getCountryData(country);
  if (!theme || !cityData || !countryData) return {};
  const cityName = CITY_NAME_EN[city] || city;
  const tEn = THEME_LABEL_EN[themeSlug];
  const keyword = tEn?.keyword || theme.label;
  const longDesc = `Top 10 ${keyword} in ${cityName}, ${countryData.nameEn} — handpicked from real guest reviews (8.0+ ratings only). Compare live Agoda lowest prices in one place. Free cancellation, instant booking confirmation, up to 7% extra off. Curated for couples, families, honeymooners, and solo travelers.`;
  const shortDesc = `Top 10 ${keyword} in ${cityName} — verified 8.0+ ratings, live Agoda prices. Free cancellation, instant confirmation.`;

  return {
    title: `${cityName} ${keyword} TOP 10 | COOLSTAY`,
    description: longDesc,
    openGraph: { title: `${cityName} ${keyword} TOP 10`, description: shortDesc, url: `https://coolstay.kr/en/${country}/${city}/${themeSlug}`, images: [cityData.img] },
    twitter: { card: 'summary_large_image', title: `${cityName} ${keyword} TOP 10`, description: shortDesc, images: [cityData.img] },
    alternates: {
      canonical: `https://coolstay.kr/en/${country}/${city}/${themeSlug}`,
      languages: {
        ko: `https://coolstay.kr/${country}/${city}/${themeSlug}`,
        en: `https://coolstay.kr/en/${country}/${city}/${themeSlug}`,
        'x-default': `https://coolstay.kr/${country}/${city}/${themeSlug}`,
      },
    },
  };
}

export default async function EnThemePage({ params }: { params: Promise<{ country: string; city: string; theme: string }> }) {
  const { country, city, theme: themeSlug } = await params;
  const theme = getTheme(themeSlug);
  const countryData = getCountryData(country);
  const cityData = getCityData(country, city);
  if (!theme || !countryData || !cityData) notFound();

  const hotels = getThemedHotels(country, city, theme, 10);
  if (hotels.length < 3) notFound();

  const cityName = CITY_NAME_EN[city] || city;
  const countryName = COUNTRY_NAME_EN[country] || countryData.nameEn;
  const tEn = THEME_LABEL_EN[themeSlug] || { label: theme.label, keyword: theme.keyword, intro: (c: string) => `Top hotels in ${c}.` };
  const otherThemes = getAvailableThemes(country, city).filter((t) => t.slug !== theme.slug);

  const pageUrl = `https://coolstay.kr/en/${country}/${city}/${themeSlug}`;
  const breadcrumb = breadcrumbJsonLd([
    { name: 'Home', url: 'https://coolstay.kr/en' },
    { name: countryName, url: `https://coolstay.kr/en/${country}` },
    { name: cityName, url: `https://coolstay.kr/en/${country}/${city}` },
    { name: `${cityName} ${tEn.label}`, url: pageUrl },
  ]);
  const itemList = itemListJsonLd(hotels, country, city, pageUrl, `${cityName} ${tEn.keyword} TOP ${hotels.length}`);

  return (
    <div className="bg-white">
      <script {...ldJson(breadcrumb)} />
      <script {...ldJson(itemList)} />
      <section className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-12 sm:py-16">
          <nav className="text-sm text-white/70 mb-4">
            <Link href="/en" className="hover:text-white">Home</Link>
            <span className="mx-2">&gt;</span>
            <Link href={`/en/${country}`} className="hover:text-white">{countryName}</Link>
            <span className="mx-2">&gt;</span>
            <Link href={`/en/${country}/${city}`} className="hover:text-white">{cityName}</Link>
            <span className="mx-2">&gt;</span>
            <span className="text-white">{tEn.label}</span>
          </nav>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">{theme.emoji}</span>
            <h1 className="text-3xl sm:text-4xl font-bold">{cityName} {tEn.keyword} TOP {hotels.length}</h1>
          </div>
          <p className="text-white/90 text-base leading-relaxed max-w-3xl">{tEn.intro(cityName)}</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {otherThemes.length > 0 && (
          <div className="mb-8">
            <p className="text-xs text-gray-400 mb-2">Browse other themes</p>
            <div className="flex flex-wrap gap-2">
              {otherThemes.map((t) => (
                <Link key={t.slug} href={`/en/${country}/${city}/${t.slug}`}
                  className="text-sm bg-gray-50 hover:bg-orange-50 hover:text-orange-600 border border-gray-200 hover:border-orange-200 rounded-full px-4 py-1.5 transition-colors">
                  <span className="mr-1">{t.emoji}</span>{cityName} {THEME_LABEL_EN[t.slug]?.label || t.label}
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
            return (
              <article key={h.hotel_id} className="flex flex-col sm:flex-row bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg hover:border-orange-200 transition-all">
                <Link href={`/en/${country}/${city}/hotel/${hotelSlug(h)}`}
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
                          {'★'.repeat(stars)}<span className="text-gray-200">{'★'.repeat(5 - stars)}</span>
                        </span>
                      )}
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{h.accommodation_type}</span>
                    </div>
                    <Link href={`/en/${country}/${city}/hotel/${hotelSlug(h)}`} className="block">
                      <h2 className="text-lg sm:text-xl font-bold text-gray-900 hover:text-orange-500 transition-colors line-clamp-2">{h.name}</h2>
                    </Link>
                    <p className="text-xs text-gray-500 mt-1 mb-2 line-clamp-1">📍 {h.address}</p>
                    <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{(h as any).overview_en || h.description_ko}</p>
                  </div>
                  <div className="sm:w-40 flex-shrink-0 flex sm:flex-col items-end sm:items-stretch gap-3 justify-between">
                    {rating > 0 && (
                      <div className="text-right sm:text-center bg-orange-50 rounded-xl px-3 py-2 border border-orange-100">
                        <div className="text-xl font-bold text-orange-600">{rating.toFixed(1)}</div>
                        <div className="text-[10px] text-gray-500">{reviews.toLocaleString()} reviews</div>
                      </div>
                    )}
                    <a href={agodaHotelLink(h.hotel_id)} target="_blank" rel="noopener noreferrer"
                      className="bg-orange-500 hover:bg-orange-600 text-white text-center text-sm font-bold px-4 py-2.5 rounded-xl transition-colors shadow-sm shadow-orange-500/30 whitespace-nowrap">
                      Check Price
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-10 bg-gray-50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-2">Tips for choosing {cityName} {tEn.keyword}</h2>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>✔ Hotels with ratings <b>8.0+</b> are unlikely to disappoint.</li>
            <li>✔ More reviews = more reliable rating.</li>
            <li>✔ Filter Agoda&apos;s <b>Free cancellation</b> rates for flexibility.</li>
            <li>✔ Book 2–3 months ahead for early-bird discounts.</li>
          </ul>
        </div>

        <div className="mt-10">
          <h2 className="text-lg font-bold text-gray-800 mb-3">Other {cityName} themes</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {THEMES.filter((t) => t.slug !== theme.slug).map((t) => (
              <Link key={t.slug} href={`/en/${country}/${city}/${t.slug}`}
                className="bg-white border border-gray-100 hover:border-orange-200 hover:shadow rounded-xl p-4 transition-all">
                <div className="text-2xl mb-1">{t.emoji}</div>
                <div className="text-sm font-semibold text-gray-800">{cityName} {THEME_LABEL_EN[t.slug]?.label || t.label}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
