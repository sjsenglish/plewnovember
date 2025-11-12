'use client'

interface QuestionNavigationProps {
  totalQuestions: number
  currentQuestion: number
  onQuestionClick: (index: number) => void
}

export default function QuestionNavigation({
  totalQuestions,
  currentQuestion,
  onQuestionClick
}: QuestionNavigationProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: totalQuestions }, (_, i) => i).map((index) => {
        const isActive = index === currentQuestion
        return (
          <button
            key={index}
            onClick={() => onQuestionClick(index)}
            className={`w-10 h-10 rounded-lg font-inter font-semibold text-sm transition-all duration-200 ${
              isActive
                ? 'bg-[#4248DB] text-white shadow-md'
                : 'bg-transparent text-black border-2 border-black hover:bg-gray-100'
            }`}
          >
            {index + 1}
          </button>
        )
      })}
    </div>
  )
}
