'use client'

import { useState, useEffect, useRef } from 'react'
import styles from './ChatPanel.module.css'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: string
}

interface ChatPanelProps {
  question: any
  packId: string
  isDemo?: boolean
  onDemoComplete?: () => void
}

export default function ChatPanel({ question, packId, isDemo = false, onDemoComplete }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Initialize with welcome message when question changes
  useEffect(() => {
    if (question) {
      const welcomeContent = isDemo
        ? `=== 데모 시작 ===

안녕하세요! 👋 CSAT Reading Buddy에 오신 것을 환영합니다.

이 데모에서는 영어 지문을 분석하는 3단계 방법을 배웁니다.

📖 3단계 방법:
1단계: 단순화 & 번역 - 각 문장을 더 쉽게 만들고 한국어로 번역
2단계: PLEW 분석 - 각 문장이 어떤 역할을 하는지 분류 [P]목적, [L]논리, [E]증거, [W]약점
3단계: 정답 찾기 - 분석을 바탕으로 답을 선택

이 문제는 "주제"를 찾는 문제이므로 PLEW 분석이 필요합니다.

실제 연습에서는 제가 덜 설명하고 여러분이 더 많이 생각해야 해요. 하지만 데모에서는 제가 더 자세히 도와드릴게요!

준비되셨나요? "준비됐어요" 또는 "시작"이라고 말씀해주세요!`
        : `안녕하세요! 👋

3단계 방법으로 문제를 풀어봅시다:
1단계: 단순화 & 번역
2단계: PLEW 분석 (필요한 경우)
3단계: 정답 찾기

한 문장씩 차근차근 진행하겠습니다. 준비되셨나요?

첫 번째 문장을 영어로 단순화해 보세요.`

      const welcomeMessage: Message = {
        id: `welcome-${question.id}`,
        content: welcomeContent,
        role: 'assistant',
        timestamp: new Date().toISOString()
      }
      setMessages([welcomeMessage])
    }
  }, [question, isDemo])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: 'user',
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const endpoint = isDemo ? '/api/demo-chat' : '/api/chat'
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input.trim(),
          question: question,
          chatHistory: messages.map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: Date.now().toString(),
        content: data.response,
        role: 'assistant',
        timestamp: data.timestamp
      }

      setMessages(prev => [...prev, assistantMessage])

      // Check if demo is complete (when AI mentions "실전 시작")
      if (isDemo && data.response.includes('"실전 시작"이라고 말씀해주세요!') && onDemoComplete) {
        // Wait a moment so the user can read the final message
        setTimeout(() => {
          onDemoComplete()
        }, 3000)
      }
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: "죄송합니다. 지금 응답하는 데 문제가 있습니다. 다시 시도해주세요.",
        role: 'assistant',
        timestamp: new Date().toISOString()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const hours = date.getHours()
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${hours}:${minutes}`
  }

  return (
    <div className={styles.chatContainer}>
      {/* Messages */}
      <div className={styles.messagesArea}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`${styles.messageWrapper} ${
              message.role === 'user' ? styles.messageWrapperUser : styles.messageWrapperAssistant
            }`}
          >
            <div className={styles.timestamp}>
              {formatTime(message.timestamp)}
            </div>
            <div
              className={`${styles.messageBubble} ${
                message.role === 'user' ? styles.userMessage : styles.buddyMessage
              }`}
            >
              <div className={styles.messageContent}>{message.content}</div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingBubble}>
              <div className="flex items-center space-x-1.5">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className={styles.inputArea}>
        <div className={styles.inputContainer}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder=""
            className={styles.chatInput}
            rows={4}
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className={styles.sendButton}
          >
            전송
          </button>
        </div>
      </div>
    </div>
  )
}