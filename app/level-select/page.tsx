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
    <div className="h-screen overflow-hidden bg-white flex flex-col justify-center items-center">
      <div className="flex flex-col justify-center items-center -space-y-8">
        {levels.map((level) => (
          <Link
            key={level.id}
            href={level.href}
            className="group transition-all duration-300 transform hover:scale-110"
          >
            <img
              src={level.iconUrl}
              alt={level.name}
              width={320}
              height={320}
              className="w-80 h-80"
            />
          </Link>
        ))}
      </div>
    </div>
  )
}
