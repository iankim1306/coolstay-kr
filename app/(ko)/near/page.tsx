import Link from "next/link";
import {
  LANDMARKS,
  CATEGORY_LABEL,
  getLandmarksGroupedByCity,
  getNearbyHotels,
  formatDistance,
} from "@/lib/landmarks";
import { breadcrumbJsonLd, ldJson } from "@/lib/jsonld";

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

  return (
    <div className="bg-white">
      <script {...ldJson(breadcrumb)} />

      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 text-white">
        <div className="max-w-5xl mx-auto px-4 py-14 sm:py-20">
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

      <div className="max-w-5xl mx-auto px-4 py-12">
        {groups.map((g) => (
          <section key={`${g.countryKey}/${g.cityKey}`} className="mb-12">
            <div className="flex items-baseline justify-between mb-4 pb-2 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">{g.cityName}</h2>
              <Link
                href={`/${g.countryKey}/${g.cityKey}`}
                className="text-sm text-teal-600 hover:text-teal-700 font-semibold"
              >
                {g.cityName} 전체 숙소 →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {g.landmarks.map((l) => {
                const nearby = getNearbyHotels(l, { limit: 10 });
                const closest = nearby[0];
                const walkable = nearby.filter((n) => n.walkable).length;
                return (
                  <Link
                    key={l.slug}
                    href={`/near/${l.slug}`}
                    className="group border border-gray-100 rounded-2xl p-4 hover:border-teal-200 hover:shadow-md transition-all"
                  >
                    <div className="text-[11px] text-gray-400 mb-1">{CATEGORY_LABEL[l.category]}</div>
                    <div className="font-semibold text-gray-900 mb-2 group-hover:text-teal-700 transition-colors">
                      {l.name} 근처 호텔
                    </div>
                    {closest && (
                      <div className="text-xs text-gray-500 leading-relaxed">
                        가장 가까운 숙소 {formatDistance(closest.km)}
                        {closest.walkable ? ` · 도보 ${closest.walkMin}분` : ` · 차로 ${closest.driveMin}분`}
                        {walkable > 0 && (
                          <>
                            <br />
                            도보권 {walkable}곳
                          </>
                        )}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </section>
        ))}

        <section className="mt-8 bg-slate-50 border border-slate-100 rounded-2xl p-6">
          <h2 className="text-sm font-bold text-gray-800 mb-2">이 목록을 만든 방법</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            각 랜드마크의 좌표와 호텔 3,900곳의 GPS 좌표를 대조해 직선거리를 계산했습니다. 평점 7.5점 이상,
            리뷰 50건 이상인 숙소만 남기고 가까운 순으로 정렬합니다. 광고비를 받고 순서를 바꾸지 않습니다.
          </p>
        </section>
      </div>
    </div>
  );
}
