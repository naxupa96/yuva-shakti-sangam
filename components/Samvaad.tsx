"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MessageSquare, ArrowUpRight, Flame, Sparkles } from "lucide-react";
import { LUMA_REGISTRATION_URL } from "@/lib/config";
import { CornerOrnament, DevanagariWatermark } from "./Decorations";

const discussionNodes = [
  "National Pride vs Global Ambition",
  "Technology Sovereignty & AI Era",
  "Social Harmony & Breaking Divides",
  "Role of Youth in National Governance",
  "Swadeshi & Modern Economy",
  "Cultural Roots for Gen-Z Bharat",
];

export default function Samvaad() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  return (
    <section id="samvaad" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#E7CEA3] bg-parchment-texture relative overflow-hidden border-b border-[#17130E]/15">
      <DevanagariWatermark text="संवाद" className="top-8 right-4 text-[12rem] sm:text-[20rem] text-[#17130E]/12 pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Bilingual Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#17130E] text-[#FAF4EC] text-xs font-black uppercase tracking-widest shadow-sm">
            <MessageSquare className="w-3.5 h-3.5 text-[#F05A12]" />
            <span>UNFILTERED YOUTH DIALOGUE</span>
          </div>

          <div className="space-y-1">
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-devanagari font-black text-[#17130E] leading-tight">
              प्रश्न आपके. <br className="sm:hidden" />
              <span className="text-[#F05A12]">
                संवाद हमारा.
              </span>
            </h2>

            <p className="text-base sm:text-xl font-display font-black text-[#5A4839] tracking-wider uppercase pt-1">
              YOUR QUESTIONS. OUR CONVERSATION.
            </p>
          </div>

          <p className="text-xs sm:text-sm text-[#5A4839] max-w-xl mx-auto leading-relaxed">
            No scripted speeches or formal hierarchies. An open forum for young minds to ask questions, challenge narratives, and discuss Bharat&apos;s real challenges.
          </p>
        </div>

        {/* Editorial Illustration & Theme Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12 items-center">
          {/* Discussion Artwork */}
          <div className="lg:col-span-6 relative rounded-2xl overflow-hidden border border-[#17130E]/20 shadow-parchment-card h-64 sm:h-80">
            <Image
              src="/images/samvaad-art.jpg"
              alt="Youth in open thoughtful dialogue"
              fill
              className="object-cover mix-blend-multiply"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#17130E]/80 via-transparent to-transparent flex items-end p-4">
              <span className="text-[#F2DFBD] text-xs font-black uppercase tracking-widest">
                Direct • Candid • Constructive
              </span>
            </div>
          </div>

          {/* Theme Nodes */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {discussionNodes.map((topic) => (
              <button
                key={topic}
                onClick={() => setSelectedTopic(selectedTopic === topic ? null : topic)}
                className={`p-3.5 rounded-xl border text-left text-xs font-bold transition-all duration-200 shadow-sm ${
                  selectedTopic === topic
                    ? "bg-[#F2DFBD] border-[#F05A12] text-[#F05A12] ring-1 ring-[#F05A12]"
                    : "bg-[#F2DFBD] border-[#17130E]/15 text-[#5A4839] hover:border-[#F05A12]/40 hover:text-[#17130E]"
                }`}
              >
                <div className="flex items-center gap-1.5 text-[#F05A12] mb-1 text-[10px] uppercase font-black">
                  <Flame className="w-3 h-3 fill-[#F05A12]" />
                  <span>THEME</span>
                </div>
                <p className="leading-snug text-[#17130E]">{topic}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Question Submission via Luma Banner */}
        <div className="p-8 sm:p-10 rounded-3xl bg-[#F2DFBD] border-2 border-[#17130E]/15 shadow-parchment-deep relative overflow-hidden">
          <CornerOrnament className="absolute top-3 left-3 text-[#F05A12]/40" />
          <CornerOrnament className="absolute top-3 right-3 text-[#F05A12]/40 -scale-x-100" />
          <CornerOrnament className="absolute bottom-3 left-3 text-[#F05A12]/40 -scale-y-100" />
          <CornerOrnament className="absolute bottom-3 right-3 text-[#F05A12]/40 -scale-100" />

          <div className="max-w-2xl mx-auto text-center space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#17130E] text-[#FAF4EC] text-[11px] font-black uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-[#FFA000]" />
              <span>SUBMIT VIA LUMA REGISTRATION</span>
            </div>

            <h3 className="text-2xl sm:text-4xl font-display font-black uppercase text-[#17130E] tracking-tight">
              HAVE A QUESTION FOR THE SAMVAAD?
            </h3>

            <p className="text-xs sm:text-sm text-[#5A4839] max-w-lg mx-auto leading-relaxed font-medium">
              You can submit your questions and topics directly in the Luma registration form before the event, or raise them live during the open-mic dialogue on 6 September.
            </p>

            <div className="pt-3">
              <a
                href={LUMA_REGISTRATION_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl btn-bhagwa-primary text-xs sm:text-sm font-black uppercase tracking-wider active:scale-95 transition-all shadow-bhagwa-sm"
              >
                <span>REGISTER &amp; SUBMIT QUESTION ON LUMA</span>
                <ArrowUpRight className="w-4 h-4 stroke-[3]" />
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
