'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import PackSizeSelector from '@/app/components/PackSizeSelector'
import CompletedPacks from '@/app/components/CompletedPacks'
import Navbar from '@/app/components/Navbar'
import BackButton from '@/app/components/BackButton'
import styles from './packMaker.module.css'

export default function PackMaker() {
  const [activeTab, setActiveTab] = useState<'create' | 'completed'>('create')
  const [isDemoCompleted, setIsDemoCompleted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if demo is completed
    const demoCompleted = localStorage.getItem('demo-completed') === 'true'
    setIsDemoCompleted(demoCompleted)
  }, [])

  const handleSharedPackClick = () => {
    router.push('/practice/sample-pack-2026')
  }

  return (
    <div className={styles.container}>
      <Navbar />
      <BackButton />
      <div className={styles.content}>
        {/* Shared Pack Button - appears after demo completion */}
        {isDemoCompleted && (
          <button
            onClick={handleSharedPackClick}
            className={styles.sharedPackButton}
            title="샘플 팩 연습하기"
          >
            <img
              src="https://firebasestorage.googleapis.com/v0/b/plewcsat1.firebasestorage.app/o/icons%2Ffolder_blue.svg?alt=media&token=3f5b15d2-6e3c-4679-aa98-3d8bc86e4aff"
              alt="샘플 팩"
              className={styles.sharedPackIcon}
            />
          </button>
        )}

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
            완료된 팩
          </button>
        </div>

        {/* Tab Content */}
        <div className={styles.innerContainer}>
          {activeTab === 'create' ? (
            <PackSizeSelector />
          ) : (
            <CompletedPacks />
          )}
        </div>
      </div>
    </div>
  )
}