'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/context/AuthContext'
import PackSizeSelector from '@/app/components/PackSizeSelector'
import CompletedPacks from '@/app/components/CompletedPacks'
import Navbar from '@/app/components/Navbar'
import styles from './packMakerLevel1.module.css'

export default function PackMakerLevel1() {
  const [activeTab, setActiveTab] = useState<'create' | 'completed'>('create')
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/pack-maker-level1')
    }
  }, [isAuthenticated, router])

  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.content}>
        {/* Tab Navigation */}
        <div className={styles.tabNavigation}>
          <button
            onClick={() => setActiveTab('create')}
            className={`${styles.tabButton} ${activeTab === 'create' ? styles.tabButtonActive : ''}`}
          >
            팩 생성
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`${styles.tabButton} ${activeTab === 'completed' ? styles.tabButtonActive : ''}`}
          >
            풀이 완료 문제
          </button>
        </div>

        {/* Tab Content */}
        <div className={styles.innerContainer}>
          {activeTab === 'create' ? (
            <PackSizeSelector level={1} />
          ) : (
            <CompletedPacks />
          )}
        </div>
      </div>
    </div>
  )
}
