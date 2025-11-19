import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth-helpers'
import { createClient } from '@/lib/supabase/server'

// GET: Fetch a specific completed pack with answers
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ packId: string }> }
) {
  try {
    // Verify user is authenticated
    const user = await getAuthenticatedUser()
    if (!user || !user.email) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 }
      )
    }

    const { packId: completedPackId } = await params

    // Validate packId is a valid UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(completedPackId)) {
      return NextResponse.json(
        { error: 'Invalid pack ID format' },
        { status: 400 }
      )
    }

    // Get Supabase client with user context
    const supabase = await createClient()

    // Fetch completed pack details
    const { data: pack, error: packError } = await supabase
      .from('completed_packs')
      .select('*')
      .eq('id', completedPackId)
      .single()

    if (packError || !pack) {
      return NextResponse.json(
        { error: 'Completed pack not found' },
        { status: 404 }
      )
    }

    // Verify user owns this completed pack
    if (pack.user_email !== user.email) {
      return NextResponse.json(
        { error: 'Forbidden - You can only access your own completed packs' },
        { status: 403 }
      )
    }

    // Fetch user answers for this pack
    const { data: answers, error: answersError } = await supabase
      .from('user_answers')
      .select('*')
      .eq('completed_pack_id', completedPackId)
      .order('answered_at', { ascending: true })

    if (answersError) {
      console.error('Error fetching answers:', answersError)
    }

    return NextResponse.json({
      pack: {
        id: pack.id,
        packId: pack.pack_id,
        userEmail: pack.user_email,
        packSize: pack.pack_size,
        level: pack.level,
        score: pack.score,
        totalQuestions: pack.total_questions,
        scorePercentage: Math.round((pack.score / pack.total_questions) * 100),
        timeTakenSeconds: pack.time_taken_seconds,
        startedAt: pack.started_at,
        completedAt: pack.completed_at
      },
      answers: answers || []
    })
  } catch (error) {
    console.error('Error in GET /api/completed-packs/[packId]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
