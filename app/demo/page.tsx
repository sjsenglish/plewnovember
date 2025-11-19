'use client'

import { useState, useEffect } from 'react'
import QuestionViewer from '@/app/components/QuestionViewer'
import ChatPanel from '@/app/components/ChatPanel'
import AnswerOptions from '@/app/components/AnswerOptions'
import Navbar from '@/app/components/Navbar'
import { demoQuestion } from '@/lib/demo-question'
import styles from '../practice/[packId]/practiceQuestions.module.css'
import completionStyles from './demoCompletion.module.css'

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
      <div className={completionStyles.completionContainer}>
        <Navbar />
        <div
          className={completionStyles.backgroundWrapper}
          style={{
            backgroundImage: "url('https://firebasestorage.googleapis.com/v0/b/plewcsat1.firebasestorage.app/o/icons%2Fbackground.svg?alt=media&token=85f36310-0af9-49f9-9453-8e4064cad41e')"
          }}
        >
          {/* Try a Sample Pack Button - Top Right */}
          <a
            href="/practice/sample-pack-2026"
            style={{
              position: 'fixed',
              top: '100px',
              right: '20px',
              zIndex: 50,
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: '#c4b5fd',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              textDecoration: 'none'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#a78bfa'
              e.currentTarget.style.transform = 'scale(1.1)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#c4b5fd'
              e.currentTarget.style.transform = 'scale(1)'
            }}
            title="Try a sample CSAT question"
          >
            <img
              src="https://firebasestorage.googleapis.com/v0/b/plewcsat1.firebasestorage.app/o/icons%2Ffolder_blue.svg?alt=media&token=3f5b15d2-6e3c-4679-aa98-3d8bc86e4aff"
              alt="Sample Pack"
              style={{ width: '32px', height: '32px' }}
            />
          </a>

          <div className={completionStyles.contentWrapper}>
            <div className={completionStyles.card}>
              <div className={completionStyles.textSection}>
                <div className={completionStyles.emoji}>🎉</div>
                <h1 className={completionStyles.title}>
                  데모 완료!
                </h1>
                <p className={completionStyles.description}>
                  축하합니다! PLEW 버디 사용법을 성공적으로 배웠습니다.<br/>
                  이제 실전 문제팩을 만들어 본격적으로 CSAT 독해를 연습해보세요.
                </p>
              </div>

              <div className={completionStyles.buttonContainer}>
                <a
                  href="/pack-maker"
                  className={completionStyles.primaryButton}
                >
                  문제팩 만들기
                </a>
                <a
                  href="/"
                  className={completionStyles.secondaryButton}
                >
                  홈으로 돌아가기
                </a>
              </div>
            </div>
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
