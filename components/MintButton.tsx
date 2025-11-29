"use client"
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { petRockContractConfig } from '@/lib/contract'
import { useEffect } from 'react'

export default function MintButton({ onMintSuccess }: { onMintSuccess: () => void }) {
    const { data: hash, writeContract, isPending, error } = useWriteContract()
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    })

    useEffect(() => {
        if (isSuccess) {
            onMintSuccess()
        }
    }, [isSuccess, onMintSuccess])

    return (
        <div className="flex flex-col items-center gap-2">
            <button
                disabled={isPending || isConfirming}
                onClick={() => writeContract({
                    ...petRockContractConfig,
                    functionName: 'mint',
                })}
                className="bg-green-500 hover:bg-green-600 text-white text-lg py-6 px-10 pixel-borders disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95 transition-transform"
            >
                {isPending ? 'Confirming...' : isConfirming ? 'Minting...' : 'Mint New Rock'}
            </button>
            {error && (
                <p className="text-red-500 text-xs text-center max-w-[200px]">
                    {error.message.split('\n')[0]}
                </p>
            )}
        </div>
    )
}
