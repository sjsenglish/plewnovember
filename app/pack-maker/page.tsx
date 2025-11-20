'use client'

import { useState } from 'react'
import PackSizeSelector from '@/app/components/PackSizeSelector'
import CompletedPacks from '@/app/components/CompletedPacks'
import Navbar from '@/app/components/Navbar'
import BackButton from '@/app/components/BackButton'
import styles from './packMaker.module.css'

export default function PackMaker() {
  const [activeTab, setActiveTab] = useState<'create' | 'completed'>('create')

  return (
    <div className={styles.container}>
      <Navbar />
      <BackButton to="/" />
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