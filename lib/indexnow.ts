// IndexNow protocol — Bing/Yandex/Seznam 즉시 색인 통보
// https://www.indexnow.org/

const INDEXNOW_KEY = 'a7f3c8d2b9e64517afd29c186b4e7a35'
const HOST = 'coolstay.kr'
const KEY_LOCATION = `https://${HOST}/${INDEXNOW_KEY}.txt`

/** 단일 URL 또는 URL 배열을 IndexNow에 통보 */
export async function notifyIndexNow(urls: string | string[]): Promise<{ ok: boolean; status: number; submitted: number }> {
  const urlList = (Array.isArray(urls) ? urls : [urls]).filter(Boolean)
  if (urlList.length === 0) return { ok: true, status: 200, submitted: 0 }

  // Bing이 IndexNow 메인 엔드포인트
  const endpoint = 'https://api.indexnow.org/IndexNow'
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: HOST,
        key: INDEXNOW_KEY,
        keyLocation: KEY_LOCATION,
        urlList,
      }),
    })
    return { ok: res.ok, status: res.status, submitted: urlList.length }
  } catch (err) {
    console.error('[IndexNow] failed:', err)
    return { ok: false, status: 0, submitted: 0 }
  }
}
