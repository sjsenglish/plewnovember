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

// Mock data for now - replace with real Algolia integration once setup is complete
const mockQuestions: AlgoliaQuestion[] = [
  {
    objectID: '1',
    question: 'What is the capital of France?',
    type: 'multiple-choice',
    options: ['London', 'Berlin', 'Paris', 'Madrid'],
    correctAnswer: 'Paris',
    explanation: 'Paris is the capital and largest city of France.',
    difficulty: 'easy',
    subject: 'Geography'
  },
  {
    objectID: '2',
    question: 'Is the Earth round?',
    type: 'true-false',
    correctAnswer: 'True',
    explanation: 'The Earth is approximately spherical in shape.',
    difficulty: 'easy',
    subject: 'Science'
  },
  {
    objectID: '3',
    question: 'Explain the concept of photosynthesis.',
    type: 'essay',
    explanation: 'Photosynthesis is the process by which plants convert light energy into chemical energy.',
    difficulty: 'medium',
    subject: 'Biology'
  }
]

export async function searchQuestions(
  query: string = '',
  limit: number = 10,
  filters?: string
): Promise<AlgoliaQuestion[]> {
  // Return mock data for now
  return mockQuestions.slice(0, limit)
}

export async function getQuestionById(objectID: string): Promise<AlgoliaQuestion | null> {
  return mockQuestions.find(q => q.objectID === objectID) || null
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