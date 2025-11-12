'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

const packOptions = [
  {
    id: 1,
    size: 27,
    label: '27번',
    iconUrl: 'https://firebasestorage.googleapis.com/v0/b/plewcsat1.firebasestorage.app/o/icons%2Fbook_pink.svg?alt=media&token=eca318d2-2785-4ffe-b806-e15381734a28'
  },
  {
    id: 2,
    size: 29,
    label: '29번',
    iconUrl: 'https://firebasestorage.googleapis.com/v0/b/plewcsat1.firebasestorage.app/o/icons%2Fbook_purple.svg?alt=media&token=362b7fc3-8bce-44fa-b862-2d39958c241b'
  },
  {
    id: 3,
    size: 21,
    label: '21번',
    iconUrl: 'https://firebasestorage.googleapis.com/v0/b/plewcsat1.firebasestorage.app/o/icons%2Fbook_blue.svg?alt=media&token=817ca445-ef40-4a0a-8312-06e293c5b5cb'
  },
  {
    id: 4,
    size: 19,
    label: '19번',
    iconUrl: 'https://firebasestorage.googleapis.com/v0/b/plewcsat1.firebasestorage.app/o/icons%2Fbook_yellow.svg?alt=media&token=d951aa02-015d-45eb-9782-9ed989aa549c'
  }
]

export default function PackMakerLevel1() {
  const [isCreating, setIsCreating] = useState(false)
  const router = useRouter()

  const handleCreatePack = async (size: number) => {
    setIsCreating(true)

    try {
      const response = await fetch('/api/packs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ size, level: 1 })
      })

      if (!response.ok) {
        throw new Error('Failed to create pack')
      }

      const data = await response.json()
      localStorage.setItem(`pack-${data.packId}`, JSON.stringify(data))
      router.push(`/practice/${data.packId}`)
    } catch (error) {
      console.error('Error creating pack:', error)
      alert('Failed to create practice pack. Please try again.')
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden flex flex-col justify-center items-center p-4 sm:p-8 m-0">
      {/* Fullscreen video background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="fixed inset-0 w-screen h-screen object-cover"
      >
        <source
          src="https://firebasestorage.googleapis.com/v0/b/plewcsat1.firebasestorage.app/o/icons%2Fgradient%20bg.mp4?alt=media&token=582d9cfd-26d4-47ff-b6d3-bfaa84e606b0"
          type="video/mp4"
        />
      </video>

      {/* Content layer on top of video */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="grid grid-cols-2 gap-8 sm:gap-12">
          {packOptions.map((pack) => (
            <button
              key={pack.id}
              onClick={() => handleCreatePack(pack.size)}
              disabled={isCreating}
              className="group flex flex-col items-center gap-4 transition-transform duration-300 ease-in-out hover:scale-110 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Image
                src={pack.iconUrl}
                alt={pack.label}
                width={200}
                height={200}
                className="w-40 h-40 sm:w-48 sm:h-48 transition-transform duration-300 group-hover:scale-105"
                unoptimized
              />
              <p className="font-heading text-2xl sm:text-3xl tracking-custom text-gray-900">
                {pack.label}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
