'use client'

import { useEffect, useState } from 'react'
import type { AppListResponse } from '@/lib/roas/types'
import { AppIcon } from '../../ui'

export default function AppManage() {
  const [data, setData] = useState<AppListResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')
  const [platform, setPlatform] = useState<'ALL' | 'ANDROID' | 'IOS'>('ALL')

  useEffect(() => {
    let alive = true
    fetch('/api/roas/applist')
      .then((r) => r.json())
      .then((j: AppListResponse) => alive && setData(j))
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [])

  const apps = (data?.apps ?? []).filter((a) => {
    if (platform !== 'ALL' && a.platform !== platform) return false
    if (q && !`${a.appName} ${a.storeId}`.toLowerCase().includes(q.toLowerCase())) return false
    return true
  })

  const android = data?.apps.filter((a) => a.platform === 'ANDROID').length ?? 0
  const ios = data?.apps.filter((a) => a.platform === 'IOS').length ?? 0

  return (
    <div>
      {/* 요약 카드 */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <Stat label="등록된 앱" value={loading ? '…' : String(data?.apps.length ?? 0)} sub="관리 중인 앱" />
        <Stat label="Android" value={loading ? '…' : String(android)} sub="안드로이드 앱" />
        <Stat label="iOS" value={loading ? '…' : String(ios)} sub="iOS 앱" />
      </div>

      {/* 필터 */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="앱 검색 (이름·패키지명)"
          className="flex-1 min-w-[180px] rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
        />
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {(['ALL', 'ANDROID', 'IOS'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPlatform(p)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                platform === p ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {p === 'ALL' ? '전체' : p === 'ANDROID' ? 'Android' : 'iOS'}
            </button>
          ))}
        </div>
      </div>

      {/* 테이블 */}
      <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white">
        <table className="w-full text-sm whitespace-nowrap">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs">
              <th className="text-left font-medium px-4 py-2.5 w-10">#</th>
              <th className="text-left font-medium px-4 py-2.5">앱 이름</th>
              <th className="text-left font-medium px-4 py-2.5">패키지 / 스토어 ID</th>
              <th className="text-left font-medium px-4 py-2.5">플랫폼</th>
              <th className="text-left font-medium px-4 py-2.5">상태</th>
            </tr>
          </thead>
          <tbody>
            {loading && !data
              ? Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-t border-gray-100">
                    <td colSpan={5} className="px-4 py-3">
                      <div className="h-4 bg-gray-100 rounded animate-pulse" />
                    </td>
                  </tr>
                ))
              : apps.map((a, i) => (
                  <tr key={a.appId} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-2.5 text-gray-400">{i + 1}</td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-3">
                        <AppIcon name={a.appName} src={a.iconUrl} />
                        <span className="font-medium text-gray-800">{a.appName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-gray-500 font-mono text-xs">{a.storeId}</td>
                    <td className="px-4 py-2.5">
                      <span
                        className={`text-xs px-2 py-0.5 rounded ${
                          a.platform === 'IOS'
                            ? 'bg-gray-100 text-gray-700'
                            : 'bg-green-50 text-green-700'
                        }`}
                      >
                        {a.platform}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className={`text-xs px-2 py-0.5 rounded ${
                          a.approvalState === 'APPROVED'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {a.approvalState}
                      </span>
                    </td>
                  </tr>
                ))}
            {data && apps.length === 0 && (
              <tr className="border-t border-gray-100">
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                  조건에 맞는 앱이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {data?.source === 'sample' && (
        <p className="text-xs text-amber-600 mt-2">⚠️ 샘플 데이터 (애드몹 미연결 시)</p>
      )}
    </div>
  )
}

function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white px-4 py-4 shadow-sm">
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-xs text-gray-400 mt-1">{sub}</div>
    </div>
  )
}
