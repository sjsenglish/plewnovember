import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

// GET: Fetch aggregate statistics for a user
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

    // Fetch user stats using the database function
    const { data: stats, error } = await supabase
      .rpc('get_user_stats', {
        p_user_email: userEmail
      })

    if (error) {
      console.error('Error fetching user stats:', error)
      return NextResponse.json(
        { error: 'Failed to fetch user stats', details: error },
        { status: 500 }
      )
    }

    const userStats = stats?.[0] || {
      total_packs_completed: 0,
      total_questions_answered: 0,
      total_correct_answers: 0,
      average_score: 0,
      total_time_spent_seconds: 0,
      best_score: 0,
      recent_activity: null
    }

    return NextResponse.json({
      totalPacksCompleted: parseInt(userStats.total_packs_completed) || 0,
      totalQuestionsAnswered: parseInt(userStats.total_questions_answered) || 0,
      totalCorrectAnswers: parseInt(userStats.total_correct_answers) || 0,
      averageScore: parseFloat(userStats.average_score) || 0,
      totalTimeSpentSeconds: parseInt(userStats.total_time_spent_seconds) || 0,
      bestScore: userStats.best_score || 0,
      recentActivity: userStats.recent_activity
    })
  } catch (error) {
    console.error('Error in GET /api/user-stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
