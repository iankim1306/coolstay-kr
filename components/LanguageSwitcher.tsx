'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

export default function LanguageSwitcher() {
  const pathname = usePathname() || '/'
  const isEn = pathname === '/en' || pathname.startsWith('/en/')

  // 현재 페이지의 다른 언어 버전 URL 계산
  const koUrl = isEn ? (pathname === '/en' ? '/' : pathname.replace(/^\/en/, '')) : pathname
  const enUrl = isEn ? pathname : (pathname === '/' ? '/en' : `/en${pathname}`)

  return (
    <div className="flex items-center gap-1 text-xs">
      <Link
        href={koUrl}
        className={`px-2 py-1 rounded ${!isEn ? 'bg-gray-900 text-white font-semibold' : 'text-gray-500 hover:text-gray-900'}`}
      >
        🇰🇷 KO
      </Link>
      <Link
        href={enUrl}
        className={`px-2 py-1 rounded ${isEn ? 'bg-gray-900 text-white font-semibold' : 'text-gray-500 hover:text-gray-900'}`}
      >
        🇺🇸 EN
      </Link>
    </div>
  )
}
