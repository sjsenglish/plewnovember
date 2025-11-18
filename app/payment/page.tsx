'use client'

import { useState } from 'react'
import Navbar from '@/app/components/Navbar'
import BackButton from '@/app/components/BackButton'
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
      <BackButton />
      <div className={styles.content}>
        <div className={styles.paymentCard}>
          <h1 className={styles.title}>Subscription</h1>

          <div className={styles.pricingSection}>
            <div className={styles.priceCard}>
              <div className={styles.priceHeader}>
                <h2 className={styles.planName}>Monthly Plan</h2>
                <p className={styles.planDescription}>
                  Full access to all PLEW features
                </p>
              </div>

              <div className={styles.priceAmount}>
                <span className={styles.currency}>$</span>
                <span className={styles.amount}>9.99</span>
                <span className={styles.period}>/month</span>
              </div>

              <ul className={styles.featureList}>
                <li className={styles.feature}>
                  <span className={styles.checkmark}>✓</span>
                  Unlimited practice sessions
                </li>
                <li className={styles.feature}>
                  <span className={styles.checkmark}>✓</span>
                  AI-powered feedback
                </li>
                <li className={styles.feature}>
                  <span className={styles.checkmark}>✓</span>
                  Progress tracking
                </li>
                <li className={styles.feature}>
                  <span className={styles.checkmark}>✓</span>
                  All difficulty levels
                </li>
                <li className={styles.feature}>
                  <span className={styles.checkmark}>✓</span>
                  Custom pack creation
                </li>
              </ul>

              <button
                className={styles.subscribeButton}
                onClick={handleSubscribe}
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Subscribe Now'}
              </button>

              {error && (
                <p className={styles.error}>
                  {error}
                </p>
              )}

              <p className={styles.disclaimer}>
                Cancel anytime. No commitments.
              </p>
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
