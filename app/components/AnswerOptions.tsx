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
        <p className="font-heading text-xs uppercase text-gray-400 tracking-wider mb-4">Select your answer</p>
        {question.answerOptions.map((option, index) => {
          const isSelected = selectedAnswer === option
          const isCorrect = showFeedback && option === question.correctAnswer
          const isIncorrect = showFeedback && isSelected && option !== question.correctAnswer

          return (
            <button
              key={index}
              onClick={() => !showFeedback && setSelectedAnswer(option)}
              disabled={showFeedback || isSubmitting}
              className={`w-full p-5 text-left rounded-2xl transition-all duration-200 font-body ${
                isCorrect
                  ? 'bg-green-500 text-white'
                  : isIncorrect
                  ? 'bg-red-500 text-white'
                  : isSelected
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-900'
              } ${showFeedback ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-4">
                  <span className={`flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full text-xs font-medium ${
                    isCorrect || isIncorrect || isSelected ? 'bg-white/20' : 'bg-white text-gray-500'
                  }`}>
                    {index + 1}
                  </span>
                  <span className="font-body leading-relaxed flex-1">{option}</span>
                </div>
                {isCorrect && <span className="text-white font-medium text-sm">✓ Correct</span>}
                {isIncorrect && <span className="text-white font-medium text-sm">✗ Incorrect</span>}
              </div>
            </button>
          )
        })}
      </div>

      <div className="flex space-x-3 pt-2">
        {!showNextButton ? (
          <button
            onClick={handleSubmit}
            disabled={!selectedAnswer || showFeedback || isSubmitting}
            className="flex-1 py-4 px-6 bg-gray-900 text-white font-medium rounded-2xl hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Answer'}
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex-1 py-4 px-6 bg-green-600 text-white font-medium rounded-2xl hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 transition-all duration-200"
          >
            Next Question →
          </button>
        )}
      </div>

      {showFeedback && question.explanation && (
        <div className={`mt-6 p-6 rounded-2xl ${
          selectedAnswer === question.correctAnswer
            ? 'bg-green-50'
            : 'bg-gray-50'
        }`}>
          <h4 className={`font-medium mb-3 text-sm ${
            selectedAnswer === question.correctAnswer
              ? 'text-green-900'
              : 'text-gray-900'
          }`}>
            {selectedAnswer === question.correctAnswer ? '✓ Correct!' : 'Explanation'}
          </h4>
          <p className={`font-body leading-relaxed ${
            selectedAnswer === question.correctAnswer
              ? 'text-green-800'
              : 'text-gray-700'
          }`}>
            {question.explanation}
          </p>
        </div>
      )}
    </div>
  )
}