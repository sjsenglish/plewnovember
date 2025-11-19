import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { incrementQuestionsCompleted } from '@/lib/user-tracking'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

interface UserAnswer {
  questionObjectId: string
  questionText: string
  selectedAnswer: string
  correctAnswer: string
  isCorrect: boolean
  answeredAt: string
}

interface SaveCompletedPackRequest {
  userEmail: string
  packId: string
  packSize: number
  level?: number
  score: number
  totalQuestions: number
  timeTakenSeconds: number
  startedAt: string
  answers: UserAnswer[]
  isDemo?: boolean
}

// POST: Save a completed pack
export async function POST(request: NextRequest) {
  try {
    const body: SaveCompletedPackRequest = await request.json()

    const {
      userEmail,
      packId,
      packSize,
      level = 1,
      score,
      totalQuestions,
      timeTakenSeconds,
      startedAt,
      answers,
      isDemo = false
    } = body

    // Validate required fields
    if (!userEmail || !packId || score === undefined || !totalQuestions || !timeTakenSeconds || !answers) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Insert completed pack
    const { data: completedPack, error: packError } = await supabase
      .from('completed_packs')
      .insert({
        user_email: userEmail,
        pack_id: packId,
        pack_size: packSize,
        level,
        score,
        total_questions: totalQuestions,
        time_taken_seconds: timeTakenSeconds,
        started_at: startedAt,
        completed_at: new Date().toISOString()
      })
      .select()
      .single()

    if (packError) {
      console.error('Error saving completed pack:', packError)
      return NextResponse.json(
        { error: 'Failed to save completed pack', details: packError },
        { status: 500 }
      )
    }

    // Insert user answers
    const answersToInsert = answers.map(answer => ({
      completed_pack_id: completedPack.id,
      question_object_id: answer.questionObjectId,
      question_text: answer.questionText,
      selected_answer: answer.selectedAnswer,
      correct_answer: answer.correctAnswer,
      is_correct: answer.isCorrect,
      answered_at: answer.answeredAt
    }))

    const { error: answersError } = await supabase
      .from('user_answers')
      .insert(answersToInsert)

    if (answersError) {
      console.error('Error saving user answers:', answersError)
      // Don't fail the whole request if answers fail, but log it
    }

    // Insert used questions to avoid repetition
    const usedQuestionsToInsert = answers.map(answer => ({
      user_email: userEmail,
      question_object_id: answer.questionObjectId,
      level,
      used_at: answer.answeredAt
    }))

    const { error: usedQuestionsError } = await supabase
      .from('used_questions')
      .insert(usedQuestionsToInsert)
      .select()

    // Ignore unique constraint violations (questions already marked as used)
    if (usedQuestionsError && !usedQuestionsError.message.includes('duplicate')) {
      console.error('Error saving used questions:', usedQuestionsError)
    }

    // Increment questions completed count (but not for demo)
    if (!isDemo) {
      try {
        await incrementQuestionsCompleted(userEmail, totalQuestions)
      } catch (error) {
        console.error('Error incrementing questions completed:', error)
        // Don't fail the whole request if this fails
      }
    }

    return NextResponse.json({
      success: true,
      completedPackId: completedPack.id,
      message: 'Pack completed successfully'
    })
  } catch (error) {
    console.error('Error in POST /api/completed-packs:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET: Fetch completed packs for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userEmail = searchParams.get('userEmail')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    if (!userEmail) {
      return NextResponse.json(
        { error: 'userEmail is required' },
        { status: 400 }
      )
    }

    // Fetch completed packs with answer counts
    const { data: completedPacks, error } = await supabase
      .rpc('get_completed_packs_summary', {
        p_user_email: userEmail,
        p_limit: limit,
        p_offset: offset
      })

    if (error) {
      console.error('Error fetching completed packs:', error)
      return NextResponse.json(
        { error: 'Failed to fetch completed packs', details: error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      completedPacks: completedPacks || [],
      count: completedPacks?.length || 0
    })
  } catch (error) {
    console.error('Error in GET /api/completed-packs:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
