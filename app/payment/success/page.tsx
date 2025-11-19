'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/app/components/Navbar'
import styles from './success.module.css'

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [upgradeStatus, setUpgradeStatus] = useState<'pending' | 'success' | 'error'>('pending')

  useEffect(() => {
    const id = searchParams.get('session_id')
    setSessionId(id)

    // Upgrade user to premium
    const upgradeUser = async () => {
      try {
        // Get user email from localStorage
        const userStr = localStorage.getItem('user')
        if (!userStr) {
          console.error('No user found in localStorage')
          setUpgradeStatus('error')
          return
        }

        const user = JSON.parse(userStr)
        const userEmail = user.email

        if (!userEmail) {
          console.error('No email found for user')
          setUpgradeStatus('error')
          return
        }

        // Call upgrade API
        const response = await fetch('/api/upgrade-to-premium', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userEmail }),
        })

        if (!response.ok) {
          throw new Error('Failed to upgrade user')
        }

        console.log('User successfully upgraded to premium')
        setUpgradeStatus('success')
      } catch (error) {
        console.error('Error upgrading user:', error)
        setUpgradeStatus('error')
      }
    }

    upgradeUser()
  }, [searchParams])

  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.content}>
        <div className={styles.successCard}>
          <div className={styles.iconContainer}>
            <div className={styles.successIcon}>✓</div>
          </div>

          <h1 className={styles.title}>Welcome to PLEW Plus!</h1>

          <p className={styles.message}>
            {upgradeStatus === 'pending' && 'Activating your subscription...'}
            {upgradeStatus === 'success' && 'Your subscription is now active. Thank you for subscribing!'}
            {upgradeStatus === 'error' && 'Payment successful! Your account will be upgraded shortly.'}
          </p>

          <div className={styles.benefits}>
            <h2 className={styles.benefitsTitle}>You now have access to:</h2>
            <ul className={styles.benefitsList}>
              <li className={styles.benefit}>✓ Unlimited practice sessions</li>
              <li className={styles.benefit}>✓ AI-powered feedback</li>
              <li className={styles.benefit}>✓ Progress tracking</li>
              <li className={styles.benefit}>✓ All difficulty levels</li>
              <li className={styles.benefit}>✓ Custom pack creation</li>
            </ul>
          </div>

          {sessionId && (
            <p className={styles.sessionInfo}>
              Session ID: {sessionId}
            </p>
          )}

          <div className={styles.actions}>
            <Link href="/" className={styles.primaryButton}>
              Start Learning
            </Link>
            <Link href="/profile" className={styles.secondaryButton}>
              View Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PaymentSuccess() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  )
}
