"use client"
import { useWriteContract, useWaitForTransactionReceipt, useChainId, useSwitchChain } from 'wagmi'
import { petRockContractConfig } from '@/lib/contract'
import { useEffect, useMemo } from 'react'
import { base } from 'wagmi/chains'

export default function FeedButton({ tokenId, disabled, onFeedSuccess }: { tokenId: bigint, disabled: boolean, onFeedSuccess: () => void }) {
    const chainId = useChainId()
    const { switchChain } = useSwitchChain()
    const { data: hash, writeContract, isPending, error, reset } = useWriteContract()
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    })

    const isWrongNetwork = chainId !== base.id

    useEffect(() => {
        if (isSuccess) {
            onFeedSuccess()
        }
    }, [isSuccess, onFeedSuccess])

    // Parse error for better UX
    const errorMessage = useMemo(() => {
        if (!error) return null
        const msg = error.message || ''
        
        if (msg.includes('User rejected') || msg.includes('user rejected')) {
            return 'Cancelled'
        }
        if (msg.includes('insufficient funds')) {
            return 'Need ETH for gas'
        }
        if (msg.includes('Already fed recently')) {
            return 'Already fed today!'
        }
        if (msg.includes('reverted')) {
            return 'Feed failed'
        }
        return 'Error feeding'
    }, [error])

    const handleFeed = () => {
        reset()
        writeContract({
            ...petRockContractConfig,
            functionName: 'feed',
            args: [tokenId]
        })
    }

    if (isWrongNetwork) {
        return (
            <button
                onClick={() => switchChain({ chainId: base.id })}
                className="bg-blue-500 hover:bg-blue-600 text-white text-xs py-3 px-6 pixel-borders transform active:scale-95 transition-transform"
            >
                Switch to Base
            </button>
        )
    }

    return (
        <div className="flex flex-col items-center">
            <button
                disabled={disabled || isPending || isConfirming}
                onClick={handleFeed}
                className="bg-orange-500 hover:bg-orange-600 text-white text-xs py-3 px-6 pixel-borders disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95 transition-transform"
            >
                {isPending || isConfirming ? 'Eating...' : 'Feed Rock'}
            </button>
            {errorMessage && (
                <p className="text-red-500 text-[10px] text-center mt-1">
                    {errorMessage}
                </p>
            )}
        </div>
    )
}
