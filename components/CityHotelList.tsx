'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type HotelItem = {
  hotel_id: string
  name: string
  address: string
  star_rating: string
  rating_average: string
  number_of_reviews: string
  photo: string
  href: string
}

type PriceMap = Record<string, { dailyRate: number; discountPercentage: number; landingURL: string } | null>

export default function CityHotelList({ hotels, cityName }: { hotels: HotelItem[]; cityName: string }) {
  const [prices, setPrices] = useState<PriceMap>({})

  useEffect(() => {
    const ids = hotels.map(h => h.hotel_id).join(',')
    fetch(`/api/prices?hotelIds=${ids}`)
      .then(r => r.json())
      .then(setPrices)
      .catch(() => {})
  }, [])

  const fmt = (n: number) => new Intl.NumberFormat('ko-KR').format(Math.round(n))

  return (
    <div className="mb-10">
      <div className="flex items-end justify-between mb-4">
        <h2 className="text-xl font-bold">{cityName} 인기 호텔 TOP {hotels.length}</h2>
        <span className="text-xs text-gray-400">실시간 아고다 가격</span>
      </div>
      <div className="space-y-4">
        {hotels.map((hotel, i) => {
          const rating = parseFloat(hotel.rating_average) || 0
          const reviews = parseInt(hotel.number_of_reviews) || 0
          const stars = parseInt(hotel.star_rating) || 0
          const price = prices[hotel.hotel_id]

          return (
            <Link
              key={hotel.hotel_id}
              href={hotel.href}
              className="group flex gap-4 bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg hover:border-orange-200 transition-all"
            >
              <div className="relative w-32 sm:w-48 h-32 sm:h-40 flex-shrink-0 overflow-hidden">
                {hotel.photo && (
                  <img
                    src={hotel.photo}
                    alt={hotel.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                )}
                <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold w-7 h-7 rounded-full flex items-center justify-center shadow">
                  {i + 1}
                </div>
              </div>
              <div className="flex-1 min-w-0 py-3 pr-3 flex flex-col justify-between">
                <div>
                  {stars > 0 && (
                    <div className="text-orange-400 text-xs mb-1">
                      {'★'.repeat(stars)}
                      <span className="text-gray-200">{'★'.repeat(5 - stars)}</span>
                    </div>
                  )}
                  <h3 className="font-bold text-gray-800 line-clamp-2 group-hover:text-orange-500 transition-colors text-sm sm:text-base mb-1">
                    {hotel.name}
                  </h3>
                  <p className="text-xs text-gray-400 line-clamp-1">📍 {hotel.address}</p>
                </div>
                <div className="flex items-center justify-between mt-2 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    {rating > 0 && (
                      <>
                        <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
                          {rating.toFixed(1)}
                        </span>
                        <span className="text-xs text-gray-500">리뷰 {reviews.toLocaleString()}</span>
                      </>
                    )}
                  </div>
                  {/* 실시간 가격 */}
                  <div className="flex items-center gap-1.5">
                    {prices[hotel.hotel_id] === undefined ? (
                      <span className="text-xs text-gray-300 animate-pulse">가격 로딩중...</span>
                    ) : price ? (
                      <>
                        <span className="text-orange-500 font-bold text-sm">₩{fmt(price.dailyRate)}</span>
                        {price.discountPercentage > 0 && (
                          <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded-full font-bold">
                            -{Math.round(price.discountPercentage)}%
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-xs text-gray-400">가격 확인 →</span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
