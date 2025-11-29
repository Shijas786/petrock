"use client"
import { useState, useEffect, useRef } from 'react'

export default function AudioPlayer() {
    const [isMuted, setIsMuted] = useState(true) // Start muted by default
    const [hasInteracted, setHasInteracted] = useState(false)
    const audioRef = useRef<HTMLAudioElement | null>(null)

    useEffect(() => {
        const handleInteraction = () => {
            if (!hasInteracted) {
                setHasInteracted(true)
                setIsMuted(false) // Unmute on first interaction
                // Try to play
                if (audioRef.current) {
                    audioRef.current.volume = 0.2
                    audioRef.current.play().catch(e => console.log("Audio play failed:", e))
                }
            }
        }

        window.addEventListener('click', handleInteraction)
        window.addEventListener('keydown', handleInteraction)
        window.addEventListener('touchstart', handleInteraction)

        return () => {
            window.removeEventListener('click', handleInteraction)
            window.removeEventListener('keydown', handleInteraction)
            window.removeEventListener('touchstart', handleInteraction)
        }
    }, [hasInteracted])

    useEffect(() => {
        if (audioRef.current) {
            if (isMuted) {
                audioRef.current.pause()
            } else {
                if (hasInteracted) {
                    audioRef.current.play().catch(e => console.log("Audio play failed:", e))
                }
            }
        }
    }, [isMuted, hasInteracted])

    const toggleMute = (e: React.MouseEvent) => {
        e.stopPropagation() // Prevent triggering the interaction handler again if clicking this button
        setIsMuted(!isMuted)
    }

    return (
        <>
            <audio
                ref={audioRef}
                src="/audio/bgm.wav"
                loop
                preload="auto"
            />
            <button
                onClick={toggleMute}
                className="fixed top-3 right-3 z-50 bg-white/80 backdrop-blur p-2 rounded-full shadow-md hover:scale-105 transition-transform pixel-borders"
                aria-label={isMuted ? "Unmute" : "Mute"}
            >
                <span className="text-xl leading-none block">
                    {isMuted ? "🔇" : "🔊"}
                </span>
            </button>
        </>
    )
}
