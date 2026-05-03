import { NextResponse } from 'next/server'
import { COUNTRIES } from '@/lib/destinations'
import { getAllHotels, hotelSlug } from '@/lib/hotels'
import { getAllThemeCombos } from '@/lib/themes'
import { notifyIndexNow } from '@/lib/indexnow'
import { notifyGoogleIndexingBatch } from '@/lib/google-indexing'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

const BASE = 'https://coolstay.kr'

/** 매일 일정 수의 페이지를 IndexNow + Google Indexing API에 push */
export async function GET(req: Request) {
  // Vercel Cron 인증
  const authHeader = req.headers.get('authorization')
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  // 모든 정적 URL 수집
  const cityUrls: string[] = []
  for (const country of COUNTRIES) {
    cityUrls.push(`${BASE}/${country.slug}`)
    cityUrls.push(`${BASE}/en/${country.slug}`)
    for (const city of country.cities) {
      cityUrls.push(`${BASE}/${country.slug}/${city.nameEn}`)
      cityUrls.push(`${BASE}/en/${country.slug}/${city.nameEn}`)
    }
  }

  const themeUrls = getAllThemeCombos().flatMap(({ countrySlug, citySlug, theme }) => [
    `${BASE}/${countrySlug}/${citySlug}/${theme.slug}`,
    `${BASE}/en/${countrySlug}/${citySlug}/${theme.slug}`,
  ])

  // 호텔은 너무 많아서 (3,150 × 2 = 6,300) 일별 로테이션
  const allHotels = getAllHotels()
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
  const hotelChunkSize = 200 // Google Indexing API 일일 한도 200/day
  const hotelStart = (dayOfYear * hotelChunkSize) % allHotels.length
  const hotelChunk = allHotels.slice(hotelStart, hotelStart + hotelChunkSize)
  const hotelUrls = hotelChunk.flatMap(({ countrySlug, citySlug, hotel }) => [
    `${BASE}/${countrySlug}/${citySlug}/hotel/${hotelSlug(hotel)}`,
    `${BASE}/en/${countrySlug}/${citySlug}/hotel/${hotelSlug(hotel)}`,
  ])

  // IndexNow는 한 번에 최대 10,000 URL 가능 (Bing 권고)
  const indexNowUrls = [...cityUrls, ...themeUrls, ...hotelUrls].slice(0, 10000)
  const indexNowResult = await notifyIndexNow(indexNowUrls)

  // Google Indexing API는 호텔 URL만 (한도 200/day)
  const googleUrls = hotelUrls.slice(0, 200)
  const googleResult = await notifyGoogleIndexingBatch(googleUrls)

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    indexNow: indexNowResult,
    google: googleResult,
    rotation: { dayOfYear, hotelStart, totalHotels: allHotels.length },
  })
}
