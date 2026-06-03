// 멀티유저 세션 — 로그인 시 유저 refresh token + 게시자ID를 Redis에 저장,
// 쿠키엔 불투명 세션ID만. 데이터 호출 때 세션→access token으로 변환.
import { getRedis } from '@/lib/redis'
import { accessTokenFromRefresh } from './oauth'
import type { AdmobAuth } from './types'

export const SESSION_COOKIE = 'roas_session'
const PREFIX = 'roassess:'
const TTL = 60 * 60 * 24 * 60 // 60일

export type SessionData = {
  refreshToken: string
  publisherId: string
  email: string
}

export function newSessionId(): string {
  return (crypto.randomUUID() + crypto.randomUUID()).replace(/-/g, '')
}

export async function saveSession(id: string, data: SessionData): Promise<void> {
  await getRedis().set(PREFIX + id, JSON.stringify(data), { ex: TTL })
}

export async function readSession(id: string | undefined): Promise<SessionData | null> {
  if (!id) return null
  try {
    return await getRedis().get<SessionData>(PREFIX + id)
  } catch {
    return null
  }
}

export async function deleteSession(id: string | undefined): Promise<void> {
  if (!id) return
  try {
    await getRedis().del(PREFIX + id)
  } catch {
    // 무시
  }
}

/** 세션ID → 애드몹 호출 인증 (access token + 게시자ID). 없으면 null */
export async function getSessionAuth(id: string | undefined): Promise<AdmobAuth | null> {
  const s = await readSession(id)
  if (!s || !s.publisherId) return null
  const token = await accessTokenFromRefresh(s.refreshToken)
  if (!token) return null
  return { accessToken: token, publisherId: s.publisherId }
}
