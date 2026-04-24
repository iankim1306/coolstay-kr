import { NextRequest, NextResponse } from 'next/server'
import { getAllAlertKeys, deleteAlert, redis } from '@/lib/redis'
import { fetchHotelPrice } from '@/lib/agoda-api'
import { Resend } from 'resend'
import type { PriceAlert } from '@/lib/redis'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function GET(req: NextRequest) {
  // Vercel Cron 보안 헤더 검증
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const keys = await getAllAlertKeys()
  if (!keys.length) return NextResponse.json({ checked: 0 })

  const resend = new Resend(process.env.RESEND_API_KEY)
  let sent = 0

  for (const key of keys) {
    const alert = await redis.get<PriceAlert>(key)
    if (!alert) continue

    const price = await fetchHotelPrice(alert.hotelId)
    if (!price) continue

    // 목표가 이하면 이메일 발송
    if (price.dailyRate <= alert.targetPrice) {
      const formattedPrice = new Intl.NumberFormat('ko-KR').format(Math.round(price.dailyRate))
      const formattedTarget = new Intl.NumberFormat('ko-KR').format(alert.targetPrice)

      await resend.emails.send({
        from: 'COOLSTAY 알림 <noreply@coolstay.kr>',
        to: alert.email,
        subject: `🔥 [쿨스테이] ${alert.hotelName} 목표가 달성! ₩${formattedPrice}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #f97316; padding: 24px; border-radius: 12px 12px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 22px;">🔥 호텔 특가 알림</h1>
            </div>
            <div style="background: white; padding: 24px; border: 1px solid #e5e7eb; border-radius: 0 0 12px 12px;">
              <p style="font-size: 16px; color: #111827;">
                <strong>${alert.hotelName}</strong>의 가격이 목표가에 도달했습니다!
              </p>
              <div style="background: #fff7ed; border: 1px solid #fed7aa; border-radius: 8px; padding: 16px; margin: 16px 0;">
                <p style="margin: 4px 0; color: #9ca3af; text-decoration: line-through;">기존가: ₩${new Intl.NumberFormat('ko-KR').format(Math.round(price.crossedOutRate))}</p>
                <p style="margin: 4px 0; font-size: 24px; font-weight: bold; color: #f97316;">현재가: ₩${formattedPrice}</p>
                <p style="margin: 4px 0; color: #6b7280;">목표가: ₩${formattedTarget} 이하</p>
                ${price.discountPercentage > 0 ? `<p style="margin: 8px 0 0; color: #16a34a; font-weight: bold;">-${Math.round(price.discountPercentage)}% 할인 중</p>` : ''}
              </div>
              ${price.freeWifi ? '<p style="color: #6b7280; font-size: 14px;">✓ 무료 WiFi 포함</p>' : ''}
              ${price.includeBreakfast ? '<p style="color: #6b7280; font-size: 14px;">✓ 조식 포함</p>' : ''}
              <a href="${price.landingURL}"
                style="display: block; background: #f97316; color: white; text-align: center; padding: 14px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; margin-top: 20px;">
                지금 예약하기 →
              </a>
              <p style="color: #9ca3af; font-size: 12px; margin-top: 16px; text-align: center;">
                이 알림은 1회 발송 후 자동 삭제됩니다.<br>
                <a href="https://coolstay.kr" style="color: #f97316;">쿨스테이</a>
              </p>
            </div>
          </div>
        `,
      })

      // 발송 완료 후 알림 삭제
      await deleteAlert(alert.hotelId, alert.email)
      sent++
    }
  }

  return NextResponse.json({ checked: keys.length, sent })
}
