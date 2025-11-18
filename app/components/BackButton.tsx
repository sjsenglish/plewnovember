'use client'

import { useRouter } from 'next/navigation'
import styles from './BackButton.module.css'

export default function BackButton() {
  const router = useRouter()

  return (
    <div className={styles.backButtonContainer}>
      <button
        onClick={() => router.back()}
        className={styles.backButton}
        type="button"
      >
        ← 뒤로
      </button>
    </div>
  )
}
