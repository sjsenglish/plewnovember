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
              <div className={styles.infoItem}>
                <label className={styles.label}>Date Joined</label>
                <p className={styles.value}>
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                    : 'N/A'}
                </p>
              </div>
              <div className={styles.infoItem}>
                <label className={styles.label}>Subscription Status</label>
                <p className={styles.value}>
                  {user.subscriptionStatus || 'Free'}
                </p>
              </div>
              {user.subscriptionEndDate && (
                <div className={styles.infoItem}>
                  <label className={styles.label}>
                    {user.subscriptionStatus === 'Active' ? 'Renews On' : 'Expires On'}
                  </label>
                  <p className={styles.value}>
                    {new Date(user.subscriptionEndDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              )}
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
