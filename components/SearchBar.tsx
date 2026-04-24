'use client'

import { useState, useEffect, useRef } from 'react'

type Result = { name: string; city: string; href: string; stars: string }

export default function SearchBar() {
  const [q, setQ] = useState('')
  const [results, setResults] = useState<Result[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    if (q.length < 2) { setResults([]); setOpen(false); return }
    setLoading(true)
    const timer = setTimeout(async () => {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      setResults(data)
      setOpen(data.length > 0)
      setLoading(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [q])

  return (
    <div ref={ref} className="relative w-full max-w-xl mx-auto">
      <div className="flex items-center bg-white rounded-2xl shadow-xl overflow-hidden">
        <span className="pl-4 text-gray-400 text-xl">🔍</span>
        <input
          type="text"
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="호텔명 또는 도시를 검색하세요 (예: 오사카, Hilton)"
          className="flex-1 px-4 py-4 text-gray-800 text-sm outline-none bg-transparent"
        />
        {loading && <span className="pr-4 text-gray-400 text-sm animate-pulse">검색중...</span>}
      </div>

      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
          {results.map((r, i) => (
            <a
              key={i}
              href={r.href}
              className="flex items-center gap-3 px-4 py-3 hover:bg-orange-50 transition-colors border-b border-gray-50 last:border-0"
              onClick={() => setOpen(false)}
            >
              <span className="text-orange-400 text-sm">
                {'★'.repeat(parseInt(r.stars) || 0)}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{r.name}</p>
                <p className="text-xs text-gray-400">{r.city}</p>
              </div>
              <span className="text-orange-500 text-xs font-medium">보기 →</span>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
