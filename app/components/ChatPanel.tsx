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
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-custom-white">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-4 rounded-xl shadow-container ${
                message.role === 'user'
                  ? 'bg-white/60 text-gray-900 rounded-br-sm'
                  : 'bg-white/60 text-gray-900 rounded-bl-sm'
              }`}
            >
              <div className="font-body whitespace-pre-wrap tracking-custom">{message.content}</div>
              <div className="font-body text-xs mt-2 tracking-custom text-gray-500">
                {new Date(message.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/60 text-gray-900 p-4 rounded-xl rounded-bl-sm shadow-container">
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

      {/* Input */}
      <div className="border-t-2 border-custom-purple/20 p-6 bg-white">
        <div className="flex space-x-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask your PLEW buddy for help..."
            className="flex-1 p-4 border-2 border-custom-purple/30 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-body tracking-custom shadow-container"
            rows={3}
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed font-heading tracking-custom shadow-container-lg"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}