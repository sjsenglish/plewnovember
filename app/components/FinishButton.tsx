'use client'

import styles from './FinishButton.module.css'

interface FinishButtonProps {
  onClick: () => void
  disabled?: boolean
}

export default function FinishButton({ onClick, disabled = false }: FinishButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={styles.finishButton}
      type="button"
    >
      완료
    </button>
  )
}
