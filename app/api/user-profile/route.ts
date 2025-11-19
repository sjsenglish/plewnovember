import { NextRequest, NextResponse } from 'next/server'
import { getUserProfile, checkUserAccess, getUserProfileWithAccess } from '@/lib/user-tracking'

// GET: Fetch user profile and access status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userEmail = searchParams.get('userEmail')

    if (!userEmail) {
      return NextResponse.json(
        { error: 'userEmail is required' },
        { status: 400 }
      )
    }

    // Get profile and access check
    const { profile, access } = await getUserProfileWithAccess(userEmail)

    return NextResponse.json({
      profile,
      access,
    })
  } catch (error) {
    console.error('Error in GET /api/user-profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
