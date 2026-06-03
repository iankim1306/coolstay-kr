import Overview from './Overview'

export default function RoasDashboardPage() {
  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-1">대시보드</h1>
      <p className="text-sm text-gray-500 mb-6">
        구글 애즈 광고비 ↔ 애드몹 앱 수익을 비교해 순수익과 ROAS를 측정합니다.
      </p>
      <Overview />
    </div>
  )
}
