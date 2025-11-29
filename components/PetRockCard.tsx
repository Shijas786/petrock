"use client";

import { useState, useEffect } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { petRockContractConfig } from "@/lib/contract";

interface PetRockCardProps {
  tokenId: bigint;
  xp: bigint;
  lastFedAt: bigint;
  onFeedSuccess: () => void;
}

// Rock personality based on XP level
const getRockPersonality = (xp: number) => {
  if (xp >= 100) return { mood: "Legendary", emoji: "👑", color: "from-yellow-400 to-amber-500" };
  if (xp >= 70) return { mood: "Ancient", emoji: "✨", color: "from-purple-400 to-pink-500" };
  if (xp >= 50) return { mood: "Wise", emoji: "🌟", color: "from-blue-400 to-cyan-500" };
  if (xp >= 30) return { mood: "Happy", emoji: "😊", color: "from-green-400 to-emerald-500" };
  if (xp >= 10) return { mood: "Content", emoji: "🙂", color: "from-rock-400 to-rock-500" };
  return { mood: "Sleepy", emoji: "😴", color: "from-rock-500 to-rock-600" };
};

// Format time remaining
const formatTimeRemaining = (seconds: number): string => {
  if (seconds <= 0) return "Ready to feed!";
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m remaining`;
  }
  return `${minutes}m remaining`;
};

// Format last fed time
const formatLastFed = (timestamp: number): string => {
  if (timestamp === 0) return "Never fed";
  
  const now = Math.floor(Date.now() / 1000);
  const diff = now - timestamp;
  
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

export function PetRockCard({ tokenId, xp, lastFedAt, onFeedSuccess }: PetRockCardProps) {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showSparkle, setShowSparkle] = useState(false);

  const xpNumber = Number(xp);
  const lastFedTimestamp = Number(lastFedAt);
  const personality = getRockPersonality(xpNumber);
  
  // Calculate cooldown
  const COOLDOWN = 24 * 60 * 60; // 24 hours in seconds
  const nextFeedTime = lastFedTimestamp + COOLDOWN;
  const canFeed = Math.floor(Date.now() / 1000) >= nextFeedTime;

  // Update time remaining every second
  useEffect(() => {
    const updateTimer = () => {
      const now = Math.floor(Date.now() / 1000);
      const remaining = Math.max(0, nextFeedTime - now);
      setTimeRemaining(remaining);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [nextFeedTime]);

  // Feed transaction
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // Handle successful feed
  useEffect(() => {
    if (isSuccess) {
      setShowSparkle(true);
      setTimeout(() => setShowSparkle(false), 600);
      onFeedSuccess();
    }
  }, [isSuccess, onFeedSuccess]);

  const handleFeed = () => {
    writeContract({
      ...petRockContractConfig,
      functionName: "feed",
      args: [tokenId],
    });
  };

  // XP progress (max at 100 for visual purposes)
  const xpProgress = Math.min(xpNumber, 100);

  return (
    <div className="relative bg-rock-900/80 backdrop-blur-sm rounded-xl border border-rock-700 p-6 shadow-pixel transition-all duration-300 hover:shadow-pixel-lg hover:border-rock-600">
      {/* Sparkle effect */}
      {showSparkle && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-4xl sparkle">✨</span>
        </div>
      )}

      {/* Rock Display */}
      <div className="flex flex-col items-center mb-4">
        <div className={`
          relative w-24 h-24 
          bg-gradient-to-br ${personality.color}
          rounded-full
          flex items-center justify-center
          shadow-lg
          rock-idle
          mb-3
        `}>
          {/* Rock face */}
          <div className="text-4xl pixel-art select-none">🪨</div>
          
          {/* Personality indicator */}
          <div className="absolute -top-1 -right-1 text-xl">
            {personality.emoji}
          </div>
        </div>

        {/* Rock name and mood */}
        <h3 className="font-pixel text-sm text-rock-100 mb-1">
          Rock #{tokenId.toString()}
        </h3>
        <span className={`text-xs font-mono bg-gradient-to-r ${personality.color} bg-clip-text text-transparent font-bold`}>
          {personality.mood}
        </span>
      </div>

      {/* XP Section */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-mono text-rock-400 uppercase tracking-wider">XP</span>
          <span className="font-mono text-pixel-gold font-bold">{xpNumber}</span>
        </div>
        
        {/* XP Progress Bar */}
        <div className="h-3 bg-rock-800 rounded-full overflow-hidden border border-rock-700">
          <div 
            className={`h-full bg-gradient-to-r ${personality.color} xp-bar-fill transition-all duration-500`}
            style={{ width: `${xpProgress}%` }}
          />
        </div>
        
        {/* Level indicator */}
        <div className="flex justify-between mt-1">
          <span className="text-[10px] font-mono text-rock-500">0</span>
          <span className="text-[10px] font-mono text-rock-500">100+</span>
        </div>
      </div>

      {/* Last Fed Info */}
      <div className="text-center mb-4 py-2 bg-rock-800/50 rounded-lg">
        <span className="text-xs font-mono text-rock-400">
          Last fed: {formatLastFed(lastFedTimestamp)}
        </span>
        {!canFeed && (
          <div className="text-xs font-mono text-rock-500 mt-1">
            {formatTimeRemaining(timeRemaining)}
          </div>
        )}
      </div>

      {/* Feed Button */}
      <button
        onClick={handleFeed}
        disabled={!canFeed || isPending || isConfirming}
        className={`
          w-full py-3 px-4
          rounded-lg
          font-mono font-bold text-sm
          transition-all duration-200
          btn-press
          flex items-center justify-center gap-2
          ${canFeed && !isPending && !isConfirming
            ? "bg-gradient-to-r from-pixel-green to-emerald-500 text-black shadow-pixel hover:shadow-pixel-lg"
            : "bg-rock-800 text-rock-500 cursor-not-allowed border border-rock-700"
          }
        `}
      >
        {isPending || isConfirming ? (
          <>
            <span className="spinner" />
            {isPending ? "Confirming..." : "Feeding..."}
          </>
        ) : canFeed ? (
          <>
            <span>🍃</span>
            Feed Rock
          </>
        ) : (
          <>
            <span>💤</span>
            Resting
          </>
        )}
      </button>

      {/* Error message */}
      {error && (
        <div className="mt-3 p-2 bg-red-900/30 border border-red-800 rounded-lg">
          <p className="text-xs font-mono text-red-400 text-center">
            {error.message.includes("Already fed") 
              ? "This rock was already fed recently!" 
              : "Transaction failed. Try again."}
          </p>
        </div>
      )}
    </div>
  );
}

