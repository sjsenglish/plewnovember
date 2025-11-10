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
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">
            Question {questionNumber} of {totalQuestions}
          </h2>
          {question.difficulty && (
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              question.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
              question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
            </div>
          )}
        </div>
      </div>

      {/* Question Content */}
      <div className="flex-1 p-6 bg-white overflow-y-auto">
        <div className="space-y-6">
          {/* Korean Instruction (actualQuestion) */}
          <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-lg">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">문제 (Question)</h3>
            <p className="text-lg font-medium text-blue-900">
              {question.actualQuestion}
            </p>
          </div>

          {/* English Passage (questionText) */}
          <div className="bg-white border border-gray-200 p-6 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-600 mb-4 uppercase tracking-wide">Passage</h4>
            <div className="text-base text-gray-900 leading-relaxed whitespace-pre-wrap">
              {question.questionText}
            </div>
          </div>

          {/* Answer Options Display (for reference - actual selection in AnswerOptions component) */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-700 mb-3">Answer Options:</h4>
            {question.answerOptions.map((option, index) => (
              <div
                key={index}
                className="p-3 border border-gray-200 rounded-lg bg-gray-50"
              >
                <span className="font-medium text-gray-600 mr-2">
                  {index + 1}.
                </span>
                {option}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}