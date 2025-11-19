import { NextRequest, NextResponse } from 'next/server'
import { upgradeUserToPremium } from '@/lib/user-tracking'

// POST: Upgrade user to premium (typically called after successful payment)
export async function POST(request: NextRequest) {
  try {
    const { userEmail } = await request.json()

    if (!userEmail) {
      return NextResponse.json(
        { error: 'userEmail is required' },
        { status: 400 }
      )
    }

    await upgradeUserToPremium(userEmail)

    return NextResponse.json({
      success: true,
      message: 'User upgraded to premium successfully',
    })
  } catch (error) {
    console.error('Error in POST /api/upgrade-to-premium:', error)
    return NextResponse.json(
      { error: 'Failed to upgrade user' },
      { status: 500 }
    )
  }
}
