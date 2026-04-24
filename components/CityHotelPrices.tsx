'use client'

import { useEffect, useState } from 'react'

type PriceMap = Record<string, { dailyRate: number; discountPercentage: number; landingURL: string } | null>

export function useCityPrices(hotelIds: string[]) {
  const [prices, setPrices] = useState<PriceMap>({})

  useEffect(() => {
    if (!hotelIds.length) return
    fetch(`/api/prices?hotelIds=${hotelIds.join(',')}`)
      .then(r => r.json())
      .then(setPrices)
      .catch(() => {})
  }, [hotelIds.join(',')])

  return prices
}

export function PriceTag({ hotelId, prices }: { hotelId: string; prices: PriceMap }) {
  const p = prices[hotelId]
  if (!p) return (
    <span className="text-xs text-gray-400">가격 확인 중...</span>
  )
  const fmt = (n: number) => new Intl.NumberFormat('ko-KR').format(Math.round(n))
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-orange-500 font-bold text-sm">₩{fmt(p.dailyRate)}</span>
      {p.discountPercentage > 0 && (
        <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded-full font-bold">
          -{Math.round(p.discountPercentage)}%
        </span>
      )}
    </div>
  )
}
