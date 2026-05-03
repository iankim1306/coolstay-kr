import { MetadataRoute } from 'next'
import { getAllHotels, hotelSlug, hotelPhotoUrl } from '@/lib/hotels'

// Image sitemap — Google Image 검색 트래픽 흡수
// 호텔 페이지마다 대표 이미지 + 메타 정보
export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://coolstay.kr'
  const now = new Date()

  // 호텔 페이지 + 호텔 사진 (각 호텔당 최대 5장)
  return getAllHotels().slice(0, 5000).map(({ countrySlug, citySlug, hotel }) => {
    const url = `${base}/${countrySlug}/${citySlug}/hotel/${hotelSlug(hotel)}`
    const images = hotel.photos.slice(0, 5).map(p => hotelPhotoUrl(p, 1280))
    return {
      url,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
      images,
    }
  })
}
