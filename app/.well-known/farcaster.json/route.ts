import { NextResponse } from 'next/server';

export async function GET() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://onchain-pet-rock.vercel.app';

  const manifest = {
    accountAssociation: {
      header: "eyJmaWQiOjEyMzQ1LCJ0eXBlIjoiY3VzdG9keSIsImtleSI6IjB4MDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMCJ9",
      payload: "eyJkb21haW4iOiJvbmNoYWluLXBldC1yb2NrLnZlcmNlbC5hcHAifQ",
      signature: "MHgwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAw"
    },
    frame: {
      version: "1",
      name: "Onchain Pet Rock",
      iconUrl: `${appUrl}/icon.png`,
      homeUrl: appUrl,
      imageUrl: `${appUrl}/og-image.png`,
      buttonTitle: "🪨 Open App",
      splashImageUrl: `${appUrl}/splash.png`,
      splashBackgroundColor: "#f8fafc",
      webhookUrl: `${appUrl}/api/webhook`
    }
  };

  return NextResponse.json(manifest);
}

