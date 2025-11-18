import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

// GET: Fetch a specific completed pack with answers
export async function GET(
  request: NextRequest,
  { params }: { params: { packId: string } }
) {
  try {
    const completedPackId = params.packId

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
