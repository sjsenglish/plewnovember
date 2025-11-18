'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import styles from './PackSizeSelector.module.css'

const packSizes = [
  { size: 1, label: '데일리 연습', description: '1문제 - 빠른 복습에 완벽' },
  { size: 5, label: '추가 연습', description: '5문제 - 집중 학습에 좋음' },
  { size: 10, label: '확장 연습', description: '10문제 - 종합적인 복습' },
  { size: 15, label: '완전 연습', description: '15문제 - 완전한 연습 세션' },
]

interface PackSizeSelectorProps {
  level?: number
}

export default function PackSizeSelector({ level }: PackSizeSelectorProps) {
  const [selectedSize, setSelectedSize] = useState<number | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isDemoCompleted, setIsDemoCompleted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if demo is completed
    const demoCompleted = localStorage.getItem('demo-completed')
    setIsDemoCompleted(demoCompleted === 'true')
  }, [])

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
      {/* Demo Button Row */}
      {!isDemoCompleted && (
        <div className={styles.demoRow}>
          <button
            onClick={() => router.push('/demo')}
            className={styles.demoButton}
          >
            <div className={styles.demoContent}>
              <div className={styles.demoIcon}>🎓</div>
              <div className={styles.demoInfo}>
                <h3 className={styles.demoTitle}>데모 시작</h3>
                <p className={styles.demoDescription}>
                  가이드 데모로 PLEW 버디 사용법을 배우세요
                </p>
              </div>
            </div>
          </button>
        </div>
      )}

      {!isDemoCompleted && (
        <div className={styles.lockNotice}>
          <p className={styles.lockText}>
            🔒 연습 팩을 잠금 해제하려면 위의 데모를 완료하세요
          </p>
        </div>
      )}

      {/* Row 1: First 3 pack options */}
      <div className={styles.row1}>
        {packSizes.slice(0, 3).map(({ size, label, description }) => (
          <button
            key={size}
            onClick={() => isDemoCompleted && setSelectedSize(size)}
            disabled={isCreating || !isDemoCompleted}
            className={`${styles.packButton} ${selectedSize === size ? styles.selected : ''} ${(isCreating || !isDemoCompleted) ? styles.disabled : ''}`}
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
            onClick={() => isDemoCompleted && setSelectedSize(size)}
            disabled={isCreating || !isDemoCompleted}
            className={`${styles.packButton} ${selectedSize === size ? styles.selected : ''} ${(isCreating || !isDemoCompleted) ? styles.disabled : ''}`}
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
            맞춤 크기
          </h3>
          <div className={styles.customInputGroup}>
            <input
              type="number"
              min="1"
              max="50"
              placeholder="문제 수 입력"
              onChange={(e) => {
                const value = parseInt(e.target.value)
                if (isDemoCompleted && value > 0 && value <= 50) {
                  setSelectedSize(value)
                }
              }}
              disabled={isCreating || !isDemoCompleted}
              className={styles.customInput}
            />
            <span className={styles.customInputLabel}>문제 (최대 50)</span>
          </div>
        </div>
      </div>

      {/* Row 3: Create button */}
      <div className={styles.row3}>
        <div className={styles.createButtonContainer}>
          <button
            onClick={handleCreatePack}
            disabled={!selectedSize || isCreating || !isDemoCompleted}
            className={styles.createButton}
          >
            {isCreating ? (
              <span className={styles.spinner}>
                <svg className={styles.spinnerIcon} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                팩 생성 중...
              </span>
            ) : (
              `연습 팩 생성 (${selectedSize || 0}문제)`
            )}
          </button>
        </div>

        {selectedSize && (
          <div className={styles.estimatedTime}>
            예상 시간: {Math.ceil(selectedSize * 1.5)}분
          </div>
        )}
      </div>
    </div>
  )
}