'use client'

import { useState, useEffect } from 'react'
import QuestionViewer from '@/app/components/QuestionViewer'
import ChatPanel from '@/app/components/ChatPanel'
import AnswerOptions from '@/app/components/AnswerOptions'
import Navbar from '@/app/components/Navbar'
import { demoQuestion } from '@/lib/demo-question'
import styles from '../practice/[packId]/practiceQuestions.module.css'

export default function Demo() {
  const [timer, setTimer] = useState(0)
  const [demoCompleted, setDemoCompleted] = useState(false)
  const [answeredCorrectly, setAnsweredCorrectly] = useState(false)
  const [questionState, setQuestionState] = useState({
    selectedAnswer: '',
    showFeedback: false
  })

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

  const handleDemoCompletion = () => {
    // Mark demo as completed
    localStorage.setItem('demo-completed', 'true')
    setDemoCompleted(true)
  }

  if (demoCompleted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div
          className="flex-1 flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://firebasestorage.googleapis.com/v0/b/plewcsat1.firebasestorage.app/o/icons%2Fbackground.svg?alt=media&token=85f36310-0af9-49f9-9453-8e4064cad41e')"
          }}
        >
          <div className="w-full max-w-3xl flex flex-col items-center">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/plewcsat1.firebasestorage.app/o/icons%2FGroup%202803.svg?alt=media&token=ba8ce115-ed4d-47d3-883b-c336b8b83381"
              alt="데모 완료"
              className="w-full max-w-2xl mb-8"
            />
            <a
              href="/pack-maker"
              className="font-heading inline-block px-8 sm:px-12 py-4 sm:py-5 bg-custom-purple text-gray-900 rounded-2xl hover:bg-purple-300 shadow-container-lg transition-all duration-300 tracking-custom text-lg sm:text-xl font-semibold"
            >
              문제팩 만들기
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.mainContent}>
        {/* Question Number Bar */}
        <div className={styles.questionNumberBar}>
          <div className={styles.questionNumbersContainer}>
            <button
              className={`${styles.questionSquare} ${styles.questionSquareActive}`}
            >
              데모
            </button>
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
                  question={demoQuestion}
                  questionNumber={1}
                  totalQuestions={1}
                />
              </div>
              <div className={styles.answerSection}>
                <AnswerOptions
                  question={demoQuestion}
                  packId="demo"
                  questionIndex={0}
                  totalQuestions={1}
                  questionState={questionState}
                  onStateChange={setQuestionState}
                  onNext={() => {}}
                  isDemo={true}
                  showFinishButton={answeredCorrectly}
                  onFinish={handleDemoCompletion}
                  onAnswerSubmit={(isCorrect) => {
                    console.log('Demo answer submitted, correct:', isCorrect)
                    if (isCorrect) {
                      setAnsweredCorrectly(true)
                    }
                  }}
                />
              </div>
            </div>

            {/* Chat Panel - 40% width */}
            <div className={styles.chatPanel}>
              <ChatPanel
                question={demoQuestion}
                packId="demo"
                isDemo={true}
                onDemoComplete={handleDemoCompletion}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
