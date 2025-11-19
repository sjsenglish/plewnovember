import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth-helpers'
import { z } from 'zod'

const progressSchema = z.object({
  packId: z.string().min(1).max(255),
  questionObjectId: z.string().min(1).max(255),
  selectedAnswer: z.string().max(1000),
  isCorrect: z.boolean(),
})

export async function POST(request: NextRequest) {
  try {
    // Verify user is authenticated
    const user = await getAuthenticatedUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Validate input
    const result = progressSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: result.error.issues },
        { status: 400 }
      )
    }

    const { packId, questionObjectId, selectedAnswer, isCorrect } = result.data

    // For now, just return success
    // Client will handle progress tracking in localStorage
    return NextResponse.json({
      success: true,
      isCorrect,
      message: 'Progress tracked client-side'
    })

  } catch (error) {
    console.error('Error in progress tracking:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
