"use client"
import FeedButton from './FeedButton'
import { useState } from 'react'

export default function PetRockCard({
  tokenId,
  xp,
  lastFedAt,
  canFeed,
  timeUntilNextFeed,
  onUpdate
}: {
  tokenId: bigint,
  xp: bigint,
  lastFedAt: bigint,
  canFeed: boolean,
  timeUntilNextFeed: bigint,
  onUpdate: () => void
}) {
  // Simple format for time
  const formatTime = (seconds: number) => {
    if (seconds <= 0) return "Now"
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    if (h > 0) return `${h}h ${m}m`
    if (m > 0) return `${m}m ${s}s`
    return `${s}s`
  }

  const [isEating, setIsEating] = useState(false)

  // Get rock image based on ID (0-249)
  const rockImageSrc = `/rocks/rock_${Number(tokenId) % 250}.svg`

  const handleFeed = () => {
    setIsEating(true)
    setTimeout(() => setIsEating(false), 2000) // Reset after 2 seconds
    onUpdate()
  }

  return (
    <div className="bg-white p-6 pixel-borders flex flex-col items-center gap-4 w-full max-w-xs relative">
      <div className="absolute top-2 right-2 text-[10px] text-gray-400">#{tokenId.toString()}</div>

      <div className={`relative w-32 h-32 mt-2 ${isEating ? 'animate-bounce' : 'animate-bounce-slow'}`}>
        <img
          src={rockImageSrc}
          alt={`Pet Rock #${tokenId}`}
          className="w-full h-full object-contain pixelated"
          style={{ imageRendering: 'pixelated' }}
        />

        {/* Eating Reaction Overlay */}
        {isEating && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-4xl animate-ping absolute">❤️</div>
            <div className="bg-white/80 backdrop-blur-sm px-2 py-1 rounded pixel-borders text-xs font-bold absolute -top-4">
              YUM!
            </div>
          </div>
        )}
      </div>

      <div className="w-full space-y-2">
        <div className="flex justify-between text-xs font-bold">
          <span>XP Level</span>
          <span>{xp.toString()}</span>
        </div>
        <div className="w-full bg-gray-200 h-6 border-2 border-black p-0.5">
          <div
            className="bg-blue-400 h-full transition-all duration-500"
            style={{ width: `${Math.min(Number(xp) % 100, 100)}%` }} // Assuming 100 XP per level visually
          />
        </div>
      </div>

      <div className="text-xs text-center h-4">
        {canFeed ? (
          <span className="text-green-600 font-bold animate-pulse">HUNGRY!</span>
        ) : (
          <span className="text-gray-500">Digest: {formatTime(Number(timeUntilNextFeed))}</span>
        )}
      </div>

      <FeedButton
        tokenId={tokenId}
        disabled={!canFeed}
        onFeedSuccess={handleFeed}
      />
    </div>
  )
}
