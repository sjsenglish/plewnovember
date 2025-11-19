import { NextRequest, NextResponse } from 'next/server'
import { incrementQuestionsCompleted } from '@/lib/user-tracking'
import { getAuthenticatedUser } from '@/lib/auth-helpers'
import { createClient } from '@/lib/supabase/server'
import { completedPackSchema, emailSchema } from '@/lib/validation-schemas'
import { z } from 'zod'

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
    // Verify user is authenticated
    const user = await getAuthenticatedUser()
    if (!user || !user.email) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 }
      )
    }

    const body: SaveCompletedPackRequest = await request.json()

    // Validate input with expanded schema
    const validationSchema = z.object({
      userEmail: emailSchema,
      packId: z.string().min(1).max(255),
      packSize: z.number().int().min(1).max(100),
      level: z.number().int().min(1).max(5).optional().default(1),
      score: z.number().min(0).max(100),
      totalQuestions: z.number().int().min(1).max(100),
      timeTakenSeconds: z.number().min(0),
      startedAt: z.string().datetime(),
      answers: z.array(z.object({
        questionObjectId: z.string(),
        questionText: z.string().max(10000),
        selectedAnswer: z.string().max(1000),
        correctAnswer: z.string().max(1000),
        isCorrect: z.boolean(),
        answeredAt: z.string().datetime()
      }))
    })

    const result = validationSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: result.error.issues },
        { status: 400 }
      )
    }

    const {
      userEmail,
      packId,
      packSize,
      level,
      score,
      totalQuestions,
      timeTakenSeconds,
      startedAt,
      answers,
      isDemo = false
    } = body

    // Verify user can only save their own pack completions
    if (user.email !== userEmail) {
      console.error('Email mismatch in POST completed-packs:', {
        authenticatedEmail: user.email,
        requestedEmail: userEmail,
        match: user.email === userEmail
      })
      return NextResponse.json(
        { error: 'Forbidden - You can only save your own pack completions' },
        { status: 403 }
      )
    }

    // Get Supabase client with user context
    const supabase = await createClient()

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
    // Verify user is authenticated
    const user = await getAuthenticatedUser()
    if (!user || !user.email) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const userEmail = searchParams.get('userEmail')
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100) // Cap at 100
    const offset = Math.max(parseInt(searchParams.get('offset') || '0'), 0)

    if (!userEmail) {
      return NextResponse.json(
        { error: 'userEmail is required' },
        { status: 400 }
      )
    }

    // Validate email
    const emailValidation = emailSchema.safeParse(userEmail)
    if (!emailValidation.success) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Verify user can only access their own completed packs
    if (user.email !== emailValidation.data) {
      console.error('Email mismatch in completed-packs:', {
        authenticatedEmail: user.email,
        requestedEmail: emailValidation.data,
        match: user.email === emailValidation.data
      })
      return NextResponse.json(
        { error: 'Forbidden - You can only access your own completed packs' },
        { status: 403 }
      )
    }

    // Get Supabase client with user context
    const supabase = await createClient()

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
