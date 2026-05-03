import Link from "next/link";

export default function NotFound() {
  const popularCities = [
    { ko: '오사카', en: 'osaka', country: 'japan', img: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?w=400&h=300&fit=crop' },
    { ko: '도쿄', en: 'tokyo', country: 'japan', img: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=400&h=300&fit=crop' },
    { ko: '방콕', en: 'bangkok', country: 'thailand', img: 'https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=400&h=300&fit=crop' },
    { ko: '발리', en: 'bali', country: 'indonesia', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=300&fit=crop' },
    { ko: '다낭', en: 'danang', country: 'vietnam', img: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=400&h=300&fit=crop' },
    { ko: '교토', en: 'kyoto', country: 'japan', img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=300&fit=crop' },
  ];

  return (
    <div className="min-h-[70vh] bg-gradient-to-b from-orange-50 to-white">
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="text-8xl font-bold text-orange-500 mb-4">404</div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
          페이지를 찾을 수 없습니다
        </h1>
        <p className="text-gray-500 mb-8">
          요청하신 페이지가 이동되었거나 삭제됐을 수 있어요.<br />
          아래 인기 도시에서 호텔을 찾아보세요.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
          <Link
            href="/"
            className="bg-orange-500 text-white text-base px-8 py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors"
          >
            🏠 홈으로 가기
          </Link>
          <a
            href="https://www.agoda.com/?cid=1962399"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-orange-600 border-2 border-orange-200 text-base px-8 py-3 rounded-xl font-bold hover:bg-orange-50 transition-colors"
          >
            아고다 특가 보기
          </a>
        </div>

        <div className="text-left">
          <h2 className="text-lg font-bold text-gray-800 mb-4">🔥 인기 도시</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {popularCities.map(c => (
              <Link
                key={c.en}
                href={`/${c.country}/${c.en}`}
                className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg hover:border-orange-200 transition-all"
              >
                <div className="relative h-24 overflow-hidden">
                  <img src={c.img} alt={c.ko}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-2 left-3 text-white font-bold text-sm">{c.ko}</div>
                </div>
                <div className="p-2 text-xs text-orange-500 text-center font-medium">
                  호텔 보기 →
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-10 bg-gray-50 rounded-xl p-6 text-left">
          <h3 className="font-bold text-gray-800 mb-3">🔎 빠른 링크</h3>
          <div className="flex flex-wrap gap-2 text-sm">
            <Link href="/japan" className="bg-white border border-gray-200 px-3 py-1.5 rounded-full hover:border-orange-300 hover:text-orange-600 transition-colors">일본</Link>
            <Link href="/thailand" className="bg-white border border-gray-200 px-3 py-1.5 rounded-full hover:border-orange-300 hover:text-orange-600 transition-colors">태국</Link>
            <Link href="/vietnam" className="bg-white border border-gray-200 px-3 py-1.5 rounded-full hover:border-orange-300 hover:text-orange-600 transition-colors">베트남</Link>
            <Link href="/philippines" className="bg-white border border-gray-200 px-3 py-1.5 rounded-full hover:border-orange-300 hover:text-orange-600 transition-colors">필리핀</Link>
            <Link href="/indonesia" className="bg-white border border-gray-200 px-3 py-1.5 rounded-full hover:border-orange-300 hover:text-orange-600 transition-colors">인도네시아</Link>
            <Link href="/taiwan" className="bg-white border border-gray-200 px-3 py-1.5 rounded-full hover:border-orange-300 hover:text-orange-600 transition-colors">대만</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
