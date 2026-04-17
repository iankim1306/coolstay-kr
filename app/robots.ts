import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
      // 네이버 크롤러 명시적 허용
      {
        userAgent: 'Yeti',
        allow: '/',
      },
      // 구글봇
      {
        userAgent: 'Googlebot',
        allow: '/',
      },
    ],
    sitemap: 'https://coolstay.kr/sitemap.xml',
    host: 'https://coolstay.kr',
  }
}
