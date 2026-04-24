import { NextRequest, NextResponse } from 'next/server'
import { getAllHotels, hotelSlug } from '@/lib/hotels'

export const runtime = 'nodejs'

let _index: Array<{ name: string; city: string; country: string; slug: string; href: string; stars: string }> | null = null

function getIndex() {
  if (!_index) {
    _index = getAllHotels().map(({ countrySlug, citySlug, hotel }) => ({
      name: hotel.name,
      city: hotel.city,
      country: countrySlug,
      slug: citySlug,
      stars: hotel.star_rating,
      href: `/${countrySlug}/${citySlug}/hotel/${hotelSlug(hotel)}`,
    }))
  }
  return _index
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim().toLowerCase() ?? ''
  if (q.length < 2) return NextResponse.json([])

  const results = getIndex()
    .filter(h => h.name.toLowerCase().includes(q) || h.city.toLowerCase().includes(q))
    .slice(0, 8)
    .map(h => ({ name: h.name, city: h.city, href: h.href, stars: h.stars }))

  return NextResponse.json(results)
}
