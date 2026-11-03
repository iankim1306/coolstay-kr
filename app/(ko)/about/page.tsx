import Link from 'next/link'
import { BASE, CATEGORIES, UPDATED } from '@/lib/stay'

export const metadata = {
  title: '쿨스테이 소개',
  description: '쿨스테이는 국내 숙박·여행 지원 제도와 숙소 예약·안전 정보를 공식 자료 기준으로 정리하는 정보 사이트입니다.',
  alternates: { canonical: `${BASE}/about` },
}

export default function About() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 leading-8 text-gray-700">
      <h1 className="text-3xl font-bold text-gray-900">쿨스테이 소개</h1>
      <p className="mt-6">
        <strong>쿨스테이(coolstay.kr)</strong>는 국내 여행을 준비하는 분들이 여행비를 아끼고, 숙소를 고를 때 헷갈리지 않도록 돕는 정보
        사이트예요. 나라와 지자체의 여행 지원 제도, 숙박 예약·취소·환불 기준, 숙소 안전 수칙, 계절별 여행 계획을 한곳에 모았습니다.
      </p>
      <h2 className="mt-10 text-xl font-bold text-gray-900">다루는 분야</h2>
      <ul className="mt-3 list-disc space-y-1 pl-5">
        {CATEGORIES.map((c) => (
          <li key={c.slug}>
            <Link href={`/info#${c.slug}`} className="font-semibold text-teal-700">{c.key}</Link> — {c.desc}
          </li>
        ))}
      </ul>
      <h2 className="mt-10 text-xl font-bold text-gray-900">글은 이렇게 씁니다</h2>
      <ol className="mt-3 list-decimal space-y-1 pl-5">
        <li>문화체육관광부, 한국관광공사, 한국소비자원, 산림청, 국립공원공단 등 기관이 공개한 안내와 공고를 먼저 확인해요.</li>
        <li>해마다 바뀌는 금액·기간·대상은 공고로 확인된 내용만 적고, 확인이 어려운 부분은 직접 확인할 곳을 안내합니다.</li>
        <li>글 끝에 참고한 공식 자료를 달고, 정리한 날짜를 적어 둡니다.</li>
        <li>특정 숙소나 예약 앱을 추천하거나 광고하지 않아요.</li>
      </ol>
      <h2 className="mt-10 text-xl font-bold text-gray-900">알아 두세요</h2>
      <p className="mt-3">
        쿨스테이의 글은 일반적인 안내예요. 실제 신청 조건·요금·환불은 각 기관 공고와 숙소 약관이 우선하니, 결제나 신청 전에 꼭 원문을 확인해 주세요.
      </p>
      <h2 className="mt-10 text-xl font-bold text-gray-900">문의</h2>
      <p className="mt-3">
        틀린 내용 제보나 다뤄 줬으면 하는 주제는 <Link href="/contact" className="text-teal-700 underline">문의 페이지</Link>로 보내 주세요.
      </p>
      <p className="mt-8 text-sm text-gray-400">최종 업데이트 {UPDATED}</p>
    </div>
  )
}
