import { NextRequest, NextResponse } from 'next/server'
import { fetchHotelPrice } from '@/lib/agoda-api'
import { cachePrice, getCachedPrice } from '@/lib/redis'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const hotelId = searchParams.get('hotelId')
  const checkin = searchParams.get('checkin') ?? undefined
  const checkout = searchParams.get('checkout') ?? undefined

  if (!hotelId) {
    return NextResponse.json({ error: 'hotelId required' }, { status: 400 })
  }

  // 날짜 파라미터 없으면 캐시 사용
  if (!checkin && !checkout) {
    const cached = await getCachedPrice(hotelId)
    if (cached) {
      return NextResponse.json(cached, {
        headers: { 'X-Cache': 'HIT' },
      })
    }
  }

  const price = await fetchHotelPrice(hotelId, checkin, checkout)

  if (!price) {
    return NextResponse.json({ error: 'No price available' }, { status: 404 })
  }

  // 기본 조회(날짜 미지정)만 캐시
  if (!checkin && !checkout) {
    await cachePrice(hotelId, price)
  }

  return NextResponse.json(price)
}
