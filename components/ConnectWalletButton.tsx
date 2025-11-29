"use client"

import { useAppKit } from '@reown/appkit/react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { useEffect, useState, useCallback } from 'react'
import { useFarcaster } from '@/context/FarcasterProvider'
import { farcasterFrame } from '@farcaster/frame-wagmi-connector'

export default function ConnectWalletButton() {
  const { open } = useAppKit()
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const { isInFrame, user, isLoading: farcasterLoading } = useFarcaster()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Auto-connect in Farcaster frame context
  useEffect(() => {
    if (mounted && isInFrame && !isConnected && !farcasterLoading) {
      // Find the Farcaster connector
      const farcasterConnector = connectors.find(c => c.id === 'farcasterFrame')
      if (farcasterConnector) {
        connect({ connector: farcasterConnector })
      }
    }
  }, [mounted, isInFrame, isConnected, farcasterLoading, connectors, connect])

  const handleConnect = useCallback(() => {
    if (isInFrame) {
      // Use Farcaster connector in frame context
      const farcasterConnector = connectors.find(c => c.id === 'farcasterFrame')
      if (farcasterConnector) {
        connect({ connector: farcasterConnector })
      }
    } else {
      // Use AppKit modal for regular web context
      open()
    }
  }, [isInFrame, connectors, connect, open])

  const handleDisconnect = useCallback(() => {
    disconnect()
  }, [disconnect])

  if (!mounted) return null

  // Show Farcaster user info if connected in frame
  if (isConnected && isInFrame && user) {
    return (
      <button
        onClick={handleDisconnect}
        className="bg-purple-500 hover:bg-purple-600 text-white text-sm py-4 px-6 pixel-borders transform active:scale-95 transition-transform flex items-center gap-2"
      >
        {user.pfpUrl && (
          <img 
            src={user.pfpUrl} 
            alt={user.displayName || user.username || 'User'} 
            className="w-6 h-6 rounded-full"
          />
        )}
        <span>
          {user.displayName || user.username || `${address?.slice(0, 6)}...${address?.slice(-4)}`}
        </span>
      </button>
    )
  }

  // Regular connected state
  if (isConnected) {
    return (
      <button
        onClick={handleDisconnect}
        className="bg-blue-500 hover:bg-blue-600 text-white text-sm py-4 px-6 pixel-borders transform active:scale-95 transition-transform"
      >
        {address?.slice(0, 6)}...{address?.slice(-4)}
      </button>
    )
  }

  // Disconnected state
  return (
    <button
      onClick={handleConnect}
      className="bg-blue-500 hover:bg-blue-600 text-white text-sm py-4 px-6 pixel-borders transform active:scale-95 transition-transform"
    >
      {isInFrame ? '🟣 Connect via Farcaster' : 'Connect Wallet'}
    </button>
  )
}
