import PackSizeSelector from '@/app/components/PackSizeSelector'

export default function PackMakerLevel2() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-custom-cyan via-custom-white to-custom-pink py-8 sm:py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl text-gray-900 mb-4 sm:mb-6 tracking-custom">
            Create Your Practice Pack - Level 2
          </h1>
          <p className="font-body text-lg sm:text-xl text-gray-700 tracking-custom">
            Select the number of questions for your practice session
          </p>
        </div>
        <PackSizeSelector level={2} />
      </div>
    </div>
  )
}
