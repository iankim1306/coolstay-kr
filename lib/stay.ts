// 국내 숙박·여행 지원 정보 글 (2026-11 개편 — 애드센스 심사 대비)
// 글 데이터는 lib/stay-posts.json. publishAt 이 오늘(UTC, 빌드 시점) 이후인 글은
// 페이지·목록·사이트맵 어디에도 나오지 않는다. 공개일에는
// .github/workflows/daily-publish.yml 이 빈 커밋을 올려 Vercel 이 다시 빌드한다.
import data from './stay-posts.json'

export type Block =
  | { h2: string }
  | { h3: string }
  | { p: string }
  | { ul: string[] }
  | { ol: string[] }

export type StayPost = {
  slug: string
  title: string
  description: string
  category: string
  publishAt: string // YYYY-MM-DD
  body: Block[]
  sources?: { name: string; url: string }[]
}

export const SITE_NAME = '쿨스테이'
export const BASE = 'https://coolstay.kr'
export const UPDATED = '2026-11-03'

export const CATEGORIES = [
  { key: '지원 제도', slug: 'support', desc: '숙박 할인권·휴가 지원·문화누리카드처럼 나라와 지자체가 여행비를 보태 주는 제도' },
  { key: '예약·환불', slug: 'booking', desc: '예약 전 확인할 것, 취소·환불 기준, 분쟁이 생겼을 때 대처법' },
  { key: '안전', slug: 'safety', desc: '펜션·캠핑장·겨울 숙소에서 꼭 지킬 안전 수칙' },
  { key: '여행 준비', slug: 'prepare', desc: '반려동물·아이·혼자 여행 등 상황별 숙소 고르는 법' },
  { key: '시즌 여행', slug: 'season', desc: '온천·해돋이·겨울 축제·비수기 제주처럼 계절에 맞춘 여행 계획' },
  { key: '알뜰 여행', slug: 'saving', desc: '예산 짜기, 평일 숙박, 기차 여행, 지역화폐로 경비 줄이기' },
] as const

const TODAY = new Date().toISOString().slice(0, 10)
const ALL = data as StayPost[]

export function getLivePosts(): StayPost[] {
  return ALL.filter((p) => p.publishAt <= TODAY).sort((a, b) =>
    a.publishAt < b.publishAt ? 1 : a.publishAt > b.publishAt ? -1 : 0,
  )
}

export function getLivePost(slug: string): StayPost | undefined {
  return getLivePosts().find((p) => p.slug === slug)
}

export function categorySlug(key: string): string {
  return CATEGORIES.find((c) => c.key === key)?.slug ?? 'etc'
}

export function plainText(body: Block[]): string {
  return body
    .map((b) => ('h2' in b ? b.h2 : 'h3' in b ? b.h3 : 'p' in b ? b.p : 'ul' in b ? b.ul.join(' ') : b.ol.join(' ')))
    .join(' ')
}
