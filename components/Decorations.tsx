"use client";

import React from "react";

/**
 * Ornamental Divider with Saffron Diamond/Star Accent
 */
export function OrnamentalDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-4 py-8 max-w-xl mx-auto opacity-70 ${className}`}>
      <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-border-accent to-saffron/40" />
      <div className="flex items-center gap-1.5 text-saffron">
        <span className="text-[10px] opacity-50">✦</span>
        <div className="w-2.5 h-2.5 rotate-45 border border-saffron bg-saffron/20 shadow-[0_0_8px_rgba(255,106,0,0.6)]" />
        <span className="text-[10px] opacity-50">✦</span>
      </div>
      <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-border-accent to-saffron/40" />
    </div>
  );
}

/**
 * Concentric Geometric Indian Mandala Motif (Pure SVG)
 */
export function MandalaMotif({ className = "", size = 300 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`pointer-events-none select-none ${className}`}
    >
      <circle cx="200" cy="200" r="180" stroke="currentColor" strokeWidth="0.75" strokeDasharray="4 4" opacity="0.3" />
      <circle cx="200" cy="200" r="150" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      <circle cx="200" cy="200" r="120" stroke="currentColor" strokeWidth="0.5" strokeDasharray="6 6" opacity="0.3" />
      <circle cx="200" cy="200" r="90" stroke="currentColor" strokeWidth="1.2" opacity="0.5" />
      <circle cx="200" cy="200" r="60" stroke="currentColor" strokeWidth="0.75" opacity="0.4" />
      <circle cx="200" cy="200" r="30" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
      <circle cx="200" cy="200" r="8" fill="currentColor" opacity="0.8" />

      {/* 8-Point Symmetry Petals / Star */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <g key={angle} transform={`rotate(${angle} 200 200)`}>
          <path
            d="M200 50 C215 100 215 150 200 170 C185 150 185 100 200 50 Z"
            stroke="currentColor"
            strokeWidth="0.75"
            fill="none"
            opacity="0.35"
          />
          <line x1="200" y1="20" x2="200" y2="50" stroke="currentColor" strokeWidth="1" opacity="0.5" />
          <circle cx="200" cy="20" r="3" fill="currentColor" opacity="0.7" />
        </g>
      ))}

      {/* 16 Radial Rays */}
      {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((angle) => (
        <line
          key={angle}
          x1="200"
          y1="110"
          x2="200"
          y2="170"
          transform={`rotate(${angle} 200 200)`}
          stroke="currentColor"
          strokeWidth="0.5"
          opacity="0.25"
        />
      ))}
    </svg>
  );
}

/**
 * Geometric Chakra / Sunburst Radiant Element (Pure SVG)
 */
export function ChakraGeometry({ className = "", size = 240 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`pointer-events-none select-none ${className}`}
    >
      <circle cx="100" cy="100" r="90" stroke="#FF6A00" strokeWidth="1" opacity="0.35" strokeDasharray="3 3" />
      <circle cx="100" cy="100" r="72" stroke="#FF8A1A" strokeWidth="0.75" opacity="0.4" />
      <circle cx="100" cy="100" r="48" stroke="#FF6A00" strokeWidth="1.25" opacity="0.6" />
      <circle cx="100" cy="100" r="24" stroke="#FFA047" strokeWidth="1" opacity="0.8" />
      <circle cx="100" cy="100" r="6" fill="#FF6A00" />

      {/* 24 Rays of Dynamic Energy */}
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i * 360) / 24;
        return (
          <line
            key={i}
            x1="100"
            y1="28"
            x2="100"
            y2="48"
            transform={`rotate(${angle} 100 100)`}
            stroke="#FF6A00"
            strokeWidth="1.2"
            opacity={i % 2 === 0 ? "0.7" : "0.35"}
          />
        );
      })}
    </svg>
  );
}

/**
 * Card Corner Ornaments
 */
export function CornerOrnament({ className = "" }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`pointer-events-none ${className}`}
    >
      <path d="M2 22V2H22" stroke="#FF8A1A" strokeWidth="1.5" strokeOpacity="0.4" />
      <circle cx="5" cy="5" r="1.5" fill="#FF6A00" />
    </svg>
  );
}

/**
 * Stylized Watermark Devanagari Typography in Background
 */
export function DevanagariWatermark({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  return (
    <span
      className={`absolute font-devanagari font-black select-none pointer-events-none uppercase tracking-tighter opacity-[0.03] text-saffron leading-none ${className}`}
      aria-hidden="true"
    >
      {text}
    </span>
  );
}
