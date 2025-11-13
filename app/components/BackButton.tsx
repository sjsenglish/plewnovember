'use client'

import { useRouter } from 'next/navigation'

export default function BackButton() {
  const router = useRouter()

  return (
    <div className="px-8 sm:px-12 py-4">
      <button
        onClick={() => router.back()}
        className="font-madimi px-8 py-4 text-gray-900 text-lg sm:text-xl font-bold rounded-2xl hover:opacity-90 transition-all duration-200"
        style={{
          backgroundColor: '#FFFFFF',
          boxShadow: '0 6px 12px 0 rgba(0, 0, 0, 0.15)'
        }}
      >
        ← Back
      </button>
    </div>
  )
}
