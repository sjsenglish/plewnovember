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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-200 border-t-gray-900 mx-auto mb-4"></div>
          <div className="font-body text-gray-600">Loading your practice pack...</div>
        </div>
      </div>
    )
  }

  if (!pack || !pack.questions || pack.questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="text-6xl mb-4">📚</div>
          <div className="font-body text-xl text-gray-900 mb-6">Pack not found or empty</div>
          <a
            href="/pack-maker"
            className="font-body inline-block px-6 py-3 bg-gray-900 text-white rounded-2xl hover:bg-gray-800 transition-all duration-200"
          >
            Create New Pack
          </a>
        </div>
      </div>
    )
  }

  const currentQuestion = pack.questions[currentQuestionIndex]

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Top Progress Bar */}
      <div className="bg-white border-b border-gray-100 px-12 py-6">
        <div className="max-w-[1800px] mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="font-heading text-xl text-gray-900">PLEW Practice Session</h1>
            <div className="font-body text-sm text-gray-500">
              Question {currentQuestionIndex + 1} of {pack.questions.length}
            </div>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div
              className="bg-gray-900 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / pack.questions.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Content - Two Column Grid */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full max-w-[1800px] mx-auto grid grid-cols-2 gap-px bg-gray-200">
          {/* Left Column - Question Viewer */}
          <div className="flex flex-col bg-white overflow-hidden">
            <div className="flex-1 overflow-y-auto">
              <QuestionViewer
                question={currentQuestion}
                questionNumber={currentQuestionIndex + 1}
                totalQuestions={pack.questions.length}
              />
            </div>
            {/* Answer Options at bottom of left column */}
            <div className="border-t border-gray-100 px-12 py-8">
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
          <div className="flex flex-col bg-white overflow-hidden">
            <ChatPanel
              question={currentQuestion}
              packId={packId}
            />
          </div>
        </div>
      </div>
    </div>
  )
}