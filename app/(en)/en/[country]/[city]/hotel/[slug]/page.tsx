import Link from "next/link";
import { notFound } from "next/navigation";
import { getCityData, getCountryData } from "@/lib/destinations";
import { getHotel, getHotelsByCity, getAllHotels, hotelSlug, agodaHotelLink, hotelPhotoUrl } from "@/lib/hotels";
import { CITY_NAME_EN, COUNTRY_NAME_EN } from "@/lib/i18n";
import { CITY_TRAVEL_INFO_EN } from "@/lib/destinations-en";
import { breadcrumbJsonLd, hotelJsonLd, faqJsonLd, ldJson } from "@/lib/jsonld";

export async function generateStaticParams() {
  return getAllHotels().map(({ countrySlug, citySlug, hotel }) => ({
    country: countrySlug,
    city: citySlug,
    slug: hotelSlug(hotel),
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ country: string; city: string; slug: string }> }) {
  const { country, city, slug } = await params;
  const hotel = getHotel(country, city, slug);
  if (!hotel) return {};
  const cityName = CITY_NAME_EN[city] || city;
  return {
    title: `${hotel.name} — Compare Lowest Price | ${cityName} Hotels`,
    description: `${hotel.name} (${hotel.star_rating}-star). Live Agoda price for ${cityName}. ${hotel.address}. Rating ${hotel.rating_average}, ${hotel.number_of_reviews} reviews. Free cancellation, instant confirmation.`,
    alternates: {
      languages: {
        ko: `https://coolstay.kr/${country}/${city}/hotel/${slug}`,
        en: `https://coolstay.kr/en/${country}/${city}/hotel/${slug}`,
        'x-default': `https://coolstay.kr/${country}/${city}/hotel/${slug}`,
      },
    },
  };
}

export default async function EnHotelPage({ params }: { params: Promise<{ country: string; city: string; slug: string }> }) {
  const { country, city, slug } = await params;
  const hotel = getHotel(country, city, slug);
  const countryData = getCountryData(country);
  const cityData = getCityData(country, city);
  if (!hotel || !countryData || !cityData) notFound();

  const cityName = CITY_NAME_EN[city] || city;
  const countryName = COUNTRY_NAME_EN[country] || countryData.nameEn;
  const cityAttractions = CITY_TRAVEL_INFO_EN[city]?.attractions;

  const bookingUrl = agodaHotelLink(hotel.hotel_id);
  const rating = parseFloat(hotel.rating_average) || 0;
  const reviews = parseInt(hotel.number_of_reviews) || 0;
  const stars = parseInt(hotel.star_rating) || 0;

  const siblings = getHotelsByCity(country, city)
    .filter((h) => h.hotel_id !== hotel.hotel_id)
    .slice(0, 4);

  const breadcrumb = breadcrumbJsonLd([
    { name: 'Home', url: 'https://coolstay.kr/en' },
    { name: countryName, url: `https://coolstay.kr/en/${country}` },
    { name: cityName, url: `https://coolstay.kr/en/${country}/${city}` },
    { name: hotel.name, url: `https://coolstay.kr/en/${country}/${city}/hotel/${hotelSlug(hotel)}` },
  ]);
  const hotelLd = hotelJsonLd(hotel, country, city, cityName, countryName);
  const faq = faqJsonLd([
    { q: `Where can I find the lowest price for ${hotel.name}?`,
      a: `You can compare ${hotel.name}'s real-time lowest price on Agoda through COOLSTAY. Booking via our link can save you up to 7% extra.` },
    { q: `What are the check-in and check-out times at ${hotel.name}?`,
      a: `Check-in is ${hotel.checkin || 'after 3:00 PM'} and check-out is ${hotel.checkout || 'before 11:00 AM'}. Contact the hotel for early check-in or late check-out.` },
    { q: `Where is ${hotel.name} located?`,
      a: `${hotel.name} is at ${hotel.address}${hotel.zipcode ? `, ${hotel.zipcode}` : ''} (${cityName}). It is a ${stars ? `${stars}-star ` : ''}${hotel.accommodation_type}.` },
    { q: `Is free cancellation available?`,
      a: `Free cancellation policy depends on the rate plan you select. Use the "Free cancellation" filter on Agoda to find applicable rates.` },
  ]);

  // Amenity badges (parse overview_en)
  const text = ((hotel as any).overview_en || hotel.description_ko || '').toLowerCase();
  const amenities = [
    { keywords: ['pool', 'swimming'], icon: '🏊', label: 'Pool' },
    { keywords: ['breakfast', 'buffet'], icon: '🍳', label: 'Breakfast' },
    { keywords: ['gym', 'fitness'], icon: '💪', label: 'Fitness' },
    { keywords: ['spa', 'massage'], icon: '💆', label: 'Spa' },
    { keywords: ['wifi', 'wi-fi'], icon: '📶', label: 'Free Wi-Fi' },
    { keywords: ['parking'], icon: '🚗', label: 'Parking' },
    { keywords: ['airport', 'shuttle'], icon: '✈️', label: 'Airport Shuttle' },
    { keywords: ['restaurant', 'dining'], icon: '🍽️', label: 'Restaurant' },
    { keywords: ['bar', 'lounge'], icon: '🍸', label: 'Bar / Lounge' },
    { keywords: ['rooftop'], icon: '🌇', label: 'Rooftop' },
    { keywords: ['villa', 'private pool'], icon: '🏡', label: 'Pool Villa' },
    { keywords: ['ocean view', 'sea view', 'beach'], icon: '🌊', label: 'Ocean View' },
  ].filter(a => a.keywords.some(kw => text.includes(kw)));

  return (
    <div className="bg-white">
      <script {...ldJson(breadcrumb)} />
      <script {...ldJson(hotelLd)} />
      <script {...ldJson(faq)} />

      {/* Hero */}
      <section className="relative">
        <div className="sm:hidden relative">
          <div className="flex overflow-x-auto snap-x snap-mandatory h-72 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
            {hotel.photos.slice(0, 10).map((photo, i) => (
              <div key={i} className="relative flex-shrink-0 w-full h-full snap-center">
                <img src={hotelPhotoUrl(photo, 1024)} alt={`${hotel.name} ${i + 1}`} className="w-full h-full object-cover" />
                <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full font-medium">
                  {i + 1} / {Math.min(hotel.photos.length, 10)}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="hidden sm:grid grid-cols-4 gap-1 max-w-6xl mx-auto h-[440px]">
          <div className="col-span-2 relative overflow-hidden">
            {hotel.photos[0] && <img src={hotelPhotoUrl(hotel.photos[0], 1280)} alt={hotel.name} className="w-full h-full object-cover" />}
          </div>
          <div className="col-span-2 grid grid-cols-2 gap-1">
            {hotel.photos.slice(1, 5).map((photo, i) => (
              <div key={i} className="relative overflow-hidden">
                <img src={hotelPhotoUrl(photo, 800)} alt={`${hotel.name} ${i + 2}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <nav className="text-sm text-gray-500 mb-4">
          <Link href="/en" className="hover:text-orange-500">Home</Link>
          <span className="mx-2">&gt;</span>
          <Link href={`/en/${country}`} className="hover:text-orange-500">{countryName}</Link>
          <span className="mx-2">&gt;</span>
          <Link href={`/en/${country}/${city}`} className="hover:text-orange-500">{cityName}</Link>
          <span className="mx-2">&gt;</span>
          <span className="text-gray-700">{hotel.name}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-10">
          <div className="flex-1 min-w-0">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                {stars > 0 && (
                  <span className="text-orange-400 text-sm">
                    {'★'.repeat(stars)}
                    <span className="text-gray-200">{'★'.repeat(5 - stars)}</span>
                  </span>
                )}
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{hotel.accommodation_type}</span>
                {hotel.chain && <span className="text-xs bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full">{hotel.chain}</span>}
              </div>
              <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3">{hotel.name}</h1>
              <p className="text-gray-500 text-sm mb-4">📍 {hotel.address}, {hotel.city}{hotel.zipcode ? `, ${hotel.zipcode}` : ''}</p>

              {rating > 0 && (
                <div className="flex items-center gap-3 bg-gradient-to-r from-orange-50 to-white border border-orange-100 rounded-xl p-4">
                  <div className="bg-orange-500 text-white font-bold text-2xl rounded-xl w-16 h-16 flex items-center justify-center">{rating.toFixed(1)}</div>
                  <div>
                    <div className="font-semibold text-gray-800">
                      {rating >= 9 ? 'Exceptional' : rating >= 8 ? 'Excellent' : rating >= 7 ? 'Very Good' : 'Good'}
                    </div>
                    <div className="text-sm text-gray-500">From {reviews.toLocaleString()} verified guest reviews</div>
                  </div>
                </div>
              )}
            </div>

            {/* Amenities */}
            {amenities.length > 0 && (
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {amenities.map(a => (
                    <span key={a.label} className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-full border border-blue-100">
                      <span>{a.icon}</span>{a.label}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* About */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-3">About this Hotel</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {(hotel as any).overview_en || hotel.description_ko}
              </p>
            </div>

            {/* Basic Info */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-3">Hotel Information</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {hotel.checkin && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="text-xs text-gray-500 mb-1">Check-in</div>
                    <div className="font-semibold text-gray-800">{hotel.checkin}</div>
                  </div>
                )}
                {hotel.checkout && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="text-xs text-gray-500 mb-1">Check-out</div>
                    <div className="font-semibold text-gray-800">{hotel.checkout}</div>
                  </div>
                )}
                {hotel.rooms && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="text-xs text-gray-500 mb-1">Rooms</div>
                    <div className="font-semibold text-gray-800">{hotel.rooms}</div>
                  </div>
                )}
                {hotel.year_opened && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="text-xs text-gray-500 mb-1">Year Opened</div>
                    <div className="font-semibold text-gray-800">{hotel.year_opened}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Tips */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-3">{hotel.name} Booking Tips</h2>
              <div className="space-y-3">
                {[
                  { icon: '🗓️', tip: 'Book 2–3 months ahead for early-bird discounts' },
                  { icon: '🔍', tip: 'Use Agoda\'s "Free cancellation" filter' },
                  { icon: '💳', tip: 'Earn AgodaCash for discounts on your next stay' },
                  { icon: '📱', tip: 'Check Agoda app-only secret deals' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
                    <span className="text-xl">{item.icon}</span>
                    <p className="text-sm text-gray-600">{item.tip}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-3">{hotel.name} — Frequently Asked Questions</h2>
              <div className="space-y-3">
                {[
                  { q: `Where can I find the lowest price for ${hotel.name}?`,
                    a: `Compare ${hotel.name}'s live Agoda lowest price and free-cancellation rates here. Booking via COOLSTAY can save up to 7% extra.` },
                  { q: `What are the check-in and check-out times?`,
                    a: `Check-in is ${hotel.checkin || 'after 3:00 PM'} and check-out is ${hotel.checkout || 'before 11:00 AM'}. Contact the hotel for early check-in or late check-out requests.` },
                  { q: `Where is ${hotel.name} located?`,
                    a: `${hotel.name} is at ${hotel.address}${hotel.zipcode ? `, ${hotel.zipcode}` : ''} (${cityName}). It is a ${stars ? `${stars}-star ` : ''}${hotel.accommodation_type}.` },
                  { q: `Is free cancellation available?`,
                    a: `Free-cancellation policy depends on the rate plan. Use Agoda's "Free cancellation" filter to find applicable rates.` },
                ].map((item, i) => (
                  <details key={i} className="bg-gray-50 rounded-xl p-4 group">
                    <summary className="font-semibold text-gray-800 cursor-pointer list-none flex justify-between items-center">
                      <span>Q. {item.q}</span>
                      <span className="text-orange-500 group-open:rotate-180 transition-transform">▾</span>
                    </summary>
                    <p className="text-sm text-gray-600 mt-3 leading-relaxed">{item.a}</p>
                  </details>
                ))}
              </div>
            </div>

            {/* Attractions */}
            {cityAttractions && cityAttractions.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-3">📍 Top Attractions in {cityName}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {cityAttractions.map((attr, i) => (
                    <div key={i} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                      <div className="font-semibold text-gray-800 text-sm mb-1">{attr.name}</div>
                      <p className="text-xs text-gray-500 mb-2">{attr.desc}</p>
                      <span className="text-xs bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full font-medium">🚶 {attr.distance}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Siblings */}
            {siblings.length > 0 && (
              <div>
                <h2 className="text-xl font-bold mb-3">Other Top Hotels in {cityName}</h2>
                <div className="grid grid-cols-2 gap-4">
                  {siblings.map((h) => (
                    <Link key={h.hotel_id} href={`/en/${country}/${city}/hotel/${hotelSlug(h)}`}
                      className="group bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg hover:border-orange-200 transition-all">
                      {h.photos[0] && (
                        <div className="h-36 overflow-hidden">
                          <img src={hotelPhotoUrl(h.photos[0], 600)} alt={h.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                      )}
                      <div className="p-3">
                        <div className="text-sm font-semibold text-gray-800 line-clamp-2 mb-1">{h.name}</div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-orange-500 font-bold">{parseFloat(h.rating_average).toFixed(1)}</span>
                          <span className="text-gray-400">{parseInt(h.number_of_reviews).toLocaleString()} reviews</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="sticky top-20 space-y-4">
              <div className="bg-white border-2 border-orange-200 rounded-2xl p-6 shadow-lg">
                <p className="text-sm font-bold text-gray-800 mb-1 text-center">Lowest Price on Agoda</p>
                <p className="text-xs text-gray-400 mb-4 text-center">Real-time price comparison</p>
                <a href={bookingUrl} target="_blank" rel="noopener noreferrer"
                  className="block w-full bg-orange-500 text-white text-center py-4 rounded-xl font-bold text-lg hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/30 mb-3">
                  Check Lowest Price
                </a>
                <ul className="space-y-2 text-xs text-gray-500">
                  <li className="flex items-center gap-2"><span className="text-green-500 font-bold">✓</span> Up to 7% extra off</li>
                  <li className="flex items-center gap-2"><span className="text-green-500 font-bold">✓</span> Free cancellation</li>
                  <li className="flex items-center gap-2"><span className="text-green-500 font-bold">✓</span> Instant confirmation</li>
                </ul>
              </div>

              <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 text-sm text-gray-600 space-y-2">
                <p className="font-semibold text-gray-800 text-sm">Why Agoda?</p>
                <p className="text-xs leading-relaxed">Agoda is Asia&apos;s leading hotel booking platform, offering exclusive deals and instant confirmation for travelers worldwide.</p>
                <ul className="text-xs space-y-1 text-gray-500">
                  <li>✓ Earn AgodaCash for future bookings</li>
                  <li>✓ Free-cancellation rate filter</li>
                  <li>✓ 24/7 multilingual customer support</li>
                </ul>
              </div>

              <Link href={`/en/${country}/${city}`}
                className="block text-center bg-gray-100 rounded-xl py-3 text-sm text-gray-600 hover:bg-gray-200 transition-colors">
                ← Back to all {cityName} hotels
              </Link>
            </div>
          </div>
        </div>
      </div>

      <section className="bg-gradient-to-r from-orange-500 to-orange-600 py-12 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-white">
          <h2 className="text-xl sm:text-2xl font-bold mb-2">Book {hotel.name} at the Lowest Price</h2>
          <p className="text-white/80 text-sm mb-5">Live deals · Free cancellation · Instant confirmation</p>
          <a href={bookingUrl} target="_blank" rel="noopener noreferrer"
            className="inline-block bg-white text-orange-600 font-bold text-base px-8 py-3 rounded-xl hover:bg-gray-100 transition-colors">
            Book Now
          </a>
        </div>
      </section>
    </div>
  );
}
