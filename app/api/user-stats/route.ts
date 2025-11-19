import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser, verifyUserOwnership } from '@/lib/auth-helpers'
import { createClient } from '@/lib/supabase/server'
import { emailSchema } from '@/lib/validation-schemas'

// GET: Fetch aggregate statistics for a user
export async function GET(request: NextRequest) {
  try {
    // Verify user is authenticated (middleware handles this, but double-check)
    const user = await getAuthenticatedUser()
    if (!user || !user.email) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const userEmail = searchParams.get('userEmail')

    if (!userEmail) {
      return NextResponse.json(
        { error: 'userEmail is required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailValidation = emailSchema.safeParse(userEmail)
    if (!emailValidation.success) {
      return NextResponse.json(
        { error: 'Invalid email format', details: emailValidation.error.issues },
        { status: 400 }
      )
    }

    // Verify user can only access their own stats
    if (user.email !== emailValidation.data) {
      return NextResponse.json(
        { error: 'Forbidden - You can only access your own statistics' },
        { status: 403 }
      )
    }

    // Get Supabase client with user context (respects RLS)
    const supabase = await createClient()

    // Fetch user stats using the database function
    const { data: stats, error } = await supabase
      .rpc('get_user_stats', {
        p_user_email: emailValidation.data
      })

    if (error) {
      console.error('Error fetching user stats:', error)
      return NextResponse.json(
        { error: 'Failed to fetch user stats' },
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
