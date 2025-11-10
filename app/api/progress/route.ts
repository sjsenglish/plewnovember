import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { packId, questionObjectId, selectedAnswer, isCorrect } = await request.json()

    if (!packId || !questionObjectId || !selectedAnswer || isCorrect === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Upsert into question_progress table
    const { error: progressError } = await supabase
      .from('question_progress')
      .upsert({
        pack_id: packId,
        question_object_id: questionObjectId,
        selected_answer: selectedAnswer,
        is_correct: isCorrect,
        answered_at: new Date().toISOString()
      }, {
        onConflict: 'pack_id,question_object_id'
      })

    if (progressError) {
      console.error('Error saving progress:', progressError)
      return NextResponse.json(
        { error: 'Failed to save progress' },
        { status: 500 }
      )
    }

    // Get current pack to increment question index
    const { data: pack, error: fetchError } = await supabase
      .from('packs')
      .select('current_question_index, size')
      .eq('id', packId)
      .single()

    if (fetchError) {
      console.error('Error fetching pack:', fetchError)
      return NextResponse.json(
        { error: 'Failed to fetch pack' },
        { status: 500 }
      )
    }

    // Update current_question_index (increment by 1 if not at the end)
    const newIndex = Math.min((pack.current_question_index || 0) + 1, pack.size - 1)
    const { error: updateError } = await supabase
      .from('packs')
      .update({ current_question_index: newIndex })
      .eq('id', packId)

    if (updateError) {
      console.error('Error updating pack index:', updateError)
      return NextResponse.json(
        { error: 'Failed to update pack' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      newIndex,
      isCorrect
    })

  } catch (error) {
    console.error('Error in progress tracking:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
