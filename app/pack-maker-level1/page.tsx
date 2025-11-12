import PackSizeSelector from '@/app/components/PackSizeSelector'

export default function PackMakerLevel1() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-custom-cyan via-custom-white to-custom-pink py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12 space-y-4">
          <h1 className="font-heading text-5xl text-gray-900 mb-6 tracking-custom">
            Create Your Practice Pack - Level 1
          </h1>
          <p className="font-body text-xl text-gray-700 tracking-custom">
            Select the number of questions for your practice session
          </p>
        </div>
        <PackSizeSelector level={1} />
      </div>
    </div>
  )
}
