"use client";

import React from "react";
import { Heart, Shield, Compass, Award, UserCheck, Flame } from "lucide-react";
import { CornerOrnament, DevanagariWatermark, OrnamentalDivider } from "./Decorations";

const swayamsevakTraits = [
  {
    icon: <Heart className="w-6 h-6 text-[#E65100]" />,
    title: "Selfless Volunteerism (सेवा)",
    desc: "Dedicated personal time, energy, and domain skills to community without expecting personal fame, financial return, or political office."
  },
  {
    icon: <Shield className="w-6 h-6 text-[#E65100]" />,
    title: "Daily Self-Discipline (संयम)",
    desc: "Cultivating physical stamina, mental clarity, punctuality, and moral integrity as an everyday lifestyle."
  },
  {
    icon: <Compass className="w-6 h-6 text-[#E65100]" />,
    title: "Social Harmony (समरसता)",
    desc: "Eliminating social divides of caste, region, and class in daily conduct to treat every citizen with equal dignity and brotherhood."
  },
  {
    icon: <Award className="w-6 h-6 text-[#E65100]" />,
    title: "Nation Before Self (राष्ट्र प्रथम)",
    desc: "Aligning individual career ambitions with the collective self-reliance, security, and honor of Bharat."
  }
];

export default function Swayamsevak() {
  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#EAE0D0] bg-parchment-texture relative overflow-hidden border-b border-[#292524]/10">
      <DevanagariWatermark text="स्वयंसेवक" className="top-10 right-4 text-[10rem] sm:text-[18rem] text-[#292524]/5" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1C1917] text-[#FAF4EC] text-xs font-black uppercase tracking-widest shadow-sm">
            <UserCheck className="w-3.5 h-3.5 text-[#E65100]" />
            <span>THE VOLUNTEER ETHOS</span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-black uppercase text-[#1C1917] tracking-tight">
            WHAT IS A <br />
            <span className="text-[#E65100]">
              SWAYAMSEVAK?
            </span>
          </h2>

          <p className="text-sm sm:text-base text-[#57534E] leading-relaxed">
            <strong className="text-[#1C1917] font-bold">Swayam-Sevak</strong> translates to self-motivated volunteer. It is not an official designation—it is a conscious personal pledge to serve society.
          </p>
        </div>

        {/* 4 Core Character Traits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          {swayamsevakTraits.map((trait) => (
            <div
              key={trait.title}
              className="p-7 sm:p-8 rounded-3xl bg-[#F5EBE1] border border-[#292524]/15 hover:border-[#E65100]/60 transition-all duration-300 relative overflow-hidden shadow-parchment-card hover:-translate-y-1 group"
            >
              <CornerOrnament className="absolute top-2 right-2 opacity-20 group-hover:opacity-60 text-[#E65100] transition-opacity" />
              <div className="w-14 h-14 rounded-2xl bg-[#FAF4EC] border border-[#292524]/10 flex items-center justify-center mb-5 shadow-sm">
                {trait.icon}
              </div>
              <h3 className="font-display font-black text-xl text-[#1C1917] uppercase tracking-tight mb-2">
                {trait.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
                {trait.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Memorial Quote Panel */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[#F5EBE1] border-2 border-[#292524]/15 text-center relative overflow-hidden shadow-parchment-deep">
          <CornerOrnament className="absolute top-3 left-3 text-[#E65100]/40" />
          <CornerOrnament className="absolute top-3 right-3 text-[#E65100]/40 -scale-x-100" />
          <CornerOrnament className="absolute bottom-3 left-3 text-[#E65100]/40 -scale-y-100" />
          <CornerOrnament className="absolute bottom-3 right-3 text-[#E65100]/40 -scale-100" />

          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <Flame className="w-8 h-8 text-[#E65100] fill-[#E65100]/30 mx-auto" />
            <p className="text-xl sm:text-3xl font-display font-black uppercase tracking-tight text-[#1C1917] leading-tight">
              &ldquo;Work silently. Build character. Serve unconditionally.&rdquo;
            </p>
            <p className="text-sm font-devanagari text-[#E65100] font-bold tracking-wide">
              स्वयंसेवकों का जीवन केवल चर्चाओं के लिए नहीं, अपितु समाज को संगठित और समर्थ बनाने के लिए है।
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
