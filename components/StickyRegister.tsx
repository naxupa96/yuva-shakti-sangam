"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function StickyRegister() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky bar after user scrolls down past the hero (e.g. 400px)
      if (window.scrollY > 400) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden p-3 bg-background/95 backdrop-blur-lg border-t border-border-subtle shadow-2xl animate-in slide-in-from-bottom-3 duration-200">
      <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
        <div className="flex flex-col truncate pr-1">
          <span className="font-display font-black text-xs text-text-primary tracking-wider uppercase truncate">
            Yuva Shakti Sangam
          </span>
          <span className="text-[10px] text-text-muted font-medium">
            6 Sept 2026 • ₹50 Entry Pass
          </span>
        </div>

        <Link
          href="/register"
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-saffron text-black font-display font-black text-xs shrink-0 active:scale-95 transition-all shadow-[0_0_15px_rgba(255,106,0,0.4)]"
        >
          <span>REGISTER (₹50)</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
