// Algolia configuration and client setup
// Note: Uncomment the algoliasearch import when ready to use actual Algolia
// import algoliasearch from 'algoliasearch/lite'

// Environment variable validation
const ALGOLIA_APP_ID = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID
const ALGOLIA_SEARCH_KEY = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY
const ALGOLIA_INDEX_NAME = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME

// Validate that all required Algolia environment variables are set
if (typeof window !== 'undefined') {
  // Only validate on client-side to avoid build-time errors when Algolia is not yet configured
  if (!ALGOLIA_INDEX_NAME) {
    console.warn('NEXT_PUBLIC_ALGOLIA_INDEX_NAME is not set. Expected value: "csat_final"')
  }
  if (!ALGOLIA_APP_ID) {
    console.warn('NEXT_PUBLIC_ALGOLIA_APP_ID is not set. Algolia search will use mock data.')
  }
  if (!ALGOLIA_SEARCH_KEY) {
    console.warn('NEXT_PUBLIC_ALGOLIA_SEARCH_KEY is not set. Algolia search will use mock data.')
  }
}

// Initialize Algolia client (uncomment when ready to use)
// const searchClient = algoliasearch(ALGOLIA_APP_ID!, ALGOLIA_SEARCH_KEY!)
// const index = searchClient.initIndex(ALGOLIA_INDEX_NAME || 'csat_final')

// PLEW Question Interface
export interface AlgoliaQuestion {
  objectID: string
  actualQuestion: string // Korean instruction
  questionText: string // English passage
  answerOptions: string[] // Array of answer choices
  correctAnswer: string
  explanation?: string
  difficulty?: 'easy' | 'medium' | 'hard'
  subject?: string
  topic?: string
}

// Mock PLEW-style questions for CSAT English practice
const mockQuestions: AlgoliaQuestion[] = [
  {
    objectID: '1',
    actualQuestion: '다음 글의 주제로 가장 적절한 것은?',
    questionText: `Urban delivery vehicles can be adapted to better suit the density of urban distribution, which often involves smaller vehicles such as vans, including bicycles. The latter have the potential to become a preferred 'last-mile' vehicle, particularly in high-density and congested areas. In locations where bicycle use is high, such as the Netherlands, delivery bicycles are also used to carry personal cargo (e.g. groceries). Due to their low acquisition and maintenance costs, cargo bicycles convey much potential in developed and developing countries alike, such as the becak (a three-wheeled bicycle) in Indonesia. Services using electrically assisted delivery tricycles have been successfully implemented in France and are gradually being adopted across Europe for services as varied as parcel and catering deliveries. Using bicycles as cargo vehicles is particularly encouraged when combined with policies that restrict motor vehicle access to specific areas of a city, such as downtown or commercial districts, or with the extension of dedicated bike lanes.`,
    answerOptions: [
      'benefits of using bicycle delivery in urban areas',
      'history of transportation methods in cities',
      'environmental impact of motor vehicles',
      'economic growth through urban development',
      'challenges of implementing bike lanes'
    ],
    correctAnswer: 'benefits of using bicycle delivery in urban areas',
    explanation: 'The passage discusses the advantages of using bicycles for delivery in urban settings, including their suitability for dense areas, low costs, and successful implementation in various countries.',
    difficulty: 'medium',
    subject: 'Reading Comprehension',
    topic: 'Urban Transportation'
  },
  {
    objectID: '2',
    actualQuestion: '다음 글에서 필자가 주장하는 바로 가장 적절한 것은?',
    questionText: `Precision and determinacy are a necessary requirement for all meaningful scientific debate. But historical representation puts a premium on a proliferation of representations, hence not on the refinement of one representation but on the production of an ever more varied set of representations. Historical understanding increases as the number of representations multiply. This is not because we thereby approach ever more closely to the one true representation of the past but because this plurality opens up for us ever more different perspectives on the past, and each perspective brings into view new aspects of the past not previously seen. Historical understanding is not like a portrait made ever more accurate by the most careful observation and the most minute depiction of what can be seen but is like a large picture gallery whose many canvases each show one particular representation of the past and together generate an understanding of the past that is far richer than any one painting could provide.`,
    answerOptions: [
      'Historical understanding improves through multiple perspectives rather than one perfect representation',
      'Scientific precision is more important than historical interpretation',
      'The best historical representation is the most accurate one',
      'Historical analysis requires strict methodological standards',
      'Proliferation of interpretations creates confusion in historical studies'
    ],
    correctAnswer: 'Historical understanding improves through multiple perspectives rather than one perfect representation',
    explanation: 'The author argues that historical understanding grows through a diversity of representations, like a gallery with many paintings, rather than perfecting a single accurate depiction.',
    difficulty: 'hard',
    subject: 'Reading Comprehension',
    topic: 'Historical Methodology'
  },
  {
    objectID: '3',
    actualQuestion: '밑줄 친 부분이 가리키는 대상이 나머지 넷과 다른 것은?',
    questionText: `Sarah had always dreamed of becoming a pilot. When she finally got her license, her mother was the first person she wanted to tell. She called her immediately, but there was no answer. She tried again an hour later, and this time her mother picked up. She was so excited that she could barely speak. Her mother congratulated her warmly and said she had always believed in her. Later that day, Sarah's sister called to say congratulations too.`,
    answerOptions: [
      'she (line 2)',
      'her (line 3)',
      'She (line 4)',
      'her (line 5)',
      'She (line 6)'
    ],
    correctAnswer: 'her (line 5)',
    explanation: 'Most pronouns refer to Sarah, but "her" in line 5 refers to Sarah\'s mother.',
    difficulty: 'easy',
    subject: 'Reading Comprehension',
    topic: 'Pronoun Reference'
  },
  {
    objectID: '4',
    actualQuestion: '다음 글의 요지로 가장 적절한 것은?',
    questionText: `Cells that help your hand muscles reach out to an object need information about the object's location in space. These cells rely on visual processing regions that analyze spatial relationships but largely ignore other visual features like color or fine detail. Meanwhile, cells involved in recognizing what the object is depend on different visual processing regions that focus on features, shapes, and colors. This division of labor in the brain means that visual information is processed along different pathways depending on whether the goal is to act on an object or to identify it. The pathway for action emphasizes "where" something is, while the pathway for recognition emphasizes "what" something is.`,
    answerOptions: [
      'The brain processes visual information differently for action versus recognition',
      'Hand-eye coordination requires complex neural pathways',
      'Color perception is essential for object recognition',
      'Visual processing happens in a single brain region',
      'Spatial information is more important than color information'
    ],
    correctAnswer: 'The brain processes visual information differently for action versus recognition',
    explanation: 'The passage explains how the brain uses different pathways to process "where" information (for action) and "what" information (for recognition).',
    difficulty: 'medium',
    subject: 'Reading Comprehension',
    topic: 'Neuroscience'
  },
  {
    objectID: '5',
    actualQuestion: '다음 글의 제목으로 가장 적절한 것은?',
    questionText: `The concept of a "learning organization" emphasizes the importance of continuous learning at all levels. In such organizations, employees are encouraged to acquire new skills, share knowledge freely, and challenge existing assumptions. Leaders support experimentation and view failures as learning opportunities rather than setbacks. This culture of learning enables organizations to adapt quickly to changing environments, innovate more effectively, and maintain competitive advantages. Companies that embrace this philosophy often outperform their peers because they can respond more flexibly to market demands and technological changes.`,
    answerOptions: [
      'Building Organizations That Learn and Adapt',
      'The Failure of Traditional Management',
      'Why Employees Resist Organizational Change',
      'Competition in Modern Business Markets',
      'The Role of Technology in Corporate Success'
    ],
    correctAnswer: 'Building Organizations That Learn and Adapt',
    explanation: 'The passage focuses on the characteristics and benefits of learning organizations that continuously adapt and improve.',
    difficulty: 'easy',
    subject: 'Reading Comprehension',
    topic: 'Organizational Development'
  },
  {
    objectID: '2026_pp_36',
    actualQuestion: '다음 빈칸에 들어갈 말로 가장 적절한 것을 고르시오.',
    questionText: `Kant was a strong defender of the rule of law as the ultimate guarantee, not only of security and peace, but also of freedom. He believed that human societies were moving towards more rational forms regulated by effective and binding legal frameworks because only such frameworks enabled people to live in harmony, to prosper and to co-operate. However, his belief in inevitable progress was not based on an optimistic or high-minded view of human nature. On the contrary, it comes close to Hobbes's outlook: man's violent and conflict-prone nature makes it necessary to establish and maintain an effective legal framework in order to secure peace. We cannot count on people's benevolence or goodwill, but even 'a nation of devils' can live in harmony in a legal system that binds every citizen equally. Ideally, the law is the embodiment of those political principles that all rational beings would freely choose. If such laws forbid them to do something that they would not rationally choose to do anyway, then the law cannot be _______.`,
    answerOptions: [
      '① regarded as reasonably confining human liberty',
      '② viewed as a strong defender of the justice system',
      '③ understood as a restraint on their freedom',
      '④ enforced effectively to suppress their evil nature',
      '⑤ accepted within the assumption of ideal legal frameworks'
    ],
    correctAnswer: '③ understood as a restraint on their freedom',
    explanation: 'The passage argues that if laws align with what rational beings would freely choose, then those laws cannot be seen as restricting freedom, since they only forbid what rational people would not choose to do anyway.',
    difficulty: 'medium',
    subject: 'Reading Comprehension',
    topic: '빈칸 추론'
  }
]

/**
 * Search questions using Algolia (or mock data if Algolia is not configured)
 *
 * @param query - Search query string
 * @param limit - Maximum number of results to return
 * @param filters - Algolia filter string
 * @returns Array of questions matching the search criteria
 */
export async function searchQuestions(
  query: string = '',
  limit: number = 10,
  filters?: string
): Promise<AlgoliaQuestion[]> {
  // TODO: Implement actual Algolia search when configured
  // Example implementation:
  // if (ALGOLIA_APP_ID && ALGOLIA_SEARCH_KEY && ALGOLIA_INDEX_NAME) {
  //   const { hits } = await index.search(query, {
  //     hitsPerPage: limit,
  //     filters: filters,
  //   })
  //   return hits as AlgoliaQuestion[]
  // }

  // Return mock data for now
  return mockQuestions.slice(0, limit)
}

/**
 * Get a specific question by its objectID
 *
 * @param objectID - The unique identifier for the question
 * @returns The question object or null if not found
 */
export async function getQuestionById(objectID: string): Promise<AlgoliaQuestion | null> {
  // TODO: Implement actual Algolia getObject when configured
  // Example implementation:
  // if (ALGOLIA_APP_ID && ALGOLIA_SEARCH_KEY && ALGOLIA_INDEX_NAME) {
  //   try {
  //     const question = await index.getObject<AlgoliaQuestion>(objectID)
  //     return question
  //   } catch (error) {
  //     return null
  //   }
  // }

  return mockQuestions.find(q => q.objectID === objectID) || null
}

/**
 * Search questions by subject
 *
 * @param subject - The subject to filter by
 * @param limit - Maximum number of results to return
 * @returns Array of questions in the specified subject
 */
export async function searchQuestionsBySubject(
  subject: string,
  limit: number = 10
): Promise<AlgoliaQuestion[]> {
  return searchQuestions('', limit, `subject:"${subject}"`)
}

/**
 * Search questions by difficulty level
 *
 * @param difficulty - The difficulty level to filter by
 * @param limit - Maximum number of results to return
 * @returns Array of questions with the specified difficulty
 */
export async function searchQuestionsByDifficulty(
  difficulty: 'easy' | 'medium' | 'hard',
  limit: number = 10
): Promise<AlgoliaQuestion[]> {
  return searchQuestions('', limit, `difficulty:"${difficulty}"`)
}

/**
 * Get the configured Algolia index name
 * @returns The index name (defaults to 'csat_final' if not configured)
 */
export function getAlgoliaIndexName(): string {
  return ALGOLIA_INDEX_NAME || 'csat_final'
}