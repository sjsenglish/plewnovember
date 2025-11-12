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
        <div className="space-y-6">
          {/* Korean Instruction (actualQuestion) */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-[#4248DB] p-6 rounded-r-xl">
            <h3 className="font-inter font-semibold text-sm text-gray-700 mb-3">문제 (Question)</h3>
            <p className="font-inter text-base text-gray-900">
              {question.actualQuestion}
            </p>
          </div>

          {/* Difficulty Badge */}
          {question.difficulty && (
            <div className="flex justify-end">
              <div className={`px-4 py-2 rounded-lg text-sm font-inter font-medium ${
                question.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
              </div>
            </div>
          )}

          {/* English Passage (questionText) */}
          <div className="p-6">
            <h4 className="font-inter font-semibold text-sm text-gray-600 mb-4 uppercase">Passage</h4>
            <div className="font-inter text-base text-gray-900 leading-relaxed whitespace-pre-wrap">
              {question.questionText}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}