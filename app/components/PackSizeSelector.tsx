'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './PackSizeSelector.module.css'

const packSizes = [
  { size: 5, label: 'Quick Practice', description: '5 questions - Perfect for a quick review' },
  { size: 10, label: 'Standard Practice', description: '10 questions - Good for focused study' },
  { size: 15, label: 'Extended Practice', description: '15 questions - Comprehensive review' },
  { size: 20, label: 'Full Practice', description: '20 questions - Complete practice session' },
]

interface PackSizeSelectorProps {
  level?: number
}

export default function PackSizeSelector({ level }: PackSizeSelectorProps) {
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
        body: JSON.stringify({ size: selectedSize, level })
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
    <div className={styles.container}>
      {/* Row 1: First 3 pack options */}
      <div className={styles.row1}>
        {packSizes.slice(0, 3).map(({ size, label, description }) => (
          <button
            key={size}
            onClick={() => setSelectedSize(size)}
            disabled={isCreating}
            className={`${styles.packButton} ${selectedSize === size ? styles.selected : ''} ${isCreating ? styles.disabled : ''}`}
          >
            <div className={styles.packContent}>
              <div className={styles.packInfo}>
                <h3 className={styles.packLabel}>
                  {label}
                </h3>
                <p className={styles.packDescription}>{description}</p>
              </div>
              <div className={styles.packSize}>
                {size}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Row 2: 4th pack option and custom size */}
      <div className={styles.row2}>
        {/* 4th pack option */}
        {packSizes.slice(3, 4).map(({ size, label, description }) => (
          <button
            key={size}
            onClick={() => setSelectedSize(size)}
            disabled={isCreating}
            className={`${styles.packButton} ${selectedSize === size ? styles.selected : ''} ${isCreating ? styles.disabled : ''}`}
          >
            <div className={styles.packContent}>
              <div className={styles.packInfo}>
                <h3 className={styles.packLabel}>
                  {label}
                </h3>
                <p className={styles.packDescription}>{description}</p>
              </div>
              <div className={styles.packSize}>
                {size}
              </div>
            </div>
          </button>
        ))}

        {/* Custom size input */}
        <div className={styles.customSizeContainer}>
          <h3 className={styles.customSizeTitle}>
            Custom Size
          </h3>
          <div className={styles.customInputGroup}>
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
              className={styles.customInput}
            />
            <span className={styles.customInputLabel}>questions (max 50)</span>
          </div>
        </div>
      </div>

      {/* Row 3: Create button */}
      <div className={styles.row3}>
        <div className={styles.createButtonContainer}>
          <button
            onClick={handleCreatePack}
            disabled={!selectedSize || isCreating}
            className={styles.createButton}
          >
            {isCreating ? (
              <span className={styles.spinner}>
                <svg className={styles.spinnerIcon} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
          <div className={styles.estimatedTime}>
            Estimated time: {Math.ceil(selectedSize * 1.5)} minutes
          </div>
        )}
      </div>
    </div>
  )
}