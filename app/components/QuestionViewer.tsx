'use client'

interface Question {
  id: string
  question: string
  type: 'multiple-choice' | 'true-false' | 'essay'
  options?: string[]
  correctAnswer?: string
  explanation?: string
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
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {question.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </div>
        </div>
      </div>

      {/* Question Content */}
      <div className="flex-1 p-6 bg-white overflow-y-auto">
        <div className="prose max-w-none">
          <div className="text-lg text-gray-900 leading-relaxed mb-6">
            {question.question}
          </div>

          {/* Multiple Choice Options */}
          {question.type === 'multiple-choice' && question.options && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-700 mb-3">Answer Options:</h4>
              {question.options.map((option, index) => (
                <div 
                  key={index}
                  className="p-3 border border-gray-200 rounded-lg bg-gray-50"
                >
                  <span className="font-medium text-gray-600 mr-2">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  {option}
                </div>
              ))}
            </div>
          )}

          {/* True/False indicator */}
          {question.type === 'true-false' && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-700 mb-3">Answer Options:</h4>
              <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                A. True
              </div>
              <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                B. False
              </div>
            </div>
          )}

          {/* Essay prompt */}
          {question.type === 'essay' && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 font-medium">
                This is an essay question. Use the chat panel to discuss your thoughts and get guidance from your PLEW buddy.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}