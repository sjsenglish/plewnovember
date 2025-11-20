'use client'

import { useRouter } from 'next/navigation'
import styles from './BackButton.module.css'

interface BackButtonProps {
  to: string
}

export default function BackButton({ to }: BackButtonProps) {
  const router = useRouter()

  return (
    <div className={styles.backButtonContainer}>
      <button
        onClick={() => router.push(to)}
        className={styles.backButton}
        type="button"
      >
        ← 뒤로
      </button>
    </div>
  )
}
