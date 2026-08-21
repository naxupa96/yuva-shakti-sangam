"use client";

import React, { useState } from "react";
import { timelineMilestones, disasterReliefIncidents } from "@/lib/data";
import { History, ShieldAlert, HeartHandshake, Plane, Waves, Activity, Train, Building2, CheckCircle2, ShieldCheck, MapPin } from "lucide-react";
import { CornerOrnament, DevanagariWatermark, OrnamentalDivider } from "./Decorations";

export default function Timeline() {
  const [viewMode, setViewMode] = useState<"all" | "disasters">("all");

  const getIncidentIcon = (category: string) => {
    switch (category) {
      case "Aviation":
        return <Plane className="w-5 h-5" />;
      case "Flood / Cyclone":
        return <Waves className="w-5 h-5" />;
      case "Epidemic / Health":
        return <Activity className="w-5 h-5" />;
      case "Railway":
        return <Train className="w-5 h-5" />;
      case "Earthquake":
        return <Building2 className="w-5 h-5" />;
      default:
        return <ShieldAlert className="w-5 h-5" />;
    }
  };

  return (
    <section id="timeline" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#E7CEA3] bg-parchment-texture relative overflow-hidden border-b border-[#17130E]/15">
      <DevanagariWatermark text="इतिहास" className="bottom-4 left-2 sm:left-4 text-[12rem] sm:text-[20rem] text-[#17130E]/14 pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#17130E] text-[#FAF4EC] text-xs font-black uppercase tracking-widest shadow-sm">
            <History className="w-3.5 h-3.5 text-[#F05A12]" />
            <span>CENTURY OF SERVICE (1925–2026)</span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-black uppercase text-[#17130E] tracking-tight">
            MILESTONES &amp; RELIEF WORK
          </h2>

          <p className="text-xs sm:text-sm text-[#5A4839] leading-relaxed">
            Documented historical record of voluntary civil response, humanitarian disaster operations, and civic solidarity from 1925 to Present.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-14">
          <button
            onClick={() => setViewMode("all")}
            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
              viewMode === "all"
                ? "bg-[#17130E] text-[#FAF4EC] shadow-md scale-105"
                : "bg-[#F2DFBD] text-[#5A4839] border border-[#17130E]/15 hover:border-[#F05A12]/50"
            }`}
          >
            <History className="w-4 h-4 text-[#F05A12]" />
            <span>Complete Timeline (1925–2026)</span>
          </button>

          <button
            onClick={() => setViewMode("disasters")}
            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
              viewMode === "disasters"
                ? "bg-[#F05A12] text-white shadow-bhagwa-sm scale-105"
                : "bg-[#F2DFBD] text-[#5A4839] border border-[#17130E]/15 hover:border-[#F05A12]/50"
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Major Disaster Relief Operations</span>
          </button>
        </div>

        {/* View Mode 1: Complete Chronological Timeline */}
        {viewMode === "all" && (
          <div className="relative border-l-2 border-[#F05A12]/50 ml-4 sm:ml-36 md:ml-44 space-y-10 pl-6 sm:pl-10">
            {timelineMilestones.map((item) => (
              <div key={`${item.year}-${item.headline}`} className="relative group">
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

                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-[#17130E]/10 text-[#5A4839]">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="font-display font-black text-lg sm:text-2xl text-[#17130E] uppercase tracking-tight mb-2">
                    {item.headline}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5A4839] leading-relaxed mb-4">
                    {item.description}
                  </p>
                  <div className="pt-3 border-t border-[#17130E]/10 text-xs text-[#F05A12] font-bold flex items-center gap-1.5">
                    <span>✦ Scale &amp; Documented Impact:</span>
                    <span className="text-[#17130E]">{item.scale}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View Mode 2: Factual Emergency & Disaster Relief Deep Dive */}
        {viewMode === "disasters" && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-[#17130E] text-[#FAF4EC] mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs font-black text-[#F05A12] uppercase tracking-widest block">
                  GROUND DISCIPLINE IN ACTION
                </span>
                <h3 className="text-xl sm:text-2xl font-display font-black uppercase text-[#FAF4EC]">
                  CIVIL EMERGENCY &amp; FIRST RESPONSES
                </h3>
                <p className="text-xs text-[#A8A29E] mt-1 max-w-2xl">
                  Strictly verified historical records of voluntary civilian mobilizations during national disasters, transport crashes, and public health emergencies.
                </p>
              </div>
              <div className="px-4 py-2 rounded-xl bg-[#F05A12]/20 border border-[#F05A12]/40 text-[#F05A12] text-xs font-black uppercase tracking-wider shrink-0">
                100% FACT-BASED
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {disasterReliefIncidents.map((incident) => (
                <div
                  key={incident.id}
                  className="p-7 sm:p-8 rounded-3xl bg-[#F2DFBD] border border-[#17130E]/15 hover:border-[#F05A12]/60 transition-all shadow-parchment-card relative overflow-hidden flex flex-col justify-between group"
                >
                  <CornerOrnament className="absolute top-2 right-2 opacity-20 text-[#F05A12]" />

                  <div>
                    {/* Header with Icon & Year */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#FAF4EC] border border-[#17130E]/10 flex items-center justify-center text-[#F05A12] shadow-sm shrink-0">
                        {getIncidentIcon(incident.category)}
                      </div>
                      <div className="text-right">
                        <span className="font-display font-black text-2xl text-[#F05A12] leading-none block">
                          {incident.year}
                        </span>
                        <span className="text-[10px] font-bold text-[#5A4839] uppercase tracking-wider block mt-1">
                          {incident.category}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#5A4839] mb-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#F05A12]" />
                      <span>{incident.location}</span>
                    </div>

                    <h3 className="font-display font-black text-xl sm:text-2xl text-[#17130E] uppercase tracking-tight mb-4">
                      {incident.title}
                    </h3>

                    {/* Factual Bullet Points */}
                    <div className="space-y-2.5 mb-6">
                      {incident.facts.map((fact, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2.5 text-xs text-[#5A4839] leading-relaxed">
                          <CheckCircle2 className="w-4 h-4 text-[#F05A12] shrink-0 mt-0.5" />
                          <span>{fact}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#17130E]/10 space-y-2">
                    <div className="text-[11px] text-[#17130E] font-bold">
                      <span className="text-[#F05A12]">Key Outcome:</span> {incident.impactSummary}
                    </div>
                    <div className="text-[10px] text-[#5A4839] italic">
                      Source: {incident.verifiedSource}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <OrnamentalDivider className="mt-14 opacity-30 text-[#F05A12]" />
      </div>
    </section>
  );
}
