'use client'

import { useState } from 'react'
import Link from 'next/link'

type Deal = {
  hotelId: number
  hotelName: string
  dailyRate: number
  crossedOutRate: number
  discountPercentage: number
  reviewScore: number
  starRating: number
  freeWifi: boolean
  landingURL: string
  imageURL: string
}

type CityDeals = {
  name: string
  slug: string
  deals: Deal[]
}

export default function HotDealTabs({ cities }: { cities: CityDeals[] }) {
  const [active, setActive] = useState(0)

  const fmt = (n: number) => new Intl.NumberFormat('ko-KR').format(Math.round(n))
  const current = cities[active]

  return (
    <div>
      {/* 탭 */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {cities.map((city, i) => (
          <button
            key={city.name}
            onClick={() => setActive(i)}
            className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
              active === i
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                : 'bg-white text-gray-500 border border-gray-200 hover:border-orange-300 hover:text-orange-500'
            }`}
          >
            {city.name}
          </button>
        ))}
      </div>

      {/* 딜 카드 그리드 */}
      {current.deals.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {current.deals.map((deal) => (
            <a
              key={deal.hotelId}
              href={deal.landingURL}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl hover:border-orange-200 transition-all"
            >
              {deal.imageURL && (
                <div className="h-48 overflow-hidden">
                  <img
                    src={deal.imageURL.replace('?s=', '?s=600x')}
                    alt={deal.hotelName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-orange-400 text-xs">
                    {'★'.repeat(Math.round(deal.starRating || 0))}
                  </span>
                  {deal.discountPercentage > 0 && (
                    <span className="ml-auto text-[11px] bg-red-500 text-white px-2 py-0.5 rounded-full font-bold">
                      -{Math.round(deal.discountPercentage)}%
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-gray-800 text-sm line-clamp-2 mb-2 group-hover:text-orange-500 transition-colors">
                  {deal.hotelName}
                </h3>
                <div className="flex items-center justify-between">
                  <div>
                    {deal.crossedOutRate > deal.dailyRate && (
                      <p className="text-xs text-gray-400 line-through">₩{fmt(deal.crossedOutRate)}</p>
                    )}
                    <p className="text-lg font-bold text-orange-500">
                      ₩{fmt(deal.dailyRate)}
                      <span className="text-xs font-normal text-gray-400">/박</span>
                    </p>
                  </div>
                  <div className="text-right text-xs text-gray-400">
                    {deal.reviewScore > 0 && <p>⭐ {deal.reviewScore.toFixed(1)}</p>}
                    {deal.freeWifi && <p>WiFi 무료</p>}
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-gray-400 text-sm">
          현재 특가 정보를 불러오는 중이에요
        </div>
      )}

      {/* 더보기 */}
      <div className="text-center mt-6">
        <Link
          href={current.slug}
          className="inline-block border border-orange-300 text-orange-500 hover:bg-orange-50 font-semibold text-sm px-6 py-3 rounded-xl transition-colors"
        >
          {current.name} 호텔 전체보기 →
        </Link>
      </div>
    </div>
  )
}
