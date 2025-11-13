import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <div
      className="fixed inset-0 w-screen h-screen overflow-hidden flex flex-col justify-center items-center p-4 sm:p-8 m-0 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('https://firebasestorage.googleapis.com/v0/b/plewcsat1.firebasestorage.app/o/icons%2Fbackground.svg?alt=media&token=85f36310-0af9-49f9-9453-8e4064cad41e')"
      }}
    >
      {/* Content layer */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Dino icon with bounce animation - clickable to next page */}
        <Link
          href="/level-select"
          className="group flex flex-col items-center gap-6"
        >
          <div className="animate-bounce-slow">
            <Image
              src="https://firebasestorage.googleapis.com/v0/b/plewcsat1.firebasestorage.app/o/icons%2Fdino-with-shadows-how-to-level-pages_option1.svg?alt=media&token=0191caff-8773-4fa2-b713-45d8495115ab"
              alt="Dino"
              width={200}
              height={200}
              className="w-40 h-40 sm:w-48 sm:h-48 transition-transform duration-300 group-hover:scale-110"
              priority
            />
          </div>
          <Image
            src="https://firebasestorage.googleapis.com/v0/b/plewcsat1.firebasestorage.app/o/icons%2Fstart-button.svg?alt=media&token=30366dfb-d1b5-4d23-afa0-88a197884e65"
            alt="Start"
            width={150}
            height={50}
            className="transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
      </div>
    </div>
  )
}