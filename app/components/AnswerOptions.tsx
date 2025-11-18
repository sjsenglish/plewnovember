'use client'

import { useState } from 'react'
import styles from './AnswerOptions.module.css'
import CheckAnswerButton from './CheckAnswerButton'
import NextButton from './NextButton'
import FinishButton from './FinishButton'

interface Question {
  objectID: string
  actualQuestion: string
  questionText: string
  answerOptions: string[]
  correctAnswer: string
  explanation?: string
}

interface QuestionState {
  selectedAnswer: string
  showFeedback: boolean
}

interface AnswerOptionsProps {
  question: Question
  packId: string
  questionIndex: number
  totalQuestions: number
  questionState?: QuestionState
  onStateChange: (state: QuestionState) => void
  onAnswerSubmit?: (isCorrect: boolean) => void
  onNext: () => void
  isDemo?: boolean
  showFinishButton?: boolean
  onFinish?: () => void
}

export default function AnswerOptions({
  question,
  packId,
  questionIndex,
  totalQuestions,
  questionState,
  onStateChange,
  onAnswerSubmit,
  onNext,
  isDemo = false,
  showFinishButton = false,
  onFinish
}: AnswerOptionsProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Use state from props or initialize with defaults
  const selectedAnswer = questionState?.selectedAnswer || ''
  const showFeedback = questionState?.showFeedback || false

  const handleSubmit = async () => {
    if (!selectedAnswer || isSubmitting) return

    setIsSubmitting(true)
    const isCorrect = selectedAnswer === question.correctAnswer

    try {
      // Submit progress to API
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          packId,
          questionObjectId: question.objectID,
          selectedAnswer,
          isCorrect
        })
      })

      if (response.ok) {
        // Update state to show feedback for this specific question
        onStateChange({
          selectedAnswer,
          showFeedback: true
        })

        // Notify parent component
        onAnswerSubmit?.(isCorrect)
      } else {
        console.error('Failed to submit progress')
        alert('답변 저장에 실패했습니다. 다시 시도해주세요.')
      }
    } catch (error) {
      console.error('Error submitting answer:', error)
      alert('오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={styles.optionsContainer}>
      <div className={styles.optionsList}>
        <p className={styles.optionsLabel}>답을 선택하세요:</p>
        {question.answerOptions.map((option, index) => {
          const isSelected = selectedAnswer === option
          const isCorrect = showFeedback && option === question.correctAnswer
          const isIncorrect = showFeedback && isSelected && option !== question.correctAnswer

          return (
            <button
              key={index}
              onClick={() => {
                if (!showFeedback) {
                  onStateChange({
                    selectedAnswer: option,
                    showFeedback: false
                  })
                }
              }}
              disabled={showFeedback || isSubmitting}
              className={`${styles.answerButton} ${
                isCorrect
                  ? styles.correct
                  : isIncorrect
                  ? styles.incorrect
                  : isSelected
                  ? styles.selected
                  : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className={styles.optionNumber}>{index + 1}.</span>
                  <span className={styles.optionText}>{option}</span>
                </div>
                {isCorrect && <span className="text-green-600 text-[0.8rem] font-heading tracking-custom">✓ 정답</span>}
                {isIncorrect && <span className="text-red-600 text-[0.8rem] font-heading tracking-custom">✗ 오답</span>}
              </div>
            </button>
          )
        })}
      </div>

      <div className={styles.buttonContainer}>
        <div>
          {!showFeedback && (
            <CheckAnswerButton
              onClick={handleSubmit}
              disabled={!selectedAnswer || isSubmitting}
              isSubmitting={isSubmitting}
            />
          )}
        </div>
        <div>
          {isDemo ? (
            (showFeedback || showFinishButton) && <FinishButton onClick={onFinish || (() => {})} />
          ) : (
            showFeedback && questionIndex === totalQuestions - 1 ? (
              <FinishButton onClick={onFinish || (() => {})} />
            ) : (
              showFeedback && <NextButton onClick={onNext} />
            )
          )}
        </div>
      </div>
    </div>
  )
}