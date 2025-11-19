import { algoliasearch } from 'algoliasearch'

// Initialize the client
// MAKE SURE these are set in your Vercel Environment Variables!
const appID = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || '';
const apiKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY || '';
// Use the environment variable, or fallback to 'csat_final' if you prefer
const indexName = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME || 'questions';

const client = algoliasearch(appID, apiKey);

export interface AlgoliaQuestion {
  objectID: string
  actualQuestion: string
  questionText: string
  answerOptions: string[]
  correctAnswer: string
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
    // 1. Perform the search request
    const response = await client.search({
      requests: [
        {
          indexName: indexName,
          query: query,
          hitsPerPage: limit,
          filters: filters || undefined,
        },
      ],
    });

    // 2. Extract hits
    if (response.results && response.results[0]) {
        // --- THE FIX IS HERE ---
        // We cast to 'any' because TypeScript thinks this might be a Facet response (which has no hits)
        const searchResult = response.results[0] as any;
        const hits = searchResult.hits;

        if (!hits) return [];

        // 3. Map to your interface safely
        return hits.map((hit: any) => ({
            objectID: hit.objectID,
            actualQuestion: hit.actualQuestion || 'No instruction provided',
            questionText: hit.questionText || hit.passage || '', // Handle variations
            answerOptions: hit.answerOptions || [],
            correctAnswer: hit.correctAnswer || '',
            explanation: hit.explanation || '',
            difficulty: hit.difficulty || 'medium',
            subject: hit.subject || 'General',
            topic: hit.topic || ''
        }));
    }

    return [];

  } catch (error) {
    console.error('Algolia Search Error:', error);
    // Fallback to empty array so the app doesn't crash hard
    return [];
  }
}

export async function getQuestionById(objectID: string): Promise<AlgoliaQuestion | null> {
  try {
    const response = await client.getObject({
        indexName: indexName,
        objectID: objectID,
        attributesToRetrieve: ['*']
    });
    return response as unknown as AlgoliaQuestion;
  } catch (error) {
    console.error('Error fetching object from Algolia:', error);
    return null;
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
