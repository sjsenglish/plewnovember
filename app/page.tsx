import Link from 'next/link'
import Image from 'next/image'
import Particles from './components/Particles'

export default function Home() {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-sky-300 via-sky-200 to-sky-100 flex flex-col justify-center items-center p-8 overflow-hidden">
      {/* Particle background */}
      <div className="absolute inset-0 z-0">
        <Particles
          particleColors={['#ffffff', '#ffffff']}
          particleCount={200}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center space-y-12">
        {/* Dino icon - clickable to next page */}
        <Link
          href="/pack-maker"
          className="group flex flex-col items-center space-y-6"
        >
          <div className="bg-custom-white p-16 rounded-3xl shadow-container-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <Image
              src="https://firebasestorage.googleapis.com/v0/b/plewcsat1.firebasestorage.app/o/icons%2Fdino.svg?alt=media&token=ff09f837-afd6-4e0b-aca7-938ab1603f54"
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