import { getStayList } from '@/lib/tourapi'

export async function GET() {
  const items = await getStayList({ areaCode: '32', numOfRows: 5 }) // 강원도 숙박 5개
  return Response.json({ count: items.length, items })
}
