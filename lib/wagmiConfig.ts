import { cookieStorage, createStorage, http } from 'wagmi'
import { base } from 'wagmi/chains'
import { Chain } from 'wagmi/chains'
import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { farcasterFrame } from '@farcaster/frame-wagmi-connector'

// Get projectId from https://cloud.reown.com
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || 'b56e18d47c72ab683b10814fe9495694' // Fallback for demo

if (!projectId) {
    throw new Error('Project ID is not defined')
}

export const networks = [base] as [Chain, ...Chain[]]

// Set up Wagmi Adapter with Farcaster connector
export const wagmiAdapter = new WagmiAdapter({
    storage: createStorage({
        storage: cookieStorage
    }),
    ssr: true,
    projectId,
    networks,
    connectors: [
        farcasterFrame(),
    ],
})

export const config = wagmiAdapter.wagmiConfig

// Create the modal
createAppKit({
    adapters: [wagmiAdapter as any],
    networks,
    projectId,
    metadata: {
        name: 'Onchain Pet Rock',
        description: 'Mint and feed your pet rock onchain',
        url: 'https://onchain-pet-rock.vercel.app',
        icons: ['https://avatars.githubusercontent.com/u/37784886']
    },
    features: {
        analytics: true,
    },
    themeMode: 'light',
})
