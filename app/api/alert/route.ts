import { NextRequest, NextResponse } from 'next/server'
import { saveAlert } from '@/lib/redis'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const { email, hotelId, hotelName, targetPrice, currency = 'KRW' } = await req.json()

    if (!email || !hotelId || !hotelName || !targetPrice) {
      return NextResponse.json({ error: '필수 항목이 누락됐습니다.' }, { status: 400 })
    }

    // 이메일 기본 검증
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: '올바른 이메일을 입력해주세요.' }, { status: 400 })
    }

    await saveAlert({
      email,
      hotelId,
      hotelName,
      targetPrice: Number(targetPrice),
      currency,
      createdAt: Date.now(),
    })

    return NextResponse.json({ success: true, message: '알림이 등록됐습니다.' })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
  }
}
