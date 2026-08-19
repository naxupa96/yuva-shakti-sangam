"use client";

import React from "react";
import { timelineMilestones } from "@/lib/data";
import { History } from "lucide-react";
import { CornerOrnament, DevanagariWatermark, OrnamentalDivider } from "./Decorations";

export default function Timeline() {
  return (
    <section id="timeline" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#E7CEA3] bg-parchment-texture relative overflow-hidden border-b border-[#17130E]/15">
      <DevanagariWatermark text="इतिहास" className="bottom-10 left-4 text-[12rem] sm:text-[18rem] text-[#17130E]/5" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#17130E] text-[#FAF4EC] text-xs font-black uppercase tracking-widest shadow-sm">
            <History className="w-3.5 h-3.5 text-[#F05A12]" />
            <span>CENTURY OF SERVICE</span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-black uppercase text-[#17130E] tracking-tight">
            MILESTONES OF SERVICE
          </h2>

          <p className="text-xs sm:text-sm text-[#5A4839] leading-relaxed">
            A continuum of grassroots discipline, humanitarian disaster response, and civic solidarity from 1925 to Present.
          </p>
        </div>

        {/* Vintage Orange Vertical Timeline */}
        <div className="relative border-l-2 border-[#F05A12]/50 ml-4 sm:ml-36 md:ml-44 space-y-10 pl-6 sm:pl-10">
          {timelineMilestones.map((item) => (
            <div key={item.year} className="relative group">
              {/* Year Label */}
              <div className="sm:absolute sm:-left-44 md:-left-52 sm:top-1 sm:text-right mb-2 sm:mb-0">
                <span className="font-display font-black text-2xl sm:text-4xl text-[#F05A12] tracking-tight block">
                  {item.year}
                </span>
                <span className="text-[10px] font-black text-[#5A4839] uppercase tracking-widest">
                  {item.badge}
                </span>
              </div>

              {/* Timeline Marker Node */}
              <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-4 h-4 rounded-full bg-[#E7CEA3] border-2 border-[#F05A12] group-hover:bg-[#F05A12] group-hover:scale-125 transition-all shadow-bhagwa-sm" />

              {/* Milestone Card */}
              <div className="p-7 rounded-3xl bg-[#F2DFBD] border border-[#17130E]/15 group-hover:border-[#F05A12]/60 transition-all shadow-parchment-card relative overflow-hidden">
                <CornerOrnament className="absolute top-2 right-2 opacity-20 text-[#F05A12]" />

                <h3 className="font-display font-black text-lg sm:text-2xl text-[#17130E] uppercase tracking-tight mb-2">
                  {item.headline}
                </h3>
                <p className="text-xs sm:text-sm text-[#5A4839] leading-relaxed mb-4">
                  {item.description}
                </p>
                <div className="pt-3 border-t border-[#17130E]/10 text-xs text-[#F05A12] font-bold">
                  Scale & Impact: {item.scale}
                </div>
              </div>
            </div>
          ))}
        </div>

        <OrnamentalDivider className="mt-14 opacity-30 text-[#F05A12]" />
      </div>
    </section>
  );
}
