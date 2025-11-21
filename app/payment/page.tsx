'use client'

import { useState } from 'react'
import Navbar from '@/app/components/Navbar'
import styles from './payment.module.css'

export default function Payment() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubscribe = async () => {
    setIsProcessing(true)
    setError(null)

    try {
      const priceId = process.env.NEXT_PUBLIC_STRIPE_PLUS_MONTHLY_PRICE_ID

      if (!priceId) {
        throw new Error('Stripe price ID not configured')
      }

      // Create checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('No checkout URL received')
      }
    } catch (err: any) {
      console.error('Subscription error:', err)
      setError(err.message || 'Failed to start checkout. Please try again.')
      setIsProcessing(false)
    }
  }

  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.content}>
        <img
          src="https://firebasestorage.googleapis.com/v0/b/plewcsat1.firebasestorage.app/o/icons%2Fkaraoke.svg?alt=media&token=23e1cfde-26f6-4c1c-bceb-38793dc5253d"
          alt="Karaoke"
          className={styles.karaokeIcon}
        />
        <div className={styles.paymentCard}>
          <h1 className={styles.title}>옥스포드 PLEW</h1>

          <div className={styles.pricingSection}>
            <div className={styles.priceCard}>
              <div className={styles.priceAmount}>
                <span className={styles.amount}>50,000원/월</span>
              </div>

              <button
                className={styles.subscribeButton}
                onClick={handleSubscribe}
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : '구독'}
              </button>

              {error && (
                <p className={styles.error}>
                  {error}
                </p>
              )}
            </div>
          </div>

          <div className={styles.secureSection}>
            <p className={styles.secureText}>
              🔒 Secure payment powered by Stripe
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
