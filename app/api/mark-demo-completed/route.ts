import { NextRequest, NextResponse } from 'next/server'
import { markDemoCompleted } from '@/lib/user-tracking'

// POST: Mark demo as completed for a user
export async function POST(request: NextRequest) {
  try {
    const { userEmail } = await request.json()

    if (!userEmail) {
      return NextResponse.json(
        { error: 'userEmail is required' },
        { status: 400 }
      )
    }

    await markDemoCompleted(userEmail)

    return NextResponse.json({
      success: true,
      message: 'Demo marked as completed',
    })
  } catch (error) {
    console.error('Error in POST /api/mark-demo-completed:', error)
    return NextResponse.json(
      { error: 'Failed to mark demo as completed' },
      { status: 500 }
    )
  }
}
