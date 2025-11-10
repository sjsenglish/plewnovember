import type { Metadata } from 'next'
import './globals.css'

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
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}