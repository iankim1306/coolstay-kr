import { NextRequest, NextResponse } from 'next/server'
import { fetchHotelPrice } from '@/lib/agoda-api'
import { cachePrice, getCachedPrice } from '@/lib/redis'

export const runtime = 'nodejs'

// 여러 호텔 가격을 한번에 조회 (도시 페이지용)
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const ids = searchParams.get('hotelIds')?.split(',').filter(Boolean) ?? []
  if (!ids.length) return NextResponse.json({})

  const results: Record<string, { dailyRate: number; discountPercentage: number; landingURL: string } | null> = {}

  await Promise.all(
    ids.map(async (id) => {
      const cached = await getCachedPrice(id)
      if (cached && typeof cached === 'object' && (cached as any).dailyRate) {
        results[id] = cached as any
        return
      }
      const price = await fetchHotelPrice(id)
      if (price) {
        await cachePrice(id, price)
        results[id] = { dailyRate: price.dailyRate, discountPercentage: price.discountPercentage, landingURL: price.landingURL }
      } else {
        results[id] = null
      }
    })
  )

  return NextResponse.json(results)
}
