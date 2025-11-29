"use client"
import { useWriteContract, useWaitForTransactionReceipt, useAccount, useChainId, useSwitchChain } from 'wagmi'
import { petRockContractConfig } from '@/lib/contract'
import { useEffect, useMemo } from 'react'
import { base } from 'wagmi/chains'

export default function MintButton({ onMintSuccess }: { onMintSuccess: () => void }) {
    const { address, isConnected } = useAccount()
    const chainId = useChainId()
    const { switchChain } = useSwitchChain()
    const { data: hash, writeContract, isPending, error, reset } = useWriteContract()
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    })

    const isWrongNetwork = chainId !== base.id

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

    // Parse error for better UX
    const errorMessage = useMemo(() => {
        if (!error) return null
        
        // Log full error structure for debugging
        console.error('Mint error object:', error)
        console.error('Error type:', typeof error)
        console.error('Error keys:', Object.keys(error || {}))
        console.error('Error toString:', String(error))
        console.error('Error JSON:', JSON.stringify(error, null, 2))
        
        // Try multiple ways to extract message
        const msg = error?.message || error?.shortMessage || error?.details || String(error) || ''
        
        console.error('Extracted message:', msg)
        
        // If message is just the address, it's likely a contract call failure
        if (msg.includes('0x0AAA4F6ff0FCC295CEC4CB4ceA97d941B4535FCC') && msg.length < 50) {
            return 'Contract call failed. Check console for details.'
        }
        
        // User rejected
        if (msg.includes('User rejected') || msg.includes('user rejected')) {
            return 'Transaction cancelled'
        }
        // Insufficient funds
        if (msg.includes('insufficient funds') || msg.includes('Insufficient funds')) {
            return 'Insufficient ETH for gas'
        }
        // Contract execution error - extract the reason
        if (msg.includes('reverted')) {
            const match = msg.match(/reason:\s*(.+?)(?:\n|$)/i)
            return match ? match[1] : 'Transaction would fail'
        }
        // Connector/wallet not ready
        if (msg.includes('Connector not connected') || msg.includes('connector')) {
            return 'Wallet not connected'
        }
        // Generic fallback - show first meaningful line
        const firstLine = msg.split('\n')[0]
        if (firstLine.length > 60) {
            return firstLine.substring(0, 60) + '...'
        }
        return firstLine || 'Unknown error'
    }, [error])

    const handleMint = () => {
        // Clear previous error
        reset()
        
        // Validate wallet connection
        if (!isConnected) {
            console.error('Wallet not connected')
            return
        }
        
        if (!address) {
            console.error('No wallet address')
            return
        }
        
        playSound('click')
        
        console.log('Attempting to mint with config:', {
            contractAddress: petRockContractConfig.address,
            contractAddressLength: petRockContractConfig.address.length,
            functionName: 'mint',
            chainId,
            isConnected,
            userAddress: address
        })
        
        try {
            writeContract({
                ...petRockContractConfig,
                functionName: 'mint',
            })
        } catch (err) {
            console.error('Error in handleMint catch block:', err)
        }
    }

    const handleSwitchNetwork = () => {
        switchChain({ chainId: base.id })
    }

    // Show switch network button if on wrong chain
    if (isWrongNetwork && isConnected) {
        return (
            <div className="flex flex-col items-center gap-2">
                <button
                    onClick={handleSwitchNetwork}
                    className="bg-blue-500 hover:bg-blue-600 text-white text-lg py-6 px-10 pixel-borders transform active:scale-95 transition-transform"
                >
                    Switch to Base
                </button>
                <p className="text-orange-500 text-xs text-center">
                    Please switch to Base network
                </p>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center gap-2">
            <button
                disabled={isPending || isConfirming || !isConnected}
                onClick={handleMint}
                className="bg-green-500 hover:bg-green-600 text-white text-lg py-6 px-10 pixel-borders disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95 transition-transform"
            >
                {isPending ? 'Confirming...' : isConfirming ? 'Minting...' : 'Mint New Rock'}
            </button>
            {errorMessage && (
                <p className="text-red-500 text-xs text-center max-w-[250px]">
                    {errorMessage}
                </p>
            )}
        </div>
    )
}
