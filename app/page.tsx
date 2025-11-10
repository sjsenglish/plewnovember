import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center items-center p-8">
      <div className="max-w-4xl w-full space-y-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          PLEW - AI Tutor App
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Personalized Learning Experience with your AI buddy
        </p>
        
        <div className="mb-12">
          <Link 
            href="/pack-maker"
            className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
          >
            Start Learning Now
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