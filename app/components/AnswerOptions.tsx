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
    <div className="space-y-4 p-4 bg-white border-t border-gray-200">
      <div className="space-y-3">
        <p className="text-sm font-medium text-gray-700">Select your answer:</p>
        {question.answerOptions.map((option, index) => {
          const isSelected = selectedAnswer === option
          const isCorrect = showFeedback && option === question.correctAnswer
          const isIncorrect = showFeedback && isSelected && option !== question.correctAnswer

          return (
            <button
              key={index}
              onClick={() => !showFeedback && setSelectedAnswer(option)}
              disabled={showFeedback || isSubmitting}
              className={`w-full p-4 text-left border-2 rounded-lg transition-all ${
                isCorrect
                  ? 'border-green-500 bg-green-50 text-green-900'
                  : isIncorrect
                  ? 'border-red-500 bg-red-50 text-red-900'
                  : isSelected
                  ? 'border-blue-500 bg-blue-50 text-blue-900'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
              } ${showFeedback ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-gray-600 mr-3">{index + 1}.</span>
                  <span>{option}</span>
                </div>
                {isCorrect && <span className="text-green-600 font-semibold">✓ Correct</span>}
                {isIncorrect && <span className="text-red-600 font-semibold">✗ Incorrect</span>}
              </div>
            </button>
          )
        })}
      </div>

      <div className="flex space-x-3">
        {!showNextButton ? (
          <button
            onClick={handleSubmit}
            disabled={!selectedAnswer || showFeedback || isSubmitting}
            className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Answer'}
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex-1 py-3 px-4 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
          >
            Next Question →
          </button>
        )}
      </div>

      {showFeedback && question.explanation && (
        <div className={`mt-4 p-4 rounded-lg border ${
          selectedAnswer === question.correctAnswer
            ? 'bg-green-50 border-green-200'
            : 'bg-blue-50 border-blue-200'
        }`}>
          <h4 className={`font-semibold mb-2 ${
            selectedAnswer === question.correctAnswer
              ? 'text-green-900'
              : 'text-blue-900'
          }`}>
            {selectedAnswer === question.correctAnswer ? '✓ Correct!' : 'Explanation:'}
          </h4>
          <p className={`${
            selectedAnswer === question.correctAnswer
              ? 'text-green-800'
              : 'text-blue-800'
          }`}>
            {question.explanation}
          </p>
        </div>
      )}
    </div>
  )
}