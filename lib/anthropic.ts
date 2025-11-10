import Anthropic from '@anthropic-ai/sdk'

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export async function generateResponse(
  messages: ChatMessage[],
  systemPrompt?: string,
  maxTokens: number = 1024
): Promise<string> {
  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    })

    const content = response.content[0]
    if (content.type === 'text') {
      return content.text
    }
    
    throw new Error('Unexpected response type from Claude')
  } catch (error) {
    console.error('Error generating response:', error)
    throw new Error('Failed to generate response from Claude')
  }
}

export async function generateQuestionExplanation(
  question: string,
  correctAnswer: string,
  userAnswer?: string
): Promise<string> {
  const systemPrompt = `You are an expert tutor. Provide a clear, educational explanation for the given question and answer. If a user's answer is provided and it's incorrect, gently explain why it's wrong and guide them to the correct understanding.`

  const prompt = userAnswer 
    ? `Question: ${question}\n\nCorrect Answer: ${correctAnswer}\n\nStudent's Answer: ${userAnswer}\n\nPlease explain why the correct answer is right and help the student understand their mistake.`
    : `Question: ${question}\n\nCorrect Answer: ${correctAnswer}\n\nPlease explain why this is the correct answer.`

  return generateResponse([{ role: 'user', content: prompt }], systemPrompt)
}