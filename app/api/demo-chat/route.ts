import { NextRequest, NextResponse } from 'next/server'
import { anthropic } from '@/lib/anthropic'
import { demoSystemPrompt } from '@/lib/demo-prompt'

export async function POST(request: NextRequest) {
  try {
    const { message, question, chatHistory = [] } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Check if Anthropic API key is configured
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        {
          response: "⚠️ Chat is not configured yet. Please add your ANTHROPIC_API_KEY to Vercel environment variables.\n\nFor now, practice answering the questions on your own! The chat will work once the API key is added.",
          timestamp: new Date().toISOString()
        }
      )
    }

    // Build conversation context with demo prompt
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

    // Call Anthropic Claude API with demo system prompt
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      system: demoSystemPrompt,
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
    console.error('Error in demo chat:', error)
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    )
  }
}
