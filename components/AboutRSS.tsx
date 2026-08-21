"use client";

import React from "react";
import { BookOpen, ShieldCheck, HeartHandshake, Users, ArrowUpRight, CheckCircle2, Flame } from "lucide-react";
import { CornerOrnament, DevanagariWatermark, OrnamentalDivider } from "./Decorations";

export default function AboutRSS() {
  return (
    <section id="about-rss" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#EAE0D0] bg-parchment-texture relative overflow-hidden border-b border-[#292524]/10">
      <DevanagariWatermark text="संस्कृति" className="top-12 left-4 text-[12rem] sm:text-[20rem] text-[#292524]/5" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1C1917] text-[#FAF4EC] text-xs font-black uppercase tracking-widest shadow-sm">
            <BookOpen className="w-3.5 h-3.5 text-[#E65100]" />
            <span>FACTUAL OVERVIEW</span>
          </div>

          <h2 className="text-4xl sm:text-6xl md:text-7xl font-display font-black uppercase text-[#1C1917] tracking-tight">
            RSS KO <br />
            <span className="text-[#E65100]">
              JAANNA HAI?
            </span>
          </h2>

          <p className="text-base sm:text-xl font-display font-bold text-[#E65100] tracking-wide uppercase">
            Before forming an opinion, understand.
          </p>

          <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
            Founded in 1925, Rashtriya Swayamsevak Sangh (RSS) is one of the world&apos;s largest voluntary civil society movements, dedicated to character building, social cohesion, and grassroots community service.
          </p>
        </div>

        {/* 4 Informational Fact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Card 1 */}
          <div className="p-7 sm:p-9 rounded-3xl bg-[#F5EBE1] border border-[#292524]/15 hover:border-[#E65100]/60 transition-all shadow-parchment-card relative overflow-hidden group">
            <CornerOrnament className="absolute top-2 right-2 opacity-20 text-[#E65100]" />
            <div className="flex items-center gap-3.5 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-[#FAF4EC] border border-[#292524]/10 flex items-center justify-center text-[#E65100] shadow-sm">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black text-[#E65100] uppercase tracking-wider block">FOUNDATIONAL ORIGIN</span>
                <h3 className="font-display font-black text-xl text-[#1C1917] uppercase">
                  Character Building &amp; Discipline
                </h3>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed mb-5">
              Founded on Vijayadashami in 1925 by Dr. K.B. Hedgewar in Nagpur, the movement started with a simple vision: lasting civilizational strength comes not from political power, but from morally grounded, disciplined citizens who place nation and society above personal interest.
            </p>
            <ul className="space-y-2 text-xs text-[#1C1917] font-medium">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#E65100] shrink-0" />
                <span>Voluntary non-political civil society organization</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#E65100] shrink-0" />
                <span>Physical fitness, mental focus, and moral grounding</span>
              </li>
            </ul>
          </div>

          {/* Card 2 */}
          <div className="p-7 sm:p-9 rounded-3xl bg-[#F5EBE1] border border-[#292524]/15 hover:border-[#E65100]/60 transition-all shadow-parchment-card relative overflow-hidden group">
            <CornerOrnament className="absolute top-2 right-2 opacity-20 text-[#E65100]" />
            <div className="flex items-center gap-3.5 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-[#FAF4EC] border border-[#292524]/10 flex items-center justify-center text-[#E65100] shadow-sm">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black text-[#E65100] uppercase tracking-wider block">GRASSROOTS GATHERING</span>
                <h3 className="font-display font-black text-xl text-[#1C1917] uppercase">
                  The Daily Shakha
                </h3>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed mb-5">
              The fundamental unit of RSS is the daily 1-hour Shakha conducted in open neighborhood grounds. It combines traditional Indian sports, martial coordination, group singing, and intellectual discussions on civic duties.
            </p>
            <ul className="space-y-2 text-xs text-[#1C1917] font-medium">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#E65100] shrink-0" />
                <span>Zero membership fees, open to all citizens</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#E65100] shrink-0" />
                <span>Breaks caste and economic barriers in daily life</span>
              </li>
            </ul>
          </div>

          {/* Card 3 */}
          <div className="p-7 sm:p-9 rounded-3xl bg-[#F5EBE1] border border-[#292524]/15 hover:border-[#E65100]/60 transition-all shadow-parchment-card relative overflow-hidden group">
            <CornerOrnament className="absolute top-2 right-2 opacity-20 text-[#E65100]" />
            <div className="flex items-center gap-3.5 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-[#FAF4EC] border border-[#292524]/10 flex items-center justify-center text-[#E65100] shadow-sm">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black text-[#E65100] uppercase tracking-wider block">SEVA BHARATI &amp; AFFILIATES</span>
                <h3 className="font-display font-black text-xl text-[#1C1917] uppercase">
                  150,000+ Service Projects
                </h3>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed mb-5">
              Inspired Swayamsevaks lead massive non-profit institutions in education (Vidya Bharati, Ekal Vidyalaya), tribal healthcare (Vanvasi Kalyan Ashram), and act as immediate civilian first-responders during disasters across India.
            </p>
            <ul className="space-y-2 text-xs text-[#1C1917] font-medium">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#E65100] shrink-0" />
                <span>First responders in Ahmedabad Aviation Emergencies (1988 &amp; 2025), Morbi (1979), Bhuj (2001) &amp; Balasore (2023)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#E65100] shrink-0" />
                <span>Pan-India COVID-19 relief: 8.5+ crore meals, isolation centers, plasma &amp; oxygen registries</span>
              </li>
            </ul>
          </div>


          {/* Card 4 */}
          <div className="p-7 sm:p-9 rounded-3xl bg-[#F5EBE1] border border-[#292524]/15 hover:border-[#E65100]/60 transition-all shadow-parchment-card relative overflow-hidden group">
            <CornerOrnament className="absolute top-2 right-2 opacity-20 text-[#E65100]" />
            <div className="flex items-center gap-3.5 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-[#FAF4EC] border border-[#292524]/10 flex items-center justify-center text-[#E65100] shadow-sm">
                <Flame className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black text-[#E65100] uppercase tracking-wider block">YOUTH ORIENTATION</span>
                <h3 className="font-display font-black text-xl text-[#1C1917] uppercase">
                  Nation First (राष्ट्राय स्वाहा)
                </h3>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed mb-5">
              For today&apos;s digital generation, understanding RSS means looking past second-hand biases and seeing actual ground realities: selfless volunteerism, environmental stewardship, and building an inclusive, forward-looking Bharat.
            </p>
            <ul className="space-y-2 text-xs text-[#1C1917] font-medium">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#E65100] shrink-0" />
                <span>Active youth participation in innovation, startup mentoring, and social impact</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#E65100] shrink-0" />
                <span>Inviting constructive dialogue, critique, and participation</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Sources & Official References */}
        <div className="p-6 rounded-2xl bg-[#F5EBE1] border border-[#292524]/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="text-xs text-[#57534E] space-y-0.5">
            <span className="font-bold text-[#1C1917] text-sm block">📚 Sources &amp; Official References</span>
            <span>Explore published literature, documented history, and verified archives at the event.</span>
          </div>
          <a
            href="https://www.rss.org"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#1C1917] text-[#FAF4EC] hover:bg-[#292524] text-xs font-bold uppercase tracking-wider shrink-0 shadow-sm"
          >
            <span>OFFICIAL ARCHIVES</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
