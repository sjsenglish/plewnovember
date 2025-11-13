import PackSizeSelector from '@/app/components/PackSizeSelector'
import Navbar from '@/app/components/Navbar'
import BackButton from '@/app/components/BackButton'

export default function PackMakerLevel1() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <BackButton />
      <div
        className="flex-1 py-8 sm:py-12 px-4 bg-cover bg-center bg-no-repeat bg-fixed"
        style={{
          backgroundImage: "url('https://firebasestorage.googleapis.com/v0/b/plewcsat1.firebasestorage.app/o/icons%2Fbackground.svg?alt=media&token=85f36310-0af9-49f9-9453-8e4064cad41e')"
        }}
      >
        <div className="max-w-4xl mx-auto">
          <PackSizeSelector level={1} />
        </div>
      </div>
    </div>
  )
}
