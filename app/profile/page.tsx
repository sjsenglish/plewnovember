'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/app/components/Navbar'
import { useAuth } from '../context/AuthContext'
import styles from './profile.module.css'

export default function Profile() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading, logout } = useAuth()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  if (isLoading || !isAuthenticated || !user) {
    return (
      <div className={styles.container}>
        <Navbar />
        <div className={styles.content}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <p>로딩 중...</p>
          </div>
        </div>
      </div>
    )
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
                  {user.subscriptionStatus === 'Active' ? (
                    <span style={{ backgroundColor: '#E5FAFA', padding: '4px 12px', borderRadius: '4px', fontWeight: 600 }}>PLEW Plus 활성</span>
                  ) : user.subscriptionStatus === 'Cancelling' ? (
                    <span style={{ backgroundColor: '#E5FAFA', padding: '4px 12px', borderRadius: '4px', fontWeight: 600 }}>해지 예정</span>
                  ) : user.subscriptionStatus === 'Cancelled' ? (
                    <span style={{ backgroundColor: '#E5FAFA', padding: '4px 12px', borderRadius: '4px' }}>해지됨</span>
                  ) : (
                    <span>무료</span>
                  )}
                </p>
              </div>
              {user.subscriptionEndDate && (
                <div className={styles.infoItem}>
                  <label className={styles.label}>
                    {user.subscriptionStatus === 'Active' ? '다음 결제일' :
                     user.subscriptionStatus === 'Cancelling' ? '구독 종료일' : '만료일'}
                  </label>
                  <p className={styles.value} style={{ fontWeight: 600 }}>
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
