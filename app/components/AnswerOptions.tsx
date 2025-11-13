'use client'

import { useState } from 'react'
import styles from './AnswerOptions.module.css'
import CheckAnswerButton from './CheckAnswerButton'
import NextButton from './NextButton'

interface Question {
  objectID: string
  actualQuestion: string
  questionText: string
  answerOptions: string[]
  correctAnswer: string
  explanation?: string
}

interface AnswerOptionsProps {
  question: Question
  packId: string
  onAnswerSubmit?: (isCorrect: boolean) => void
}

export default function AnswerOptions({ question, packId, onAnswerSubmit }: AnswerOptionsProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string>('')
  const [showFeedback, setShowFeedback] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showNextButton, setShowNextButton] = useState(false)

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
        setShowFeedback(true)

        // Show visual feedback
        setTimeout(() => {
          setShowNextButton(true)
          onAnswerSubmit?.(isCorrect)
        }, 2000)
      } else {
        console.error('Failed to submit progress')
        alert('Failed to save your answer. Please try again.')
      }
    } catch (error) {
      console.error('Error submitting answer:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNext = () => {
    // Reload page to get next question
    window.location.reload()
  }

  return (
    <div className="space-y-4">
      <div className="space-y-5">
        <p className="font-heading text-[0.9rem] text-black tracking-custom mb-2">Select your answer:</p>
        {question.answerOptions.map((option, index) => {
          const isSelected = selectedAnswer === option
          const isCorrect = showFeedback && option === question.correctAnswer
          const isIncorrect = showFeedback && isSelected && option !== question.correctAnswer

          return (
            <button
              key={index}
              onClick={() => !showFeedback && setSelectedAnswer(option)}
              disabled={showFeedback || isSubmitting}
              className={`${styles.answerButton} ${
                isCorrect
                  ? styles.correct
                  : isIncorrect
                  ? styles.incorrect
                  : isSelected
                  ? styles.selected
                  : ''
              } font-body tracking-custom`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-heading text-[0.8rem] text-black mr-3">{index + 1}.</span>
                  <span className="font-body text-[0.9rem] tracking-custom text-black">{option}</span>
                </div>
                {isCorrect && <span className="text-green-600 text-[0.8rem] font-heading tracking-custom">✓ Correct</span>}
                {isIncorrect && <span className="text-red-600 text-[0.8rem] font-heading tracking-custom">✗ Incorrect</span>}
              </div>
            </button>
          )
        })}
      </div>

      <div className="flex justify-between items-center mt-10">
        <div>
          {!showFeedback && (
            <CheckAnswerButton
              onClick={handleSubmit}
              disabled={isSubmitting}
              isSubmitting={isSubmitting}
            />
          )}
        </div>
        <div>
          {showNextButton && (
            <NextButton onClick={handleNext} />
          )}
        </div>
      </div>
    </div>
  )
}