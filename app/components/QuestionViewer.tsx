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
          <div className="mb-6">
            <h3 className="font-heading text-sm text-gray-600 mb-3 tracking-custom">문제 (Question)</h3>
            <p className="font-body text-lg text-gray-900 tracking-custom">
              {question.actualQuestion}
            </p>
          </div>

          {/* English Passage (questionText) */}
          <div className="mb-8">
            <h4 className="font-heading text-sm text-gray-600 mb-4 uppercase tracking-custom">Passage</h4>
            <div className="font-body text-base text-gray-900 leading-relaxed whitespace-pre-wrap tracking-custom">
              {question.questionText}
            </div>
          </div>

          {/* Answer Options Display (for reference - actual selection in AnswerOptions component) */}
          <div className="space-y-4">
            <h4 className="font-heading text-gray-700 mb-4 tracking-custom">Answer Options:</h4>
            {question.answerOptions.map((option, index) => (
              <div
                key={index}
                className="p-4"
              >
                <span className="font-heading text-gray-600 mr-3 tracking-custom">
                  {index + 1}.
                </span>
                <span className="font-body tracking-custom">{option}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}