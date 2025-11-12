'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import QuestionViewer from '@/app/components/QuestionViewer'
import ChatPanel from '@/app/components/ChatPanel'
import AnswerOptions from '@/app/components/AnswerOptions'
import QuestionNavigation from '@/app/components/QuestionNavigation'
import Timer from '@/app/components/Timer'

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-custom-cyan via-custom-purple to-custom-pink">
        <div className="text-center bg-custom-white p-12 rounded-3xl shadow-container-lg">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-6"></div>
          <div className="font-body text-xl text-gray-700 tracking-custom">Loading your practice pack...</div>
        </div>
      </div>
    )
  }

  if (!pack || !pack.questions || pack.questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-custom-cyan via-custom-purple to-custom-pink">
        <div className="text-center bg-custom-white p-12 rounded-3xl shadow-container-lg">
          <div className="text-6xl mb-6">📚</div>
          <div className="font-body text-xl text-red-600 mb-8 tracking-custom">Pack not found or empty</div>
          <a
            href="/pack-maker"
            className="font-body inline-block px-8 py-3 bg-custom-purple text-gray-900 rounded-xl hover:bg-purple-300 shadow-container transition-all duration-300 tracking-custom"
          >
            Create New Pack
          </a>
        </div>
      </div>
    )
  }

  const currentQuestion = pack.questions[currentQuestionIndex]

  const handleQuestionNavigation = (index: number) => {
    setCurrentQuestionIndex(index)
  }

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="flex items-start justify-between">
          {/* Question Navigation - Top Left */}
          <div className="flex-1">
            <h3 className="font-inter font-semibold text-sm text-gray-600 mb-3">Questions</h3>
            <QuestionNavigation
              totalQuestions={pack.questions.length}
              currentQuestion={currentQuestionIndex}
              onQuestionClick={handleQuestionNavigation}
            />
          </div>

          {/* Timer - Top Right */}
          <div>
            <Timer />
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-8 py-3 bg-white">
        <div className="w-full bg-gray-200 rounded-full h-2 shadow-sm">
          <div
            className="bg-gradient-to-r from-black to-[#2A3CDB] h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / pack.questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden p-6 bg-gray-100">
        {/* Gradient Outline Container */}
        <div
          className="h-full p-1 rounded-3xl"
          style={{
            background: 'linear-gradient(135deg, #E4E7FF 0%, #9397ED 15%, #4248DB 35%, #5850D3 50%, #4E47B9 65%, #9391C3 85%, #EEEFFF 100%)'
          }}
        >
          {/* Inner white container */}
          <div className="h-full bg-white rounded-3xl p-6">
            {/* Two Column Grid */}
            <div className="h-full grid grid-cols-2 gap-6">
              {/* Left Column - Question Viewer */}
              <div className="flex flex-col bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
                <div className="flex-1 overflow-y-auto p-6">
                  <QuestionViewer
                    question={currentQuestion}
                    questionNumber={currentQuestionIndex + 1}
                    totalQuestions={pack.questions.length}
                  />
                </div>
                {/* Answer Options at bottom of left column */}
                <div className="border-t border-gray-200 p-6 bg-gray-50">
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
              <div className="flex flex-col bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
                <ChatPanel
                  question={currentQuestion}
                  packId={packId}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}