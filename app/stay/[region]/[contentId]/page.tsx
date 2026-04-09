import { getStayDetail, getStayImages } from "@/lib/tourapi";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ region: string; contentId: string }> }) {
  const { region: rawRegion, contentId } = await params;
  const region = decodeURIComponent(rawRegion);
  const item = await getStayDetail(contentId);
  if (!item) return {};
  return {
    title: `${item.title} - ${region} 숙박 최저가 예약 | 쿨스테이`,
    description: `${item.title} 최저가 비교 및 예약. ${item.addr1}. 무료 취소 가능, 최저가 보장.`,
  };
}

export default async function StayDetailPage({ params }: { params: Promise<{ region: string; contentId: string }> }) {
  const { region: rawRegion, contentId } = await params;
  const region = decodeURIComponent(rawRegion);
  const [item, images] = await Promise.all([
    getStayDetail(contentId),
    getStayImages(contentId),
  ]);
  if (!item) notFound();

  const bookingUrl = `https://www.booking.com/search.html?ss=${encodeURIComponent(item.title + ' ' + item.addr1)}&lang=ko`;

  return (
    <div>
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <nav className="text-sm text-gray-400 mb-3">
            <a href="/" className="hover:text-white">홈</a>
            <span className="mx-2">&gt;</span>
            <a href={`/stay/${region}`} className="hover:text-white">{region}</a>
            <span className="mx-2">&gt;</span>
            <span className="text-white">{item.title}</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl font-bold">{item.title}</h1>
          <p className="text-gray-400 text-sm mt-1">{item.addr1}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 좌측: 콘텐츠 */}
          <div className="flex-1">
            {/* 대표 이미지 */}
            {item.firstimage && (
              <img src={item.firstimage} alt={item.title} className="w-full rounded-xl mb-6 max-h-96 object-cover" />
            )}

            {/* 추가 이미지 */}
            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mb-8">
                {images.slice(0, 6).map((img: any, i: number) => (
                  <img key={i} src={img.originimgurl} alt={item.title} className="rounded-lg w-full h-28 object-cover" />
                ))}
              </div>
            )}

            {/* 숙소 소개 */}
            {item.overview && (
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-3">숙소 소개</h2>
                <div className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-xl p-5"
                  dangerouslySetInnerHTML={{ __html: item.overview }}
                />
              </div>
            )}

            {/* 기본 정보 */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-3">기본 정보</h2>
              <div className="bg-gray-50 rounded-xl p-5">
                <dl className="space-y-3 text-sm">
                  <div className="flex">
                    <dt className="w-24 text-gray-400 flex-shrink-0">주소</dt>
                    <dd className="text-gray-700">{item.addr1}</dd>
                  </div>
                  {item.tel && (
                    <div className="flex">
                      <dt className="w-24 text-gray-400 flex-shrink-0">전화번호</dt>
                      <dd className="text-gray-700">{item.tel}</dd>
                    </div>
                  )}
                  {item.zipcode && (
                    <div className="flex">
                      <dt className="w-24 text-gray-400 flex-shrink-0">우편번호</dt>
                      <dd className="text-gray-700">{item.zipcode}</dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          </div>

          {/* 우측: 예약 사이드바 (고정) */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="sticky top-20 space-y-4">
              {/* 예약 카드 */}
              <div className="bg-white border-2 border-orange-200 rounded-2xl p-6 shadow-lg">
                <div className="text-center mb-4">
                  <p className="text-xs text-gray-400 mb-1">Booking.com 최저가</p>
                  <p className="text-sm text-red-500 font-semibold">오늘 예약 시 추가 할인</p>
                </div>
                <a
                  href={bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-orange-500 text-white text-center py-4 rounded-xl font-bold text-lg hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/30"
                >
                  최저가 확인하기
                </a>
                <ul className="mt-4 space-y-2 text-xs text-gray-500">
                  <li className="flex items-center gap-1.5">
                    <span className="text-green-500">&#10003;</span> 무료 취소 가능
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="text-green-500">&#10003;</span> 예약 수수료 없음
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="text-green-500">&#10003;</span> 최저가 보장
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="text-green-500">&#10003;</span> 즉시 예약 확정
                  </li>
                </ul>
              </div>

              {/* 신뢰 지표 */}
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-xs text-gray-400 mb-2">데이터 제공</p>
                <p className="text-sm font-semibold text-gray-700">한국관광공사</p>
                <p className="text-xs text-gray-400 mt-1">공공데이터 기반 신뢰할 수 있는 정보</p>
              </div>

              {/* 다른 숙소 */}
              <a
                href={`/stay/${region}`}
                className="block text-center bg-gray-100 rounded-xl py-3 text-sm text-gray-600 hover:bg-gray-200 transition-colors"
              >
                {region} 다른 숙소 보기 &rarr;
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
