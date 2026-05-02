'use client'

import { useState } from 'react'

interface CityDateSearchProps {
  cityId: number
  cityName: string
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

export default function CityDateSearch({ cityId, cityName }: CityDateSearchProps) {
  const today = new Date()
  const defaultCheckin = addDays(today, 14)
  const defaultCheckout = addDays(defaultCheckin, 1)

  const [checkin, setCheckin] = useState(formatDate(defaultCheckin))
  const [checkout, setCheckout] = useState(formatDate(defaultCheckout))
  const [nights, setNights] = useState(1)

  function handleCheckinChange(val: string) {
    setCheckin(val)
    const cin = new Date(val)
    const cout = addDays(cin, nights)
    setCheckout(formatDate(cout))
  }

  function handleNightsChange(val: number) {
    setNights(val)
    if (checkin) {
      const cin = new Date(checkin)
      const cout = addDays(cin, val)
      setCheckout(formatDate(cout))
    }
  }

  const agodaUrl = `https://www.agoda.com/search?city=${cityId}&checkIn=${checkin}&los=${nights}&cid=1962399`

  return (
    <div className="bg-white border-2 border-orange-200 rounded-2xl p-5 shadow-lg">
      <p className="text-sm font-bold text-gray-800 mb-4 text-center">📅 날짜 선택 후 예약</p>

      <div className="space-y-3 mb-4">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">체크인</label>
          <input
            type="date"
            value={checkin}
            min={formatDate(addDays(today, 1))}
            onChange={e => handleCheckinChange(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
          />
        </div>

        <div>
          <label className="text-xs text-gray-500 mb-1 block">숙박 기간</label>
          <select
            value={nights}
            onChange={e => handleNightsChange(Number(e.target.value))}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
          >
            {[1, 2, 3, 4, 5, 6, 7].map(n => (
              <option key={n} value={n}>{n}박</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs text-gray-500 mb-1 block">체크아웃</label>
          <div className="border border-gray-100 bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-600">
            {checkout}
          </div>
        </div>
      </div>

      <a
        href={agodaUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full bg-orange-500 text-white text-center py-3 rounded-xl font-bold text-sm hover:bg-orange-600 transition-colors shadow-md shadow-orange-500/30"
      >
        {cityName} 호텔 검색하기 →
      </a>
      <p className="text-xs text-gray-400 text-center mt-2">아고다 실시간 최저가 · 즉시 확정</p>
    </div>
  )
}
