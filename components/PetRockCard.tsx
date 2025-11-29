"use client"
import FeedButton from './FeedButton'

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

  // Procedural generation based on Token ID
  const getRockStyle = (id: bigint) => {
    const idNum = Number(id)
    const hues = [0, 45, 90, 135, 180, 225, 270, 315]
    const faces = ['._.', 'o_o', '^_^', '-_-', '>_<', 'O_O', 'u_u', 'x_x']

    return {
      hue: hues[idNum % hues.length],
      face: faces[idNum % faces.length]
    }
  }

  const style = getRockStyle(tokenId)

  return (
    <div className="bg-white p-6 pixel-borders flex flex-col items-center gap-4 w-full max-w-xs relative">
      <div className="absolute top-2 right-2 text-[10px] text-gray-400">#{tokenId.toString()}</div>

      <div
        className="text-6xl animate-bounce-slow mt-2 relative"
        style={{ filter: `hue-rotate(${style.hue}deg)` }}
      >
        🪨
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-black bg-white/50 px-1 rounded-sm backdrop-blur-sm">
          {style.face}
        </div>
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
        onFeedSuccess={onUpdate}
      />
    </div>
  )
}
