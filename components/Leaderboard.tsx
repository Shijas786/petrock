"use client"
import { useReadContract, useReadContracts } from 'wagmi'
import { petRockContractConfig } from '@/lib/contract'
import { useMemo } from 'react'

interface LeaderboardEntry {
  tokenId: bigint
  xp: bigint
  owner: string
  rank: number
}

export default function Leaderboard() {
  // Get total supply
  const { data: totalSupply } = useReadContract({
    ...petRockContractConfig,
    functionName: 'totalSupply',
  })

  const totalSupplyNum = totalSupply ? Number(totalSupply) : 0

  // Prepare calls for all token IDs (1 to totalSupply)
  const tokenIdCalls = Array.from({ length: totalSupplyNum }, (_, i) => ({
    ...petRockContractConfig,
    functionName: 'xp',
    args: [BigInt(i + 1)] // Token IDs start at 1
  }))

  const ownerCalls = Array.from({ length: totalSupplyNum }, (_, i) => ({
    ...petRockContractConfig,
    functionName: 'ownerOf',
    args: [BigInt(i + 1)]
  }))

  // Fetch XP for all tokens
  const { data: xpResults } = useReadContracts({
    contracts: tokenIdCalls,
    query: {
      enabled: totalSupplyNum > 0,
      refetchInterval: 10000, // Refetch every 10 seconds
    }
  })

  // Fetch owners for all tokens
  const { data: ownerResults } = useReadContracts({
    contracts: ownerCalls,
    query: {
      enabled: totalSupplyNum > 0,
    }
  })

  // Process and sort leaderboard
  const leaderboard = useMemo(() => {
    if (!xpResults || !ownerResults || totalSupplyNum === 0) return []

    const entries: LeaderboardEntry[] = []
    
    for (let i = 0; i < totalSupplyNum; i++) {
      const xpResult = xpResults[i]
      const ownerResult = ownerResults[i]
      
      if (xpResult?.status === 'success' && ownerResult?.status === 'success') {
        entries.push({
          tokenId: BigInt(i + 1),
          xp: xpResult.result as bigint,
          owner: ownerResult.result as string,
          rank: 0 // Will be set after sorting
        })
      }
    }

    // Sort by XP descending
    entries.sort((a, b) => {
      const xpA = Number(a.xp)
      const xpB = Number(b.xp)
      return xpB - xpA
    })

    // Assign ranks
    entries.forEach((entry, index) => {
      entry.rank = index + 1
    })

    // Return top 10
    return entries.slice(0, 10)
  }, [xpResults, ownerResults, totalSupplyNum])

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  if (totalSupplyNum === 0) {
    return (
      <div className="w-full bg-white pixel-borders p-6 text-center">
        <h2 className="text-lg font-bold mb-2 text-blue-600">🏆 Leaderboard</h2>
        <p className="text-xs text-gray-500">No rocks minted yet!</p>
      </div>
    )
  }

  return (
    <div className="w-full bg-white pixel-borders p-4 md:p-6">
      <h2 className="text-lg md:text-xl font-bold mb-4 text-center text-blue-600">
        🏆 Top Rocks
      </h2>
      
      {leaderboard.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-xs text-gray-500">Loading leaderboard...</p>
        </div>
      ) : (
        <div className="space-y-2">
          {leaderboard.map((entry) => (
            <div
              key={entry.tokenId.toString()}
              className="flex items-center justify-between p-3 bg-gray-50 border-2 border-black"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  entry.rank === 1 ? 'bg-yellow-400 text-yellow-900' :
                  entry.rank === 2 ? 'bg-gray-300 text-gray-700' :
                  entry.rank === 3 ? 'bg-orange-300 text-orange-900' :
                  'bg-gray-200 text-gray-600'
                }`}>
                  {entry.rank}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-800 truncate">
                    Rock #{entry.tokenId.toString()}
                  </div>
                  <div className="text-[10px] text-gray-500 truncate">
                    {formatAddress(entry.owner)}
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0 text-right">
                <div className="text-sm font-bold text-blue-600">
                  {entry.xp.toString()} XP
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {totalSupplyNum > 10 && (
        <p className="text-[10px] text-gray-400 text-center mt-4">
          Showing top 10 of {totalSupplyNum} rocks
        </p>
      )}
    </div>
  )
}

