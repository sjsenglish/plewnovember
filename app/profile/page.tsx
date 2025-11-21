'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/app/components/Navbar'
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
      <div className={styles.content}>
        <div className={styles.profileCard}>
          <h1 className={styles.title}>프로필</h1>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>계정 정보</h2>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <label className={styles.label}>이름</label>
                <p className={styles.value}>{user.name}</p>
              </div>
              <div className={styles.infoItem}>
                <label className={styles.label}>이메일</label>
                <p className={styles.value}>{user.email}</p>
              </div>
              <div className={styles.infoItem}>
                <label className={styles.label}>가입일</label>
                <p className={styles.value}>
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                    : 'N/A'}
                </p>
              </div>
              <div className={styles.infoItem}>
                <label className={styles.label}>구독 상태</label>
                <p className={styles.value}>
                  {user.subscriptionStatus === 'Active' ? '활성' : user.subscriptionStatus || '무료'}
                </p>
              </div>
              {user.subscriptionEndDate && (
                <div className={styles.infoItem}>
                  <label className={styles.label}>
                    {user.subscriptionStatus === 'Active' ? '갱신일' : '만료일'}
                  </label>
                  <p className={styles.value}>
                    {new Date(user.subscriptionEndDate).toLocaleDateString('ko-KR', {
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
            로그아웃
          </button>
        </div>
      </div>
    </div>
  )
}
