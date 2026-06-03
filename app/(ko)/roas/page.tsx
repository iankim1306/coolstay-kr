import type { Metadata } from 'next'
import Dashboard from './Dashboard'

export const metadata: Metadata = {
  title: 'ROAS 대시보드',
  description: '구글 애즈 광고비 대비 애드몹 앱 수익(ROAS) 측정 대시보드',
  robots: { index: false, follow: false }, // 비공개 도구 — 색인 금지
}

export default function RoasPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">ROAS 대시보드</h1>
        <p className="text-sm text-gray-500 mt-1">
          구글 애즈 광고비 ↔ 애드몹 앱 수익을 비교해 순수익과 ROAS를 측정합니다.
        </p>
      </header>
      <Dashboard />
    </div>
  )
}
