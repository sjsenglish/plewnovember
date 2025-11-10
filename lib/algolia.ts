import { algoliasearch } from 'algoliasearch'

const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY!
)

const index = client.initIndex(process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME!)

export interface AlgoliaQuestion {
  objectID: string
  question: string
  type: 'multiple-choice' | 'true-false' | 'essay'
  options?: string[]
  correctAnswer?: string
  explanation?: string
  difficulty?: 'easy' | 'medium' | 'hard'
  subject?: string
  topic?: string
}

export async function searchQuestions(
  query: string = '',
  limit: number = 10,
  filters?: string
): Promise<AlgoliaQuestion[]> {
  try {
    const searchParams = {
      query,
      hitsPerPage: limit,
      ...(filters && { filters })
    }

    const { hits } = await index.search<AlgoliaQuestion>(query, searchParams)
    
    return hits.map(hit => ({
      objectID: hit.objectID,
      question: hit.question,
      type: hit.type,
      options: hit.options,
      correctAnswer: hit.correctAnswer,
      explanation: hit.explanation,
      difficulty: hit.difficulty,
      subject: hit.subject,
      topic: hit.topic
    }))
  } catch (error) {
    console.error('Error searching questions:', error)
    return []
  }
}

export async function getQuestionById(objectID: string): Promise<AlgoliaQuestion | null> {
  try {
    const question = await index.getObject<AlgoliaQuestion>(objectID)
    return question
  } catch (error) {
    console.error('Error getting question by ID:', error)
    return null
  }
}

export async function searchQuestionsBySubject(
  subject: string,
  limit: number = 10
): Promise<AlgoliaQuestion[]> {
  return searchQuestions('', limit, `subject:"${subject}"`)
}

export async function searchQuestionsByDifficulty(
  difficulty: 'easy' | 'medium' | 'hard',
  limit: number = 10
): Promise<AlgoliaQuestion[]> {
  return searchQuestions('', limit, `difficulty:"${difficulty}"`)
}