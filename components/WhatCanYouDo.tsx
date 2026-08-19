"use client";

import React, { useState } from "react";
import { actionDomains } from "@/lib/data";
import { Cpu, GraduationCap, Briefcase, Trees, HeartHandshake, Shield, ChevronDown, CheckCircle2, Sparkles } from "lucide-react";
import { CornerOrnament, DevanagariWatermark, OrnamentalDivider } from "./Decorations";

const domainIcons: Record<string, React.ReactNode> = {
  tech: <Cpu className="w-5 h-5 text-[#F05A12]" />,
  education: <GraduationCap className="w-5 h-5 text-[#F05A12]" />,
  entrepreneurship: <Briefcase className="w-5 h-5 text-[#F05A12]" />,
  seva: <HeartHandshake className="w-5 h-5 text-[#F05A12]" />,
  environment: <Trees className="w-5 h-5 text-[#F05A12]" />,
  leadership: <Shield className="w-5 h-5 text-[#F05A12]" />,
};

export default function WhatCanYouDo() {
  const [expandedId, setExpandedId] = useState<string | null>("tech");

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section id="what-can-you-do" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#E7CEA3] bg-parchment-texture relative overflow-hidden border-b border-[#17130E]/15">
      <DevanagariWatermark text="कर्म" className="top-10 left-4 text-[12rem] sm:text-[20rem] text-[#17130E]/5" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#17130E] text-[#FAF4EC] text-xs font-black uppercase tracking-widest shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#F05A12]" />
            <span>ACTION PATHWAYS</span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-black uppercase text-[#17130E] tracking-tight">
            WHAT CAN YOU DO <br />
            <span className="text-[#F05A12]">
              FOR BHARAT?
            </span>
          </h2>

          <p className="text-xs sm:text-sm text-[#5A4839] leading-relaxed">
            Nation-building is tangible work across six vital frontiers. Tap any domain to unlock concrete action pathways.
          </p>
        </div>

        {/* 6 Action Domains Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {actionDomains.map((domain) => {
            const isExpanded = expandedId === domain.id;
            return (
              <div
                key={domain.id}
                onClick={() => toggleExpand(domain.id)}
                className={`p-7 rounded-3xl border cursor-pointer transition-all duration-300 relative overflow-hidden flex flex-col justify-between shadow-parchment-card ${
                  isExpanded
                    ? "bg-[#F2DFBD] border-[#F05A12] ring-1 ring-[#F05A12]/40 shadow-bhagwa-sm"
                    : "bg-[#F2DFBD]/80 border-[#17130E]/15 hover:border-[#F05A12]/50 hover:bg-[#F2DFBD]"
                }`}
              >
                <CornerOrnament className="absolute top-2 right-2 opacity-20 text-[#F05A12]" />

                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-[#E7CEA3] border border-[#17130E]/10 flex items-center justify-center shadow-sm">
                      {domainIcons[domain.id] || <Sparkles className="w-5 h-5 text-[#F05A12]" />}
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-[#F05A12] px-3 py-1 rounded-full bg-[#E7CEA3] border border-[#F05A12]/30">
                      {domain.impactMetric}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-display font-black text-2xl text-[#17130E] uppercase tracking-tight mb-2">
                    {domain.title}
                  </h3>

                  {/* Tagline & Description */}
                  <p className="text-xs font-bold text-[#F05A12] mb-1">
                    {domain.tagline}
                  </p>
                  <p className="text-xs sm:text-sm text-[#5A4839] leading-relaxed mb-4">
                    {domain.description}
                  </p>
                </div>

                {/* Collapsible Expanded Details */}
                {isExpanded && (
                  <div className="pt-4 border-t border-[#17130E]/10 space-y-4 animate-in fade-in duration-200">
                    <div>
                      <span className="text-[10px] font-black text-[#F05A12] uppercase tracking-widest block mb-2">
                        HOW YOU CAN CONTRIBUTE
                      </span>
                      <ul className="space-y-2">
                        {domain.contributionPoints.map((item, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-xs text-[#17130E] font-medium">
                            <CheckCircle2 className="w-4 h-4 text-[#F05A12] shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-2">
                      <span className="text-[10px] font-bold text-[#5A4839] uppercase tracking-widest block mb-0.5">
                        CIVILIZATIONAL RELEVANCE
                      </span>
                      <p className="text-xs text-[#5A4839] italic">
                        {domain.civilizationalRelevance}
                      </p>
                    </div>
                  </div>
                )}

                {/* Toggle Prompt */}
                <div className="pt-4 mt-2 flex items-center justify-between text-xs font-bold text-[#5A4839]">
                  <span>{isExpanded ? "Collapse details" : "Tap to explore action plan"}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#F05A12] transition-transform duration-200 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  />
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
