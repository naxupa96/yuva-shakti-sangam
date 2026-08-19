"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MessageSquare, Send, Sparkles, Check, ArrowRight, Flame } from "lucide-react";
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
  const [userQuestion, setUserQuestion] = useState("");
  const [reflected, setReflected] = useState(false);

  const handleReflect = (e: React.FormEvent) => {
    e.preventDefault();
    if (userQuestion.trim() || selectedTopic) {
      setReflected(true);
    }
  };

  return (
    <section id="samvaad" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#E7CEA3] bg-parchment-texture relative overflow-hidden border-b border-[#17130E]/15">
      <DevanagariWatermark text="संवाद" className="top-10 right-4 text-[12rem] sm:text-[20rem] text-[#17130E]/5" />

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
                onClick={() => {
                  setSelectedTopic(topic);
                  setReflected(false);
                }}
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

        {/* Interactive Question Canvas */}
        <div className="p-6 sm:p-10 rounded-3xl bg-[#F2DFBD] border-2 border-[#17130E]/15 shadow-parchment-deep relative">
          <CornerOrnament className="absolute top-3 left-3 text-[#F05A12]/40" />
          <CornerOrnament className="absolute top-3 right-3 text-[#F05A12]/40 -scale-x-100" />

          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-6">
              <span className="text-xs font-black text-[#F05A12] uppercase tracking-widest block mb-1">
                PRE-SANGAM THOUGHT STARTER
              </span>
              <h3 className="text-2xl sm:text-3xl font-display font-black uppercase text-[#17130E]">
                If you could change ONE thing about India... What would it be?
              </h3>
              <p className="text-xs sm:text-sm text-[#5A4839] mt-2">
                Frame your perspective below and bring this question to the live Sangam on 6 September.
              </p>
            </div>

            {reflected ? (
              <div className="p-6 rounded-2xl bg-[#E7CEA3] border border-[#F05A12] text-center space-y-3 animate-in fade-in">
                <div className="w-12 h-12 rounded-full bg-[#F05A12] text-white flex items-center justify-center mx-auto shadow-bhagwa-sm">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <h4 className="font-display font-black text-lg text-[#17130E] uppercase">
                  QUESTION FRAMED FOR SANGAM!
                </h4>
                <p className="text-xs text-[#5A4839] max-w-md mx-auto">
                  &ldquo;{userQuestion || selectedTopic}&rdquo;
                </p>
                <div className="pt-2">
                  <a
                    href={LUMA_REGISTRATION_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl btn-bhagwa-primary text-xs font-black uppercase tracking-wider"
                  >
                    <span>CLAIM YOUR SANGAM PASS</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleReflect} className="space-y-4">
                <textarea
                  rows={3}
                  value={userQuestion}
                  onChange={(e) => setUserQuestion(e.target.value)}
                  placeholder="Type your question or perspective for the open dialogue..."
                  className="w-full p-4 rounded-xl bg-[#E7CEA3] border border-[#17130E]/20 text-[#17130E] text-xs sm:text-sm placeholder-[#5A4839]/60 focus:outline-none focus:border-[#F05A12] focus:ring-1 focus:ring-[#F05A12] resize-none"
                />

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <span className="text-[11px] text-[#5A4839] font-medium">
                    {selectedTopic ? `Selected Theme: ${selectedTopic}` : "Select a theme above or write your own question"}
                  </span>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#17130E] hover:bg-[#24170D] text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5 text-[#F05A12]" />
                    <span>REFLECT QUESTION</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
