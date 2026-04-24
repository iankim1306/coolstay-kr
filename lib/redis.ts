import { Redis } from '@upstash/redis'

let _redis: Redis | null = null
export function getRedis(): Redis {
  if (!_redis) _redis = Redis.fromEnv()
  return _redis
}
// 하위 호환용 (직접 import해서 쓰던 곳)
export const redis = new Proxy({} as Redis, {
  get(_, prop) {
    return (getRedis() as any)[prop]
  },
})

export type PriceAlert = {
  email: string
  hotelId: string
  hotelName: string
  targetPrice: number
  currency: string
  createdAt: number
}

/** 알림 구독 저장 */
export async function saveAlert(alert: PriceAlert) {
  const key = `alert:${alert.hotelId}:${alert.email}`
  await redis.set(key, JSON.stringify(alert), { ex: 60 * 60 * 24 * 90 }) // 90일 보관
  await redis.sadd(`alerts:hotel:${alert.hotelId}`, alert.email)
  await redis.sadd('alerts:all', key)
}

/** 특정 호텔의 모든 알림 구독 조회 */
export async function getAlertsByHotel(hotelId: string): Promise<PriceAlert[]> {
  const emails = await redis.smembers(`alerts:hotel:${hotelId}`)
  if (!emails.length) return []
  const keys = emails.map((e) => `alert:${hotelId}:${e}`)
  const results = await Promise.all(keys.map((k) => redis.get<PriceAlert>(k)))
  return results.filter(Boolean) as PriceAlert[]
}

/** 전체 알림 키 조회 (cron용) */
export async function getAllAlertKeys(): Promise<string[]> {
  return redis.smembers('alerts:all')
}

/** 알림 삭제 (발송 후) */
export async function deleteAlert(hotelId: string, email: string) {
  const key = `alert:${hotelId}:${email}`
  await redis.del(key)
  await redis.srem(`alerts:hotel:${hotelId}`, email)
  await redis.srem('alerts:all', key)
}

/** 가격 캐시 저장 (6시간) */
export async function cachePrice(hotelId: string, data: unknown) {
  await redis.set(`price:${hotelId}`, JSON.stringify(data), { ex: 60 * 60 * 6 })
}

/** 가격 캐시 조회 */
export async function getCachedPrice(hotelId: string) {
  return redis.get(`price:${hotelId}`)
}
