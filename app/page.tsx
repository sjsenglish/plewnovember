import Link from 'next/link'
import { BookOpen } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center items-center p-8">
      <div className="max-w-4xl w-full space-y-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          PLEW Method
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Master Reading Comprehension with AI-Guided Analysis
        </p>

        {/* Large clickable book icon */}
        <div className="mb-12 flex justify-center">
          <Link
            href="/pack-maker"
            className="group"
          >
            <div className="bg-white p-12 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
              <BookOpen
                className="w-32 h-32 text-blue-600 group-hover:text-purple-600 transition-colors duration-300"
                strokeWidth={1.5}
              />
            </div>
            <p className="mt-6 text-lg font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">
              Click to Start Practice
            </p>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-semibold text-lg mb-2">Next.js 15</h3>
            <p className="text-gray-600">App Router enabled</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-semibold text-lg mb-2">Supabase</h3>
            <p className="text-gray-600">Database ready</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-semibold text-lg mb-2">Algolia</h3>
            <p className="text-gray-600">Search configured</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-semibold text-lg mb-2">Claude API</h3>
            <p className="text-gray-600">AI tutor ready</p>
          </div>
        </div>
      </div>
    </div>
  )
}