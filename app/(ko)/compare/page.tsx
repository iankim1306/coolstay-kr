import Link from "next/link";
import { getAllHotels, hotelPhotoUrl, hotelSlug, agodaHotelLink } from "@/lib/hotels";

export const metadata = {
  title: "호텔 비교 도구 — 한 번에 4개까지 비교 | 쿨스테이",
  description: "여러 호텔을 한 화면에서 비교하세요. 가격·평점·리뷰 수·별점·편의시설을 표로 한눈에.",
};

interface CompareSearchParams {
  ids?: string;
}

export default async function ComparePage({ searchParams }: { searchParams: Promise<CompareSearchParams> }) {
  const sp = await searchParams;
  const idList = (sp.ids || '').split(',').filter(Boolean).slice(0, 4);

  const allHotels = getAllHotels();
  const hotels = idList
    .map(id => allHotels.find(h => h.hotel.hotel_id === id))
    .filter((h): h is { countrySlug: string; citySlug: string; hotel: typeof allHotels[number]['hotel'] } => h !== undefined);

  if (hotels.length === 0) {
    return (
      <div className="bg-white">
        <section className="bg-gradient-to-br from-gray-900 to-slate-800 text-white">
          <div className="max-w-6xl mx-auto px-4 py-16">
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">호텔 비교 도구</h1>
            <p className="text-gray-300">최대 4개 호텔을 한 화면에서 비교하세요.</p>
          </div>
        </section>
        <div className="max-w-3xl mx-auto px-4 py-12 text-center">
          <p className="text-gray-500 mb-6">비교할 호텔이 선택되지 않았습니다.</p>
          <p className="text-sm text-gray-400 mb-8">호텔 페이지나 도시 페이지에서 "비교 추가" 버튼을 눌러 호텔을 선택할 수 있습니다.</p>
          <Link href="/" className="inline-block bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-600">
            홈으로 가기
          </Link>
        </div>
      </div>
    );
  }

  // 비교 가능한 속성
  const rows = [
    { label: '평점', key: 'rating' },
    { label: '리뷰 수', key: 'reviews' },
    { label: '별점', key: 'stars' },
    { label: '시작가 (USD)', key: 'price' },
    { label: '체크인', key: 'checkin' },
    { label: '체크아웃', key: 'checkout' },
    { label: '객실 수', key: 'rooms' },
    { label: '개장 연도', key: 'opened' },
    { label: '주소', key: 'address' },
  ];

  return (
    <div className="bg-white">
      <section className="bg-gradient-to-br from-gray-900 to-slate-800 text-white">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <Link href="/" className="text-sm text-gray-400 hover:text-white">← 홈</Link>
          <h1 className="text-2xl sm:text-3xl font-bold mt-3 mb-2">호텔 비교 ({hotels.length}개)</h1>
          <p className="text-gray-300 text-sm">평점·가격·편의시설을 한눈에 비교하세요</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-8 overflow-x-auto">
        <table className="w-full border-collapse min-w-[700px]">
          <thead>
            <tr>
              <th className="text-left p-3 border-b border-gray-200 bg-gray-50 text-sm font-semibold w-32 sticky left-0 bg-gray-50 z-10">항목</th>
              {hotels.map(({ hotel, countrySlug, citySlug }) => (
                <th key={hotel.hotel_id} className="text-center p-3 border-b border-gray-200 bg-gray-50 min-w-[200px]">
                  {hotel.photos[0] && (
                    <img src={hotelPhotoUrl(hotel.photos[0], 400)} alt={hotel.name}
                      className="w-full h-24 object-cover rounded-lg mb-2" />
                  )}
                  <Link href={`/${countrySlug}/${citySlug}/hotel/${hotelSlug(hotel)}`}
                    className="text-sm font-bold text-gray-900 hover:text-orange-500 line-clamp-2 block">
                    {hotel.name}
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={row.key} className="border-b border-gray-100">
                <td className="p-3 text-sm font-semibold text-gray-700 bg-gray-50 sticky left-0 z-10">{row.label}</td>
                {hotels.map(({ hotel }) => {
                  let value: string = '-';
                  if (row.key === 'rating') {
                    const r = parseFloat(hotel.rating_average);
                    value = r > 0 ? `★ ${r.toFixed(1)}/10` : '-';
                  } else if (row.key === 'reviews') {
                    value = parseInt(hotel.number_of_reviews).toLocaleString();
                  } else if (row.key === 'stars') {
                    const s = parseInt(hotel.star_rating);
                    value = s > 0 ? `${'★'.repeat(s)} (${s}성급)` : '-';
                  } else if (row.key === 'price') {
                    const p = parseFloat(hotel.rates_from);
                    value = p > 0 ? `$${Math.round(p)}~` : '-';
                  } else if (row.key === 'checkin') value = hotel.checkin || '-';
                  else if (row.key === 'checkout') value = hotel.checkout || '-';
                  else if (row.key === 'rooms') value = hotel.rooms || '-';
                  else if (row.key === 'opened') value = hotel.year_opened || '-';
                  else if (row.key === 'address') value = hotel.address || '-';
                  return (
                    <td key={hotel.hotel_id} className="p-3 text-sm text-gray-700 text-center">{value}</td>
                  );
                })}
              </tr>
            ))}
            <tr>
              <td className="p-3 bg-gray-50 sticky left-0 z-10"></td>
              {hotels.map(({ hotel }) => (
                <td key={hotel.hotel_id} className="p-3 text-center">
                  <a href={agodaHotelLink(hotel.hotel_id)} target="_blank" rel="noopener noreferrer"
                    className="inline-block bg-orange-500 text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">
                    아고다 가격 보기
                  </a>
                </td>
              ))}
            </tr>
          </tbody>
        </table>

        <div className="mt-8 bg-gray-50 rounded-xl p-5 text-sm text-gray-600">
          <p>💡 호텔 비교는 최대 4개까지 가능합니다. 호텔 상세 페이지에서 "비교 추가" 버튼으로 호텔을 추가하세요.</p>
        </div>
      </div>
    </div>
  );
}
