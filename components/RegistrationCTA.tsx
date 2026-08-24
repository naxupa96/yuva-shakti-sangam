"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck, Users, Ticket, Flame } from "lucide-react";
import { eventConfig } from "@/lib/config";
import { CornerOrnament, MandalaMotif, DevanagariWatermark } from "./Decorations";

export default function RegistrationCTA() {
  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#EAE0D0] bg-parchment-texture relative overflow-hidden border-b border-[#292524]/10">
      <DevanagariWatermark text="शक्ति" className="top-5 left-4 text-[14rem] sm:text-[24rem] text-[#292524]/5" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Main CTA Panel matching the reference card */}
        <div className="p-8 sm:p-14 rounded-3xl bg-[#F5EBE1] border-2 border-[#292524]/15 shadow-parchment-deep relative overflow-hidden text-center">
          <CornerOrnament className="absolute top-3 left-3 text-[#E65100]/40" />
          <CornerOrnament className="absolute top-3 right-3 text-[#E65100]/40 -scale-x-100" />
          <CornerOrnament className="absolute bottom-3 left-3 text-[#E65100]/40 -scale-y-100" />
          <CornerOrnament className="absolute bottom-3 right-3 text-[#E65100]/40 -scale-100" />

          {/* Background Mandala Watermark */}
          <div className="absolute -right-20 -top-20 opacity-25 text-[#E65100] pointer-events-none">
            <MandalaMotif size={450} />
          </div>

          {/* Overline Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1C1917] text-[#FAF4EC] text-xs font-black uppercase tracking-widest mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#FFA000]" />
            <span>OFFICIAL REGISTRATION PASS (₹50)</span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-6xl md:text-7xl font-display font-black uppercase text-[#1C1917] tracking-tight leading-[1.05] mb-4">
            READY TO JOIN <br />
            <span className="text-[#E65100] italic">
              THE SANGAM?
            </span>
          </h2>

          {/* Supporting Text */}
          <div className="text-sm sm:text-lg text-[#57534E] max-w-lg mx-auto space-y-1 mb-6 font-medium">
            <p>Bring your questions. Bring your energy.</p>
            <p className="text-[#E65100] font-bold">Bring your ideas for Bharat.</p>
          </div>

          {/* Inclusions Pill */}
          <div className="inline-flex flex-wrap items-center justify-center gap-2 py-2 px-4 rounded-2xl bg-[#1C1917] text-[#FAF4EC] text-xs font-black uppercase tracking-wider mb-8 shadow-sm">
            <Sparkles className="w-4 h-4 text-[#FFA000]" />
            <span>OFFICIAL ID CARD PROVIDED</span>
            <span>•</span>
            <span className="text-[#FFA000]">HIGH TEA INCLUDED</span>
          </div>

          {/* High-Impact CTA Button */}
          <div className="flex flex-col items-center justify-center gap-2 max-w-md mx-auto mb-10">
            <Link
              href="/register"
              className="w-full py-4 px-8 rounded-xl btn-bhagwa-primary text-base sm:text-lg font-black uppercase tracking-wider flex items-center justify-center gap-3 active:scale-95 transition-all group"
            >
              <span>JOIN THE SANGAM (₹50)</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
            </Link>
            <span className="text-[11px] font-bold text-[#57534E]">
              📍 Shree Saurashtra Patel Samaj, Maninagar, Ahmedabad
            </span>
          </div>

          {/* Benefit / Trust Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t border-[#292524]/10 max-w-2xl mx-auto text-center">
            <div className="flex items-center justify-center sm:justify-start gap-3 p-3.5 rounded-xl bg-[#FAF4EC] border border-[#292524]/10">
              <div className="w-9 h-9 rounded-lg bg-[#E65100]/10 border border-[#E65100]/30 flex items-center justify-center text-[#E65100] shrink-0">
                <Ticket className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="text-[11px] font-black text-[#1C1917] uppercase tracking-wider block">₹50 ENTRY</span>
                <span className="text-[10px] text-[#57534E]">Nominal Reg. Fee</span>
              </div>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-3 p-3.5 rounded-xl bg-[#FAF4EC] border border-[#292524]/10">
              <div className="w-9 h-9 rounded-lg bg-[#E65100]/10 border border-[#E65100]/30 flex items-center justify-center text-[#E65100] shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="text-[11px] font-black text-[#1C1917] uppercase tracking-wider block">VERIFIED PASS</span>
                <span className="text-[10px] text-[#57534E]">Instant Digital Pass</span>
              </div>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-3 p-3.5 rounded-xl bg-[#FAF4EC] border border-[#292524]/10">
              <div className="w-9 h-9 rounded-lg bg-[#E65100]/10 border border-[#E65100]/30 flex items-center justify-center text-[#E65100] shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="text-[11px] font-black text-[#1C1917] uppercase tracking-wider block">OPEN FOR YOUTH</span>
                <span className="text-[10px] text-[#57534E]">Age 16–35</span>
              </div>
            </div>
          </div>
        </div>

        {/* Memorial Statement Strip */}
        <div className="mt-10 p-8 rounded-3xl bg-[#1C1917] text-[#FAF4EC] text-center space-y-3 shadow-xl">
          <p className="text-lg sm:text-2xl font-display font-black uppercase text-[#FAF4EC] tracking-tight">
            &ldquo;YOUR ENERGY CAN BE ENTERTAINMENT. OR IT CAN BECOME SHAKTI.&rdquo;
          </p>
          <p className="text-xs font-black uppercase tracking-widest text-[#E65100]">
            {eventConfig.name} • {eventConfig.dateDisplay} • {eventConfig.locationShort}
          </p>
        </div>
      </div>
    </section>
  );
}
