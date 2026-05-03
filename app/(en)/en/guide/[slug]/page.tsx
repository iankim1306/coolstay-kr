import Link from "next/link";
import { notFound } from "next/navigation";
import { getGuide, GUIDES } from "@/lib/guides";
import { getCityData } from "@/lib/destinations";
import { getHotelsByCity, hotelSlug, hotelPhotoUrl } from "@/lib/hotels";
import { CITY_NAME_EN } from "@/lib/i18n";
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
      canonical: `https://coolstay.kr/en/guide/${slug}`,
      languages: {
        ko: `https://coolstay.kr/guide/${slug}`,
        en: `https://coolstay.kr/en/guide/${slug}`,
        'x-default': `https://coolstay.kr/en/guide/${slug}`,
      },
    },
  };
}

export default async function EnGuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const city = getCityData(guide.countryKey, guide.cityKey);
  const cityName = CITY_NAME_EN[guide.cityKey] || guide.cityKey;
  const topHotels = getHotelsByCity(guide.countryKey, guide.cityKey).slice(0, 5);

  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: "https://coolstay.kr/en" },
    { name: "Travel Guides", url: "https://coolstay.kr/en/guide" },
    { name: guide.h1, url: `https://coolstay.kr/en/guide/${slug}` },
  ]);

  const faqLd = faqJsonLd(guide.faq);

  return (
    <article className="bg-white">
      <script {...ldJson(breadcrumb)} />
      <script {...ldJson(faqLd)} />

      <section className="relative bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-white overflow-hidden">
        {city && (
          <div className="absolute inset-0 opacity-25"
            style={{ backgroundImage: `url(${city.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          />
        )}
        <div className="relative max-w-4xl mx-auto px-4 py-16 sm:py-24">
          <nav className="text-sm text-gray-400 mb-4">
            <Link href="/en" className="hover:text-white">Home</Link>
            <span className="mx-2">&gt;</span>
            <Link href="/en/guide" className="hover:text-white">Travel Guides</Link>
          </nav>
          <p className="text-orange-400 text-sm font-semibold tracking-widest mb-3 uppercase">Complete Guide</p>
          <h1 className="text-3xl sm:text-5xl font-bold mb-4 leading-tight">{guide.h1}</h1>
          <p className="text-gray-300 text-base leading-relaxed">{guide.intro}</p>
          <div className="mt-6 flex items-center gap-4 text-xs text-gray-400">
            <span>📅 Last updated: {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long' }).format(new Date())}</span>
            <span>•</span>
            <span>📖 {Math.ceil((guide.intro.length + guide.sections.reduce((sum, s) => sum + s.content.length, 0)) / 500)} min read</span>
          </div>
        </div>
      </section>

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

        {city && topHotels.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Top 5 Hotels in {cityName}</h2>
            <p className="text-gray-500 text-sm mb-6">Ranked by Agoda rating + review count</p>
            <div className="space-y-3">
              {topHotels.map((h, i) => (
                <Link key={h.hotel_id} href={`/en/${guide.countryKey}/${guide.cityKey}/hotel/${hotelSlug(h)}`}
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
            <div className="mt-4 text-center">
              <Link href={`/en/${guide.countryKey}/${guide.cityKey}`}
                className="inline-block text-sm text-orange-500 hover:text-orange-600 font-semibold">
                See all {cityName} hotels →
              </Link>
            </div>
          </section>
        )}

        <section className="mt-12 bg-orange-50 border border-orange-100 rounded-2xl p-6">
          <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
            <span className="text-xl">🌤️</span>Best Season to Visit
          </h3>
          <p className="text-sm text-gray-700 leading-relaxed">{guide.bestSeasonNote}</p>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
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

        <section className="mt-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 text-center text-white">
          <h3 className="text-xl font-bold mb-2">Compare {cityName} hotels at the lowest Agoda price</h3>
          <p className="text-white/80 text-sm mb-4">Real-time prices · free cancellation · instant confirmation</p>
          <Link href={`/en/${guide.countryKey}/${guide.cityKey}`}
            className="inline-block bg-white text-orange-600 font-bold px-8 py-3 rounded-xl hover:bg-gray-100 transition-colors">
            View {cityName} Hotels
          </Link>
        </section>
      </div>
    </article>
  );
}
