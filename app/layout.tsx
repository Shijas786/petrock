import type { Metadata } from "next";
import { headers } from "next/headers";
import ContextProvider from "@/context";
import "./globals.css";

export const metadata: Metadata = {
  title: "Onchain Pet Rock",
  description: "Mint your own Pet Rock NFT and feed it every day for XP!",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🪨</text></svg>",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersObj = await headers();
  const cookies = headersObj.get("cookie");

  return (
    <html lang="en">
      <body className="antialiased">
        <ContextProvider cookies={cookies}>
          <div className="noise-overlay" />
          <main className="min-h-screen grid-bg">{children}</main>
        </ContextProvider>
      </body>
    </html>
  );
}
