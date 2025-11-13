'use client'

import styles from './NextButton.module.css'

interface NextButtonProps {
  onClick: () => void
}

export default function NextButton({ onClick }: NextButtonProps) {
  return (
    <button
      onClick={onClick}
      className={styles.nextButton}
      type="button"
    >
      Next →
    </button>
  )
}
