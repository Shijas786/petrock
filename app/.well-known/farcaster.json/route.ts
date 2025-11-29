import { NextResponse } from 'next/server';

export async function GET() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://onchain-pet-rock.vercel.app';

  // IMPORTANT: Replace the accountAssociation values with your signed values
  // Get these from Warpcast Developer Tools or Base's Sign Manifest Tool:
  // - Warpcast: Settings → Developer → Mini Apps
  // - Base Tool: https://docs.base.org/mini-apps/features/sign-manifest
  
  const manifest = {
    accountAssociation: {
      // TODO: Replace these placeholder values with your signed manifest data
      // These values link your Farcaster account to this domain
      // You can set these as environment variables on Vercel:
      // FARCASTER_HEADER, FARCASTER_PAYLOAD, FARCASTER_SIGNATURE
      header: process.env.FARCASTER_HEADER || "eyJmaWQiOjEyMzQ1LCJ0eXBlIjoiY3VzdG9keSIsImtleSI6IjB4MDAwMCJ9",
      payload: process.env.FARCASTER_PAYLOAD || "eyJkb21haW4iOiJleGFtcGxlLmNvbSJ9", 
      signature: process.env.FARCASTER_SIGNATURE || "MHgwMDAwMDAwMDAwMDAwMDAwMDAwMA"
    },
    frame: {
      version: "1",
      name: "Onchain Pet Rock",
      iconUrl: `${appUrl}/icon.svg`,
      homeUrl: appUrl,
      imageUrl: `${appUrl}/og-image.svg`,
      buttonTitle: "🪨 Open App",
      splashImageUrl: `${appUrl}/splash.svg`,
      splashBackgroundColor: "#f8fafc",
      webhookUrl: `${appUrl}/api/webhook`
    }
  };

  return NextResponse.json(manifest);
}
