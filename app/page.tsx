"use client";

import { useAccount, useReadContract, useReadContracts, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { ConnectWalletButton } from "@/components/ConnectWalletButton";
import { PetRockCard } from "@/components/PetRockCard";
import { petRockContractConfig, PETROCK_CONTRACT_ADDRESS } from "@/lib/contract";
import { useEffect, useState, useCallback } from "react";

export default function Home() {
  const { address, isConnected } = useAccount();
  const [refreshKey, setRefreshKey] = useState(0);

  // Force refresh function
  const refreshData = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  // Get user's balance
  const { data: balance, refetch: refetchBalance } = useReadContract({
    ...petRockContractConfig,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Get total supply
  const { data: totalSupply } = useReadContract({
    ...petRockContractConfig,
    functionName: "totalSupply",
  });

  // Build array of token queries
  const tokenCount = balance ? Number(balance) : 0;
  const tokenIndexes = Array.from({ length: tokenCount }, (_, i) => i);

  // Get all token IDs owned by user
  const { data: tokenIds, refetch: refetchTokenIds } = useReadContracts({
    contracts: tokenIndexes.map((index) => ({
      ...petRockContractConfig,
      functionName: "tokenOfOwnerByIndex" as const,
      args: [address!, BigInt(index)] as const,
    })),
    query: {
      enabled: !!address && tokenCount > 0,
    },
  });

  // Extract valid token IDs
  const validTokenIds = tokenIds
    ?.filter((result) => result.status === "success")
    .map((result) => result.result as bigint) || [];

  // Get XP and lastFedAt for each token
  const { data: tokenData, refetch: refetchTokenData } = useReadContracts({
    contracts: validTokenIds.flatMap((tokenId) => [
      {
        ...petRockContractConfig,
        functionName: "xp" as const,
        args: [tokenId] as const,
      },
      {
        ...petRockContractConfig,
        functionName: "lastFedAt" as const,
        args: [tokenId] as const,
      },
    ]),
    query: {
      enabled: validTokenIds.length > 0,
    },
  });

  // Parse token data
  const rocks = validTokenIds.map((tokenId, index) => {
    const xpResult = tokenData?.[index * 2];
    const lastFedResult = tokenData?.[index * 2 + 1];

    return {
      tokenId,
      xp: xpResult?.status === "success" ? (xpResult.result as bigint) : BigInt(0),
      lastFedAt: lastFedResult?.status === "success" ? (lastFedResult.result as bigint) : BigInt(0),
    };
  });

  // Mint transaction
  const { writeContract, data: mintHash, isPending: isMinting, error: mintError } = useWriteContract();

  const { isLoading: isMintConfirming, isSuccess: isMintSuccess } = useWaitForTransactionReceipt({
    hash: mintHash,
  });

  // Refresh data after successful mint
  useEffect(() => {
    if (isMintSuccess) {
      const timer = setTimeout(() => {
        refetchBalance();
        refetchTokenIds();
        refetchTokenData();
        refreshData();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isMintSuccess, refetchBalance, refetchTokenIds, refetchTokenData, refreshData]);

  const handleMint = () => {
    writeContract({
      ...petRockContractConfig,
      functionName: "mint",
    });
  };

  const handleFeedSuccess = useCallback(() => {
    setTimeout(() => {
      refetchTokenData();
    }, 2000);
  }, [refetchTokenData]);

  // Check if contract is configured
  const isContractConfigured = PETROCK_CONTRACT_ADDRESS !== "0x0000000000000000000000000000000000000000";

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <header className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-rock-600 to-rock-800 rounded-full mb-4 shadow-pixel animate-float">
            <span className="text-4xl pixel-art">🪨</span>
          </div>
          
          <h1 className="font-pixel text-2xl sm:text-3xl gradient-text mb-3">
            Onchain Pet Rock
          </h1>
          
          <p className="text-rock-400 font-mono text-sm max-w-md mx-auto leading-relaxed">
            Mint your own rock and feed it every day for XP. The more you care, the more it grows.
          </p>

          {/* Stats */}
          {totalSupply !== undefined && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-rock-900/50 rounded-full border border-rock-700">
              <span className="text-rock-400 font-mono text-xs">Total Rocks:</span>
              <span className="text-pixel-gold font-mono font-bold">{totalSupply.toString()}</span>
            </div>
          )}
        </header>

        {/* Contract Warning */}
        {!isContractConfigured && (
          <div className="mb-6 p-4 bg-amber-900/30 border border-amber-700 rounded-xl">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <h3 className="font-mono font-bold text-amber-400 mb-1">Contract Not Configured</h3>
                <p className="text-amber-300/80 text-sm font-mono">
                  Please deploy the PetRockNFT contract and set NEXT_PUBLIC_PETROCK_CONTRACT_ADDRESS in your .env.local file.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Connect Section */}
        <div className="flex justify-center mb-8">
          <ConnectWalletButton />
        </div>

        {/* Main Content */}
        {!isConnected ? (
          <div className="text-center py-12 px-6 bg-rock-900/50 rounded-xl border border-rock-800">
            <div className="text-5xl mb-4 animate-bounce-slow">🔗</div>
            <h2 className="font-pixel text-sm text-rock-300 mb-2">Connect Your Wallet</h2>
            <p className="text-rock-500 font-mono text-sm">
              Connect your wallet to see your rocks and mint new ones.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Mint Section */}
            <div className="bg-rock-900/50 rounded-xl border border-rock-800 p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h2 className="font-pixel text-xs text-rock-300 mb-1">Your Collection</h2>
                  <p className="text-rock-500 font-mono text-sm">
                    {tokenCount === 0
                      ? "You don't have any rocks yet!"
                      : `You own ${tokenCount} rock${tokenCount > 1 ? "s" : ""}`}
                  </p>
                </div>
                
                <button
                  onClick={handleMint}
                  disabled={isMinting || isMintConfirming || !isContractConfigured}
                  className="
                    px-6 py-3
                    bg-gradient-to-r from-pixel-pink to-rose-500
                    text-white font-bold
                    rounded-lg
                    shadow-pixel
                    hover:shadow-pixel-lg
                    transition-all duration-200
                    btn-press
                    font-mono text-sm
                    disabled:opacity-50 disabled:cursor-not-allowed
                    flex items-center gap-2
                    w-full sm:w-auto justify-center
                  "
                >
                  {isMinting || isMintConfirming ? (
                    <>
                      <span className="spinner" />
                      {isMinting ? "Confirming..." : "Minting..."}
                    </>
                  ) : (
                    <>
                      <span>⛏️</span>
                      Mint Pet Rock
                    </>
                  )}
                </button>
              </div>

              {/* Mint Error */}
              {mintError && (
                <div className="mt-4 p-3 bg-red-900/30 border border-red-800 rounded-lg">
                  <p className="text-xs font-mono text-red-400 text-center">
                    Failed to mint. Please try again.
                  </p>
                </div>
              )}

              {/* Mint Success */}
              {isMintSuccess && (
                <div className="mt-4 p-3 bg-green-900/30 border border-green-800 rounded-lg">
                  <p className="text-xs font-mono text-green-400 text-center">
                    🎉 Successfully minted your new Pet Rock!
                  </p>
                </div>
              )}
            </div>

            {/* Rocks Grid */}
            {rocks.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" key={refreshKey}>
                {rocks.map((rock) => (
                  <PetRockCard
                    key={rock.tokenId.toString()}
                    tokenId={rock.tokenId}
                    xp={rock.xp}
                    lastFedAt={rock.lastFedAt}
                    onFeedSuccess={handleFeedSuccess}
                  />
                ))}
              </div>
            )}

            {/* Empty State */}
            {isConnected && rocks.length === 0 && !isMinting && !isMintConfirming && (
              <div className="text-center py-8">
                <div className="text-4xl mb-3 opacity-50">🪨</div>
                <p className="text-rock-500 font-mono text-sm">
                  Mint your first rock to get started!
                </p>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 text-center">
          <p className="text-rock-600 font-mono text-xs">
            Built with 💚 on Base
          </p>
        </footer>
      </div>
    </div>
  );
}

