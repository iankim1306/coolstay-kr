import { MetadataRoute } from 'next'

// 2026-11-03: 옛 해외 호텔 페이지는 검색 제외(X-Robots-Tag noindex) — 사이트맵을 비워 둔다.
export default function sitemap(): MetadataRoute.Sitemap {
  return []
}
