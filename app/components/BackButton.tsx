'use client'

import { useRouter } from 'next/navigation'

export default function BackButton() {
  const router = useRouter()

  return (
    <div className="px-4 sm:px-6 py-4">
      <button
        onClick={() => router.back()}
        className="bg-white font-madimi px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 text-gray-900 text-base sm:text-lg"
        style={{
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        }}
      >
        ← Back
      </button>
    </div>
  )
}
