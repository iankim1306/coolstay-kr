import Calendar from './Calendar'

export default function CalendarPage() {
  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-1">수익 캘린더</h1>
      <p className="text-sm text-gray-500 mb-6">최근 30일 일자별 애드몹 수익을 히트맵으로 봅니다.</p>
      <Calendar />
    </div>
  )
}
