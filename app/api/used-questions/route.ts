import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userEmail = searchParams.get('userEmail')
    const level = parseInt(searchParams.get('level') || '1')

    if (!userEmail) {
      return NextResponse.json(
        { error: 'userEmail parameter is required' },
        { status: 400 }
      )
    }

    // Get Supabase client
    const supabase = await createClient()

    // Fetch used questions for this user and level
    const { data, error } = await supabase
      .from('used_questions')
      .select('question_object_id')
      .eq('user_email', userEmail)
      .eq('level', level)

    if (error) {
      console.error('Error fetching used questions:', error)
      return NextResponse.json(
        { usedQuestionIds: [] }
      )
    }

    // Extract question IDs
    const usedQuestionIds = (data || []).map(q => q.question_object_id)

    return NextResponse.json({
      usedQuestionIds
    })
  } catch (error) {
    console.error('Error in GET /api/used-questions:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
