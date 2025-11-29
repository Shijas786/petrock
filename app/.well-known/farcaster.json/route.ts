import { NextResponse } from 'next/server';

export async function GET() {
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://onchain-pet-rock.vercel.app').trim();

  const manifest = {
    accountAssociation: {
      header: (process.env.FARCASTER_HEADER || "").trim(),
      payload: (process.env.FARCASTER_PAYLOAD || "").trim(),
      signature: (process.env.FARCASTER_SIGNATURE || "").trim()
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
