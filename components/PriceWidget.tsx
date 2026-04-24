'use client'

import { useState, useEffect } from 'react'

type PriceData = {
  dailyRate: number
  crossedOutRate: number
  discountPercentage: number
  currency: string
  freeWifi: boolean
  includeBreakfast: boolean
  landingURL: string
}

type Props = {
  hotelId: string
  hotelName: string
  fallbackRate?: number // rates_from (정적 기준가)
}

export default function PriceWidget({ hotelId, hotelName, fallbackRate }: Props) {
  const [price, setPrice] = useState<PriceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [checkin, setCheckin] = useState('')
  const [checkout, setCheckout] = useState('')
  const [alertEmail, setAlertEmail] = useState('')
  const [alertTarget, setAlertTarget] = useState('')
  const [alertStatus, setAlertStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')
  const [showAlert, setShowAlert] = useState(false)

  // 기본 날짜: 오늘+14일, 1박
  useEffect(() => {
    const d = new Date()
    d.setDate(d.getDate() + 14)
    const cin = d.toISOString().slice(0, 10)
    d.setDate(d.getDate() + 1)
    const cout = d.toISOString().slice(0, 10)
    setCheckin(cin)
    setCheckout(cout)
  }, [])

  // 가격 조회
  useEffect(() => {
    if (!checkin || !checkout) return
    setLoading(true)
    const params = new URLSearchParams({ hotelId, checkin, checkout })
    fetch(`/api/price?${params}`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => setPrice(data))
      .catch(() => setPrice(null))
      .finally(() => setLoading(false))
  }, [hotelId, checkin, checkout])

  const handleAlertSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!alertEmail || !alertTarget) return
    setAlertStatus('loading')
    try {
      const res = await fetch('/api/alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: alertEmail,
          hotelId,
          hotelName,
          targetPrice: Number(alertTarget.replace(/,/g, '')),
        }),
      })
      const data = await res.json()
      setAlertStatus(res.ok ? 'ok' : 'error')
      if (res.ok) {
        setAlertEmail('')
        setAlertTarget('')
        setTimeout(() => setShowAlert(false), 3000)
      } else {
        console.error(data.error)
      }
    } catch {
      setAlertStatus('error')
    }
  }

  const fmt = (n: number) =>
    new Intl.NumberFormat('ko-KR').format(Math.round(n))

  const displayRate = price?.dailyRate ?? fallbackRate
  const hasDiscount = price && price.discountPercentage > 0 && price.crossedOutRate > price.dailyRate

  return (
    <div className="bg-white border-2 border-orange-200 rounded-2xl p-6 shadow-lg">
      {/* 날짜 선택 */}
      <div className="flex gap-2 mb-4">
        <div className="flex-1">
          <label className="text-[10px] text-gray-400 block mb-1">체크인</label>
          <input
            type="date"
            value={checkin}
            min={new Date().toISOString().slice(0, 10)}
            onChange={(e) => setCheckin(e.target.value)}
            className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-orange-400"
          />
        </div>
        <div className="flex-1">
          <label className="text-[10px] text-gray-400 block mb-1">체크아웃</label>
          <input
            type="date"
            value={checkout}
            min={checkin}
            onChange={(e) => setCheckout(e.target.value)}
            className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-orange-400"
          />
        </div>
      </div>

      {/* 가격 표시 */}
      <div className="text-center mb-4">
        {loading ? (
          <div className="animate-pulse h-8 bg-gray-100 rounded-lg w-32 mx-auto" />
        ) : displayRate ? (
          <div>
            {hasDiscount && (
              <p className="text-gray-400 text-xs line-through mb-0.5">
                ₩{fmt(price.crossedOutRate)}
              </p>
            )}
            <p className="text-2xl font-bold text-orange-500">
              ₩{fmt(displayRate)}
              <span className="text-sm font-normal text-gray-500"> /박</span>
            </p>
            {hasDiscount && (
              <span className="inline-block bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full mt-1">
                -{Math.round(price.discountPercentage)}% 특가
              </span>
            )}
            {!price && fallbackRate && (
              <p className="text-[10px] text-gray-400 mt-1">기준가 (날짜별 변동)</p>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-400">선택한 날짜 가격 없음</p>
        )}
      </div>

      {/* 아고다 예약 버튼 */}
      <a
        href={price?.landingURL ?? `https://www.agoda.com/partners/partnersearch.aspx?hid=${hotelId}&cid=1962399`}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="flex items-center justify-between w-full bg-orange-500 text-white px-4 py-3.5 rounded-xl font-bold text-sm hover:bg-orange-600 transition-colors shadow-md shadow-orange-500/30 mb-2"
      >
        <span className="flex items-center gap-2">
          아고다
          <span className="text-[10px] bg-white text-orange-600 px-1.5 py-0.5 rounded-full font-bold">추천</span>
        </span>
        <span>지금 예약 →</span>
      </a>

      {/* 부가 정보 */}
      {price && (
        <div className="flex gap-3 text-[11px] text-gray-500 mb-3">
          {price.freeWifi && <span>✓ 무료 WiFi</span>}
          {price.includeBreakfast && <span>✓ 조식 포함</span>}
        </div>
      )}

      <ul className="space-y-1.5 text-xs text-gray-500 pt-3 border-t border-gray-100 mb-4">
        <li className="flex items-center gap-2"><span className="text-green-500 font-bold">✓</span> 아고다 추가 할인 최대 7%</li>
        <li className="flex items-center gap-2"><span className="text-green-500 font-bold">✓</span> 무료 취소 가능 요금</li>
        <li className="flex items-center gap-2"><span className="text-green-500 font-bold">✓</span> 즉시 예약 확정</li>
      </ul>

      {/* 가격 알림 */}
      {!showAlert ? (
        <button
          onClick={() => setShowAlert(true)}
          className="w-full text-xs text-orange-500 border border-orange-200 rounded-xl py-2.5 hover:bg-orange-50 transition-colors font-medium"
        >
          🔔 목표가 도달 시 알림 받기
        </button>
      ) : (
        <form onSubmit={handleAlertSubmit} className="border border-orange-200 rounded-xl p-3 bg-orange-50">
          <p className="text-xs font-semibold text-gray-700 mb-2">🔔 특가 알림 등록</p>
          <input
            type="email"
            placeholder="이메일 주소"
            value={alertEmail}
            onChange={(e) => setAlertEmail(e.target.value)}
            required
            className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 mb-2 focus:outline-none focus:border-orange-400"
          />
          <div className="flex gap-2 mb-2">
            <span className="text-xs text-gray-500 self-center">₩</span>
            <input
              type="number"
              placeholder="목표 가격 (1박)"
              value={alertTarget}
              onChange={(e) => setAlertTarget(e.target.value)}
              required
              min={1}
              className="flex-1 text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-orange-400"
            />
            <span className="text-xs text-gray-500 self-center">이하</span>
          </div>
          {alertStatus === 'ok' && (
            <p className="text-xs text-green-600 mb-2">✓ 알림이 등록됐습니다!</p>
          )}
          {alertStatus === 'error' && (
            <p className="text-xs text-red-500 mb-2">오류가 발생했습니다. 다시 시도해주세요.</p>
          )}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={alertStatus === 'loading'}
              className="flex-1 bg-orange-500 text-white text-xs py-2 rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-50"
            >
              {alertStatus === 'loading' ? '등록 중...' : '알림 등록'}
            </button>
            <button
              type="button"
              onClick={() => setShowAlert(false)}
              className="text-xs text-gray-400 px-3 py-2 rounded-lg hover:bg-gray-100"
            >
              취소
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
