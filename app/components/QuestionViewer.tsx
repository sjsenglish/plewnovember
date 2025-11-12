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
    <div className="h-full flex flex-col bg-white">
      {/* Question Content */}
      <div className="flex-1 overflow-y-auto px-12 py-16">
        <div className="max-w-4xl mx-auto space-y-16">
          {/* Korean Instruction (actualQuestion) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-xs uppercase text-gray-400 tracking-wider">Question</h3>
              {/* Difficulty Badge */}
              {question.difficulty && (
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  question.difficulty === 'easy' ? 'bg-green-50 text-green-600' :
                  question.difficulty === 'medium' ? 'bg-amber-50 text-amber-600' :
                  'bg-red-50 text-red-600'
                }`}>
                  {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
                </span>
              )}
            </div>
            <p className="font-body text-2xl text-gray-900 leading-relaxed">
              {question.actualQuestion}
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100"></div>

          {/* English Passage (questionText) */}
          <div className="space-y-6">
            <h4 className="font-heading text-xs uppercase text-gray-400 tracking-wider">Passage</h4>
            <div className="font-body text-lg text-gray-700 leading-loose whitespace-pre-wrap">
              {question.questionText}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100"></div>

          {/* Answer Options Display (for reference - actual selection in AnswerOptions component) */}
          <div className="space-y-8">
            <h4 className="font-heading text-xs uppercase text-gray-400 tracking-wider">Answer Options</h4>
            <div className="space-y-4">
              {question.answerOptions.map((option, index) => (
                <div
                  key={index}
                  className="group p-6 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full bg-white text-gray-500 text-sm font-medium group-hover:bg-gray-900 group-hover:text-white transition-all duration-200">
                      {index + 1}
                    </span>
                    <span className="font-body text-gray-900 leading-relaxed flex-1">{option}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}