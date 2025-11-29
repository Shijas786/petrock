"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import sdk from "@farcaster/frame-sdk";
import type { Context } from "@farcaster/frame-core";
import { useAccount, useConnect } from "wagmi";
import { farcasterFrame } from "@farcaster/frame-wagmi-connector";

interface FarcasterUser {
  fid: number;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
}

interface FarcasterContextType {
  context: Context.FrameContext | null;
  user: FarcasterUser | null;
  isInFrame: boolean;
  isLoading: boolean;
  isConnected: boolean;
  address: string | undefined;
  signIn: () => Promise<void>;
  connectWallet: () => Promise<void>;
  openUrl: (url: string) => Promise<void>;
  addFrame: () => Promise<void>;
  close: () => void;
}

const FarcasterContext = createContext<FarcasterContextType | null>(null);

export function FarcasterProvider({ children }: { children: ReactNode }) {
  const [context, setContext] = useState<Context.FrameContext | null>(null);
  const [user, setUser] = useState<FarcasterUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInFrame, setIsInFrame] = useState(false);
  
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();

  // Initialize SDK on mount
  useEffect(() => {
    const initSdk = async () => {
      try {
        setIsLoading(true);
        
        // Check if we're in a frame context
        const frameContext = await sdk.context;
        
        if (frameContext) {
          setContext(frameContext);
          setIsInFrame(true);
          
          // Extract user info from context
          if (frameContext.user) {
            setUser({
              fid: frameContext.user.fid,
              username: frameContext.user.username,
              displayName: frameContext.user.displayName,
              pfpUrl: frameContext.user.pfpUrl,
            });
          }
          
          // Signal that the app is ready
          sdk.actions.ready();
        }
      } catch (error) {
        console.log("Not in Farcaster frame context");
        setIsInFrame(false);
      } finally {
        setIsLoading(false);
      }
    };

    initSdk();
  }, []);

  // Sign in with Farcaster
  const signIn = useCallback(async () => {
    if (!isInFrame) {
      console.log("Not in Farcaster context, skipping sign-in");
      return;
    }
    
    try {
      const nonce = generateNonce();
      const result = await sdk.actions.signIn({
        nonce,
        acceptAuthAddress: true,
      });
      console.log("Sign-in successful:", result);
    } catch (error: any) {
      if (error?.name === "RejectedByUser") {
        console.log("User rejected sign-in");
      } else {
        console.error("Sign-in error:", error);
      }
    }
  }, [isInFrame]);

  // Connect wallet using Farcaster connector
  const connectWallet = useCallback(async () => {
    if (isInFrame) {
      // Use Farcaster frame connector
      try {
        const farcasterConnector = connectors.find(c => c.id === 'farcasterFrame');
        if (farcasterConnector) {
          connect({ connector: farcasterConnector });
        }
      } catch (error) {
        console.error("Failed to connect via Farcaster:", error);
      }
    }
  }, [isInFrame, connect, connectors]);

  // Open URL
  const openUrl = useCallback(async (url: string) => {
    if (isInFrame) {
      try {
        await sdk.actions.openUrl(url);
      } catch (error) {
        window.open(url, "_blank");
      }
    } else {
      window.open(url, "_blank");
    }
  }, [isInFrame]);

  // Add frame
  const addFrame = useCallback(async () => {
    if (isInFrame) {
      try {
        await sdk.actions.addFrame();
      } catch (error) {
        console.error("Failed to add frame:", error);
      }
    }
  }, [isInFrame]);

  // Close frame
  const close = useCallback(() => {
    if (isInFrame) {
      sdk.actions.close();
    }
  }, [isInFrame]);

  return (
    <FarcasterContext.Provider
      value={{
        context,
        user,
        isInFrame,
        isLoading,
        isConnected,
        address,
        signIn,
        connectWallet,
        openUrl,
        addFrame,
        close,
      }}
    >
      {children}
    </FarcasterContext.Provider>
  );
}

export function useFarcaster() {
  const context = useContext(FarcasterContext);
  if (!context) {
    throw new Error("useFarcaster must be used within a FarcasterProvider");
  }
  return context;
}

// Helper function to generate nonce
function generateNonce(length: number = 16): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
