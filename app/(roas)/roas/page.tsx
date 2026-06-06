import Link from 'next/link'
import Overview from './Overview'

export default function RoasDashboardPage() {
  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-1">대시보드</h1>
      <p className="text-sm text-gray-500 mb-4">
        구글 애즈 광고비 ↔ 애드몹 앱 수익을 비교해 순수익과 ROAS를 측정합니다.
      </p>

      {/* 공개 소개 (구글 애즈 API 용도 명시) */}
      <div className="mb-6 rounded-xl border border-gray-100 bg-white px-4 py-3 text-sm text-gray-600 shadow-sm">
        <span className="font-semibold text-gray-800">ROAS Dashboard</span> — a personal,
        read-only reporting tool that uses the <b>Google Ads API</b> to retrieve campaign{' '}
        <b>cost</b> and combines it with <b>AdMob</b> revenue to measure return on ad spend (ROAS).{' '}
        <Link href="/roas/about" className="text-orange-600 underline hover:text-orange-700">
          Learn more →
        </Link>
      </div>

      <Overview />
    </div>
  )
}
