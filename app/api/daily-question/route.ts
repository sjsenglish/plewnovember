import { NextRequest, NextResponse } from 'next/server'
import { searchQuestions } from '@/lib/algolia'

export async function GET(request: NextRequest) {
  try {
    // Get today's date as a seed for deterministic question selection
    const today = new Date()
    const dateString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

    // Use date as seed to generate a deterministic index
    const seed = dateString.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)

    // Fetch a pool of questions
    const questions = await searchQuestions('', 100)

    if (questions.length === 0) {
      return NextResponse.json(
        { error: 'No questions available' },
        { status: 404 }
      )
    }

    // Select a question deterministically based on the date
    const questionIndex = seed % questions.length
    const dailyQuestion = questions[questionIndex]

    return NextResponse.json({
      questionId: dailyQuestion.objectID,
      date: dateString
    })
  } catch (error) {
    console.error('Error fetching daily question:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
