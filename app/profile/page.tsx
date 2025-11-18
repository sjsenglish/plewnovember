'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/app/components/Navbar'
import BackButton from '@/app/components/BackButton'
import { useAuth } from '../context/AuthContext'
import styles from './profile.module.css'

export default function Profile() {
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <div className={styles.container}>
      <Navbar />
      <BackButton />
      <div className={styles.content}>
        <div className={styles.profileCard}>
          <h1 className={styles.title}>Profile</h1>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Account Information</h2>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <label className={styles.label}>Name</label>
                <p className={styles.value}>{user.name}</p>
              </div>
              <div className={styles.infoItem}>
                <label className={styles.label}>Email</label>
                <p className={styles.value}>{user.email}</p>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Progress Stats</h2>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <p className={styles.statValue}>0</p>
                <p className={styles.statLabel}>Packs Completed</p>
              </div>
              <div className={styles.statCard}>
                <p className={styles.statValue}>0</p>
                <p className={styles.statLabel}>Total Questions</p>
              </div>
              <div className={styles.statCard}>
                <p className={styles.statValue}>0%</p>
                <p className={styles.statLabel}>Accuracy</p>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Settings</h2>
            <div className={styles.settingsList}>
              <button className={styles.settingButton}>
                <span>Notification Preferences</span>
                <span className={styles.arrow}>→</span>
              </button>
              <button className={styles.settingButton}>
                <span>Language Settings</span>
                <span className={styles.arrow}>→</span>
              </button>
              <button className={styles.settingButton}>
                <span>Privacy Settings</span>
                <span className={styles.arrow}>→</span>
              </button>
            </div>
          </div>

          <button onClick={handleLogout} className={styles.logoutButton}>
            Log Out
          </button>
        </div>
      </div>
    </div>
  )
}
