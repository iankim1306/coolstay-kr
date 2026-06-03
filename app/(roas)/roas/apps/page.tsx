import AppManage from './AppManage'

export default function AppsPage() {
  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-1">앱 관리</h1>
      <p className="text-sm text-gray-500 mb-6">애드몹에 등록된 모든 앱을 한눈에 관리합니다.</p>
      <AppManage />
    </div>
  )
}
