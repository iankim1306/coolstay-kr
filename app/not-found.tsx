import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <div className="text-7xl font-bold text-teal-600">404</div>
      <h1 className="mt-4 text-2xl font-bold text-gray-900">페이지를 찾을 수 없어요</h1>
      <p className="mt-3 text-gray-500">주소가 바뀌었거나 아직 올라오지 않은 글이에요.</p>
      <div className="mt-8 flex justify-center gap-3">
        <Link href="/" className="rounded-xl bg-teal-600 px-6 py-3 font-bold text-white hover:bg-teal-700">홈으로</Link>
        <Link href="/info" className="rounded-xl border border-teal-200 px-6 py-3 font-bold text-teal-700 hover:bg-teal-50">전체 글 보기</Link>
      </div>
    </div>
  );
}
