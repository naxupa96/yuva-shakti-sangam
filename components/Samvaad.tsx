"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MessageSquare, ArrowRight, Flame, Sparkles } from "lucide-react";
import { CornerOrnament, DevanagariWatermark } from "./Decorations";

interface SamvaadTopic {
  id: string;
  gujarati: string;
  english: string;
  description: string;
}

const discussionNodes: SamvaadTopic[] = [
  {
    id: "01",
    gujarati: "યુવા અને સેવા",
    english: "Youth & Social Service (Seva)",
    description: "Grassroots service, empathy, and organized community upliftment.",
  },
  {
    id: "02",
    gujarati: "યુવા અને પર્યાવરણ",
    english: "Youth & Environment",
    description: "Ecological responsibility, water conservation, and sustainable lifestyles.",
  },
  {
    id: "03",
    gujarati: "યુવા અને સ્વદેશી",
    english: "Youth & Swadeshi (Self-Reliance)",
    description: "Indigenous innovation, local enterprise, and Atmanirbhar Bharat.",
  },
  {
    id: "04",
    gujarati: "વૈચારિક યુદ્ધ અને સોશિયલ મીડિયા: યુવાની ભૂમિકા",
    english: "Ideological Warfare & Social Media: Role of Youth",
    description: "Countering misinformation and establishing truthful cultural discourse.",
  },
  {
    id: "05",
    gujarati: "RSS અને યુવા",
    english: "RSS & The Youth",
    description: "Centenary vision, discipline, and nation-building in the modern era.",
  },
];

export default function Samvaad() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  return (
    <section id="samvaad" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#E7CEA3] bg-parchment-texture relative overflow-hidden border-b border-[#17130E]/15">
      <DevanagariWatermark text="संवाद" className="top-8 right-4 text-[12rem] sm:text-[20rem] text-[#17130E]/5 pointer-events-none" />

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
          <div className="lg:col-span-5 relative rounded-2xl overflow-hidden border border-[#17130E]/20 shadow-parchment-card h-72 sm:h-96">
            <Image
              src="/images/samvaad-art.jpg"
              alt="Youth in open thoughtful dialogue"
              fill
              className="object-cover mix-blend-multiply"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#17130E]/90 via-[#17130E]/30 to-transparent flex flex-col justify-end p-5 text-white">
              <span className="text-[#FFA000] text-[10px] font-black uppercase tracking-widest">
                સંવાદ ના મુખ્ય વિષયો
              </span>
              <span className="font-display font-black text-lg sm:text-xl text-[#FAF4EC] uppercase">
                5 CORE SAMVAAD THEMES
              </span>
              <span className="text-[#F2DFBD]/80 text-xs mt-1">
                Direct • Candid • Constructive Youth Engagement
              </span>
            </div>
          </div>

          {/* Theme Nodes */}
          <div className="lg:col-span-7 flex flex-col gap-2.5">
            {discussionNodes.map((topic) => (
              <div
                key={topic.id}
                onClick={() => setSelectedTopic(selectedTopic === topic.id ? null : topic.id)}
                className={`p-3.5 sm:p-4 rounded-xl border text-left transition-all duration-200 shadow-sm cursor-pointer ${
                  selectedTopic === topic.id
                    ? "bg-[#FAF4EC] border-[#F05A12] ring-2 ring-[#F05A12]/30 shadow-md"
                    : "bg-[#FAF4EC]/80 border-[#17130E]/15 hover:border-[#F05A12]/60 hover:bg-[#FAF4EC]"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded bg-[#F05A12]/10 text-[#F05A12]">
                        {topic.id}
                      </span>
                      <h4 className="font-devanagari font-bold text-sm sm:text-base text-[#17130E]">
                        {topic.gujarati}
                      </h4>
                    </div>
                    <p className="text-xs font-bold text-[#E65100]">
                      {topic.english}
                    </p>
                    <p className="text-[11px] text-[#5A4839] leading-snug">
                      {topic.description}
                    </p>
                  </div>
                  <Flame className={`w-4 h-4 shrink-0 transition-colors ${selectedTopic === topic.id ? "text-[#F05A12] fill-[#F05A12]" : "text-[#5A4839]/40"}`} />
                </div>
              </div>
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
              <span>ASK IN REGISTRATION FORM</span>
            </div>

            <h3 className="text-2xl sm:text-4xl font-display font-black uppercase text-[#17130E] tracking-tight">
              HAVE A QUESTION FOR THE SAMVAAD?
            </h3>

            <p className="text-xs sm:text-sm text-[#5A4839] max-w-lg mx-auto leading-relaxed font-medium">
              You can submit your questions and topics directly in the registration form before the event, or raise them live during the open-mic dialogue on 6 September.
            </p>

            <div className="pt-3 flex items-center justify-center">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl btn-bhagwa-primary text-xs sm:text-sm font-black uppercase tracking-wider active:scale-95 transition-all shadow-bhagwa-sm group"
              >
                <span>REGISTER & SUBMIT YOUR QUESTION</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
