"use client";

import React from "react";
import { pillars } from "@/lib/data";
import { Brain, Network, Compass, Zap, Sparkles } from "lucide-react";
import { CornerOrnament, DevanagariWatermark, OrnamentalDivider } from "./Decorations";

const iconMap: Record<string, React.ReactNode> = {
  "01": <Brain className="w-6 h-6 text-[#E65100]" />,
  "02": <Network className="w-6 h-6 text-[#E65100]" />,
  "03": <Compass className="w-6 h-6 text-[#E65100]" />,
  "04": <Zap className="w-6 h-6 text-[#E65100]" />,
};

export default function WhyAttend() {
  return (
    <section id="why-attend" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#EAE0D0] bg-parchment-texture relative overflow-hidden border-b border-[#292524]/10">
      <DevanagariWatermark text="संस्कृति" className="top-10 left-4 text-[12rem] sm:text-[20rem] text-[#292524]/5" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1C1917] text-[#FAF4EC] text-xs font-black uppercase tracking-widest shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#E65100]" />
            <span>FOUR CORE DIMENSIONS</span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-black uppercase text-[#1C1917] tracking-tight">
            WHY ATTEND <br />
            <span className="text-[#E65100]">
              THE SANGAM?
            </span>
          </h2>

          <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
            Not a spectator conference. A four-dimensional immersion into intellect, culture, fraternity, and ground action.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="p-7 rounded-3xl bg-[#F5EBE1] border border-[#292524]/15 hover:border-[#E65100]/60 transition-all duration-300 relative overflow-hidden shadow-parchment-card group hover:-translate-y-1 flex flex-col justify-between"
            >
              <CornerOrnament className="absolute top-2 right-2 opacity-20 group-hover:opacity-60 text-[#E65100] transition-opacity" />

              <div>
                {/* Number & Icon */}
                <div className="flex items-center justify-between mb-6">
                  <span className="font-display font-black text-4xl text-[#E65100] leading-none">
                    {pillar.number}
                  </span>
                  <div className="w-12 h-12 rounded-2xl bg-[#FAF4EC] border border-[#292524]/10 flex items-center justify-center shadow-sm">
                    {iconMap[pillar.number]}
                  </div>
                </div>

                {/* Title & Tagline */}
                <div className="space-y-1 mb-3">
                  <h3 className="font-display font-black text-2xl text-[#1C1917] uppercase tracking-tight">
                    {pillar.title}
                  </h3>
                  <span className="text-xs font-bold text-[#E65100] block">
                    {pillar.tagline}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed mb-6">
                  {pillar.description}
                </p>
              </div>

              {/* Action Badge */}
              <div className="pt-4 border-t border-[#292524]/10">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#1C1917] px-3 py-1.5 rounded-lg bg-[#FAF4EC] border border-[#292524]/10 inline-block">
                  {pillar.action}
                </span>
              </div>
            </div>
          ))}
        </div>

        <OrnamentalDivider className="mt-14 opacity-30 text-[#E65100]" />
      </div>
    </section>
  );
}
