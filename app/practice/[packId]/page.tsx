'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import QuestionViewer from '@/app/components/QuestionViewer'
import ChatPanel from '@/app/components/ChatPanel'
import AnswerOptions from '@/app/components/AnswerOptions'
import Navbar from '@/app/components/Navbar'
import { useAuth } from '@/app/context/AuthContext' // Import AuthContext
import styles from './practiceQuestions.module.css'

interface Pack {
  id: string
  questions: any[]
  size: number
  level?: number
}

interface QuestionState {
  selectedAnswer: string
  showFeedback: boolean
  isCorrect?: boolean
  answeredAt?: string
}

export default function Practice() {
  const params = useParams()
  const router = useRouter()
  const packId = params.packId as string
  const { user } = useAuth() // Get real user from context

  const [pack, setPack] = useState<Pack | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [timer, setTimer] = useState(0)
  const [questionStates, setQuestionStates] = useState<Record<number, QuestionState>>({})
  const [startedAt, setStartedAt] = useState<string | null>(null)
  const [isCompleted, setIsCompleted] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [generatingNewPack, setGeneratingNewPack] = useState(false)

  useEffect(() => {
    const loadPack = async () => {
      try {
        // Try to get pack from localStorage first
        const storedPack = localStorage.getItem(`pack-${packId}`)
        if (storedPack) {
          const packData = JSON.parse(storedPack)
          setPack({
            id: packData.packId,
            questions: packData.questions,
            size: packData.size,
            level: packData.level || 1
          })
          // Set start time when pack is first loaded
          setStartedAt(new Date().toISOString())
        } else {
          // If not in localStorage, try to fetch from API (for shared packs)
          console.log('[DEBUG] Pack not in localStorage, trying API for shared pack:', packId)
          const response = await fetch(`/api/packs/${packId}`)
          if (response.ok) {
            const packData = await response.json()
            // Check if it's a shared pack (has questions array)
            if (packData.questions && packData.questions.length > 0) {
              console.log('[DEBUG] Loaded shared pack from API:', packId)
              setPack({
                id: packData.packId,
                questions: packData.questions,
                size: packData.size,
                level: packData.level || 1
              })
              // Store in localStorage for future use
              localStorage.setItem(`pack-${packId}`, JSON.stringify(packData))
              setStartedAt(new Date().toISOString())
            } else {
              console.error('Pack not found in localStorage or API')
            }
          } else {
            console.error('Pack not found in localStorage or API')
          }
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

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => prev + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handlePackCompletion = async () => {
    if (!pack || !startedAt || isCompleted || isSaving) return

    // Check if user is logged in using context, not localStorage
    if (!user || !user.email) {
      console.error('No authenticated user found')
      alert('로그인이 필요합니다.')
      router.push('/login')
      return
    }

    setIsCompleted(true)
    setIsSaving(true)

    try {
      // Calculate score
      const score = Object.values(questionStates).filter(state => state.isCorrect).length

      // Prepare answers data
      const answers = pack.questions.map((question, index) => {
        const state = questionStates[index]
        return {
          questionObjectId: question.objectID,
          questionText: question.questionText,
          selectedAnswer: state?.selectedAnswer || '',
          correctAnswer: question.correctAnswer,
          isCorrect: state?.isCorrect || false,
          answeredAt: state?.answeredAt || new Date().toISOString()
        }
      })

      // Save completed pack to backend
      const response = await fetch('/api/completed-packs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail: user.email, // Use the real email from context
          packId: pack.id,
          packSize: pack.size,
          level: pack.level || 1,
          score,
          totalQuestions: pack.questions.length,
          timeTakenSeconds: timer,
          startedAt,
          answers
        })
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Pack completion saved successfully')
        // Auto-generate new pack
        await generateNewPack()
        // Redirect to pack maker
        router.push('/pack-maker')
      } else {
        const errorData = await response.json()
        console.error('Failed to save completed pack:', errorData)
        alert(`Error: ${errorData.error || 'Failed to save'}`)
        setIsSaving(false) // Allow retry if it failed
        setIsCompleted(false)
      }
    } catch (error) {
      console.error('Error saving completed pack:', error)
      setIsSaving(false)
      setIsCompleted(false)
    }
  }

  const generateNewPack = async () => {
    if (!pack || generatingNewPack || !user) return

    setGeneratingNewPack(true)

    try {
      // Create new pack with same size and level
      const response = await fetch('/api/packs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          size: pack.size,
          userEmail: user.email, // Use real email
          level: pack.level || 1
        })
      })

      if (response.ok) {
        const newPackData = await response.json()
        // Store new pack in localStorage
        localStorage.setItem(`pack-${newPackData.packId}`, JSON.stringify(newPackData))
        console.log('New pack generated:', newPackData.packId)
      } else {
        console.error('Failed to generate new pack')
      }
    } catch (error) {
      console.error('Error generating new pack:', error)
    } finally {
      setGeneratingNewPack(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div
          className="flex-1 flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://firebasestorage.googleapis.com/v0/b/plewcsat1.firebasestorage.app/o/icons%2Fbackground.svg?alt=media&token=85f36310-0af9-49f9-9453-8e4064cad41e')"
          }}
        >
          <div className="text-center bg-custom-white p-8 sm:p-12 rounded-3xl shadow-container-lg max-w-md">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-6"></div>
            <div className="font-body text-lg sm:text-xl text-gray-700 tracking-custom">연습 팩을 불러오는 중...</div>
          </div>
        </div>
      </div>
    )
  }

  if (!pack || !pack.questions || pack.questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div
          className="flex-1 flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://firebasestorage.googleapis.com/v0/b/plewcsat1.firebasestorage.app/o/icons%2Fbackground.svg?alt=media&token=85f36310-0af9-49f9-9453-8e4064cad41e')"
          }}
        >
          <div className="text-center bg-custom-white p-8 sm:p-12 rounded-3xl shadow-container-lg max-w-md">
            <div className="text-5xl sm:text-6xl mb-6">📚</div>
            <div className="font-body text-lg sm:text-xl text-red-600 mb-8 tracking-custom">팩을 찾을 수 없거나 비어 있습니다</div>
            <a
              href="/pack-maker"
              className="font-body inline-block px-6 sm:px-8 py-3 bg-custom-purple text-gray-900 rounded-xl hover:bg-purple-300 shadow-container transition-all duration-300 tracking-custom"
            >
              새 팩 만들기
            </a>
          </div>
        </div>
      </div>
    )
  }

  const currentQuestion = pack.questions[currentQuestionIndex]

  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.mainContent}>
        {/* Question Number Bar */}
        <div className={styles.questionNumberBar}>
          <div className={styles.questionNumbersContainer}>
            {pack.questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`${styles.questionSquare} ${
                  index === currentQuestionIndex
                    ? styles.questionSquareActive
                    : styles.questionSquareInactive
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <div className={styles.timer}>{formatTime(timer)}</div>
        </div>

        {/* Main Content Area */}
        <div className={styles.contentArea}>
          <div className={styles.combinedContainer}>
            {/* Question Panel - 60% width */}
            <div className={styles.questionPanel}>
              <div className={styles.questionContent}>
                <QuestionViewer
                  question={currentQuestion}
                  questionNumber={currentQuestionIndex + 1}
                  totalQuestions={pack.questions.length}
                />
              </div>
              <div className={styles.answerSection}>
                <AnswerOptions
                  question={currentQuestion}
                  packId={packId}
                  questionIndex={currentQuestionIndex}
                  totalQuestions={pack.questions.length}
                  questionState={questionStates[currentQuestionIndex]}
                  onStateChange={(state) => {
                    setQuestionStates(prev => ({
                      ...prev,
                      [currentQuestionIndex]: state
                    }))
                  }}
                  onAnswerSubmit={(isCorrect) => {
                    // Update question state with correctness and timestamp
                    setQuestionStates(prev => ({
                      ...prev,
                      [currentQuestionIndex]: {
                        ...prev[currentQuestionIndex],
                        isCorrect,
                        answeredAt: new Date().toISOString()
                      }
                    }))
                  }}
                  onNext={() => {
                    // Move to next question
                    setCurrentQuestionIndex((prev) => prev + 1)
                  }}
                  onFinish={handlePackCompletion}
                />
              </div>
            </div>

            {/* Chat Panel - 40% width */}
            <div className={styles.chatPanel}>
              <ChatPanel
                question={currentQuestion}
                packId={packId}
                userEmail={user?.email || undefined}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
