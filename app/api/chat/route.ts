import { NextRequest, NextResponse } from 'next/server'
import { anthropic } from '@/lib/anthropic'
import { plewPrompt } from '@/lib/plew-prompt'

export async function POST(request: NextRequest) {
  try {
    const { message, question, chatHistory = [] } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Build conversation context
    const systemPrompt = plewPrompt(question)
    
    const messages = [
      {
        role: 'user' as const,
        content: message
      }
    ]

    // Add chat history if available
    if (chatHistory.length > 0) {
      // Insert previous messages before the current one
      messages.unshift(...chatHistory)
    }

    // Call Anthropic Claude API with latest model
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      system: systemPrompt,
      messages: messages
    })

    const assistantMessage = response.content[0]
    
    if (assistantMessage.type !== 'text') {
      throw new Error('Unexpected response type from Claude')
    }

    return NextResponse.json({
      response: assistantMessage.text,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error in chat:', error)
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    )
  }
}