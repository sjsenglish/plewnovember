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
  const [timeElapsed, setTimeElapsed] = useState(0)

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}mins`
  }

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

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-custom-cyan via-custom-purple to-custom-pink">
      {/* Top Section */}
      <div className="px-8 py-6 bg-white shadow-lg">
        {/* Title */}
        <h1 className="font-heading text-3xl font-bold text-gray-900 tracking-custom mb-4">
          PLEW Practice
        </h1>

        {/* Gradient Divider */}
        <div className="w-full h-1 bg-gradient-to-r from-custom-cyan via-custom-purple to-custom-pink mb-6"></div>

        {/* Question Overview and Timer */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-heading text-xl text-gray-900 tracking-custom mb-3">Question Overview</h2>
            <div className="font-body text-base text-gray-600 tracking-custom">
              Timer: {formatTime(timeElapsed)}
            </div>
          </div>

          {/* Progress Bar - Top Right */}
          <div className="flex flex-col items-end">
            <div className="font-body text-base text-gray-700 tracking-custom mb-2">
              Question {currentQuestionIndex + 1} of {pack.questions.length}
            </div>
            <div className="w-64 bg-gray-200 rounded-full h-3 shadow-sm">
              <div
                className="bg-gradient-to-r from-purple-500 to-purple-700 h-3 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / pack.questions.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Question Navigation Buttons */}
        <div className="flex gap-3 flex-wrap">
          {pack.questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestionIndex(index)}
              className={`w-14 h-14 flex items-center justify-center font-heading text-lg font-bold rounded-lg shadow-md transition-all duration-200 hover:shadow-lg ${
                index === currentQuestionIndex
                  ? 'bg-[#4248DB] text-white'
                  : 'bg-black text-white hover:bg-gray-800'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content - Two Column Grid with gradient border */}
      <div className="flex-1 overflow-hidden p-6">
        <div className="h-full grid grid-cols-2 gap-10">
          {/* Left Column - Question Viewer with gradient border */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-custom-cyan via-custom-purple to-custom-pink rounded-2xl"></div>
            <div className="absolute inset-[3px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
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
          </div>

          {/* Right Column - Chat Panel with gradient border */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-custom-cyan via-custom-purple to-custom-pink rounded-2xl"></div>
            <div className="absolute inset-[3px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
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