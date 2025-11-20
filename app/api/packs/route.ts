import { NextRequest, NextResponse } from 'next/server'
import { searchQuestions, getQuestionById } from '@/lib/algolia'
import { checkUserAccess } from '@/lib/user-tracking'
import { packCreationSchema } from '@/lib/validation-schemas'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Extract additional fields that might not be in the schema
    const { questionId, questions: predefinedQuestions, packId: customPackId } = body

    // Validate input
    const result = packCreationSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: result.error.issues },
        { status: 400 }
      )
    }

    const { size, userEmail, level, isDemo } = result.data

    // Check user access limits (skip for demo)
    if (userEmail && !isDemo) {
      const accessCheck = await checkUserAccess(userEmail)

      if (!accessCheck.canAccess) {
        return NextResponse.json(
          {
            error: 'Access limit reached',
            message: accessCheck.reason || 'You have reached the free tier limit. Upgrade to premium for unlimited access.',
            tier: accessCheck.tier,
            questionsCompleted: accessCheck.questionsCompleted,
            requiresUpgrade: true,
          },
          { status: 403 }
        )
      }
    }

    let questions: any[] = []

    // If predefined questions are provided, use them
    if (predefinedQuestions && Array.isArray(predefinedQuestions) && predefinedQuestions.length > 0) {
      questions = predefinedQuestions
    }
    // If a specific question ID is provided, fetch that question
    else if (questionId) {
      const question = await getQuestionById(questionId)
      if (question) {
        questions = [question]
      } else {
        return NextResponse.json(
          { error: 'Question not found' },
          { status: 404 }
        )
      }
    }
    // Otherwise, fetch questions using the normal flow
    else {
      // Fetch used questions for this user and level if userEmail is provided
      let usedQuestionIds: string[] = []
      if (userEmail) {
        try {
          const usedQuestionsResponse = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/used-questions?userEmail=${encodeURIComponent(userEmail)}&level=${level}`
          )
          if (usedQuestionsResponse.ok) {
            const data = await usedQuestionsResponse.json()
            usedQuestionIds = data.usedQuestionIds || []
          }
        } catch (error) {
          console.error('Error fetching used questions:', error)
          // Continue without filtering if this fails
        }
      }

      // Search for questions using Algolia
      // Request more questions than needed to account for filtering
      const requestSize = usedQuestionIds.length > 0 ? size * 2 : size
      const allQuestions = await searchQuestions('', requestSize)

      // Filter out used questions
      const availableQuestions = usedQuestionIds.length > 0
        ? allQuestions.filter(q => !usedQuestionIds.includes(q.objectID))
        : allQuestions

      // Take only the requested number of questions
      questions = availableQuestions.slice(0, size)
    }

    if (questions.length === 0) {
      return NextResponse.json(
        { error: 'No questions found' },
        { status: 404 }
      )
    }

    if (questions.length < size) {
      console.warn(`Only found ${questions.length} unused questions, requested ${size}`)
    }

    // Use custom pack ID if provided, otherwise generate a timestamp-based one
    const packId = customPackId || `pack-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    // Return pack data (client will handle storage)
    return NextResponse.json({
      packId: packId,
      size: questions.length,
      questions: questions,
      level,
      createdAt: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error in pack creation:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
