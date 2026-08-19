"use client";

import React, { useState } from "react";
import { eventConfig, LUMA_REGISTRATION_URL } from "@/lib/config";
import { faqs } from "@/lib/data";
import { MapPin, Calendar, Clock, Navigation, ChevronDown, Sparkles, ExternalLink } from "lucide-react";
import { CornerOrnament, DevanagariWatermark, OrnamentalDivider } from "./Decorations";

export default function EventInfo() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <section id="event-info" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#EAE0D0] bg-parchment-texture relative overflow-hidden border-b border-[#292524]/10">
      <DevanagariWatermark text="स्थान" className="top-10 left-4 text-[12rem] sm:text-[18rem] text-[#292524]/5" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1C1917] text-[#FAF4EC] text-xs font-black uppercase tracking-widest shadow-sm">
            <MapPin className="w-3.5 h-3.5 text-[#E65100]" />
            <span>LOGISTICS &amp; PLANNING</span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-black uppercase text-[#1C1917] tracking-tight">
            EVENT LOGISTICS
          </h2>

          <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
            Essential venue, schedule, and attendance details for 6 September 2026.
          </p>
        </div>

        {/* 3 Logistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {/* Card 1 */}
          <div className="p-8 rounded-3xl bg-[#F5EBE1] border border-[#292524]/15 hover:border-[#E65100]/60 transition-all flex flex-col justify-between group shadow-parchment-card">
            <CornerOrnament className="absolute top-2 right-2 opacity-20 text-[#E65100]" />
            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#FAF4EC] border border-[#292524]/10 flex items-center justify-center text-[#E65100] mb-6 shadow-sm">
                <MapPin className="w-7 h-7" />
              </div>
              <span className="text-[10px] font-black text-[#E65100] uppercase tracking-widest block mb-1">
                LOCATION &amp; CITY
              </span>
              <h3 className="font-display font-black text-2xl text-[#1C1917] uppercase tracking-tight mb-2">
                Maninagar, Ahmedabad
              </h3>
              <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed mb-4">
                Gujarat, India. Well-connected by Ahmedabad Metro, BRTS, and local transit.
              </p>
              <div className="p-3.5 rounded-2xl bg-[#FAF4EC] border border-[#292524]/10 text-xs font-bold text-[#E65100]">
                📍 {eventConfig.venueNote}
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-[#292524]/10">
              <a
                href={eventConfig.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E65100] hover:text-[#D84315] transition-colors"
              >
                <span>OPEN GOOGLE MAPS</span>
                <Navigation className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-8 rounded-3xl bg-[#F5EBE1] border border-[#292524]/15 hover:border-[#E65100]/60 transition-all flex flex-col justify-between group shadow-parchment-card">
            <CornerOrnament className="absolute top-2 right-2 opacity-20 text-[#E65100]" />
            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#FAF4EC] border border-[#292524]/10 flex items-center justify-center text-[#E65100] mb-6 shadow-sm">
                <Calendar className="w-7 h-7" />
              </div>
              <span className="text-[10px] font-black text-[#E65100] uppercase tracking-widest block mb-1">
                GATHERING DATE
              </span>
              <h3 className="font-display font-black text-2xl text-[#1C1917] uppercase tracking-tight mb-2">
                06 September 2026
              </h3>
              <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed mb-4">
                Sunday evening gathering. Reserve your spot early to avoid last-minute rush.
              </p>
              <div className="p-3.5 rounded-2xl bg-[#FAF4EC] border border-[#292524]/10 text-xs font-bold text-[#1C1917]">
                📅 Add to Calendar via Luma pass
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-[#292524]/10">
              <a
                href={LUMA_REGISTRATION_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E65100] hover:text-[#D84315] transition-colors"
              >
                <span>RESERVE PASS VIA LUMA</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-8 rounded-3xl bg-[#F5EBE1] border border-[#292524]/15 hover:border-[#E65100]/60 transition-all flex flex-col justify-between group shadow-parchment-card">
            <CornerOrnament className="absolute top-2 right-2 opacity-20 text-[#E65100]" />
            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#FAF4EC] border border-[#292524]/10 flex items-center justify-center text-[#E65100] mb-6 shadow-sm">
                <Clock className="w-7 h-7" />
              </div>
              <span className="text-[10px] font-black text-[#E65100] uppercase tracking-widest block mb-1">
                EVENT SCHEDULE
              </span>
              <h3 className="font-display font-black text-2xl text-[#1C1917] uppercase tracking-tight mb-2">
                4:00 PM – 8:00 PM IST
              </h3>
              <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed mb-4">
                Reporting and check-in opens at 3:30 PM. Concludes promptly with the Sangam Sankalp at 8:00 PM.
              </p>
              <div className="p-3.5 rounded-2xl bg-[#FAF4EC] border border-[#292524]/10 text-xs font-bold text-[#1C1917]">
                ⏰ Please arrive 15 minutes early
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-[#292524]/10">
              <a
                href="#journey"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E65100] hover:text-[#D84315] transition-colors"
              >
                <span>EXPLORE 4-HOUR TIMELINE</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Vintage FAQ Accordion */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 space-y-2">
            <span className="text-xs font-black text-[#E65100] uppercase tracking-widest block">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h3 className="text-2xl sm:text-4xl font-display font-black uppercase text-[#1C1917]">
              CLEAR ANSWERS. ZERO CONFUSION.
            </h3>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={faq.question}
                  className={`rounded-3xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? "bg-[#FAF4EC] border-[#E65100]/60 shadow-bhagwa-sm"
                      : "bg-[#F5EBE1] border-[#292524]/15 hover:border-[#E65100]/40"
                  }`}
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 font-display font-black text-base sm:text-lg text-[#1C1917] hover:text-[#E65100] transition-colors"
                    aria-expanded={isOpen}
                  >
                    <span>{faq.question}</span>
                    <div className="w-8 h-8 rounded-full bg-[#EAE0D0] border border-[#292524]/10 flex items-center justify-center shrink-0">
                      <ChevronDown
                        className={`w-4 h-4 text-[#E65100] transition-transform duration-200 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 text-xs sm:text-sm text-[#57534E] leading-relaxed border-t border-[#292524]/10 pt-4 animate-in fade-in duration-150">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
