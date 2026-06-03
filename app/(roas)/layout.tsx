import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import '../globals.css'
import Shell from './Shell'

const geist = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ROAS 대시보드',
  description: '구글 애즈 광고비 ↔ 애드몹 앱 수익(ROAS) 측정 도구',
  robots: { index: false, follow: false }, // 비공개 도구
}

export default function RoasGroupLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={geist.variable}>
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        <Shell>{children}</Shell>
      </body>
    </html>
  )
}
