'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const packSizes = [
  { size: 5, label: 'Quick Practice', description: '5 questions - Perfect for a quick review' },
  { size: 10, label: 'Standard Practice', description: '10 questions - Good for focused study' },
  { size: 15, label: 'Extended Practice', description: '15 questions - Comprehensive review' },
  { size: 20, label: 'Full Practice', description: '20 questions - Complete practice session' },
]

export default function PackSizeSelector() {
  const [selectedSize, setSelectedSize] = useState<number | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const router = useRouter()

  const handleCreatePack = async () => {
    if (!selectedSize) return

    setIsCreating(true)
    
    try {
      const response = await fetch('/api/packs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ size: selectedSize })
      })

      if (!response.ok) {
        throw new Error('Failed to create pack')
      }

      const data = await response.json()

      // Store pack data in localStorage for client-side retrieval
      localStorage.setItem(`pack-${data.packId}`, JSON.stringify(data))

      // Navigate to the practice page
      router.push(`/practice/${data.packId}`)
    } catch (error) {
      console.error('Error creating pack:', error)
      alert('Failed to create practice pack. Please try again.')
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="grid gap-6 mb-12">
        {packSizes.map(({ size, label, description }) => (
          <button
            key={size}
            onClick={() => setSelectedSize(size)}
            disabled={isCreating}
            className={`p-8 text-left border-2 rounded-2xl transition-all shadow-container hover:shadow-container-lg ${
              selectedSize === size
                ? 'border-purple-500 bg-custom-purple'
                : 'border-custom-purple/30 hover:border-purple-400 bg-white hover:bg-custom-white'
            } ${isCreating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading text-xl text-gray-900 mb-2 tracking-custom">
                  {label}
                </h3>
                <p className="font-body text-gray-700 tracking-custom">{description}</p>
              </div>
              <div className="font-heading text-4xl text-purple-600 tracking-custom">
                {size}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Custom size input */}
      <div className="mb-12 p-8 border-2 border-dashed border-custom-purple/50 rounded-2xl bg-custom-white shadow-container">
        <h3 className="font-heading text-xl text-gray-900 mb-6 tracking-custom">
          Custom Size
        </h3>
        <div className="flex items-center space-x-4">
          <input
            type="number"
            min="1"
            max="50"
            placeholder="Enter number of questions"
            onChange={(e) => {
              const value = parseInt(e.target.value)
              if (value > 0 && value <= 50) {
                setSelectedSize(value)
              }
            }}
            disabled={isCreating}
            className="flex-1 p-4 border-2 border-custom-purple/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-body tracking-custom shadow-container"
          />
          <span className="font-body text-gray-600 tracking-custom">questions (max 50)</span>
        </div>
      </div>

      {/* Create button */}
      <div className="text-center">
        <button
          onClick={handleCreatePack}
          disabled={!selectedSize || isCreating}
          className="px-12 py-5 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-heading rounded-xl hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-container-lg tracking-custom text-lg"
        >
          {isCreating ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating Pack...
            </span>
          ) : (
            `Create Practice Pack (${selectedSize || 0} questions)`
          )}
        </button>
      </div>

      {selectedSize && (
        <div className="mt-6 text-center font-body text-sm text-gray-600 tracking-custom">
          Estimated time: {Math.ceil(selectedSize * 1.5)} minutes
        </div>
      )}
    </div>
  )
}