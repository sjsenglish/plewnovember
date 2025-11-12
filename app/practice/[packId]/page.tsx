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
      {/* Top Title */}
      <div className="px-8 py-4 bg-white">
        <h1 className="font-inter font-bold text-2xl text-gray-900">PLEW Practice</h1>
      </div>

      {/* Gradient Divider Line */}
      <div
        className="h-[3px] mx-8"
        style={{
          background: 'linear-gradient(90deg, #E4E7FF 0%, #9397ED 15%, #4248DB 35%, #5850D3 50%, #4E47B9 65%, #9391C3 85%, #EEEFFF 100%)',
        }}
      ></div>

      {/* Navigation and Timer Bar */}
      <div className="bg-white px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Question Navigation - Left */}
          <div className="flex-1">
            <div className="flex items-center gap-8">
              <h3 className="font-inter font-semibold text-sm text-gray-600">Question Overview</h3>
              <div className="flex items-center gap-2">
                <span className="font-inter font-semibold text-sm text-gray-600 mr-2">Time</span>
                <Timer />
              </div>
            </div>
            <div className="mt-3">
              <QuestionNavigation
                totalQuestions={pack.questions.length}
                currentQuestion={currentQuestionIndex}
                onQuestionClick={handleQuestionNavigation}
              />
            </div>
          </div>

          {/* Progress Bar and Counter - Right */}
          <div className="w-80">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-black to-[#2A3CDB] h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / pack.questions.length) * 100}%` }}
              ></div>
            </div>
            <div className="text-right mt-1">
              <span className="font-inter text-sm text-gray-600">
                Question {currentQuestionIndex + 1} of {pack.questions.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden px-12 py-8 bg-white">
        {/* SVG Background Container - Increased size */}
        <div
          className="h-full w-full rounded-3xl bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://firebasestorage.googleapis.com/v0/b/plewcsat1.firebasestorage.app/o/icons%2FRectangle%202130.svg?alt=media&token=9f9384aa-6a16-4302-b4fe-279ca9f95e0a)',
            backgroundSize: '100% 100%',
            padding: '32px',
          }}
        >
          {/* Two Column Grid with spacing adjusted to fit inside SVG */}
          <div className="h-full grid grid-cols-2 gap-8">
            {/* Left Column - Question Viewer */}
            <div className="flex flex-col bg-transparent rounded-2xl overflow-hidden">
              <div className="flex-1 overflow-y-auto pr-2">
                <QuestionViewer
                  question={currentQuestion}
                  questionNumber={currentQuestionIndex + 1}
                  totalQuestions={pack.questions.length}
                />
              </div>
              {/* Answer Options at bottom */}
              <div className="mt-4">
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
            <div className="flex flex-col bg-transparent rounded-2xl overflow-hidden h-full">
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