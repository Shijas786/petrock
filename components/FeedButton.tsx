"use client"
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { petRockContractConfig } from '@/lib/contract'
import { useEffect } from 'react'

export default function FeedButton({ tokenId, disabled, onFeedSuccess }: { tokenId: bigint, disabled: boolean, onFeedSuccess: () => void }) {
    const { data: hash, writeContract, isPending, error } = useWriteContract()
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    })

    useEffect(() => {
        if (isSuccess) {
            onFeedSuccess()
        }
    }, [isSuccess, onFeedSuccess])

    return (
        <div className="flex flex-col items-center">
            <button
                disabled={disabled || isPending || isConfirming}
                onClick={() => writeContract({
                    ...petRockContractConfig,
                    functionName: 'feed',
                    args: [tokenId]
                })}
                className="bg-orange-500 hover:bg-orange-600 text-white text-xs py-3 px-6 pixel-borders disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95 transition-transform"
            >
                {isPending || isConfirming ? 'Eating...' : 'Feed Rock'}
            </button>
            {error && (
                <p className="text-red-500 text-[10px] text-center mt-1">
                    Error feeding
                </p>
            )}
        </div>
    )
}
