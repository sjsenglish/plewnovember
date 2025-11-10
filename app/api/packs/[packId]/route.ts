import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ packId: string }> }
) {
  try {
    const { packId } = await params

    if (!packId) {
      return NextResponse.json(
        { error: 'Pack ID is required' },
        { status: 400 }
      )
    }

    // Fetch pack from Supabase
    const supabase = await createClient()
    const { data: pack, error } = await supabase
      .from('packs')
      .select('*')
      .eq('id', packId)
      .single()

    if (error) {
      console.error('Error fetching pack:', error)
      return NextResponse.json(
        { error: 'Pack not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      id: pack.id,
      size: pack.size,
      questions: pack.questions,
      createdAt: pack.created_at
    })

  } catch (error) {
    console.error('Error in pack retrieval:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}