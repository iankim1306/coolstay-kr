import { MetadataRoute } from 'next'
import { BASE, getLivePosts, UPDATED } from '@/lib/stay'

// 2026-11-03 개편: 국내 숙박·여행 정보 글만 싣는다.
// 옛 해외 호텔 페이지(나라·도시·호텔·근처·가이드·영어판)는 검색 제외라 빠졌다.
export default function sitemap(): MetadataRoute.Sitemap {
  const fixed = ['', '/info', '/about', '/privacy', '/contact'].map((p) => ({
    url: `${BASE}${p}`,
    lastModified: new Date(UPDATED),
  }))
  const posts = getLivePosts().map((p) => ({
    url: `${BASE}/info/${p.slug}`,
    lastModified: new Date(p.publishAt),
  }))
  return [...fixed, ...posts]
}
