"use client";

import React, { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, Play, Pause, Music } from "lucide-react";

export default function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);

  useEffect(() => {
    const audio = new Audio("/music1.m4a");
    audio.loop = true;
    audio.preload = "auto";
    audioRef.current = audio;

    // Attempt autoplay immediately
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          setHasInteracted(true);
        })
        .catch(() => {
          // Autoplay blocked by browser policy; wait for first user gesture
          setIsPlaying(false);

          const startAudioOnGesture = () => {
            if (audioRef.current && !hasInteracted) {
              audioRef.current
                .play()
                .then(() => {
                  setIsPlaying(true);
                  setHasInteracted(true);
                })
                .catch((e) => {
                  console.warn("Audio play prevented:", e);
                });
            }
            // Cleanup listeners
            cleanupListeners();
          };

          const cleanupListeners = () => {
            window.removeEventListener("click", startAudioOnGesture);
            window.removeEventListener("touchstart", startAudioOnGesture);
            window.removeEventListener("keydown", startAudioOnGesture);
          };

          window.addEventListener("click", startAudioOnGesture, { once: true });
          window.addEventListener("touchstart", startAudioOnGesture, { once: true });
          window.addEventListener("keydown", startAudioOnGesture, { once: true });
        });
    }

    // Auto-dismiss initial tooltip after 7 seconds
    const tooltipTimer = setTimeout(() => {
      setShowTooltip(false);
    }, 7000);

    return () => {
      clearTimeout(tooltipTimer);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setHasInteracted(true);
          setShowTooltip(false);
        })
        .catch((err) => console.warn("Audio error:", err));
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <aside aria-label="Audio controls" className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40 flex items-center gap-2 select-none print:hidden">
      {/* Floating Prompt / Badge */}
      {showTooltip && (
        <div
          onClick={togglePlay}
          className="cursor-pointer hidden sm:flex items-center gap-2 bg-[#17130E]/95 text-[#F2DFBD] border border-[#F05A12]/40 px-3.5 py-2 rounded-full text-xs font-semibold shadow-xl backdrop-blur-md animate-bounce hover:border-[#F05A12] transition-all"
        >
          <Music className="w-3.5 h-3.5 text-[#F05A12] animate-pulse" />
          <span>{isPlaying ? "Theme Playing" : "Tap to Play Sangam Theme 🎵"}</span>
        </div>
      )}

      {/* Main Music Control Button */}
      <div className="relative group">
        <button
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause background music" : "Play background music"}
          className={`relative flex items-center gap-2 px-3.5 py-2.5 rounded-full backdrop-blur-lg border transition-all duration-300 shadow-2xl ${
            isPlaying
              ? "bg-[#17130E]/90 border-[#F05A12]/60 text-[#F2DFBD] shadow-[#F05A12]/20 hover:scale-105"
              : "bg-[#17130E]/90 border-[#E7CEA3]/30 text-[#A89886] hover:text-[#F2DFBD] hover:border-[#F05A12]/60 hover:scale-105"
          }`}
        >
          {/* Animated Equalizer Wave Bars (when playing) */}
          <div className="flex items-end gap-0.5 h-4 w-4 justify-center">
            {isPlaying ? (
              <>
                <span className="w-1 bg-[#F05A12] rounded-full animate-[equalizer_0.8s_ease-in-out_infinite_alternate]" style={{ height: "60%" }} />
                <span className="w-1 bg-[#F05A12] rounded-full animate-[equalizer_1.1s_ease-in-out_infinite_alternate_0.2s]" style={{ height: "100%" }} />
                <span className="w-1 bg-[#F05A12] rounded-full animate-[equalizer_0.7s_ease-in-out_infinite_alternate_0.4s]" style={{ height: "40%" }} />
              </>
            ) : (
              <Music className="w-4 h-4 text-[#A89886] group-hover:text-[#F05A12] transition-colors" />
            )}
          </div>

          {/* Label on Desktop */}
          <span className="hidden md:inline text-xs font-black uppercase tracking-wider text-inherit">
            {isPlaying ? "Sangam Audio" : "Play Audio"}
          </span>

          {/* Action Icon */}
          <div className="w-6 h-6 rounded-full bg-[#F05A12]/15 flex items-center justify-center text-[#F05A12]">
            {isPlaying ? (
              <Pause className="w-3 h-3 fill-current" />
            ) : (
              <Play className="w-3 h-3 fill-current ml-0.5" />
            )}
          </div>
        </button>

        {/* Quick Mute Action button (appears on hover when playing) */}
        {isPlaying && (
          <button
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute audio" : "Mute audio"}
            className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-[#17130E] border border-[#F05A12]/50 text-[#F05A12] flex items-center justify-center hover:bg-[#F05A12] hover:text-black transition-colors shadow-md"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
          </button>
        )}
      </div>
    </aside>
  );
}
