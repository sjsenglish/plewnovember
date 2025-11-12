import Link from 'next/link'
import Image from 'next/image'
import Iridescence from './components/Iridescence'

export default function Home() {
  return (
    <div className="min-h-screen relative flex flex-col justify-center items-center p-8">
      {/* Iridescent background */}
      <div className="absolute inset-0 w-full h-full">
        <Iridescence
          color={[1, 1, 1]}
          mouseReact={false}
          amplitude={0.1}
          speed={1.0}
        />
      </div>

      {/* Content on top of background */}
      <div className="relative z-10 flex flex-col items-center space-y-12">
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