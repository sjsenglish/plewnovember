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
    const fetchPack = async () => {
      try {
        const response = await fetch(`/api/packs/${packId}`)
        if (response.ok) {
          const packData = await response.json()
          setPack(packData)
        }
      } catch (error) {
        console.error('Error fetching pack:', error)
      } finally {
        setLoading(false)
      }
    }

    if (packId) {
      fetchPack()
    }
  }, [packId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-lg font-medium text-gray-700">Loading your practice pack...</div>
        </div>
      </div>
    )
  }

  if (!pack || !pack.questions || pack.questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="text-6xl mb-4">📚</div>
          <div className="text-lg text-red-600 font-medium">Pack not found or empty</div>
          <a
            href="/pack-maker"
            className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl font-bold text-gray-900">PLEW Practice Session</h1>
          <div className="text-sm text-gray-600">
            Question {currentQuestionIndex + 1} of {pack.questions.length}
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / pack.questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Main Content - Two Column Grid */}
      <div className="flex-1 grid grid-cols-2 overflow-hidden">
        {/* Left Column - Question Viewer */}
        <div className="flex flex-col border-r border-gray-200 bg-white overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            <QuestionViewer
              question={currentQuestion}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={pack.questions.length}
            />
          </div>
          {/* Answer Options at bottom of left column */}
          <div className="border-t border-gray-200">
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
        <div className="flex flex-col bg-gray-50 overflow-hidden">
          <ChatPanel
            question={currentQuestion}
            packId={packId}
          />
        </div>
      </div>
    </div>
  )
}