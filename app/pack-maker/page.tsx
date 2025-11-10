import PackSizeSelector from '@/app/components/PackSizeSelector'

export default function PackMaker() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Create Your Practice Pack
          </h1>
          <p className="text-lg text-gray-600">
            Select the number of questions for your practice session
          </p>
        </div>
        <PackSizeSelector />
      </div>
    </div>
  )
}