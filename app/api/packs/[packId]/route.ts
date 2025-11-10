import { NextRequest, NextResponse } from 'next/server'

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

    // Return instructions for client-side pack retrieval
    // The client should use localStorage to get the pack data
    return NextResponse.json({
      packId,
      message: 'Pack data should be retrieved from client storage'
    })

  } catch (error) {
    console.error('Error in pack retrieval:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
