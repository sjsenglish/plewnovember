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
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-custom-purple via-custom-pink to-custom-cyan text-gray-900 p-6 shadow-container">
        <h3 className="font-heading text-xl tracking-custom">PLEW Buddy</h3>
        <p className="font-body text-gray-700 text-sm tracking-custom">Your AI tutor is here to help!</p>
      </div>

      {/* Messages Container with larger rounded edges */}
      <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-white rounded-2xl">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[80%] p-5 rounded-2xl ${
                message.role === 'user'
                  ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white'
                  : 'bg-[#F3F3FF] text-gray-900 border-2 border-[#4248DB]'
              }`}
            >
              <div className="font-body whitespace-pre-wrap tracking-custom">{message.content}</div>
            </div>
            {/* Timestamp outside bubble, HH:MM only */}
            <div
              className={`font-body text-xs mt-1 tracking-custom ${
                message.role === 'user' ? 'text-gray-600 mr-2' : 'text-gray-500 ml-2'
              }`}
            >
              {new Date(message.timestamp).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
              })}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex flex-col items-start">
            <div className="bg-[#F3F3FF] text-gray-900 p-5 rounded-2xl border-2 border-[#4248DB]">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Section */}
      <div className="border-t-2 border-gray-200 p-6 bg-white">
        <div className="space-y-3">
          {/* Chat Input - 4 rows, fully rounded */}
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask your PLEW buddy for help..."
            className="w-full p-4 border-2 border-gray-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-[#4248DB] focus:border-[#4248DB] font-body tracking-custom shadow-sm"
            rows={4}
            disabled={isLoading}
          />
          {/* Send Button - Separated, black background, white text, full width */}
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="w-full py-4 bg-black text-white rounded-2xl hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed font-heading tracking-custom shadow-lg transition-all"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}