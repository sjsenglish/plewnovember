'use client'

import { useState } from 'react'
import Navbar from '@/app/components/Navbar'
import BackButton from '@/app/components/BackButton'
import styles from './payment.module.css'

export default function Payment() {
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSubscribe = async () => {
    setIsProcessing(true)
    // TODO: Add Stripe integration here
    // const STRIPE_PRICE_ID = 'price_xxxxxxxxxxxxx' // Add your Stripe price ID here

    setTimeout(() => {
      alert('Stripe integration coming soon! Add your Stripe price ID to complete setup.')
      setIsProcessing(false)
    }, 1000)
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
