import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col justify-center items-center p-4 sm:p-8">
      {/* Fullscreen video background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source
          src="https://firebasestorage.googleapis.com/v0/b/plewcsat1.firebasestorage.app/o/icons%2Fgradient%20bg.mp4?alt=media&token=582d9cfd-26d4-47ff-b6d3-bfaa84e606b0"
          type="video/mp4"
        />
      </video>

      {/* Content layer on top of video */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Purple ghost icon - clickable to next page */}
        <Link
          href="/level-select"
          className="group flex flex-col items-center gap-6"
        >
          <div className="bg-custom-white p-12 sm:p-16 rounded-3xl shadow-container-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <Image
              src="/purple-ghost.svg"
              alt="Start"
              width={200}
              height={200}
              className="w-40 h-40 sm:w-48 sm:h-48 transition-transform duration-300 group-hover:scale-110"
              priority
            />
          </div>
          <p className="font-heading text-4xl sm:text-5xl tracking-custom text-gray-900 group-hover:text-purple-700 transition-colors duration-300">
            start
          </p>
        </Link>
      </div>
    </div>
  )
}