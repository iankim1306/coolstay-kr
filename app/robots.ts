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
    sitemap: [
      'https://coolstay.kr/sitemap.xml',
      'https://coolstay.kr/sitemap-cities/sitemap.xml',
      'https://coolstay.kr/sitemap-themes/sitemap.xml',
      'https://coolstay.kr/sitemap-hotels/sitemap.xml',
      'https://coolstay.kr/sitemap-images/sitemap.xml',
    ],
    host: 'https://coolstay.kr',
  }
}
