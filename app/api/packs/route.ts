import { NextRequest, NextResponse } from 'next/server'
import { searchQuestions } from '@/lib/algolia'

export async function POST(request: NextRequest) {
  try {
    const { size } = await request.json()

    if (!size || size < 1 || size > 100) {
      return NextResponse.json(
        { error: 'Invalid pack size. Must be between 1 and 100.' },
        { status: 400 }
      )
    }

    // Search for questions using Algolia (returns mock data)
    const questions = await searchQuestions('', size)

    if (questions.length === 0) {
      return NextResponse.json(
        { error: 'No questions found' },
        { status: 404 }
      )
    }

    // Generate a simple pack ID (timestamp-based)
    const packId = `pack-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    // Return pack data (client will handle storage)
    return NextResponse.json({
      packId: packId,
      size: questions.length,
      questions: questions,
      createdAt: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error in pack creation:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
