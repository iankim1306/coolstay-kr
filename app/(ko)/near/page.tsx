import Link from "next/link";
import {
  LANDMARKS,
  CATEGORY_LABEL,
  getLandmarksGroupedByCity,
  getNearbyHotels,
  formatDistance,
} from "@/lib/landmarks";
import { landmarkPhoto } from "@/lib/landmarks";
import { getCityData } from "@/lib/destinations";
import { breadcrumbJsonLd, linkListJsonLd, ldJson } from "@/lib/jsonld";
import { WalkIcon, CarIcon } from "@/components/Icons";

export const metadata = {
  title: "명소 근처 호텔 — 좌표로 찾는 숙소 | 쿨스테이",
  description:
    "유니버설·도톤보리·미케비치처럼 가고 싶은 곳을 고르면, 그 좌표에서 가까운 순으로 숙소를 보여드립니다. 도보 시간·평점·리뷰 수를 함께 확인하세요.",
  alternates: { canonical: "https://coolstay.kr/near" },
};

export default function NearIndexPage() {
  const groups = getLandmarksGroupedByCity();

  const breadcrumb = breadcrumbJsonLd([
    { name: "홈", url: "https://coolstay.kr/" },
    { name: "명소 근처 숙소", url: "https://coolstay.kr/near" },
  ]);

  const list = linkListJsonLd(
    "명소 근처 숙소 페이지 목록",
    "https://coolstay.kr/near",
    groups.flatMap((g) =>
      g.landmarks.map((l) => ({
        name: `${l.name} 근처 숙소`,
        url: `https://coolstay.kr/near/${l.slug}`,
      }))
    )
  );

  return (
    <div className="bg-white">
      <script {...ldJson(breadcrumb)} />
      <script {...ldJson(list)} />

      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-4 py-14 sm:py-20">
          <nav className="text-sm text-gray-400 mb-4">
            <Link href="/" className="hover:text-white">홈</Link>
            <span className="mx-2">&gt;</span>
            <span className="text-white">명소 근처 숙소</span>
          </nav>
          <p className="text-teal-300 text-sm font-semibold tracking-widest mb-3 uppercase">GPS 거리 기준</p>
          <h1 className="text-3xl sm:text-5xl font-bold mb-4 leading-tight">
            가고 싶은 곳부터 고르세요
          </h1>
          <p className="text-gray-300 text-base leading-relaxed max-w-2xl">
            &quot;어느 동네가 좋은가&quot;는 처음 가는 도시에서 답하기 어려운 질문입니다. 그래서 순서를 뒤집었습니다.
            명소·역·해변을 고르면 그 좌표에서 가까운 순으로 숙소를 보여드립니다. 거리는 실제 GPS로 계산한
            직선거리이고, 도보 시간·평점·리뷰 수를 함께 표시합니다.
          </p>
          <div className="mt-6 text-xs text-gray-400">
            현재 {groups.length}개 도시 · 랜드마크 {LANDMARKS.length}곳
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {groups.map((g) => {
          const city = getCityData(g.countryKey, g.cityKey);
          return (
            <section key={`${g.countryKey}/${g.cityKey}`} className="mb-12">
              {/* 도시 배너 */}
              <Link
                href={`/${g.countryKey}/${g.cityKey}`}
                className="group relative block h-24 sm:h-28 rounded-2xl overflow-hidden mb-4"
              >
                {city && (
                  <img
                    src={city.img}
                    alt={`${g.cityName} 여행`}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/85 via-slate-900/45 to-slate-900/10" />
                <div className="relative h-full flex items-center justify-between px-5 sm:px-7">
                  <div>
                    <h2 className="text-white text-xl sm:text-2xl font-bold">{g.cityName}</h2>
                    <p className="text-white/70 text-xs mt-0.5">랜드마크 {g.landmarks.length}곳</p>
                  </div>
                  <span className="text-white/90 text-sm font-semibold group-hover:translate-x-0.5 transition-transform">
                    {g.cityName} 전체 숙소 →
                  </span>
                </div>
              </Link>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {g.landmarks.map((l) => {
                  const nearby = getNearbyHotels(l, { limit: 10 });
                  const closest = nearby[0];
                  const walkable = nearby.filter((n) => n.walkable).length;
                  const cover = landmarkPhoto(l.slug);

                  return (
                    <Link
                      key={l.slug}
                      href={`/near/${l.slug}`}
                      className="group relative block rounded-2xl overflow-hidden h-44 shadow-sm hover:shadow-lg transition-all"
                    >
                      {cover && (
                        <img
                          src={cover}
                          alt={l.name}
                          loading="lazy"
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/92 via-slate-950/45 to-slate-950/10" />

                      <div className="relative h-full flex flex-col justify-between p-4">
                        <span className="self-start bg-white/15 backdrop-blur-sm text-white/90 text-[11px] px-2 py-0.5 rounded-full">
                          {CATEGORY_LABEL[l.category]}
                        </span>

                        <div>
                          <div className="text-white font-bold text-[15px] leading-snug mb-1.5 drop-shadow">
                            {l.name} 근처 호텔
                          </div>
                          {closest && (
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-white/85">
                              <span className="inline-flex items-center gap-1 bg-black/35 backdrop-blur-sm px-1.5 py-0.5 rounded">
                                {closest.walkable ? (
                                  <>
                                    <WalkIcon className="w-3 h-3" />
                                    도보 {closest.walkMin}분
                                  </>
                                ) : (
                                  <>
                                    <CarIcon className="w-3 h-3" />
                                    차로 {closest.driveMin}분
                                  </>
                                )}
                              </span>
                              <span>가장 가까운 숙소 {formatDistance(closest.km)}</span>
                              {walkable > 0 && <span>· 도보권 {walkable}곳</span>}
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}

        <section className="mt-8 bg-slate-50 border border-slate-100 rounded-2xl p-6">
          <h2 className="text-sm font-bold text-gray-800 mb-2">이 목록을 만든 방법</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            각 랜드마크의 좌표와 호텔 3,900곳의 GPS 좌표를 대조해 직선거리를 계산했습니다. 평점 7.5점 이상,
            리뷰 50건 이상인 숙소만 남기고 가까운 순으로 정렬합니다. 광고비를 받고 순서를 바꾸지 않습니다.
          </p>
          <p className="text-xs text-gray-400 mt-3">
            명소 사진은 위키미디어 커먼즈의 자유 라이선스(퍼블릭 도메인·CC0·CC BY·CC BY-SA) 이미지를 사용했습니다.
            저작자와 라이선스는 각 명소 페이지 하단에 표기합니다.
          </p>
        </section>
      </div>
    </div>
  );
}
