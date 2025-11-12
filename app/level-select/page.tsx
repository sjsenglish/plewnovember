import Link from 'next/link'
import Image from 'next/image'

const levels = [
  {
    id: 1,
    name: 'Level 1',
    iconUrl: 'https://firebasestorage.googleapis.com/v0/b/plewcsat1.firebasestorage.app/o/icons%2F%E1%84%80%E1%85%A91.svg?alt=media&token=4ebb6178-84ca-45b5-8849-d3afa3972aaa',
    href: '/pack-maker-level1'
  },
  {
    id: 2,
    name: 'Level 2',
    iconUrl: 'https://firebasestorage.googleapis.com/v0/b/plewcsat1.firebasestorage.app/o/icons%2F%E1%84%80%E1%85%A92.svg?alt=media&token=40ce42b3-455a-4514-8fee-3e56802fb984',
    href: '/pack-maker-level2'
  },
  {
    id: 3,
    name: 'Level 3',
    iconUrl: 'https://firebasestorage.googleapis.com/v0/b/plewcsat1.firebasestorage.app/o/icons%2F%E1%84%80%E1%85%A93.svg?alt=media&token=b4e53c50-7615-4acf-91fa-e4563512b5c8',
    href: '/pack-maker-level3'
  }
]

export default function LevelSelect() {
  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center p-8"
      style={{ backgroundColor: '#010242' }}
    >
      <div className="text-center mb-16">
        <h1 className="font-heading text-5xl text-white mb-4 tracking-custom">
          Select Your Level
        </h1>
        <p className="font-body text-xl text-white/80 tracking-custom">
          Choose the difficulty level for your practice session
        </p>
      </div>

      <div className="flex flex-wrap justify-center items-center gap-12">
        {levels.map((level) => (
          <Link
            key={level.id}
            href={level.href}
            className="group flex flex-col items-center space-y-6"
          >
            <div className="bg-white p-12 rounded-3xl shadow-2xl hover:shadow-[0_20px_60px_rgba(255,255,255,0.3)] transition-all duration-300 transform hover:scale-110">
              <img
                src={level.iconUrl}
                alt={level.name}
                width={160}
                height={160}
                className="w-40 h-40 transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <p className="font-heading text-4xl tracking-custom text-white group-hover:text-purple-300 transition-colors duration-300">
              {level.name}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
