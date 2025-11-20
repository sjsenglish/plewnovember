'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/context/AuthContext'
import styles from './CompletedPacks.module.css'

interface CompletedPack {
  id: string
  pack_id: string
  pack_size: number
  level: number
  score: number
  total_questions: number
  score_percentage: number
  time_taken_seconds: number
  started_at: string
  completed_at: string
  answer_count: number
}

interface UserStats {
  totalPacksCompleted: number
  totalQuestionsAnswered: number
  totalCorrectAnswers: number
  averageScore: number
  totalTimeSpentSeconds: number
  bestScore: number
  recentActivity: string | null
}

export default function CompletedPacks() {
  const [completedPacks, setCompletedPacks] = useState<CompletedPack[]>([])
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    if (user?.email) {
      loadCompletedPacks()
      loadUserStats()
    } else {
      setError('로그인이 필요합니다')
      setLoading(false)
    }
  }, [user])

  const loadCompletedPacks = async () => {
    try {
      if (!user?.email) {
        setError('로그인이 필요합니다')
        setLoading(false)
        return
      }

      const response = await fetch(`/api/completed-packs?userEmail=${encodeURIComponent(user.email)}`)

      if (!response.ok) {
        throw new Error('Failed to load completed packs')
      }

      const data = await response.json()
      setCompletedPacks(data.completedPacks || [])
    } catch (err) {
      console.error('Error loading completed packs:', err)
      setError('완료된 팩을 불러오는데 실패했습니다')
    } finally {
      setLoading(false)
    }
  }

  const loadUserStats = async () => {
    try {
      if (!user?.email) return

      const response = await fetch(`/api/user-stats?userEmail=${encodeURIComponent(user.email)}`)

      if (response.ok) {
        const data = await response.json()
        setUserStats(data)
      }
    } catch (err) {
      console.error('Error loading user stats:', err)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}분 ${secs}초`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="font-body text-gray-700 mt-4 tracking-custom">완료된 팩을 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <p className="font-body text-red-600 text-lg tracking-custom">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {/* User Stats Summary */}
      {userStats && userStats.totalPacksCompleted > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Progress Stats</h2>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <p className={styles.statValue}>{userStats.totalPacksCompleted}</p>
              <p className={styles.statLabel}>Packs Completed</p>
            </div>
            <div className={styles.statCard}>
              <p className={styles.statValue}>{userStats.totalQuestionsAnswered}</p>
              <p className={styles.statLabel}>Total Questions</p>
            </div>
            <div className={styles.statCard}>
              <p className={styles.statValue}>{userStats.averageScore.toFixed(1)}%</p>
              <p className={styles.statLabel}>Accuracy</p>
            </div>
          </div>
        </div>
      )}

      {/* Completed Packs List */}
      <div className={styles.packsSection}>
        <h2 className="font-heading text-2xl text-gray-900 mb-4 tracking-custom">
          완료된 팩 ({completedPacks.length})
        </h2>

        {completedPacks.length === 0 ? (
          <div className={styles.emptyState}>
            <p className="font-body text-gray-600 text-lg mb-2 tracking-custom">
              아직 완료된 팩이 없습니다
            </p>
            <p className="font-body text-gray-500 text-sm tracking-custom">
              팩을 생성하고 문제를 풀어보세요!
            </p>
          </div>
        ) : (
          <div className={styles.packsList}>
            {completedPacks.map((pack) => (
              <div key={pack.id} className={styles.packCard}>
                <div className={styles.packHeader}>
                  <div className={styles.packTitle}>
                    <span className={styles.packSize}>{pack.pack_size}문제</span>
                    <span className={styles.levelBadge}>레벨 {pack.level}</span>
                  </div>
                  <div className={styles.packDateContainer}>
                    <div className={styles.packDateLabel}>Date Test Taken</div>
                    <div className={styles.packDate}>
                      {formatDate(pack.completed_at)}
                    </div>
                  </div>
                </div>

                <div className={styles.packStats}>
                  <div className={styles.scoreSection}>
                    <div className={styles.scoreCircle}>
                      <div className={styles.scorePercentage}>
                        {Math.round(pack.score_percentage)}%
                      </div>
                    </div>
                    <div className={styles.scoreDetails}>
                      <div className={styles.scoreText}>
                        {pack.score} / {pack.total_questions} 정답
                      </div>
                      <div className={styles.timeText}>
                        {formatTime(pack.time_taken_seconds)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.packActions}>
                  <button
                    onClick={() => router.push(`/completed-pack/${pack.id}`)}
                    className={styles.reviewButton}
                  >
                    답안 보기
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
