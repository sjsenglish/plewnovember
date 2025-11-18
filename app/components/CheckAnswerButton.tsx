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
      {isSubmitting ? '확인 중...' : '답 확인'}
    </button>
  )
}
