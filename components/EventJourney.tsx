"use client";

import React from "react";
import { journeySteps } from "@/lib/data";
import { Footprints, Clock, Sparkles } from "lucide-react";
import { CornerOrnament, DevanagariWatermark, OrnamentalDivider } from "./Decorations";

export default function EventJourney() {
  return (
    <section id="journey" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#E7CEA3] bg-parchment-texture relative overflow-hidden border-b border-[#17130E]/15">
      <DevanagariWatermark text="यात्रा" className="top-10 right-4 text-[12rem] sm:text-[20rem] text-[#17130E]/5" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#17130E] text-[#FAF4EC] text-xs font-black uppercase tracking-widest shadow-sm">
            <Footprints className="w-3.5 h-3.5 text-[#F05A12]" />
            <span>THE 4-HOUR PROGRESSION</span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-black uppercase text-[#17130E] tracking-tight">
            THE SANGAM JOURNEY
          </h2>

          <p className="text-xs sm:text-sm text-[#5A4839] leading-relaxed">
            Seven structured phases from arrival check-in to the collective Sangam Sankalp.
          </p>
        </div>

        {/* 7-Step Progress Timeline */}
        <div className="relative border-l-2 border-[#F05A12]/50 ml-4 sm:ml-32 md:ml-40 space-y-8 pl-6 sm:pl-10">
          {journeySteps.map((step) => (
            <div key={step.stepNumber} className="relative group">
              {/* Step & Time */}
              <div className="sm:absolute sm:-left-40 md:-left-48 sm:top-1 sm:text-right mb-2 sm:mb-0">
                <span className="font-display font-black text-xl sm:text-2xl text-[#F05A12] tracking-tight block">
                  STEP {step.stepNumber}
                </span>
                <span className="text-[11px] font-bold text-[#5A4839] flex items-center sm:justify-end gap-1.5">
                  <Clock className="w-3 h-3 text-[#F05A12]" />
                  {step.time}
                </span>
              </div>

              {/* Marker Node */}
              <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-4 h-4 rounded-full bg-[#E7CEA3] border-2 border-[#F05A12] group-hover:bg-[#F05A12] group-hover:scale-125 transition-all shadow-bhagwa-sm" />

              {/* Step Card */}
              <div className="p-6 rounded-3xl bg-[#F2DFBD] border border-[#17130E]/15 group-hover:border-[#F05A12]/60 transition-all shadow-parchment-card relative overflow-hidden">
                <CornerOrnament className="absolute top-2 right-2 opacity-20 text-[#F05A12]" />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <h3 className="font-display font-black text-xl sm:text-2xl text-[#17130E] uppercase tracking-tight">
                    {step.title}
                  </h3>
                  <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase text-[#F05A12] px-2.5 py-0.5 rounded-lg bg-[#E7CEA3] border border-[#F05A12]/30 w-fit">
                    <Sparkles className="w-3 h-3 text-[#FFA000]" />
                    {step.vibe}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#5A4839] leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <OrnamentalDivider className="mt-14 opacity-30 text-[#F05A12]" />
      </div>
    </section>
  );
}
