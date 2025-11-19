import { NextRequest, NextResponse } from 'next/server'
import { searchQuestions } from '@/lib/algolia'
import { checkUserAccess } from '@/lib/user-tracking'

export async function POST(request: NextRequest) {
  try {
    const { size, userEmail, level = 1, isDemo = false } = await request.json()

    if (!size || size < 1 || size > 100) {
      return NextResponse.json(
        { error: 'Invalid pack size. Must be between 1 and 100.' },
        { status: 400 }
      )
    }

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

    // Search for questions using Algolia (returns mock data)
    // Request more questions than needed to account for filtering
    const requestSize = usedQuestionIds.length > 0 ? size * 2 : size
    const allQuestions = await searchQuestions('', requestSize)

    // Filter out used questions
    const availableQuestions = usedQuestionIds.length > 0
      ? allQuestions.filter(q => !usedQuestionIds.includes(q.objectID))
      : allQuestions

    // Take only the requested number of questions
    const questions = availableQuestions.slice(0, size)

    if (questions.length === 0) {
      return NextResponse.json(
        { error: 'No questions found' },
        { status: 404 }
      )
    }

    if (questions.length < size) {
      console.warn(`Only found ${questions.length} unused questions, requested ${size}`)
    }

    // Generate a simple pack ID (timestamp-based)
    const packId = `pack-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

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
