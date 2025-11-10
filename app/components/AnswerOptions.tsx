'use client'

import { useState } from 'react'

interface Question {
  id: string
  question: string
  type: 'multiple-choice' | 'true-false' | 'essay'
  options?: string[]
  correctAnswer?: string
  explanation?: string
}

interface AnswerOptionsProps {
  question: Question
  onAnswer: (answer: string) => void
}

export default function AnswerOptions({ question, onAnswer }: AnswerOptionsProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string>('')
  const [showExplanation, setShowExplanation] = useState(false)
  const [essayAnswer, setEssayAnswer] = useState('')

  const handleSubmit = () => {
    const answer = question.type === 'essay' ? essayAnswer : selectedAnswer
    if (!answer.trim()) return

    onAnswer(answer)
    setShowExplanation(true)
  }

  const handleReset = () => {
    setSelectedAnswer('')
    setEssayAnswer('')
    setShowExplanation(false)
  }

  if (question.type === 'essay') {
    return (
      <div className="space-y-4">
        <div className="space-y-3">
          <label htmlFor="essay-answer" className="block text-sm font-medium text-gray-700">
            Your Answer:
          </label>
          <textarea
            id="essay-answer"
            value={essayAnswer}
            onChange={(e) => setEssayAnswer(e.target.value)}
            placeholder="Type your essay response here..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={6}
            disabled={showExplanation}
          />
        </div>

        <div className="flex space-x-3">
          <button
            onClick={handleSubmit}
            disabled={!essayAnswer.trim() || showExplanation}
            className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Answer
          </button>
          {showExplanation && (
            <button
              onClick={handleReset}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Try Again
            </button>
          )}
        </div>

        {showExplanation && question.explanation && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Sample Response:</h4>
            <p className="text-blue-800">{question.explanation}</p>
          </div>
        )}
      </div>
    )
  }

  const options = question.type === 'true-false' 
    ? ['True', 'False']
    : question.options || []

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <p className="text-sm font-medium text-gray-700">Select your answer:</p>
        {options.map((option, index) => {
          const letter = String.fromCharCode(65 + index)
          const isSelected = selectedAnswer === option
          const isCorrect = showExplanation && option === question.correctAnswer
          const isIncorrect = showExplanation && isSelected && option !== question.correctAnswer

          return (
            <button
              key={index}
              onClick={() => !showExplanation && setSelectedAnswer(option)}
              disabled={showExplanation}
              className={`w-full p-3 text-left border-2 rounded-lg transition-colors ${
                isCorrect
                  ? 'border-green-500 bg-green-50 text-green-800'
                  : isIncorrect
                  ? 'border-red-500 bg-red-50 text-red-800'
                  : isSelected
                  ? 'border-blue-500 bg-blue-50 text-blue-800'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              } ${showExplanation ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <span className="font-medium mr-2">{letter}.</span>
              {option}
              {isCorrect && <span className="ml-2 text-green-600">✓ Correct</span>}
              {isIncorrect && <span className="ml-2 text-red-600">✗ Incorrect</span>}
            </button>
          )
        })}
      </div>

      <div className="flex space-x-3">
        <button
          onClick={handleSubmit}
          disabled={!selectedAnswer || showExplanation}
          className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit Answer
        </button>
        {showExplanation && (
          <button
            onClick={handleReset}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Try Again
          </button>
        )}
      </div>

      {showExplanation && question.explanation && (
        <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Explanation:</h4>
          <p className="text-gray-700">{question.explanation}</p>
        </div>
      )}
    </div>
  )
}