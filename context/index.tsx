"use client";

import React, { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, cookieToInitialState, type Config } from "wagmi";
import { createAppKit } from "@reown/appkit/react";
import { config, networks, projectId, wagmiAdapter } from "@/config";
import { baseSepolia, base } from "@reown/appkit/networks";

const queryClient = new QueryClient();

// TODO: Set NEXT_PUBLIC_CHAIN_ID in your .env.local file
const chainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID || "84532");
const isMainnet = chainId === 8453;
const defaultNetwork = isMainnet ? base : baseSepolia;

const metadata = {
  name: "Onchain Pet Rock",
  description: "Mint your own Pet Rock NFT and feed it every day for XP!",
  url: typeof window !== "undefined" ? window.location.origin : "https://petrock.app",
  icons: ["https://avatars.githubusercontent.com/u/179229932"],
};

// Initialize AppKit outside the component render cycle
if (projectId) {
  createAppKit({
    adapters: [wagmiAdapter] as any,
    projectId,
    networks,
    defaultNetwork,
    metadata,
    features: {
      analytics: true,
      email: true,
      socials: ["google", "x", "github", "discord", "farcaster"],
      emailShowWallets: true,
    },
    themeMode: "dark",
    themeVariables: {
      "--w3m-color-mix": "#4ade80",
      "--w3m-color-mix-strength": 20,
      "--w3m-accent": "#4ade80",
      "--w3m-border-radius-master": "2px",
    },
  });
}

export default function ContextProvider({
  children,
  cookies,
}: {
  children: ReactNode;
  cookies: string | null;
}) {
  const initialState = cookieToInitialState(config as Config, cookies);

  return (
    <WagmiProvider config={config as Config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
