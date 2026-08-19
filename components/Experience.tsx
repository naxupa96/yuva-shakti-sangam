"use client";

import React from "react";
import { experiences } from "@/lib/data";
import { Gamepad2, Drama, MessageSquareText, Flag, Users, Sparkles, Check } from "lucide-react";
import { CornerOrnament, DevanagariWatermark, OrnamentalDivider } from "./Decorations";

const iconMap: Record<string, React.ReactNode> = {
  Gamepad2: <Gamepad2 className="w-6 h-6 text-[#E65100]" />,
  Drama: <Drama className="w-6 h-6 text-[#E65100]" />,
  MessageSquareText: <MessageSquareText className="w-6 h-6 text-[#E65100]" />,
  Flag: <Flag className="w-6 h-6 text-[#E65100]" />,
  Users: <Users className="w-6 h-6 text-[#E65100]" />,
};

export default function Experience() {
  return (
    <section id="experience" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#EAE0D0] bg-parchment-texture relative overflow-hidden border-b border-[#292524]/10">
      <DevanagariWatermark text="अनुभव" className="top-12 right-6 text-[12rem] sm:text-[20rem] text-[#292524]/5" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1C1917] text-[#FAF4EC] text-xs font-black uppercase tracking-widest shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#E65100]" />
            <span>5 ON-GROUND EXPERIENCES</span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-black uppercase text-[#1C1917] tracking-tight">
            WHAT AWAITS YOU
          </h2>

          <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
            From adrenaline-fueled indigenous games to powerful theatrical performances and open leadership dialogue.
          </p>
        </div>

        {/* 5 Experience Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experiences.map((exp, index) => {
            const isWide = index === 0 || index === 2;
            return (
              <div
                key={exp.title}
                className={`p-7 sm:p-8 rounded-3xl bg-[#F5EBE1] border border-[#292524]/15 hover:border-[#E65100]/60 transition-all duration-300 relative overflow-hidden shadow-parchment-card group flex flex-col justify-between ${
                  isWide ? "md:col-span-1" : ""
                }`}
              >
                <CornerOrnament className="absolute top-2 right-2 opacity-20 group-hover:opacity-60 text-[#E65100] transition-opacity" />

                <div>
                  {/* Top Bar: Icon + Badge */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-[#FAF4EC] border border-[#292524]/10 flex items-center justify-center shadow-sm">
                      {iconMap[exp.icon] || <Sparkles className="w-6 h-6 text-[#E65100]" />}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#E65100] px-3 py-1 rounded-full bg-[#FAF4EC] border border-[#E65100]/30">
                      {exp.badge}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-display font-black text-xl sm:text-2xl text-[#1C1917] uppercase tracking-tight mb-2">
                    {exp.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed mb-6">
                    {exp.description}
                  </p>
                </div>

                {/* Highlights List */}
                <div className="pt-4 border-t border-[#292524]/10 space-y-2">
                  {exp.highlights.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-[#1C1917] font-semibold">
                      <Check className="w-3.5 h-3.5 text-[#E65100] shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <OrnamentalDivider className="mt-14 opacity-30 text-[#E65100]" />
      </div>
    </section>
  );
}
