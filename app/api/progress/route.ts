import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { packId, questionObjectId, selectedAnswer, isCorrect } = await request.json()

    if (!packId || !questionObjectId || !selectedAnswer || isCorrect === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

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
