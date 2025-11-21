'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/context/AuthContext'
import { useUserAccess } from '@/app/hooks/useUserAccess'
import UpgradeModal from '@/app/components/UpgradeModal'
import styles from './PackSizeSelector.module.css'

interface Pack {
  id: string
  questions: any[]
  number: number
}

interface FilteredPacks {
  [key: string]: Pack[]
}

interface CompletedPacksData {
  [packId: string]: boolean
}

interface PackSizeSelectorProps {
  level?: number
}

export default function PackSizeSelector({ level }: PackSizeSelectorProps) {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState({
    primarySubjectArea: '',
    passageType: '',
    questionSkill: '',
    source: ''
  })
  const [filteredPacks, setFilteredPacks] = useState<FilteredPacks>({})
  const [completedPacks, setCompletedPacks] = useState<CompletedPacksData>({})
  const [isLoading, setIsLoading] = useState(false)
  const [dailyQuestionId, setDailyQuestionId] = useState<string | null>(null)
  const [filterOptions, setFilterOptions] = useState({
    primarySubjectArea: [] as string[],
    passageType: [] as string[],
    questionSkill: [] as string[],
    source: [] as string[]
  })

  const router = useRouter()
  const { user } = useAuth()
  const { access, refresh: refreshAccess } = useUserAccess(user?.email || null)

  // Get daily question ID based on current date
  useEffect(() => {
    const getDailyQuestionId = async () => {
      try {
        const response = await fetch('/api/daily-question')
        const data = await response.json()
        if (data.questionId) {
          setDailyQuestionId(data.questionId)
        }
      } catch (error) {
        console.error('Error fetching daily question:', error)
      }
    }
    getDailyQuestionId()
  }, [])

  // Load filter options
  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const response = await fetch('/api/filter-options')
        const data = await response.json()
        if (data.options) {
          setFilterOptions(data.options)
        }
      } catch (error) {
        console.error('Error loading filter options:', error)
      }
    }
    loadFilterOptions()
  }, [])

  // Load completed packs from Supabase
  useEffect(() => {
    const loadCompletedPacks = async () => {
      if (!user?.email) return

      try {
        const response = await fetch('/api/completed-filter-packs')
        const data = await response.json()
        if (data.completedPacks) {
          const completedMap: CompletedPacksData = {}
          data.completedPacks.forEach((packId: string) => {
            completedMap[packId] = true
          })
          setCompletedPacks(completedMap)
        }
      } catch (error) {
        console.error('Error loading completed packs:', error)
      }
    }
    loadCompletedPacks()
  }, [user?.email])

  // Fetch filtered packs when filters change
  useEffect(() => {
    const fetchFilteredPacks = async () => {
      // Only fetch if at least one filter is selected
      const hasFilter = Object.values(selectedFilters).some(v => v !== '')
      if (!hasFilter) {
        setFilteredPacks({})
        return
      }

      setIsLoading(true)
      try {
        const queryParams = new URLSearchParams()
        Object.entries(selectedFilters).forEach(([key, value]) => {
          if (value) queryParams.append(key, value)
        })

        const response = await fetch(`/api/filtered-packs?${queryParams}`)
        const data = await response.json()

        if (data.packs) {
          setFilteredPacks(data.packs)
        }
      } catch (error) {
        console.error('Error fetching filtered packs:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFilteredPacks()
  }, [selectedFilters])

  const handleDailyQuestion = async () => {
    if (!dailyQuestionId) return

    try {
      const response = await fetch('/api/packs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          size: 1,
          level,
          userEmail: user?.email || null,
          questionId: dailyQuestionId
        })
      })

      const data = await response.json()

      if (response.status === 403 && data.requiresUpgrade) {
        setShowUpgradeModal(true)
        return
      }

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create pack')
      }

      localStorage.setItem(`pack-${data.packId}`, JSON.stringify(data))
      router.push(`/practice/${data.packId}`)
    } catch (error) {
      console.error('Error creating daily question pack:', error)
      alert('Failed to create practice pack. Please try again.')
    }
  }

  const handlePackClick = async (pack: Pack) => {
    // Check if pack is completed
    if (completedPacks[pack.id]) {
      // Navigate to review/results page
      router.push(`/completed-pack/${pack.id}`)
      return
    }

    // Create new practice session for this pack
    try {
      const response = await fetch('/api/packs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          size: 3,
          level,
          userEmail: user?.email || null,
          packId: pack.id,
          questions: pack.questions
        })
      })

      const data = await response.json()

      if (response.status === 403 && data.requiresUpgrade) {
        setShowUpgradeModal(true)
        return
      }

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create pack')
      }

      localStorage.setItem(`pack-${data.packId}`, JSON.stringify(data))
      router.push(`/practice/${data.packId}`)
    } catch (error) {
      console.error('Error creating pack:', error)
      alert('Failed to create practice pack. Please try again.')
    }
  }

  const handleUpgrade = () => {
    router.push('/pricing')
  }

  return (
    <div className={styles.container}>
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        questionsCompleted={access?.questionsCompleted || 0}
        onUpgrade={handleUpgrade}
      />

      {/* Quick Options Row - 1 Question and Sample Pack 2026 */}
      <div className={styles.quickOptionsRow}>
        <button
          onClick={handleDailyQuestion}
          className={styles.dailyQuestionButton}
        >
          <div className={styles.packContent}>
            <div className={styles.packInfo}>
              <h3 className={styles.packLabel}>데일리 연습</h3>
              <p className={styles.packDescription}>오늘의 데일리 문제</p>
            </div>
            <div className={styles.packSize}>1</div>
          </div>
        </button>

        <button
          onClick={() => router.push('/practice/sample-pack-2026')}
          className={styles.samplePackButton}
        >
          <div className={styles.packContent}>
            <div className={styles.packInfo}>
              <h3 className={styles.packLabel}>고난도 예시 문제</h3>
              <p className={styles.packDescription}>2026 실전 문제 체험</p>
            </div>
            <div className={styles.sharedPackIcon}>
              <img
                src="https://firebasestorage.googleapis.com/v0/b/plewcsat1.firebasestorage.app/o/icons%2Ffolder_blue.svg?alt=media&token=3f5b15d2-6e3c-4679-aa98-3d8bc86e4aff"
                alt="고난도 예시 문제"
                className={styles.iconImage}
              />
            </div>
          </div>
        </button>
      </div>

      {/* Filter Section */}
      <div className={styles.filterSection}>
        <h2 className={styles.filterTitle}>필터</h2>
        <div className={styles.filterGrid}>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>과목</label>
            <select
              value={selectedFilters.primarySubjectArea}
              onChange={(e) => setSelectedFilters(prev => ({ ...prev, primarySubjectArea: e.target.value }))}
              className={styles.filterSelect}
            >
              <option value="">전체</option>
              {filterOptions.primarySubjectArea.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>지문 유형</label>
            <select
              value={selectedFilters.passageType}
              onChange={(e) => setSelectedFilters(prev => ({ ...prev, passageType: e.target.value }))}
              className={styles.filterSelect}
            >
              <option value="">전체</option>
              {filterOptions.passageType.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>문제 유형</label>
            <select
              value={selectedFilters.questionSkill}
              onChange={(e) => setSelectedFilters(prev => ({ ...prev, questionSkill: e.target.value }))}
              className={styles.filterSelect}
            >
              <option value="">전체</option>
              {filterOptions.questionSkill.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>출처</label>
            <select
              value={selectedFilters.source}
              onChange={(e) => setSelectedFilters(prev => ({ ...prev, source: e.target.value }))}
              className={styles.filterSelect}
            >
              <option value="">전체</option>
              {filterOptions.source.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Packs Display */}
      {isLoading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}>
            <svg className={styles.spinnerIcon} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>팩 로딩 중...</span>
          </div>
        </div>
      ) : Object.keys(filteredPacks).length > 0 ? (
        <div className={styles.packsContainer}>
          {Object.entries(filteredPacks).map(([category, packs]) => (
            <div key={category} className={styles.categorySection}>
              <h3 className={styles.categoryTitle}>{category}</h3>
              <div className={styles.packsScroll}>
                {packs.map((pack) => (
                  <div
                    key={pack.id}
                    onClick={() => handlePackClick(pack)}
                    className={styles.packCard}
                  >
                    <img
                      src="https://firebasestorage.googleapis.com/v0/b/plewcsat1.firebasestorage.app/o/icons%2Ffolder_blue.svg?alt=media&token=3f5b15d2-6e3c-4679-aa98-3d8bc86e4aff"
                      alt={`Pack ${pack.number}`}
                      className={styles.packCardImage}
                    />
                    <div className={styles.packNumber}>{pack.number}</div>
                    {completedPacks[pack.id] && (
                      <div className={styles.completedBadge}>완성</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        Object.values(selectedFilters).some(v => v !== '') && (
          <div className={styles.noResultsContainer}>
            <p className={styles.noResultsText}>선택한 필터에 해당하는 팩이 없습니다.</p>
          </div>
        )
      )}
    </div>
  )
}
