import { NextRequest, NextResponse } from 'next/server'
import { anthropic } from '@/lib/anthropic'
import { plewPrompt } from '@/lib/plew-prompt'
import { isUsageLimitExceeded, trackUsage, calculateCost, getUsageSummary } from '@/lib/usage-tracking'

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

    // Check if usage limit has been exceeded
    const limitExceeded = await isUsageLimitExceeded()
    if (limitExceeded) {
      const summary = await getUsageSummary()
      return NextResponse.json(
        {
          response: `⚠️ Usage limit reached!\n\nThe site has reached its $10 API usage limit.\n\nTotal spent: $${summary?.totalCost.toFixed(2) || '10.00'}\nTotal requests: ${summary?.totalRequests || 'N/A'}\n\nPlease contact the administrator to increase the limit.`,
          timestamp: new Date().toISOString(),
          limitExceeded: true
        },
        { status: 429 }
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

    // Track usage
    const model = 'claude-sonnet-4-20250514'
    const inputTokens = response.usage.input_tokens
    const outputTokens = response.usage.output_tokens
    const cost = calculateCost(model, inputTokens, outputTokens)

    await trackUsage({
      model,
      input_tokens: inputTokens,
      output_tokens: outputTokens,
      cost_usd: cost,
      endpoint: '/api/chat',
    })

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