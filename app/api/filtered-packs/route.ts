import { NextRequest, NextResponse } from 'next/server'
import { algoliasearch } from 'algoliasearch'

const appID = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || ''
const apiKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY || ''
const indexName = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME || 'questions'

const client = algoliasearch(appID, apiKey)

interface Pack {
  id: string
  questions: any[]
  number: number
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Build Algolia filter string
    const filters: string[] = []
    const primarySubjectArea = searchParams.get('primarySubjectArea')
    const passageType = searchParams.get('passageType')
    const questionSkill = searchParams.get('questionSkill')
    const source = searchParams.get('source')

    if (primarySubjectArea) filters.push(`primarySubjectArea:"${primarySubjectArea}"`)
    if (passageType) filters.push(`passageType:"${passageType}"`)
    if (questionSkill) filters.push(`questionSkill:"${questionSkill}"`)
    if (source) filters.push(`source:"${source}"`)

    const filterString = filters.join(' AND ')

    // Fetch questions from Algolia
    const response = await client.search({
      requests: [
        {
          indexName: indexName,
          query: '',
          hitsPerPage: 1000, // Get all matching questions
          filters: filterString || undefined,
        },
      ],
    })

    if (!response.results || !response.results[0]) {
      return NextResponse.json({ packs: {} })
    }

    const searchResult = response.results[0] as any
    const hits = searchResult.hits || []

    if (hits.length === 0) {
      return NextResponse.json({ packs: {} })
    }

    // Organize questions into packs of 3
    const packs: Pack[] = []
    for (let i = 0; i < hits.length; i += 3) {
      const packQuestions = hits.slice(i, i + 3)
      if (packQuestions.length === 3) { // Only create packs with exactly 3 questions
        const packNumber = Math.floor(i / 3) + 1
        packs.push({
          id: `pack-${filterString}-${packNumber}`,
          questions: packQuestions,
          number: packNumber
        })
      }
    }

    // Group packs by category for display
    // Create a descriptive category name based on filters
    let categoryName = 'Filtered Packs'
    if (primarySubjectArea) categoryName = primarySubjectArea
    if (passageType) categoryName += ` - ${passageType}`
    if (questionSkill) categoryName += ` - ${questionSkill}`
    if (source) categoryName += ` - ${source}`

    const packsGrouped = {
      [categoryName]: packs
    }

    return NextResponse.json({ packs: packsGrouped })
  } catch (error) {
    console.error('Error fetching filtered packs:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
