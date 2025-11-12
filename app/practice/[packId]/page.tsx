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
      <div className="min-h-screen flex items-center justify-center bg-white font-inter">
        <div className="text-center bg-white p-12 rounded-3xl shadow-lg">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-6"></div>
          <div className="text-xl text-gray-700">Loading your practice pack...</div>
        </div>
      </div>
    )
  }

  if (!pack || !pack.questions || pack.questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white font-inter">
        <div className="text-center bg-white p-12 rounded-3xl shadow-lg">
          <div className="text-6xl mb-6">📚</div>
          <div className="text-xl text-red-600 mb-8">Pack not found or empty</div>
          <a
            href="/pack-maker"
            className="inline-block px-8 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 shadow-lg transition-all duration-300"
          >
            Create New Pack
          </a>
        </div>
      </div>
    )
  }

  const currentQuestion = pack.questions[currentQuestionIndex]

  return (
    <div className="h-screen flex flex-col bg-white font-inter">
      {/* Top Header */}
      <div className="bg-white px-12 py-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">PLEW Practice Session</h1>

        {/* Gradient Divider Line */}
        <div
          className="h-1 w-full mb-6"
          style={{
            background: 'linear-gradient(to right, #A28BD6, #5F61DB)'
          }}
        ></div>

        {/* Question Overview */}
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Question Overview</h2>

        {/* Question Navigation Squares */}
        <div className="flex flex-wrap gap-2">
          {pack.questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestionIndex(index)}
              className="w-10 h-10 rounded flex items-center justify-center text-white font-medium transition-all"
              style={{
                backgroundColor: currentQuestionIndex === index ? '#4248DB' : '#000000'
              }}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content - Single Large Container */}
      <div className="flex-1 overflow-hidden px-12 pb-12">
        <div
          className="h-full rounded-2xl overflow-hidden"
          style={{
            border: '2px solid #9397ED',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
          }}
        >
          {/* Two Column Grid Inside Container */}
          <div className="h-full grid grid-cols-2">
            {/* Left Column - Question Viewer */}
            <div className="flex flex-col border-r border-gray-200">
              <div className="flex-1 overflow-y-auto p-6">
                <QuestionViewer
                  question={currentQuestion}
                  questionNumber={currentQuestionIndex + 1}
                  totalQuestions={pack.questions.length}
                />
              </div>
              {/* Answer Options at bottom of left column */}
              <div className="border-t border-gray-200 p-6">
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
            <div className="flex flex-col">
              <ChatPanel
                question={currentQuestion}
                packId={packId}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}