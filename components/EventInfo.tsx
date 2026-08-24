"use client";

import React, { useState } from "react";
import Link from "next/link";
import { eventConfig } from "@/lib/config";
import { faqs } from "@/lib/data";
import { MapPin, Calendar, Clock, Navigation, ChevronDown, ExternalLink, Mail, Phone, MessageCircle, UserCheck, ArrowRight } from "lucide-react";
import { CornerOrnament, DevanagariWatermark } from "./Decorations";

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
            Essential venue, schedule, helpline, and attendance details for 6 September 2026.
          </p>
        </div>

        {/* 3 Logistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Card 1: Location */}
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

          {/* Card 2: Date */}
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
                📅 Sunday, 4:00 PM to 8:00 PM IST
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-[#292524]/10">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E65100] hover:text-[#D84315] transition-colors"
              >
                <span>GET DIGITAL PASS (₹50)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 3: Time */}
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

        {/* Contact & Helpline Panel */}
        <div className="p-8 sm:p-10 rounded-3xl bg-[#1C1917] text-[#FAF4EC] border border-[#292524] shadow-2xl mb-16 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Left Col: Info */}
            <div className="space-y-2 lg:col-span-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E65100]/20 text-[#E65100] text-[11px] font-black uppercase tracking-wider">
                <span>DIRECT SUPPORT &amp; QUERIES</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-display font-black uppercase text-[#FAF4EC]">
                CONTACT &amp; HELPLINE
              </h3>
              <p className="text-xs text-[#A8A29E] leading-relaxed">
                Have questions regarding registration, delegation, volunteering, or venue access? Reach out to our organizing team.
              </p>
              <div className="pt-2">
                <a
                  href={`mailto:${eventConfig.email}`}
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#E65100] hover:underline"
                >
                  <Mail className="w-4 h-4" />
                  <span>{eventConfig.email}</span>
                </a>
              </div>
            </div>

            {/* Right Col: Coordinators Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:col-span-2">
              {eventConfig.coordinators.map((coordinator) => (
                <div
                  key={coordinator.name}
                  className="p-5 rounded-2xl bg-[#241F1A] border border-[#3E3832] flex flex-col justify-between space-y-4 hover:border-[#E65100]/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-[#E65100]" />
                        <h4 className="font-display font-black text-lg text-[#FAF4EC]">
                          {coordinator.name}
                        </h4>
                      </div>
                      <span className="text-[11px] text-[#78716C] uppercase font-bold tracking-wider block mt-0.5">
                        Event Coordinator
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#3E3832]">
                    <a
                      href={`tel:${coordinator.phoneRaw}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#141210] border border-[#3E3832] text-xs font-bold text-[#FAF4EC] hover:text-[#E65100] hover:border-[#E65100]/50 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#E65100]" />
                      <span>{coordinator.phone}</span>
                    </a>
                    <a
                      href={coordinator.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#25D366]/15 border border-[#25D366]/30 text-xs font-bold text-[#25D366] hover:bg-[#25D366]/25 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              ))}
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
