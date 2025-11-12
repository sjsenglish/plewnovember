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
    <div className="space-y-4">
      <div className="space-y-4">
        <p className="font-inter font-semibold text-base text-gray-700">Select your answer:</p>
        {question.answerOptions.map((option, index) => {
          const isSelected = selectedAnswer === option
          const isCorrect = showFeedback && option === question.correctAnswer
          const isIncorrect = showFeedback && isSelected && option !== question.correctAnswer

          return (
            <div
              key={index}
              style={{
                padding: '3px',
                background: isCorrect
                  ? '#10B981'
                  : isIncorrect
                  ? '#EF4444'
                  : 'linear-gradient(135deg, #E4E7FF 0%, #9397ED 15%, #4248DB 35%, #5850D3 50%, #4E47B9 65%, #9391C3 85%, #EEEFFF 100%)',
                borderRadius: '12px',
              }}
            >
              <button
                onClick={() => !showFeedback && setSelectedAnswer(option)}
                disabled={showFeedback || isSubmitting}
                className={`w-full p-4 text-left rounded-[9px] transition-all font-inter ${
                  isCorrect
                    ? 'bg-green-50 text-green-900'
                    : isIncorrect
                    ? 'bg-red-50 text-red-900'
                    : 'bg-white text-gray-900 hover:bg-gray-50'
                } ${showFeedback ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-inter font-semibold text-gray-600 mr-3">{index + 1}.</span>
                    <span className="font-inter">{option}</span>
                  </div>
                  {isCorrect && <span className="text-green-600 font-inter font-semibold">✓ Correct</span>}
                  {isIncorrect && <span className="text-red-600 font-inter font-semibold">✗ Incorrect</span>}
                </div>
              </button>
            </div>
          )
        })}
      </div>

      <div className="flex space-x-3">
        {!showNextButton ? (
          <button
            onClick={handleSubmit}
            disabled={!selectedAnswer || showFeedback || isSubmitting}
            className="flex-1 py-3 px-6 bg-[#4248DB] text-white font-inter font-semibold rounded-lg hover:bg-[#3640c7] focus:outline-none focus:ring-2 focus:ring-[#4248DB] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Answer'}
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex-1 py-3 px-6 bg-green-600 text-white font-inter font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
          >
            Next Question →
          </button>
        )}
      </div>

      {showFeedback && question.explanation && (
        <div className={`mt-4 p-5 rounded-lg border ${
          selectedAnswer === question.correctAnswer
            ? 'bg-green-50 border-green-300'
            : 'bg-blue-50 border-blue-300'
        }`}>
          <h4 className={`font-inter font-semibold mb-2 ${
            selectedAnswer === question.correctAnswer
              ? 'text-green-900'
              : 'text-gray-900'
          }`}>
            {selectedAnswer === question.correctAnswer ? '✓ Correct!' : 'Explanation:'}
          </h4>
          <p className={`font-inter ${
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