import type { Metadata } from 'next'
import { Madimi_One, Figtree, Inter } from 'next/font/google'
import './globals.css'

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

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'PLEW - Reading Comprehension Practice',
  description: 'Master CSAT English reading comprehension with AI-guided PLEW method',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${madimiOne.variable} ${figtree.variable} ${inter.variable} font-figtree antialiased`}>{children}</body>
    </html>
  )
}