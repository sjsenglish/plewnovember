'use client'

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
      className="fixed inset-0 w-screen h-screen overflow-hidden flex flex-col justify-center items-center m-0 p-0 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('https://firebasestorage.googleapis.com/v0/b/plewcsat1.firebasestorage.app/o/icons%2Fbackground.svg?alt=media&token=85f36310-0af9-49f9-9453-8e4064cad41e')"
      }}
    >
      {/* Content layer */}
      <div className="relative z-10 flex flex-col items-center">
        {levels.map((level, index) => (
          <Link
            key={level.id}
            href={level.href}
            className={`block transition-transform duration-300 ease-in-out hover:scale-110 cursor-pointer ${
              index === 0 ? 'mt-0' : '-mt-[120px]'
            }`}
          >
            <Image
              src={level.iconUrl}
              alt={level.name}
              width={320}
              height={320}
              className="w-80 h-80 block"
              unoptimized
            />
          </Link>
        ))}
      </div>
    </div>
  )
}
