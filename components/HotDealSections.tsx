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

export type CityDealsSection = {
  name: string
  slug: string
  flag: string         // 국기 이모지
  deals: Deal[]
  isNew?: boolean
  viewAllLabel?: string
}

interface HotDealSectionsProps {
  cities: CityDealsSection[]
  /** locale = 'ko' | 'en' — 가격/리뷰 라벨 등 */
  locale?: 'ko' | 'en'
}

/**
 * 도시별 인기 호텔을 탭 없이 세로 섹션으로 모두 펼쳐 노출
 * 한 번에 많은 호텔 + 한국 호텔 메인 강조
 */
export default function HotDealSections({ cities, locale = 'ko' }: HotDealSectionsProps) {
  const visible = cities.filter(c => c.deals.length > 0)
  if (visible.length === 0) return null

  // 가격 포맷 (한국어: ₩, 영어: USD 환산)
  const fmt = (krwAmount: number) => {
    if (locale === 'en') {
      const usd = Math.round(krwAmount * 0.00074)
      return `$${usd.toLocaleString('en-US')}`
    }
    return `₩${new Intl.NumberFormat('ko-KR').format(Math.round(krwAmount))}`
  }

  const labels = locale === 'en'
    ? { perNight: '/night', wifi: 'Free WiFi', viewAll: 'View all', hotels: 'Popular Hotels', newBadge: 'NEW' }
    : { perNight: '/박', wifi: 'WiFi 무료', viewAll: '전체보기', hotels: '인기 호텔', newBadge: 'NEW' }

  return (
    <div className="space-y-12">
      {visible.map((city) => (
        <div key={city.name}>
          {/* 도시 섹션 헤더 */}
          <div className="flex items-end justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{city.flag}</span>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                {city.name} {labels.hotels}
              </h3>
              {city.isNew && (
                <span className="text-[10px] bg-red-500 text-white font-bold px-2 py-0.5 rounded-full">
                  {labels.newBadge}
                </span>
              )}
            </div>
            <Link
              href={city.slug}
              className="text-sm text-orange-500 hover:text-orange-600 font-semibold whitespace-nowrap"
            >
              {city.viewAllLabel || `${labels.viewAll} →`}
            </Link>
          </div>

          {/* 호텔 카드 그리드 */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {city.deals.slice(0, 6).map((deal) => (
              <a
                key={deal.hotelId}
                href={deal.landingURL}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="group bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg hover:border-orange-200 transition-all"
              >
                {deal.imageURL && (
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img
                      src={deal.imageURL.replace('?s=', '?s=400x')}
                      alt={deal.hotelName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    {deal.discountPercentage > 0 && (
                      <span className="absolute top-2 right-2 text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded-full font-bold">
                        -{Math.round(deal.discountPercentage)}%
                      </span>
                    )}
                  </div>
                )}
                <div className="p-2.5">
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-orange-400 text-[10px]">
                      {'★'.repeat(Math.round(deal.starRating || 0))}
                    </span>
                    {deal.reviewScore > 0 && (
                      <span className="ml-auto text-[10px] text-gray-500">⭐ {deal.reviewScore.toFixed(1)}</span>
                    )}
                  </div>
                  <h4 className="font-semibold text-gray-800 text-xs line-clamp-2 mb-1.5 group-hover:text-orange-500 transition-colors min-h-[2.5em]">
                    {deal.hotelName}
                  </h4>
                  <div>
                    {deal.crossedOutRate > deal.dailyRate && (
                      <p className="text-[10px] text-gray-400 line-through">{fmt(deal.crossedOutRate)}</p>
                    )}
                    <p className="text-sm font-bold text-orange-500">
                      {fmt(deal.dailyRate)}
                      <span className="text-[10px] font-normal text-gray-400">{labels.perNight}</span>
                    </p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
