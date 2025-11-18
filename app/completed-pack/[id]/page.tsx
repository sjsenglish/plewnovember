'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import QuestionViewer from '@/app/components/QuestionViewer'
import ChatPanel from '@/app/components/ChatPanel'
import Navbar from '@/app/components/Navbar'
import styles from './completedPack.module.css'

interface CompletedPack {
  id: string
  packId: string
  userEmail: string
  packSize: number
  level: number
  score: number
  totalQuestions: number
  scorePercentage: number
  timeTakenSeconds: number
  startedAt: string
  completedAt: string
}

interface Answer {
  id: string
  question_object_id: string
  question_text: string
  selected_answer: string
  correct_answer: string
  is_correct: boolean
  answered_at: string
}

interface Question {
  objectID: string
  questionText: string
  answerOptions: string[]
  correctAnswer: string
  selectedAnswer?: string
  isCorrect?: boolean
}

export default function CompletedPackView() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [pack, setPack] = useState<CompletedPack | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadCompletedPack()
  }, [id])

  const loadCompletedPack = async () => {
    try {
      const response = await fetch(`/api/completed-packs/${id}`)

      if (!response.ok) {
        throw new Error('Failed to load completed pack')
      }

      const data = await response.json()
      setPack(data.pack)

      // Transform answers into questions format
      const transformedQuestions: Question[] = data.answers.map((answer: Answer) => ({
        objectID: answer.question_object_id,
        questionText: answer.question_text,
        answerOptions: [], // Will need to fetch original questions if we want to show all options
        correctAnswer: answer.correct_answer,
        selectedAnswer: answer.selected_answer,
        isCorrect: answer.is_correct
      }))

      setQuestions(transformedQuestions)
    } catch (err) {
      console.error('Error loading completed pack:', err)
      setError('완료된 팩을 불러오는데 실패했습니다')
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
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
            <div className="font-body text-lg sm:text-xl text-gray-700 tracking-custom">완료된 팩을 불러오는 중...</div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !pack || questions.length === 0) {
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
            <div className="text-5xl sm:text-6xl mb-6">😕</div>
            <div className="font-body text-lg sm:text-xl text-red-600 mb-8 tracking-custom">
              {error || '완료된 팩을 찾을 수 없습니다'}
            </div>
            <button
              onClick={() => router.push('/pack-maker')}
              className="font-body inline-block px-6 sm:px-8 py-3 bg-custom-purple text-gray-900 rounded-xl hover:bg-purple-300 shadow-container transition-all duration-300 tracking-custom"
            >
              팩 메이커로 돌아가기
            </button>
          </div>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]

  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.mainContent}>
        {/* Question Number Bar */}
        <div className={styles.questionNumberBar}>
          <div className={styles.questionNumbersContainer}>
            {questions.map((q, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`${styles.questionSquare} ${
                  index === currentQuestionIndex
                    ? styles.questionSquareActive
                    : q.isCorrect
                    ? styles.questionSquareCorrect
                    : styles.questionSquareIncorrect
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <div className={styles.timer}>{formatTime(pack.timeTakenSeconds)}</div>
        </div>

        {/* Score Banner */}
        <div className={styles.scoreBanner}>
          <div className={styles.scoreInfo}>
            <span className={styles.scoreLabel}>점수:</span>
            <span className={styles.scoreValue}>{pack.score} / {pack.totalQuestions}</span>
            <span className={styles.scorePercentage}>({pack.scorePercentage}%)</span>
          </div>
          <button
            onClick={() => router.push('/pack-maker')}
            className={styles.backButton}
          >
            팩 메이커로 돌아가기
          </button>
        </div>

        {/* Main Content Area */}
        <div className={styles.contentArea}>
          <div className={styles.combinedContainer}>
            {/* Question Panel - 60% width */}
            <div className={styles.questionPanel}>
              <div className={styles.questionContent}>
                <QuestionViewer
                  question={{
                    ...currentQuestion,
                    actualQuestion: '문제',
                    explanation: ''
                  }}
                  questionNumber={currentQuestionIndex + 1}
                  totalQuestions={questions.length}
                />
              </div>
              <div className={styles.answerSection}>
                <div className={styles.optionsContainer}>
                  <p className={styles.optionsLabel}>답변 결과:</p>
                  <div className={styles.optionsList}>
                    {currentQuestion.answerOptions && currentQuestion.answerOptions.length > 0 ? (
                      currentQuestion.answerOptions.map((option, index) => {
                        const isSelected = currentQuestion.selectedAnswer === option
                        const isCorrect = option === currentQuestion.correctAnswer
                        const isIncorrect = isSelected && option !== currentQuestion.correctAnswer

                        return (
                          <div
                            key={index}
                            className={`${styles.answerButton} ${
                              isCorrect
                                ? styles.correct
                                : isIncorrect
                                ? styles.incorrect
                                : isSelected
                                ? styles.selected
                                : ''
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <span className={styles.optionNumber}>{index + 1}.</span>
                                <span className={styles.optionText}>{option}</span>
                              </div>
                              {isCorrect && <span className="text-green-600 text-[0.8rem] font-heading tracking-custom">✓ 정답</span>}
                              {isIncorrect && <span className="text-red-600 text-[0.8rem] font-heading tracking-custom">✗ 오답</span>}
                            </div>
                          </div>
                        )
                      })
                    ) : (
                      // If answer options weren't stored, show just the selected and correct answers
                      <div className={styles.simpleAnswerView}>
                        <div className={`${styles.answerItem} ${currentQuestion.isCorrect ? styles.correct : ''}`}>
                          <span className={styles.answerLabel}>내 답변:</span>
                          <span className={styles.answerValue}>{currentQuestion.selectedAnswer}</span>
                          {currentQuestion.isCorrect && <span className="text-green-600 text-[0.8rem] font-heading tracking-custom ml-2">✓ 정답</span>}
                          {!currentQuestion.isCorrect && <span className="text-red-600 text-[0.8rem] font-heading tracking-custom ml-2">✗ 오답</span>}
                        </div>
                        {!currentQuestion.isCorrect && (
                          <div className={`${styles.answerItem} ${styles.correct}`}>
                            <span className={styles.answerLabel}>정답:</span>
                            <span className={styles.answerValue}>{currentQuestion.correctAnswer}</span>
                            <span className="text-green-600 text-[0.8rem] font-heading tracking-custom ml-2">✓</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Navigation Buttons */}
                  <div className={styles.buttonContainer}>
                    <button
                      onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                      disabled={currentQuestionIndex === 0}
                      className={styles.navButton}
                    >
                      ← 이전
                    </button>
                    <button
                      onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                      disabled={currentQuestionIndex === questions.length - 1}
                      className={styles.navButton}
                    >
                      다음 →
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Panel - 40% width */}
            <div className={styles.chatPanel}>
              <ChatPanel
                question={currentQuestion}
                packId={pack.packId}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
