import PackSizeSelector from '@/app/components/PackSizeSelector'

export default function PackMaker() {
  return (
    <div
      className="min-h-screen py-8 sm:py-12 px-4 bg-cover bg-center bg-no-repeat bg-fixed"
      style={{
        backgroundImage: "url('https://firebasestorage.googleapis.com/v0/b/plewcsat1.firebasestorage.app/o/icons%2Fbackground.svg?alt=media&token=85f36310-0af9-49f9-9453-8e4064cad41e')"
      }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl text-gray-900 mb-4 sm:mb-6 tracking-custom">
            Create Your Practice Pack
          </h1>
          <p className="font-body text-lg sm:text-xl text-gray-700 tracking-custom">
            Select the number of questions for your practice session
          </p>
        </div>
        <PackSizeSelector />
      </div>
    </div>
  )
}