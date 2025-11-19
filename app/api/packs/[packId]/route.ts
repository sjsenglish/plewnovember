import { NextRequest, NextResponse } from 'next/server'
import { getSharedPack, isSharedPack } from '@/lib/shared-packs'

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

    // Check if this is a shared pack
    if (await isSharedPack(packId)) {
      const sharedPack = await getSharedPack(packId)
      if (sharedPack) {
        console.log('[DEBUG] Returning shared pack:', packId)
        return NextResponse.json(sharedPack)
      }
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
