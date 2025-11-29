"use client";

import sdk from "@farcaster/frame-sdk";
import type { Context } from "@farcaster/frame-core";

// Type for sign-in result
export interface SignInResult {
  signature: string;
  message: string;
  fid?: number;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
}

// Initialize the SDK and get context
export async function initializeFarcasterSdk(): Promise<Context.FrameContext | null> {
  try {
    const context = await sdk.context;
    
    // Call ready to hide splash screen
    sdk.actions.ready();
    
    return context;
  } catch (error) {
    console.log("Not running in Farcaster context:", error);
    return null;
  }
}

// Sign in with Farcaster
export async function signInWithFarcaster(): Promise<SignInResult | null> {
  try {
    // Generate a random nonce (minimum 8 alphanumeric characters)
    const nonce = generateNonce();
    
    const result = await sdk.actions.signIn({
      nonce,
      acceptAuthAddress: true, // Accept auth address for better UX
    });
    
    return {
      signature: result.signature,
      message: result.message,
    };
  } catch (error: any) {
    if (error?.name === "RejectedByUser") {
      console.log("User rejected sign-in request");
    } else {
      console.error("Sign-in error:", error);
    }
    return null;
  }
}

// Generate a random nonce
function generateNonce(length: number = 16): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Open a URL in Farcaster
export async function openUrl(url: string): Promise<void> {
  try {
    await sdk.actions.openUrl(url);
  } catch (error) {
    // Fallback to window.open for non-Farcaster context
    window.open(url, "_blank");
  }
}

// Add a frame (cast intent)
export async function addFrame(): Promise<void> {
  try {
    await sdk.actions.addFrame();
  } catch (error) {
    console.error("Failed to add frame:", error);
  }
}

// Close the frame
export function closeFrame(): void {
  try {
    sdk.actions.close();
  } catch (error) {
    console.error("Failed to close frame:", error);
  }
}

// Check if running inside Farcaster
export function isInFarcasterContext(): boolean {
  return typeof window !== "undefined" && window.parent !== window;
}

// Export the SDK for direct use
export { sdk };
