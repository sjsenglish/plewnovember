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
      <div className="grid gap-4 mb-8">
        {packSizes.map(({ size, label, description }) => (
          <button
            key={size}
            onClick={() => setSelectedSize(size)}
            disabled={isCreating}
            className={`p-6 text-left border-2 rounded-xl transition-all ${
              selectedSize === size
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            } ${isCreating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {label}
                </h3>
                <p className="text-gray-600">{description}</p>
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {size}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Custom size input */}
      <div className="mb-8 p-6 border-2 border-dashed border-gray-300 rounded-xl">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Custom Size
        </h3>
        <div className="flex items-center space-x-3">
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
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <span className="text-gray-500">questions (max 50)</span>
        </div>
      </div>

      {/* Create button */}
      <div className="text-center">
        <button
          onClick={handleCreatePack}
          disabled={!selectedSize || isCreating}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
        <div className="mt-4 text-center text-sm text-gray-600">
          Estimated time: {Math.ceil(selectedSize * 1.5)} minutes
        </div>
      )}
    </div>
  )
}