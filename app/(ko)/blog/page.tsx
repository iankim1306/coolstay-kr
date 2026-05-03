import Link from "next/link";
import { POSTS } from "@/lib/blog";

export const metadata = {
  title: "블로그 — 호텔 예약 팁·시즌 가이드 | 쿨스테이",
  description: "아고다 할인 활용법, 시즌별 호텔 가격 가이드, 여행지 비교 등 호텔 예약에 도움되는 정보 모음.",
};

export default function BlogIndexPage() {
  const sorted = [...POSTS].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="bg-white">
      <section className="bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-4 py-16 sm:py-20">
          <p className="text-orange-400 text-sm font-semibold tracking-widest mb-3 uppercase">블로그</p>
          <h1 className="text-3xl sm:text-5xl font-bold mb-4">호텔 예약 정보 & 여행 팁</h1>
          <p className="text-gray-300 text-lg max-w-2xl">아고다 할인법, 시즌 가이드, 여행지 비교까지.</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sorted.map(p => (
            <Link key={p.slug} href={`/blog/${p.slug}`}
              className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:border-orange-200 transition-all">
              <div className="relative h-44 overflow-hidden">
                <img src={p.thumbnail} alt={p.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 left-3 bg-white/90 text-orange-600 text-xs font-bold px-2 py-1 rounded-full">{p.category}</div>
              </div>
              <div className="p-5">
                <h2 className="font-bold text-base text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-500 transition-colors">{p.title}</h2>
                <p className="text-xs text-gray-500 line-clamp-2 mb-3">{p.description}</p>
                <div className="text-xs text-gray-400">{p.date}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
