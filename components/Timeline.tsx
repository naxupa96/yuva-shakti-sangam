"use client";

import React from "react";
import { timelineMilestones } from "@/lib/data";
import { History, Flame } from "lucide-react";
import { CornerOrnament, DevanagariWatermark, OrnamentalDivider } from "./Decorations";

export default function Timeline() {
  return (
    <section id="timeline" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#EAE0D0] bg-parchment-texture relative overflow-hidden border-b border-[#292524]/10">
      <DevanagariWatermark text="इतिहास" className="bottom-10 left-4 text-[12rem] sm:text-[18rem] text-[#292524]/5" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1C1917] text-[#FAF4EC] text-xs font-black uppercase tracking-widest shadow-sm">
            <History className="w-3.5 h-3.5 text-[#E65100]" />
            <span>CENTURY OF SERVICE</span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-black uppercase text-[#1C1917] tracking-tight">
            MILESTONES OF SERVICE
          </h2>

          <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
            A continuum of grassroots discipline, humanitarian disaster response, and civic solidarity from 1925 to Present.
          </p>
        </div>

        {/* Vintage Orange Vertical Timeline */}
        <div className="relative border-l-2 border-[#E65100]/50 ml-4 sm:ml-36 md:ml-44 space-y-10 pl-6 sm:pl-10">
          {timelineMilestones.map((item) => (
            <div key={item.year} className="relative group">
              {/* Year Label */}
              <div className="sm:absolute sm:-left-44 md:-left-52 sm:top-1 sm:text-right mb-2 sm:mb-0">
                <span className="font-display font-black text-2xl sm:text-4xl text-[#E65100] tracking-tight block">
                  {item.year}
                </span>
                <span className="text-[10px] font-black text-[#57534E] uppercase tracking-widest">
                  {item.tag}
                </span>
              </div>

              {/* Timeline Marker Node */}
              <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-4 h-4 rounded-full bg-[#EAE0D0] border-2 border-[#E65100] group-hover:bg-[#E65100] group-hover:scale-125 transition-all shadow-bhagwa-sm" />

              {/* Milestone Card */}
              <div className="p-7 rounded-3xl bg-[#F5EBE1] border border-[#292524]/15 group-hover:border-[#E65100]/60 group-hover:bg-[#FAF4EC] transition-all shadow-parchment-card relative overflow-hidden">
                <CornerOrnament className="absolute top-2 right-2 opacity-20 text-[#E65100]" />

                <h3 className="font-display font-black text-lg sm:text-2xl text-[#1C1917] uppercase tracking-tight mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed mb-4">
                  {item.description}
                </p>
                <div className="pt-3 border-t border-[#292524]/10 text-xs text-[#E65100] font-medium italic">
                  Context: {item.context}
                </div>
              </div>
            </div>
          ))}
        </div>

        <OrnamentalDivider className="mt-14 opacity-30 text-[#E65100]" />
      </div>
    </section>
  );
}
