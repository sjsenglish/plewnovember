'use client'

interface Question {
  objectID: string
  actualQuestion: string // Korean instruction
  questionText: string // English passage
  answerOptions: string[]
  correctAnswer: string
  explanation?: string
  difficulty?: string
  subject?: string
  topic?: string
}

interface QuestionViewerProps {
  question: Question
  questionNumber: number
  totalQuestions: number
}

export default function QuestionViewer({
  question,
  questionNumber,
  totalQuestions
}: QuestionViewerProps) {
  if (!question) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-gray-500">No question selected</div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Question Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-8">
          {/* Korean Instruction (actualQuestion) */}
          <div className="bg-gradient-to-r from-custom-purple to-custom-pink border-l-4 border-purple-600 p-6 rounded-r-2xl shadow-container">
            <h3 className="font-heading text-sm text-purple-900 mb-3 tracking-custom">문제 (Question)</h3>
            <p className="font-body text-lg text-purple-900 tracking-custom">
              {question.actualQuestion}
            </p>
          </div>

          {/* Difficulty Badge */}
          {question.difficulty && (
            <div className="flex justify-end">
              <div className={`px-4 py-2 rounded-xl text-sm font-body shadow-container tracking-custom ${
                question.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
              </div>
            </div>
          )}

          {/* English Passage (questionText) */}
          <div className="bg-custom-white border-2 border-custom-cyan p-8 rounded-2xl shadow-container">
            <h4 className="font-heading text-sm text-gray-600 mb-6 uppercase tracking-custom">Passage</h4>
            <div className="font-body text-base text-gray-900 leading-relaxed whitespace-pre-wrap tracking-custom">
              {question.questionText}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}