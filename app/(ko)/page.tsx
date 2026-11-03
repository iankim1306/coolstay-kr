import Link from 'next/link'
import { BASE, CATEGORIES, getLivePosts, UPDATED } from '@/lib/stay'

export const metadata = {
  title: '쿨스테이 — 국내 숙박·여행 지원 제도와 알뜰 여행 정보',
  description:
    '숙박세일페스타·근로자 휴가지원·문화누리카드 같은 여행 지원 제도, 숙박 예약 취소·환불 기준, 펜션·캠핑장 안전 수칙, 계절별 국내 여행 계획을 공식 자료 기준으로 정리합니다.',
  alternates: { canonical: `${BASE}/` },
}

export default function HomePage() {
  const posts = getLivePosts()
  const latest = posts.slice(0, 6)

  return (
    <div>
      <section className="border-b border-teal-100 bg-gradient-to-b from-teal-50 to-white">
        <div className="mx-auto max-w-5xl px-4 py-14">
          <p className="text-sm font-semibold text-teal-700">국내 숙박·여행 정보</p>
          <h1 className="mt-3 text-3xl font-bold leading-snug text-gray-900 sm:text-4xl">
            여행비는 아끼고,
            <br />
            숙소 고민은 줄이고.
          </h1>
          <p className="mt-4 max-w-2xl text-gray-600">
            나라와 지자체가 보태 주는 여행 지원 제도, 예약을 취소할 때 알아야 할 환불 기준, 숙소에서 지켜야 할 안전 수칙을
            공식 자료를 바탕으로 쉽게 풀어 씁니다. 광고 상품을 추천하지 않고, 글마다 참고한 기관 자료를 함께 달아요.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <Link
                key={c.slug}
                href={`/info#${c.slug}`}
                className="rounded-full border border-teal-200 bg-white px-4 py-1.5 text-sm text-teal-800 hover:bg-teal-50"
              >
                {c.key}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-bold text-gray-900">새로 올라온 글</h2>
          <Link href="/info" className="text-sm text-teal-700 hover:underline">
            전체 글 보기 →
          </Link>
        </div>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {latest.map((p) => (
            <li key={p.slug}>
              <Link href={`/info/${p.slug}`} className="block h-full rounded-xl border border-gray-100 p-5 hover:border-teal-200 hover:shadow-sm">
                <span className="text-xs font-semibold text-teal-700">{p.category}</span>
                <span className="mt-2 block font-semibold leading-snug text-gray-900">{p.title}</span>
                <span className="mt-2 block text-sm text-gray-500">{p.description}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-4">
        <h2 className="text-2xl font-bold text-gray-900">분야별로 찾아보기</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((c) => {
            const n = posts.filter((p) => p.category === c.key).length
            return (
              <Link key={c.slug} href={`/info#${c.slug}`} className="rounded-xl bg-gray-50 p-5 hover:bg-teal-50">
                <span className="font-bold text-gray-900">{c.key}</span>
                <span className="ml-2 text-sm text-gray-400">{n}편</span>
                <span className="mt-2 block text-sm text-gray-600">{c.desc}</span>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12">
        <div className="rounded-2xl border border-gray-100 p-6 text-gray-600">
          <h2 className="text-xl font-bold text-gray-900">쿨스테이는 이렇게 정리합니다</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5">
            <li>문화체육관광부·한국관광공사·한국소비자원 등 기관이 공개한 자료를 먼저 확인하고 씁니다.</li>
            <li>해마다 바뀌는 금액·기간은 공고가 확인된 것만 적고, 아니면 확인할 곳을 안내해요.</li>
            <li>특정 숙소나 예약 앱을 광고하지 않습니다.</li>
            <li>내용이 바뀌거나 틀린 곳을 알려 주시면 확인한 뒤 고칩니다. <Link href="/contact" className="text-teal-700 underline">문의하기</Link></li>
          </ul>
          <p className="mt-4 text-sm text-gray-400">최종 개편 {UPDATED}</p>
        </div>
      </section>
    </div>
  )
}
