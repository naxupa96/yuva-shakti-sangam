"use client";

import React from "react";
import { experiences } from "@/lib/data";
import { Gamepad2, Drama, MessageSquareText, Flag, Users, Sparkles, Check, Theater, Hammer, HeartHandshake } from "lucide-react";
import { CornerOrnament, DevanagariWatermark, OrnamentalDivider } from "./Decorations";

const iconMap: Record<string, React.ReactNode> = {
  Gamepad2: <Gamepad2 className="w-6 h-6 text-[#F05A12]" />,
  Theater: <Theater className="w-6 h-6 text-[#F05A12]" />,
  Drama: <Drama className="w-6 h-6 text-[#F05A12]" />,
  MessageSquare: <MessageSquareText className="w-6 h-6 text-[#F05A12]" />,
  Hammer: <Hammer className="w-6 h-6 text-[#F05A12]" />,
  HeartHandshake: <HeartHandshake className="w-6 h-6 text-[#F05A12]" />,
  Flag: <Flag className="w-6 h-6 text-[#F05A12]" />,
  Users: <Users className="w-6 h-6 text-[#F05A12]" />,
};

export default function Experience() {
  return (
    <section id="experience" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#E7CEA3] bg-parchment-texture relative overflow-hidden border-b border-[#17130E]/15">
      <DevanagariWatermark text="अनुभव" className="top-12 right-6 text-[12rem] sm:text-[20rem] text-[#17130E]/5" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#17130E] text-[#FAF4EC] text-xs font-black uppercase tracking-widest shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#F05A12]" />
            <span>5 ON-GROUND EXPERIENCES</span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-black uppercase text-[#17130E] tracking-tight">
            WHAT AWAITS YOU
          </h2>

          <p className="text-xs sm:text-sm text-[#5A4839] leading-relaxed">
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
                className={`p-7 sm:p-8 rounded-3xl bg-[#F2DFBD] border border-[#17130E]/15 hover:border-[#F05A12]/60 transition-all duration-300 relative overflow-hidden shadow-parchment-card group flex flex-col justify-between ${
                  isWide ? "md:col-span-1" : ""
                }`}
              >
                <CornerOrnament className="absolute top-2 right-2 opacity-20 group-hover:opacity-60 text-[#F05A12] transition-opacity" />

                <div>
                  {/* Top Bar: Icon + Devanagari Title */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-[#E7CEA3] border border-[#17130E]/10 flex items-center justify-center shadow-sm">
                      {iconMap[exp.icon] || <Sparkles className="w-6 h-6 text-[#F05A12]" />}
                    </div>
                    <span className="text-xs font-devanagari font-black text-[#F05A12] px-3 py-1 rounded-full bg-[#E7CEA3] border border-[#F05A12]/30">
                      {exp.titleHindi}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-display font-black text-xl sm:text-2xl text-[#17130E] uppercase tracking-tight mb-2">
                    {exp.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-[#5A4839] leading-relaxed mb-6">
                    {exp.description}
                  </p>
                </div>

                {/* Highlights List */}
                <div className="pt-4 border-t border-[#17130E]/10 space-y-2">
                  {exp.highlights.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-[#17130E] font-semibold">
                      <Check className="w-3.5 h-3.5 text-[#F05A12] shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <OrnamentalDivider className="mt-14 opacity-30 text-[#F05A12]" />
      </div>
    </section>
  );
}
