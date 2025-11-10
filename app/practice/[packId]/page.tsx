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
  const { packId } = useParams()
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading your practice pack...</div>
      </div>
    )
  }

  if (!pack) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-600">Pack not found</div>
      </div>
    )
  }

  const currentQuestion = pack.questions[currentQuestionIndex]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Left Pane - Question Viewer */}
        <div className="w-1/2 border-r border-gray-200">
          <QuestionViewer 
            question={currentQuestion}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={pack.questions.length}
          />
          <div className="p-4 border-t">
            <AnswerOptions 
              question={currentQuestion}
              onAnswer={(answer) => {
                // Handle answer selection
                console.log('Answer selected:', answer)
              }}
            />
          </div>
        </div>

        {/* Right Pane - Chat Panel */}
        <div className="w-1/2">
          <ChatPanel 
            question={currentQuestion}
            packId={packId as string}
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2">
        <div className="flex gap-4">
          <button
            onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
            disabled={currentQuestionIndex === 0}
            className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentQuestionIndex(Math.min(pack.questions.length - 1, currentQuestionIndex + 1))}
            disabled={currentQuestionIndex === pack.questions.length - 1}
            className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}