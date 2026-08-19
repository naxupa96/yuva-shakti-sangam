"use client";

import React, { useState } from "react";
import { actionDomains } from "@/lib/data";
import { Code, GraduationCap, Building2, Trees, HeartHandshake, Award, ChevronDown, CheckCircle2, Sparkles } from "lucide-react";
import { CornerOrnament, DevanagariWatermark, OrnamentalDivider } from "./Decorations";

const domainIcons: Record<string, React.ReactNode> = {
  tech: <Code className="w-5 h-5 text-[#E65100]" />,
  edu: <GraduationCap className="w-5 h-5 text-[#E65100]" />,
  biz: <Building2 className="w-5 h-5 text-[#E65100]" />,
  env: <Trees className="w-5 h-5 text-[#E65100]" />,
  seva: <HeartHandshake className="w-5 h-5 text-[#E65100]" />,
  lead: <Award className="w-5 h-5 text-[#E65100]" />,
};

export default function WhatCanYouDo() {
  const [expandedId, setExpandedId] = useState<string | null>("tech");

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section id="what-can-you-do" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#EAE0D0] bg-parchment-texture relative overflow-hidden border-b border-[#292524]/10">
      <DevanagariWatermark text="कर्म" className="top-10 left-4 text-[12rem] sm:text-[20rem] text-[#292524]/5" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1C1917] text-[#FAF4EC] text-xs font-black uppercase tracking-widest shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#E65100]" />
            <span>ACTION PATHWAYS</span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-black uppercase text-[#1C1917] tracking-tight">
            WHAT CAN YOU DO <br />
            <span className="text-[#E65100]">
              FOR BHARAT?
            </span>
          </h2>

          <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
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
                    ? "bg-[#FAF4EC] border-[#E65100] ring-1 ring-[#E65100]/40 shadow-bhagwa-sm"
                    : "bg-[#F5EBE1] border-[#292524]/15 hover:border-[#E65100]/50 hover:bg-[#FAF4EC]"
                }`}
              >
                <CornerOrnament className="absolute top-2 right-2 opacity-20 text-[#E65100]" />

                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-[#EAE0D0] border border-[#292524]/10 flex items-center justify-center shadow-sm">
                      {domainIcons[domain.id]}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-devanagari font-bold text-[#57534E] px-2.5 py-1 rounded-lg bg-[#EAE0D0] border border-[#292524]/10">
                        {domain.hindiWord}
                      </span>
                      <span className="text-xs font-black uppercase tracking-wider text-[#E65100] px-3 py-1 rounded-full bg-[#E65100]/10 border border-[#E65100]/30">
                        {domain.actionWord}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-display font-black text-2xl text-[#1C1917] uppercase tracking-tight mb-2">
                    {domain.title}
                  </h3>

                  {/* Short Description */}
                  <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed mb-4">
                    {domain.shortDesc}
                  </p>
                </div>

                {/* Collapsible Expanded Details */}
                {isExpanded && (
                  <div className="pt-4 border-t border-[#292524]/10 space-y-4 animate-in fade-in duration-200">
                    <div>
                      <span className="text-[10px] font-black text-[#E65100] uppercase tracking-widest block mb-2">
                        HOW YOU CAN CONTRIBUTE
                      </span>
                      <ul className="space-y-2">
                        {domain.expandedDetails.howToContribute.map((item, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-xs text-[#1C1917] font-medium">
                            <CheckCircle2 className="w-4 h-4 text-[#E65100] shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-2">
                      <span className="text-[10px] font-bold text-[#57534E] uppercase tracking-widest block mb-0.5">
                        CIVILIZATIONAL IMPACT
                      </span>
                      <p className="text-xs text-[#57534E] italic">
                        {domain.expandedDetails.impact}
                      </p>
                    </div>
                  </div>
                )}

                {/* Toggle Prompt */}
                <div className="pt-4 mt-2 flex items-center justify-between text-xs font-bold text-[#57534E]">
                  <span>{isExpanded ? "Collapse details" : "Tap to explore action plan"}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#E65100] transition-transform duration-200 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  />
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
