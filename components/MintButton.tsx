"use client"
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { petRockContractConfig } from '@/lib/contract'
import { useEffect } from 'react'

export default function MintButton({ onMintSuccess }: { onMintSuccess: () => void }) {
    const { data: hash, writeContract, isPending, error } = useWriteContract()
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    })

    const playSound = (type: 'click' | 'success') => {
        const audio = new Audio(`/audio/${type}.wav`)
        audio.volume = 0.4
        audio.play().catch(e => console.log("Audio play failed", e))
    }

    useEffect(() => {
        if (isSuccess) {
            playSound('success')
            onMintSuccess()
        }
    }, [isSuccess, onMintSuccess])

    return (
        <div className="flex flex-col items-center gap-2">
            <button
                disabled={isPending || isConfirming}
                onClick={() => {
                    playSound('click')
                    writeContract({
                        ...petRockContractConfig,
                        functionName: 'mint',
                    })
                }}
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
