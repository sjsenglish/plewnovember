import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth-helpers'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    // Verify user is authenticated
    const user = await getAuthenticatedUser()
    if (!user || !user.email) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 }
      )
    }

    // Get Supabase client with user context
    const supabase = await createClient()

    // Fetch all completed packs for this user
    const { data: completedPacks, error } = await supabase
      .from('completed_packs')
      .select('pack_id')
      .eq('user_email', user.email)

    if (error) {
      console.error('Error fetching completed packs:', error)
      return NextResponse.json(
        { error: 'Failed to fetch completed packs', details: error },
        { status: 500 }
      )
    }

    // Extract pack IDs
    const packIds = completedPacks?.map(pack => pack.pack_id) || []

    return NextResponse.json({
      completedPacks: packIds
    })
  } catch (error) {
    console.error('Error in GET /api/completed-filter-packs:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
