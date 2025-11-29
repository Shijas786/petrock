# 🪨 Onchain Pet Rock

A Web3 dApp where users mint Pet Rock NFTs and feed them daily for XP. Built with **Reown AppKit** for seamless wallet connections.

## Features

- **Mint Pet Rocks**: Each user can mint unique Pet Rock NFTs
- **Daily Feeding**: Feed your rocks once every 24 hours to gain XP
- **XP System**: Rocks level up with different personalities based on XP
- **Mobile-First UI**: Clean, pixel-art inspired design
- **No Backend**: All state stored on-chain
- **Reown AppKit**: One-click wallet auth, social logins, and more

## Tech Stack

- **Smart Contract**: Solidity 0.8.20 (ERC721)
- **Frontend**: Next.js 14 + TypeScript
- **Blockchain**: Base (or any EVM L2)
- **Web3**: Reown AppKit + Wagmi v2 + viem
- **Styling**: TailwindCSS

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Get a Reown Project ID

1. Go to [Reown Cloud](https://cloud.reown.com)
2. Sign in or create an account
3. Create a new project
4. Copy your Project ID

### 3. Deploy the Smart Contract

1. Open [Remix IDE](https://remix.ethereum.org/)
2. Create a new file and paste the contents of `contracts/PetRockNFT.sol`
3. Compile with Solidity 0.8.20
4. Deploy to Base Sepolia (or your preferred network)
5. Copy the deployed contract address

### 4. Configure Environment

Create a `.env.local` file in the root directory:

```env
# Reown Project ID (required for wallet connections)
# Get it from https://cloud.reown.com
NEXT_PUBLIC_PROJECT_ID=your_reown_project_id_here

# Your deployed contract address
NEXT_PUBLIC_PETROCK_CONTRACT_ADDRESS=0xYourContractAddressHere

# Chain ID (Base Mainnet = 8453, Base Sepolia = 84532)
NEXT_PUBLIC_CHAIN_ID=84532
```

### 5. Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Smart Contract

The `PetRockNFT` contract is a minimal ERC721 implementation with:

- **mint()**: Mint a new Pet Rock
- **feed(tokenId)**: Feed your rock (+10 XP, 24h cooldown)
- **xp(tokenId)**: View rock's XP
- **lastFedAt(tokenId)**: View last feeding timestamp
- **canFeed(tokenId)**: Check if feeding is available

## Rock Personalities

Based on XP level:
- **0-9 XP**: Sleepy 😴
- **10-29 XP**: Content 🙂
- **30-49 XP**: Happy 😊
- **50-69 XP**: Wise 🌟
- **70-99 XP**: Ancient ✨
- **100+ XP**: Legendary 👑

## Reown AppKit Features

This project uses [Reown AppKit](https://docs.reown.com/appkit/next/core/installation) for:

- One-click wallet connections
- Social logins (Google, X, GitHub, Discord, Farcaster)
- Email login
- Multiple wallet support
- Dark theme with pixel-art styling

## Project Structure

```
├── app/
│   ├── layout.tsx      # Root layout with AppKit provider
│   ├── page.tsx        # Main Pet Rock page
│   └── globals.css     # Pixel-art styling
├── components/
│   ├── ConnectWalletButton.tsx  # AppKit button
│   └── PetRockCard.tsx          # Rock display card
├── config/
│   └── index.tsx       # Wagmi adapter setup
├── context/
│   └── index.tsx       # AppKit context provider
├── lib/
│   └── contract.ts     # Contract ABI and address
├── contracts/
│   └── PetRockNFT.sol  # Smart contract
└── .cursor/rules/
    └── reown-appkit.mdc  # Cursor IDE rules for AppKit
```

## License

MIT
