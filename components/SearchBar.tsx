'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

type Result = { name: string; city: string; href: string; stars: string }

// 한국어 도시 → 경로 매핑 (직접 도시 페이지 이동용)
const CITY_ROUTES: Record<string, string> = {
  '오사카': '/japan/osaka', '도쿄': '/japan/tokyo', '교토': '/japan/kyoto',
  '후쿠오카': '/japan/fukuoka', '나고야': '/japan/nagoya', '삿포로': '/japan/sapporo',
  '오키나와': '/japan/okinawa', '방콕': '/thailand/bangkok', '푸켓': '/thailand/phuket',
  '치앙마이': '/thailand/chiangmai', '파타야': '/thailand/pattaya', '후아힌': '/thailand/huahin',
  '다낭': '/vietnam/danang', '하노이': '/vietnam/hanoi', '호치민': '/vietnam/hochiminh',
  '호이안': '/vietnam/hoian', '나트랑': '/vietnam/nhatrang',
  '세부': '/philippines/cebu', '보라카이': '/philippines/boracay',
  '발리': '/indonesia/bali', '타이베이': '/taiwan/taipei',
  // 영문도 지원
  'osaka': '/japan/osaka', 'tokyo': '/japan/tokyo', 'kyoto': '/japan/kyoto',
  'fukuoka': '/japan/fukuoka', 'bangkok': '/thailand/bangkok', 'phuket': '/thailand/phuket',
  'bali': '/indonesia/bali', 'danang': '/vietnam/danang', 'taipei': '/taiwan/taipei',
}

export default function SearchBar() {
  const [q, setQ] = useState('')
  const [results, setResults] = useState<Result[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [noResult, setNoResult] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    setNoResult(false)
    if (q.length < 1) { setResults([]); setOpen(false); return }
    setLoading(true)
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
        const data = await res.json()
        setResults(data)
        setOpen(true)
        setNoResult(data.length === 0)
      } catch {
        setNoResult(true)
      } finally {
        setLoading(false)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [q])

  function handleSearch() {
    if (!q.trim()) return
    // 도시명 직접 매칭 → 도시 페이지로 이동
    const cityRoute = CITY_ROUTES[q.trim()] || CITY_ROUTES[q.trim().toLowerCase()]
    if (cityRoute) {
      router.push(cityRoute)
      return
    }
    // 결과 첫 번째 항목으로 이동
    if (results.length > 0) {
      router.push(results[0].href)
      return
    }
    // 없는 지역이면 아고다로 직행
    if (noResult) {
      window.open(`https://www.agoda.com/search?searchText=${encodeURIComponent(q)}&cid=1962399`, '_blank')
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleSearch()
  }

  return (
    <div ref={ref} className="relative w-full max-w-xl mx-auto">
      <div className="flex items-center bg-white rounded-2xl shadow-xl overflow-hidden">
        <span className="pl-4 text-gray-400 text-xl flex-shrink-0">🔍</span>
        <input
          type="text"
          value={q}
          onChange={e => setQ(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="도시 또는 호텔명 검색 (예: 도쿄, 오사카, Hilton)"
          className="flex-1 px-4 py-4 text-gray-800 text-sm outline-none bg-transparent min-w-0"
        />
        {loading && (
          <span className="pr-3 text-gray-300 text-sm animate-pulse flex-shrink-0">검색중...</span>
        )}
        <button
          onClick={handleSearch}
          className="flex-shrink-0 bg-orange-500 hover:bg-orange-600 text-white font-bold px-5 py-4 text-sm transition-colors"
        >
          검색
        </button>
      </div>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
          {results.length > 0 ? (
            results.map((r, i) => (
              <a
                key={i}
                href={r.href}
                className="flex items-center gap-3 px-4 py-3 hover:bg-orange-50 transition-colors border-b border-gray-50 last:border-0"
                onClick={() => setOpen(false)}
              >
                <span className="text-orange-400 text-sm flex-shrink-0">
                  {'★'.repeat(parseInt(r.stars) || 0)}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{r.name}</p>
                  <p className="text-xs text-gray-400">{r.city}</p>
                </div>
                <span className="text-orange-500 text-xs font-medium flex-shrink-0">보기 →</span>
              </a>
            ))
          ) : noResult ? (
            <div className="px-4 py-5 text-center text-sm text-gray-400">
              <p className="font-semibold text-gray-600 mb-1">"{q}" 준비중인 지역이에요</p>
              <p className="text-xs mb-3">아고다에서 직접 검색해보세요</p>
              <a
                href={`https://www.agoda.com/search?searchText=${encodeURIComponent(q)}&cid=1962399`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors"
                onClick={() => setOpen(false)}
              >
                아고다에서 "{q}" 검색하기 →
              </a>
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}
