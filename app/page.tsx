import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-custom-cyan via-custom-purple to-custom-pink flex flex-col justify-center items-center p-8">
      <div className="flex flex-col items-center space-y-12">
        {/* Purple ghost icon - clickable to next page */}
        <Link
          href="/pack-maker"
          className="group flex flex-col items-center space-y-6"
        >
          <div className="bg-custom-white p-16 rounded-3xl shadow-container-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <Image
              src="/purple-ghost.svg"
              alt="Start"
              width={200}
              height={200}
              className="w-48 h-48 transition-transform duration-300 group-hover:scale-110"
              priority
            />
          </div>
          <p className="font-heading text-5xl tracking-custom text-gray-900 group-hover:text-purple-700 transition-colors duration-300">
            start
          </p>
        </Link>
      </div>
    </div>
  )
}