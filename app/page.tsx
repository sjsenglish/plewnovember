export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center items-center p-8">
      <div className="max-w-4xl w-full space-y-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          AI Tutor App
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Powered by Next.js 15, Supabase, Algolia, and Anthropic Claude
        </p>
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