import { NextRequest, NextResponse } from 'next/server'
import { algoliasearch } from 'algoliasearch'

const appID = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || ''
const apiKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY || ''
const indexName = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME || 'questions'

const client = algoliasearch(appID, apiKey)

export async function GET(request: NextRequest) {
  try {
    // Fetch all questions to extract unique filter values
    // In production, you might want to use Algolia's faceting feature instead
    const response = await client.search({
      requests: [
        {
          indexName: indexName,
          query: '',
          hitsPerPage: 1000, // Adjust based on your dataset size
          attributesToRetrieve: ['primarySubjectArea', 'passageType', 'questionSkill', 'source']
        },
      ],
    })

    if (!response.results || !response.results[0]) {
      return NextResponse.json({ options: {
        primarySubjectArea: [],
        passageType: [],
        questionSkill: [],
        source: []
      }})
    }

    const searchResult = response.results[0] as any
    const hits = searchResult.hits || []

    // Extract unique values for each filter
    const primarySubjectAreaSet = new Set<string>()
    const passageTypeSet = new Set<string>()
    const questionSkillSet = new Set<string>()
    const sourceSet = new Set<string>()

    hits.forEach((hit: any) => {
      if (hit.primarySubjectArea) primarySubjectAreaSet.add(hit.primarySubjectArea)
      if (hit.passageType) passageTypeSet.add(hit.passageType)
      if (hit.questionSkill) questionSkillSet.add(hit.questionSkill)
      if (hit.source) sourceSet.add(hit.source)
    })

    return NextResponse.json({
      options: {
        primarySubjectArea: Array.from(primarySubjectAreaSet).sort(),
        passageType: Array.from(passageTypeSet).sort(),
        questionSkill: Array.from(questionSkillSet).sort(),
        source: Array.from(sourceSet).sort()
      }
    })
  } catch (error) {
    console.error('Error fetching filter options:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
