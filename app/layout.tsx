import type { Metadata } from 'next'
import { Madimi_One, Figtree } from 'next/font/google'
import './globals.css'
import PasswordProtection from '@/components/PasswordProtection'

const madimiOne = Madimi_One({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-madimi',
  display: 'swap',
})

const figtree = Figtree({
  subsets: ['latin'],
  variable: '--font-figtree',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'PLEW - 독해 연습',
  description: 'AI 가이드 PLEW 방법으로 수능 영어 독해 마스터하기',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={`${madimiOne.variable} ${figtree.variable} font-figtree antialiased`}>
        <PasswordProtection>{children}</PasswordProtection>
      </body>
    </html>
  )
}