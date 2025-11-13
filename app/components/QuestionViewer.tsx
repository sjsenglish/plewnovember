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
        <div className="space-y-5">
          {/* Korean Instruction (actualQuestion) */}
          <div className="bg-gradient-to-r from-custom-purple to-custom-pink border-l-[3px] border-purple-600 p-4 rounded-r-2xl shadow-container">
            <h3 className="font-heading text-[0.6125rem] text-purple-900 mb-2 tracking-custom">문제 (Question)</h3>
            <p className="font-body text-[0.875rem] text-purple-900 tracking-custom">
              {question.actualQuestion}
            </p>
          </div>

          {/* Difficulty Badge */}
          {question.difficulty && (
            <div className="flex justify-end">
              <div className={`px-3 py-1.5 rounded-xl text-[0.6125rem] font-body shadow-container tracking-custom ${
                question.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
              </div>
            </div>
          )}

          {/* English Passage (questionText) */}
          <div className="bg-custom-white p-5 rounded-2xl shadow-container">
            <h4 className="font-heading text-[0.6125rem] text-gray-600 mb-4 uppercase tracking-custom">Passage</h4>
            <div className="font-body text-[0.7rem] text-gray-900 leading-relaxed whitespace-pre-wrap tracking-custom">
              {question.questionText}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}