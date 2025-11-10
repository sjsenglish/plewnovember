import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { searchQuestions } from '@/lib/algolia'

export async function POST(request: NextRequest) {
  try {
    const { size } = await request.json()

    if (!size || size < 1 || size > 100) {
      return NextResponse.json(
        { error: 'Invalid pack size. Must be between 1 and 100.' },
        { status: 400 }
      )
    }

    // Search for questions using Algolia
    const questions = await searchQuestions('', size)

    if (questions.length === 0) {
      return NextResponse.json(
        { error: 'No questions found' },
        { status: 404 }
      )
    }

    // Create pack in Supabase
    const supabase = createClient()
    const { data: pack, error } = await supabase
      .from('packs')
      .insert([
        {
          size: questions.length,
          questions: questions,
          created_at: new Date().toISOString(),
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('Error creating pack:', error)
      return NextResponse.json(
        { error: 'Failed to create pack' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      packId: pack.id,
      size: pack.size,
      questions: pack.questions
    })

  } catch (error) {
    console.error('Error in pack creation:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}