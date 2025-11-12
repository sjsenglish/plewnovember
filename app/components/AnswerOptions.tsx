'use client'

import { useState } from 'react'

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
    <div className="space-y-6">
      <div className="space-y-3">
        <p className="font-heading text-base text-gray-700 tracking-custom mb-4">Select your answer:</p>
        {question.answerOptions.map((option, index) => {
          const isSelected = selectedAnswer === option
          const isCorrect = showFeedback && option === question.correctAnswer
          const isIncorrect = showFeedback && isSelected && option !== question.correctAnswer

          return (
            <button
              key={index}
              onClick={() => !showFeedback && setSelectedAnswer(option)}
              disabled={showFeedback || isSubmitting}
              className={`w-full p-4 text-left transition-all font-body tracking-custom ${
                isCorrect
                  ? 'bg-green-100 text-green-900'
                  : isIncorrect
                  ? 'bg-red-100 text-red-900'
                  : isSelected
                  ? 'bg-purple-200 text-purple-900'
                  : 'hover:bg-white/50'
              } ${showFeedback ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-heading text-gray-600 mr-4">{index + 1}.</span>
                  <span className="font-body tracking-custom">{option}</span>
                </div>
                {isCorrect && <span className="text-green-600 font-heading tracking-custom">✓ Correct</span>}
                {isIncorrect && <span className="text-red-600 font-heading tracking-custom">✗ Incorrect</span>}
              </div>
            </button>
          )
        })}
      </div>

      <div className="flex space-x-4">
        {!showNextButton ? (
          <button
            onClick={handleSubmit}
            disabled={!selectedAnswer || showFeedback || isSubmitting}
            className="flex-1 py-4 px-6 bg-purple-600 text-white font-heading hover:bg-purple-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all tracking-custom"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Answer'}
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex-1 py-4 px-6 bg-green-600 text-white font-heading hover:bg-green-700 focus:outline-none transition-all tracking-custom"
          >
            Next Question →
          </button>
        )}
      </div>

      {showFeedback && question.explanation && (
        <div className={`mt-6 p-6 ${
          selectedAnswer === question.correctAnswer
            ? 'bg-green-50 text-green-900'
            : 'bg-cyan-50 text-gray-900'
        }`}>
          <h4 className={`font-heading mb-3 tracking-custom ${
            selectedAnswer === question.correctAnswer
              ? 'text-green-900'
              : 'text-gray-900'
          }`}>
            {selectedAnswer === question.correctAnswer ? '✓ Correct!' : 'Explanation:'}
          </h4>
          <p className={`font-body tracking-custom ${
            selectedAnswer === question.correctAnswer
              ? 'text-green-800'
              : 'text-gray-800'
          }`}>
            {question.explanation}
          </p>
        </div>
      )}
    </div>
  )
}