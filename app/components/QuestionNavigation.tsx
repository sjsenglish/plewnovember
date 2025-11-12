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
    <div className="flex flex-wrap gap-3">
      {Array.from({ length: totalQuestions }, (_, i) => i).map((index) => {
        const isActive = index === currentQuestion
        return (
          <button
            key={index}
            onClick={() => onQuestionClick(index)}
            className={`w-14 h-14 rounded-xl font-inter font-bold text-base transition-all duration-200 shadow-md ${
              isActive
                ? 'bg-[#4248DB] text-white'
                : 'bg-black text-white hover:bg-gray-800'
            }`}
          >
            {index + 1}
          </button>
        )
      })}
    </div>
  )
}
