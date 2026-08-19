"use client";

import React from "react";
import { CornerOrnament, DevanagariWatermark, OrnamentalDivider } from "./Decorations";
import { Flame } from "lucide-react";

export default function BigIdea() {
  return (
    <section id="big-idea" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#EAE0D0] bg-parchment-texture relative overflow-hidden border-b border-[#292524]/10">
      <DevanagariWatermark text="संकल्प" className="top-8 right-4 text-[12rem] sm:text-[20rem] text-[#292524]/5" />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="p-8 sm:p-14 rounded-3xl bg-[#F5EBE1] border-2 border-[#292524]/15 shadow-parchment-deep relative overflow-hidden">
          <CornerOrnament className="absolute top-3 left-3 text-[#E65100]/40" />
          <CornerOrnament className="absolute top-3 right-3 text-[#E65100]/40 -scale-x-100" />
          <CornerOrnament className="absolute bottom-3 left-3 text-[#E65100]/40 -scale-y-100" />
          <CornerOrnament className="absolute bottom-3 right-3 text-[#E65100]/40 -scale-100" />

          <div className="text-center space-y-6 max-w-3xl mx-auto">
            {/* Overline Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1C1917] text-[#FAF4EC] text-xs font-black uppercase tracking-widest shadow-sm">
              <Flame className="w-3.5 h-3.5 text-[#E65100]" />
              <span>THE CORE CONVICTION</span>
            </div>

            {/* Giant Editorial Punchy Statement */}
            <div className="space-y-2">
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-black uppercase tracking-tight text-[#1C1917] leading-[1.05]">
                INDIA DOESN&apos;T JUST NEED <br />
                <span className="text-[#E65100]">
                  YOUNG PEOPLE.
                </span>
              </h2>

              <OrnamentalDivider className="my-4 opacity-40 text-[#E65100]" />

              <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-black uppercase tracking-tight text-[#1C1917] leading-[1.05]">
                INDIA NEEDS YOUNG PEOPLE <br />
                <span className="text-[#E65100] italic">
                  WHO CARE.
                </span>
              </h2>
            </div>

            {/* Narrative Paragraphs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 text-left text-xs sm:text-sm text-[#57534E] leading-relaxed border-t border-[#292524]/10">
              <p>
                With 600+ million youth under 25, India holds the greatest demographic dividend on planet Earth. But numbers alone do not build greatness—purpose, civic responsibility, and character do.
              </p>
              <p>
                <strong className="text-[#1C1917]">Yuva Shakti Sangam</strong> is designed as a catalyst to connect your intellect, physical vigor, and creative potential with the collective civilizational mission of Bharat.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
