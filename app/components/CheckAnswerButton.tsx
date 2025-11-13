'use client'

import styles from './CheckAnswerButton.module.css'

interface CheckAnswerButtonProps {
  onClick: () => void
  disabled?: boolean
  isSubmitting?: boolean
}

export default function CheckAnswerButton({ onClick, disabled, isSubmitting }: CheckAnswerButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={styles.checkAnswerButton}
      type="button"
    >
      {isSubmitting ? 'Checking...' : 'Check Answer'}
    </button>
  )
}
