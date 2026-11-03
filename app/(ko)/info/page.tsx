import Link from 'next/link'
import { BASE, CATEGORIES, getLivePosts } from '@/lib/stay'

export const metadata = {
  title: '전체 글 | 쿨스테이 — 국내 숙박·여행 지원 정보',
  description: '숙박 할인권·휴가 지원 제도부터 예약 취소 환불 기준, 숙소 안전 수칙, 계절별 여행 계획까지 분야별로 모았습니다.',
  alternates: { canonical: `${BASE}/info` },
}

export default function InfoIndex() {
  const posts = getLivePosts()
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900">전체 글</h1>
      <p className="mt-2 text-gray-500">분야별로 정리했어요. 글마다 참고한 공식 자료를 함께 달아 두었습니다.</p>
      {CATEGORIES.map((c) => {
        const list = posts.filter((p) => p.category === c.key)
        if (!list.length) return null
        return (
          <section key={c.slug} id={c.slug} className="mt-12 scroll-mt-24">
            <h2 className="text-xl font-bold text-gray-900">{c.key}</h2>
            <p className="mt-1 text-sm text-gray-500">{c.desc}</p>
            <ul className="mt-4 divide-y divide-gray-100 border-y border-gray-100">
              {list.map((p) => (
                <li key={p.slug} className="py-4">
                  <Link href={`/info/${p.slug}`} className="block">
                    <span className="font-semibold text-gray-900 hover:text-teal-700">{p.title}</span>
                    <span className="mt-1 block text-sm text-gray-500">{p.description}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
