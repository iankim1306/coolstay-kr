import { BASE } from '@/lib/stay'

export const metadata = {
  title: '문의 | 쿨스테이',
  description: '쿨스테이에 내용 오류 제보, 주제 요청, 기타 문의를 보내는 방법',
  alternates: { canonical: `${BASE}/contact` },
}

const MAIL = 'holy3320@gmail.com'

export default function Contact() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 leading-8 text-gray-700">
      <h1 className="text-3xl font-bold text-gray-900">문의</h1>
      <p className="mt-6">내용 오류 제보, 다뤄 줬으면 하는 주제, 기타 문의는 아래 이메일로 보내 주세요. 보통 2~3일 안에 답장을 드려요.</p>
      <p className="mt-4">이메일: <a href={`mailto:${MAIL}`} className="font-semibold text-teal-700 underline">{MAIL}</a></p>
      <h2 className="mt-10 text-xl font-bold text-gray-900">제보하실 때</h2>
      <ul className="mt-3 list-disc space-y-1 pl-5">
        <li>어느 글의 어떤 부분인지(페이지 주소) 함께 적어 주시면 빨리 고칠 수 있어요.</li>
        <li>숙소 예약·환불 분쟁 같은 개별 사건은 1372 소비자상담센터에 문의하시는 게 정확합니다.</li>
        <li>숙소·업체의 광고나 제휴 제안은 받지 않습니다.</li>
      </ul>
    </div>
  )
}
