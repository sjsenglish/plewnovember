'use client'

import styles from './QuestionViewer.module.css'

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
    <div className="space-y-6">
      {/* Korean Instruction (actualQuestion) */}
      <div>
        <p className={`font-body text-[1.1rem] text-black tracking-custom ${styles.instructionText}`}>
          {question.actualQuestion}
        </p>
      </div>

      {/* Difficulty Badge */}
      {question.difficulty && (
        <div className="flex justify-end">
          <div className={`px-3 py-1.5 rounded-xl text-[0.8rem] font-body shadow-container tracking-custom ${
            question.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
            question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
          </div>
        </div>
      )}

      {/* English Passage (questionText) */}
      <div className={`font-body text-[1rem] text-black leading-relaxed whitespace-pre-wrap tracking-custom ${styles.questionText}`}>
        {question.questionText}
      </div>
    </div>
  )
}