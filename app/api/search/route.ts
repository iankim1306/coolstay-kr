import { NextRequest, NextResponse } from 'next/server'
import { getAllHotels, hotelSlug } from '@/lib/hotels'
import { COUNTRIES } from '@/lib/destinations'

export const runtime = 'nodejs'

// 한국어 도시명 → 영문 slug 매핑
const KO_CITY_MAP: Record<string, string> = {}
for (const country of COUNTRIES) {
  for (const city of country.cities) {
    KO_CITY_MAP[city.name] = city.nameEn          // 오사카 → osaka
    KO_CITY_MAP[city.name.toLowerCase()] = city.nameEn
  }
}

type IndexItem = {
  name: string
  nameLower: string
  city: string       // 영문 slug
  cityKo: string     // 한국어
  country: string
  href: string
  stars: string
}

let _index: IndexItem[] | null = null

function getIndex(): IndexItem[] {
  if (!_index) {
    // 한국어 도시명 역매핑 (nameEn → name)
    const enToKo: Record<string, string> = {}
    for (const country of COUNTRIES) {
      for (const city of country.cities) {
        enToKo[city.nameEn] = city.name
      }
    }

    _index = getAllHotels().map(({ countrySlug, citySlug, hotel }) => ({
      name: hotel.name,
      nameLower: hotel.name.toLowerCase(),
      city: citySlug,
      cityKo: enToKo[citySlug] ?? citySlug,
      country: countrySlug,
      stars: hotel.star_rating,
      href: `/${countrySlug}/${citySlug}/hotel/${hotelSlug(hotel)}`,
    }))
  }
  return _index
}

export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get('q')?.trim() ?? ''
  if (raw.length < 1) return NextResponse.json([])

  const q = raw.toLowerCase()

  // 한국어 도시명을 영문으로 변환 (부분 매칭)
  const matchedEnCity = Object.entries(KO_CITY_MAP).find(([ko]) =>
    ko.includes(q) || q.includes(ko)
  )?.[1]

  const results = getIndex()
    .filter(h =>
      h.nameLower.includes(q) ||          // 호텔명 영문 매칭
      h.city.includes(q) ||               // 도시 영문 slug 매칭
      h.cityKo.includes(raw) ||           // 도시 한국어 매칭
      (matchedEnCity && h.city === matchedEnCity) // 한국어→영문 변환 매칭
    )
    .slice(0, 8)
    .map(h => ({
      name: h.name,
      city: h.cityKo,   // 한국어로 표시
      href: h.href,
      stars: h.stars,
    }))

  return NextResponse.json(results)
}
