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
      <div className="fixed inset-0 w-screen h-screen flex items-center justify-center m-0 p-0" style={{
        backgroundImage: 'url(https://firebasestorage.googleapis.com/v0/b/plewcsat1.firebasestorage.app/o/icons%2Fsite%20bg%20gradient.svg?alt=media&token=b0995b84-c897-4418-a164-14b6e263bb1a)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-6"></div>
          <div className="font-body text-lg sm:text-xl text-gray-700 tracking-custom">Loading your practice pack...</div>
        </div>
      </div>
    )
  }

  if (!pack || !pack.questions || pack.questions.length === 0) {
    return (
      <div className="fixed inset-0 w-screen h-screen flex items-center justify-center m-0 p-0" style={{
        backgroundImage: 'url(https://firebasestorage.googleapis.com/v0/b/plewcsat1.firebasestorage.app/o/icons%2Fsite%20bg%20gradient.svg?alt=media&token=b0995b84-c897-4418-a164-14b6e263bb1a)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        <div className="text-center p-8">
          <div className="text-5xl sm:text-6xl mb-6">📚</div>
          <div className="font-body text-lg sm:text-xl text-red-600 mb-8 tracking-custom">Pack not found or empty</div>
          <a
            href="/pack-maker"
            className="font-body inline-block px-6 sm:px-8 py-3 bg-custom-purple text-gray-900 hover:bg-purple-300 transition-all duration-300 tracking-custom"
          >
            Create New Pack
          </a>
        </div>
      </div>
    )
  }

  const currentQuestion = pack.questions[currentQuestionIndex]

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden m-0 p-0" style={{
      backgroundImage: 'url(https://firebasestorage.googleapis.com/v0/b/plewcsat1.firebasestorage.app/o/icons%2Fsite%20bg%20gradient.svg?alt=media&token=b0995b84-c897-4418-a164-14b6e263bb1a)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      {/* Main Content - Two Column Layout */}
      <div className="h-full grid grid-cols-2 gap-0">
        {/* Left Column - Question Viewer */}
        <div className="flex flex-col overflow-hidden p-8">
          <div className="flex-1 overflow-y-auto">
            <QuestionViewer
              question={currentQuestion}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={pack.questions.length}
            />
          </div>
          {/* Answer Options at bottom of left column */}
          <div className="pt-6">
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
        <div className="flex flex-col overflow-hidden p-8">
          <ChatPanel
            question={currentQuestion}
            packId={packId}
          />
        </div>
      </div>
    </div>
  )
}