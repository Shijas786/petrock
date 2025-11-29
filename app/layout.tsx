import type { Metadata } from "next";
import "./globals.css";
import ContextProvider from '@/context/ContextProvider'
import { headers } from 'next/headers'

// App URL - update this when deploying
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://onchain-pet-rock.vercel.app';

export const metadata: Metadata = {
  title: "Onchain Pet Rock",
  description: "Mint and feed your pet rock onchain",
  icons: {
    icon: "/icon.svg",
  },
  // Farcaster Frame metadata
  other: {
    "fc:frame": "vNext",
    "fc:frame:image": `${APP_URL}/icon.png`,
    "fc:frame:image:aspect_ratio": "1:1",
    "fc:frame:button:1": "🪨 Open App",
    "fc:frame:button:1:action": "launch_frame",
    "fc:frame:button:1:target": APP_URL,
    // Mini App manifest
    "of:version": "vNext",
    "of:accepts:xmtp": "2024-02-01",
    "of:image": `${APP_URL}/icon.png`,
  },
  openGraph: {
    title: "Onchain Pet Rock",
    description: "Mint and feed your pet rock onchain. Built on Base.",
    images: [`${APP_URL}/og-image.png`],
  },
  twitter: {
    card: "summary_large_image",
    title: "Onchain Pet Rock",
    description: "Mint and feed your pet rock onchain. Built on Base.",
    images: [`${APP_URL}/og-image.png`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookies = headers().get('cookie')

  return (
    <html lang="en">
      <body className="antialiased bg-pastel-bg min-h-screen text-foreground">
        <ContextProvider cookies={cookies}>
          {children}
        </ContextProvider>
      </body>
    </html>
  );
}
