'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/app/components/Navbar'
import styles from './success.module.css'

export default function PaymentSuccess() {
  const searchParams = useSearchParams()
  const [sessionId, setSessionId] = useState<string | null>(null)

  useEffect(() => {
    const id = searchParams.get('session_id')
    setSessionId(id)
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
            Your subscription is now active. Thank you for subscribing!
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
