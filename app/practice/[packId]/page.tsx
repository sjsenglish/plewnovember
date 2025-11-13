'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import QuestionViewer from '@/app/components/QuestionViewer'
import ChatPanel from '@/app/components/ChatPanel'
import AnswerOptions from '@/app/components/AnswerOptions'

interface Pack {
  id: string
  questions: any[]
  size: number
}

export default function Practice() {
  const params = useParams()
  const packId = params.packId as string
  const [pack, setPack] = useState<Pack | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPack = () => {
      try {
        // Try to get pack from localStorage
        const storedPack = localStorage.getItem(`pack-${packId}`)
        if (storedPack) {
          const packData = JSON.parse(storedPack)
          setPack({
            id: packData.packId,
            questions: packData.questions,
            size: packData.size
          })
        } else {
          console.error('Pack not found in localStorage')
        }
      } catch (error) {
        console.error('Error loading pack:', error)
      } finally {
        setLoading(false)
      }
    }

    if (packId) {
      loadPack()
    }
  }, [packId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-custom-cyan via-custom-purple to-custom-pink p-4">
        <div className="text-center bg-custom-white p-8 sm:p-12 rounded-3xl shadow-container-lg max-w-md">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-6"></div>
          <div className="font-body text-lg sm:text-xl text-gray-700 tracking-custom">Loading your practice pack...</div>
        </div>
      </div>
    )
  }

  if (!pack || !pack.questions || pack.questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-custom-cyan via-custom-purple to-custom-pink p-4">
        <div className="text-center bg-custom-white p-8 sm:p-12 rounded-3xl shadow-container-lg max-w-md">
          <div className="text-5xl sm:text-6xl mb-6">📚</div>
          <div className="font-body text-lg sm:text-xl text-red-600 mb-8 tracking-custom">Pack not found or empty</div>
          <a
            href="/pack-maker"
            className="font-body inline-block px-6 sm:px-8 py-3 bg-custom-purple text-gray-900 rounded-xl hover:bg-purple-300 shadow-container transition-all duration-300 tracking-custom"
          >
            Create New Pack
          </a>
        </div>
      </div>
    )
  }

  const currentQuestion = pack.questions[currentQuestionIndex]

  return (
    <div className="h-screen flex flex-col bg-custom-white overflow-hidden">
      {/* Question Overview */}
      <div className="bg-gradient-to-r from-custom-cyan via-custom-purple to-custom-pink shadow-container px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <h1 className="font-heading text-xl sm:text-2xl lg:text-3xl text-gray-900 tracking-custom mb-4">Question Overview</h1>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {pack.questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestionIndex(index)}
              className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center font-heading text-sm sm:text-base rounded-lg transition-all duration-200 shadow-container ${
                index === currentQuestionIndex
                  ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white scale-110 shadow-container-lg'
                  : 'bg-white/90 text-gray-700 hover:bg-white hover:scale-105'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content - Responsive Layout */}
      <div className="flex-1 flex flex-col lg:grid lg:grid-cols-2 overflow-hidden gap-3 sm:gap-4 p-3 sm:p-4">
        {/* Left Column - Question Viewer */}
        <div className="flex flex-col bg-white rounded-xl sm:rounded-2xl shadow-container-lg overflow-hidden min-h-0">
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <QuestionViewer
              question={currentQuestion}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={pack.questions.length}
            />
          </div>
          {/* Answer Options at bottom of left column */}
          <div className="border-t border-custom-purple/20 p-4 sm:p-6">
            <AnswerOptions
              question={currentQuestion}
              packId={packId}
              onAnswerSubmit={(isCorrect) => {
                console.log('Answer submitted, correct:', isCorrect)
              }}
            />
          </div>
        </div>

        {/* Right Column - Chat Panel */}
        <div className="flex flex-col bg-white rounded-xl sm:rounded-2xl shadow-container-lg overflow-hidden min-h-0">
          <ChatPanel
            question={currentQuestion}
            packId={packId}
          />
        </div>
      </div>
    </div>
  )
}