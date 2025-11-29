# 🪨 Onchain Pet Rock

A Web3 dApp where users mint Pet Rock NFTs and feed them daily for XP. Built as a **Farcaster Mini App** with **Reown AppKit** for seamless wallet connections.

## Features

- **Mint Pet Rocks**: Each user can mint unique Pet Rock NFTs
- **Daily Feeding**: Feed your rocks once every 24 hours to gain XP
- **XP System**: Rocks level up with different personalities based on XP
- **Mobile-First UI**: Clean, pixel-art inspired design
- **No Backend**: All state stored on-chain
- **Farcaster Mini App**: Native Farcaster frame support with sign-in
- **Reown AppKit**: One-click wallet auth, social logins, and more

## Tech Stack

- **Smart Contract**: Solidity 0.8.20 (ERC721)
- **Frontend**: Next.js 14 + TypeScript
- **Blockchain**: Base
- **Web3**: Reown AppKit + Wagmi v2 + viem
- **Farcaster**: Frame SDK + Wagmi Connector
- **Styling**: TailwindCSS

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Get Required IDs

#### Reown Project ID
1. Go to [Reown Cloud](https://cloud.reown.com)
2. Sign in or create an account
3. Create a new project
4. Copy your Project ID

#### Farcaster Mini App (Optional)
1. Deploy your app to a public URL
2. Update the `.well-known/farcaster.json` manifest with your domain
3. Register as a Mini App in the Farcaster ecosystem

### 3. Deploy the Smart Contract

1. Open [Remix IDE](https://remix.ethereum.org/)
2. Create a new file and paste the contents of `contracts/PetRockNFT.sol`
3. Compile with Solidity 0.8.20
4. Deploy to Base (or your preferred network)
5. Copy the deployed contract address

### 4. Configure Environment

Create a `.env.local` file in the root directory:

```env
# Reown Project ID (required for wallet connections)
# Get it from https://cloud.reown.com
NEXT_PUBLIC_PROJECT_ID=your_reown_project_id_here

# Your deployed contract address
NEXT_PUBLIC_PETROCK_CONTRACT_ADDRESS=0xYourContractAddressHere

# App URL (for Farcaster frames)
NEXT_PUBLIC_APP_URL=https://your-app-url.vercel.app
```

### 5. Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Farcaster Mini App Integration

This app supports running as a Farcaster Mini App with:

### Features
- **Auto-connect**: Automatically connects wallet when running in Farcaster
- **User Context**: Access Farcaster user info (fid, username, pfp)
- **Sign-in with Farcaster**: SIWF authentication support
- **Frame Actions**: Open URLs, add frames, and more

### Setup for Farcaster

1. **Deploy to a public URL** (Vercel recommended)

2. **Update the manifest** at `/.well-known/farcaster.json`:
   - The route is auto-generated at `app/.well-known/farcaster.json/route.ts`
   - Update `NEXT_PUBLIC_APP_URL` in your environment

3. **Frame Metadata** is automatically included in the page head:
   ```html
   <meta name="fc:frame" content="vNext" />
   <meta name="fc:frame:image" content="https://your-app/og-image.png" />
   <meta name="fc:frame:button:1" content="🪨 Open App" />
   ```

### Testing in Farcaster
1. Share your app URL in a cast
2. The frame should render with your OG image
3. Click "Open App" to launch as a Mini App

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

## Project Structure

```
├── app/
│   ├── layout.tsx                    # Root layout with providers
│   ├── page.tsx                      # Main Pet Rock page
│   ├── globals.css                   # Pixel-art styling
│   └── .well-known/farcaster.json/   # Farcaster manifest route
├── components/
│   ├── ConnectWalletButton.tsx       # Wallet connection (Farcaster + AppKit)
│   ├── PetRockCard.tsx               # Rock display card
│   ├── MintButton.tsx                # Mint functionality
│   ├── FeedButton.tsx                # Feed functionality
│   └── AudioPlayer.tsx               # Background music
├── context/
│   ├── ContextProvider.tsx           # Main app provider
│   └── FarcasterProvider.tsx         # Farcaster SDK context
├── lib/
│   ├── wagmiConfig.ts                # Wagmi + Farcaster connector setup
│   ├── farcasterSdk.ts               # Farcaster SDK utilities
│   └── contract.ts                   # Contract ABI and address
├── contracts/
│   └── PetRockNFT.sol                # Smart contract
└── public/
    ├── og-image.svg                  # Open Graph / Frame image
    ├── icon.svg                      # App icon
    └── splash.svg                    # Splash screen
```

## Resources

- [Reown AppKit Docs](https://docs.reown.com/appkit/next/core/installation)
- [Farcaster Mini Apps Docs](https://miniapps.farcaster.xyz/docs)
- [Farcaster Sign-in](https://miniapps.farcaster.xyz/docs/sdk/actions/sign-in)
- [Frame SDK GitHub](https://github.com/farcasterxyz/frame-sdk)

## License

MIT
