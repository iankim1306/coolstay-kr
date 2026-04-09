import { getStayList, AREA_CODES } from "@/lib/tourapi";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return Object.keys(AREA_CODES).map((name) => ({ region: name }));
}

export async function generateMetadata({ params }: { params: Promise<{ region: string }> }) {
  const { region: rawRegion } = await params;
  const region = decodeURIComponent(rawRegion);
  return {
    title: `${region} 숙박 추천 BEST - 펜션, 호텔, 풀빌라 최저가 비교 | 쿨스테이`,
    description: `${region} 지역 펜션, 호텔, 풀빌라, 글램핑 숙소를 최저가로 비교해보세요. 커플, 가족, 반려동물 동반 숙소 정보 제공.`,
  };
}

export default async function RegionPage({ params }: { params: Promise<{ region: string }> }) {
  const { region: rawRegion } = await params;
  const region = decodeURIComponent(rawRegion);
  const areaCode = AREA_CODES[region];
  if (!areaCode) notFound();

  const items = await getStayList({ areaCode, numOfRows: 20 });

  return (
    <div>
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <nav className="text-sm text-gray-400 mb-3">
            <a href="/" className="hover:text-white">홈</a>
            <span className="mx-2">&gt;</span>
            <span className="text-white">{region}</span>
          </nav>
          <h1 className="text-3xl font-bold mb-2">{region} 숙소 추천 BEST</h1>
          <p className="text-gray-400">{region} 지역 펜션·호텔·풀빌라·글램핑 {items.length}개 숙소 최저가 비교</p>
          <div className="flex gap-4 mt-4 text-xs text-gray-400">
            <span className="flex items-center gap-1"><span className="text-green-400">&#10003;</span> 무료 취소</span>
            <span className="flex items-center gap-1"><span className="text-green-400">&#10003;</span> 최저가 보장</span>
            <span className="flex items-center gap-1"><span className="text-green-400">&#10003;</span> 실시간 가격</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 알림 */}
        <div className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 mb-6 flex items-center gap-2">
          <span className="text-orange-500 font-bold text-sm">SALE</span>
          <span className="text-sm text-gray-700">{region} 인기 숙소 최대 40% 할인 중 — 조기 마감될 수 있습니다</span>
        </div>

        {/* 숙소 목록 */}
        <div className="space-y-4">
          {items.map((item: any, idx: number) => (
            <Link
              key={item.contentid}
              href={`/stay/${region}/${item.contentid}`}
              className="flex bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-orange-200 transition-all"
            >
              {/* 이미지 */}
              <div className="w-56 sm:w-72 flex-shrink-0 relative">
                {item.firstimage ? (
                  <img
                    src={item.firstimage}
                    alt={item.title}
                    className="w-full h-full object-cover min-h-[180px]"
                  />
                ) : (
                  <div className="w-full h-full min-h-[180px] bg-gray-100 flex items-center justify-center text-gray-300 text-5xl">
                    🏨
                  </div>
                )}
                {idx < 3 && (
                  <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
                    TOP {idx + 1}
                  </span>
                )}
              </div>

              {/* 정보 */}
              <div className="flex-1 p-5 flex flex-col justify-between">
                <div>
                  <h2 className="font-bold text-lg mb-1">{item.title}</h2>
                  <p className="text-sm text-gray-400 mb-3">{item.addr1}</p>
                  {item.tel && (
                    <p className="text-xs text-gray-400">TEL {item.tel}</p>
                  )}
                </div>
                <div className="flex items-end justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                      추천
                    </span>
                    <span className="text-xs text-gray-400">한국관광공사 인증</span>
                  </div>
                  <span className="bg-orange-500 text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">
                    가격 확인
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* 하단 CTA */}
        <div className="mt-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 text-center text-white">
          <h3 className="text-xl font-bold mb-2">{region} 숙소 더 많이 보고 싶다면?</h3>
          <p className="text-white/80 text-sm mb-4">Booking.com에서 {region} 전체 숙소를 확인하세요</p>
          <a
            href={`https://www.booking.com/searchresults.html?ss=${encodeURIComponent(region)}&lang=ko`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-orange-600 font-bold px-8 py-3 rounded-xl hover:bg-gray-100 transition-colors"
          >
            {region} 전체 숙소 보기
          </a>
        </div>
      </div>
    </div>
  );
}
