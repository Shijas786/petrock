"use client"
import { useAccount, useReadContract, useReadContracts } from 'wagmi'
import { petRockContractConfig } from '@/lib/contract'
import ConnectWalletButton from '@/components/ConnectWalletButton'
import MintButton from '@/components/MintButton'
import PetRockCard from '@/components/PetRockCard'
import { useState, useEffect } from 'react'

export default function Home() {
  const { address, isConnected } = useAccount()
  const [rocks, setRocks] = useState<any[]>([])

  // 1. Get Balance
  const { data: balance, refetch: refetchBalance } = useReadContract({
    ...petRockContractConfig,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address
    }
  })

  // 2. Prepare calls for token IDs
  const balanceNum = balance ? Number(balance) : 0
  const tokenIndexCalls = Array.from({ length: balanceNum }, (_, i) => ({
    ...petRockContractConfig,
    functionName: 'tokenOfOwnerByIndex',
    args: [address!, BigInt(i)]
  }))

  const { data: tokenIdsResult, refetch: refetchTokenIds } = useReadContracts({
    contracts: tokenIndexCalls,
    query: {
      enabled: balanceNum > 0 && !!address
    }
  })

  const tokenIds = tokenIdsResult?.map(r => r.result as bigint).filter(t => t !== undefined) || []

  // 3. Prepare calls for rock details
  const rockDetailsCalls = tokenIds.flatMap(id => [
    { ...petRockContractConfig, functionName: 'xp', args: [id] },
    { ...petRockContractConfig, functionName: 'lastFedAt', args: [id] },
    { ...petRockContractConfig, functionName: 'canFeed', args: [id] },
    { ...petRockContractConfig, functionName: 'timeUntilNextFeed', args: [id] }
  ])

  const { data: rockDetailsResult, refetch: refetchDetails } = useReadContracts({
    contracts: rockDetailsCalls,
    query: {
      enabled: tokenIds.length > 0
    }
  })

  // Process data
  useEffect(() => {
    if (!tokenIds.length || !rockDetailsResult) {
      if (balanceNum === 0) setRocks([])
      return
    }

    const newRocks = []
    for (let i = 0; i < tokenIds.length; i++) {
      const baseIdx = i * 4
      // Ensure we have results for all fields
      if (
        rockDetailsResult[baseIdx]?.status === 'success' &&
        rockDetailsResult[baseIdx + 1]?.status === 'success' &&
        rockDetailsResult[baseIdx + 2]?.status === 'success' &&
        rockDetailsResult[baseIdx + 3]?.status === 'success'
      ) {
        newRocks.push({
          id: tokenIds[i],
          xp: rockDetailsResult[baseIdx].result,
          lastFedAt: rockDetailsResult[baseIdx + 1].result,
          canFeed: rockDetailsResult[baseIdx + 2].result,
          timeUntilNextFeed: rockDetailsResult[baseIdx + 3].result
        })
      }
    }
    setRocks(newRocks)
  }, [tokenIdsResult, rockDetailsResult, balanceNum])

  const refresh = () => {
    refetchBalance()
    refetchTokenIds()
    refetchDetails()
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8 max-w-md mx-auto relative font-pixel">
      <header className="w-full text-center mb-8 mt-4">
        <h1 className="text-2xl md:text-3xl font-bold mb-2 text-blue-600 drop-shadow-sm leading-relaxed">
          Onchain<br />Pet Rock
        </h1>
        <p className="text-[10px] md:text-xs text-gray-600 uppercase tracking-widest">Mint • Feed • Grow</p>
      </header>

      {!isConnected ? (
        <div className="flex flex-col items-center gap-8 mt-10 w-full">
          <div className="text-8xl animate-bounce-slow filter drop-shadow-lg">🪨</div>
          <div className="bg-white p-6 pixel-borders w-full text-center">
            <p className="mb-4 text-xs leading-5">Connect your wallet to adopt a rock.</p>
            <ConnectWalletButton />
          </div>
        </div>
      ) : (
        <div className="w-full flex flex-col items-center gap-8">
          <div className="flex justify-between w-full items-center px-2 bg-white/50 p-2 rounded pixel-borders">
            <span className="text-[10px] font-bold text-gray-500">OWNER</span>
            <ConnectWalletButton />
          </div>

          <div className="w-full flex flex-col gap-6 items-center">
            {rocks.length > 0 ? (
              rocks.map((rock) => (
                <PetRockCard
                  key={rock.id.toString()}
                  tokenId={rock.id}
                  xp={rock.xp}
                  lastFedAt={rock.lastFedAt}
                  canFeed={rock.canFeed}
                  timeUntilNextFeed={rock.timeUntilNextFeed}
                  onUpdate={refresh}
                />
              ))
            ) : (
              <div className="text-center py-10 opacity-60">
                <p className="text-sm">No rocks found.</p>
                <p className="text-[10px] mt-2">Mint to generate your unique pet!</p>
              </div>
            )}

            <div className="mt-4 w-full flex justify-center">
              <MintButton onMintSuccess={refresh} />
            </div>
          </div>
        </div>
      )}

      <footer className="mt-auto py-8 text-[10px] text-gray-400 text-center">
        <p>built on Base 🔵</p>
      </footer>
    </main>
  )
}
