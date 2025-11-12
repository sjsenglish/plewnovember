'use client'

import { useState, useEffect, useRef } from 'react'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: string
}

interface ChatPanelProps {
  question: any
  packId: string
}

export default function ChatPanel({ question, packId }: ChatPanelProps) {
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
      const welcomeMessage: Message = {
        id: `welcome-${question.id}`,
        content: `Hi! I'm your PLEW buddy. I'm here to help you understand this ${question.type} question. Feel free to ask me anything about it, and I'll guide you through the thinking process!`,
        role: 'assistant',
        timestamp: new Date().toISOString()
      }
      setMessages([welcomeMessage])
    }
  }, [question])

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
      const response = await fetch('/api/chat', {
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
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: "Sorry, I'm having trouble responding right now. Please try again.",
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

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-gray-100 px-12 py-8">
        <h3 className="font-heading text-2xl text-gray-900 mb-2">PLEW Buddy</h3>
        <p className="font-body text-gray-500 text-sm">Your AI tutor is here to help</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-12 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] ${
                  message.role === 'user'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-50 text-gray-900'
                } px-6 py-5 rounded-3xl`}
              >
                <div className="font-body whitespace-pre-wrap leading-relaxed text-[15px]">
                  {message.content}
                </div>
                <div
                  className={`font-body text-xs mt-3 ${
                    message.role === 'user' ? 'text-gray-400' : 'text-gray-400'
                  }`}
                >
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-50 px-6 py-5 rounded-3xl">
                <div className="flex items-center space-x-1.5">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-gray-100 px-12 py-6">
        <div className="max-w-4xl mx-auto flex gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a question..."
            className="flex-1 px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl resize-none focus:outline-none focus:bg-white focus:border-gray-300 font-body text-[15px] placeholder:text-gray-400 transition-all duration-200"
            rows={1}
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="px-8 py-4 bg-gray-900 text-white rounded-2xl hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:opacity-30 disabled:cursor-not-allowed font-medium text-[15px] transition-all duration-200"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}