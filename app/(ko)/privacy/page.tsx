import { BASE, UPDATED } from '@/lib/stay'

export const metadata = {
  title: '개인정보처리방침 | 쿨스테이',
  description: '쿨스테이 개인정보처리방침',
  alternates: { canonical: `${BASE}/privacy` },
}

const MAIL = 'holy3320@gmail.com'

export default function Privacy() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 leading-8 text-gray-700">
      <h1 className="text-3xl font-bold text-gray-900">개인정보처리방침</h1>
      <p className="mt-6">쿨스테이(이하 「사이트」)는 이용자의 개인정보를 소중히 다루며 아래와 같이 처리합니다.</p>
      <h2 className="mt-8 text-xl font-bold text-gray-900">1. 수집하는 개인정보</h2>
      <p className="mt-2">사이트는 회원가입이 없고, 글을 읽는 데 개인정보를 입력받지 않습니다. 이메일로 문의하시면 답장을 위해 보낸 분의 이메일 주소와 문의 내용만 받으며, 답변이 끝나면 지체 없이 삭제해요.</p>
      <h2 className="mt-8 text-xl font-bold text-gray-900">2. 자동으로 수집되는 정보</h2>
      <p className="mt-2">사이트 운영과 방문 통계를 위해 Google 애널리틱스, Vercel Analytics 같은 분석 도구가 방문 페이지·브라우저 종류·접속 시각 등을 자동으로 기록할 수 있습니다. 이 정보로 개인을 식별하지 않습니다.</p>
      <h2 className="mt-8 text-xl font-bold text-gray-900">3. 광고와 쿠키</h2>
      <p className="mt-2">사이트는 Google AdSense 등 제3자 광고를 게재할 수 있습니다. Google을 포함한 제3자 광고 업체는 쿠키를 사용해 이용자의 이 사이트와 다른 사이트 방문 기록을 바탕으로 광고를 보여 줄 수 있어요. <a href="https://adssettings.google.com" target="_blank" rel="noopener nofollow" className="text-teal-700 underline">Google 광고 설정</a>에서 맞춤 광고를 끌 수 있고, 브라우저 설정에서 쿠키 저장을 거부할 수도 있습니다.</p>
      <h2 className="mt-8 text-xl font-bold text-gray-900">4. 제3자 제공</h2>
      <p className="mt-2">법령에 따른 요청이 있는 경우를 빼고는 이용자 정보를 제3자에게 제공하지 않습니다.</p>
      <h2 className="mt-8 text-xl font-bold text-gray-900">5. 문의처</h2>
      <p className="mt-2">개인정보 관련 문의: <a href={`mailto:${MAIL}`} className="text-teal-700 underline">{MAIL}</a></p>
      <p className="mt-8 text-sm text-gray-400">시행일 {UPDATED}</p>
    </div>
  )
}
