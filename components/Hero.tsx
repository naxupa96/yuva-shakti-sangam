"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { eventConfig } from "@/lib/config";
import Countdown from "./Countdown";
import { Calendar, Clock, MapPin, Sparkles, ArrowRight, Ticket, ShieldCheck, Users, Menu, X, Instagram } from "lucide-react";

export default function Hero() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <section id="hero" className="relative bg-[#E7CEA3] bg-parchment-texture overflow-hidden pt-4 sm:pt-7 pb-16 px-3 sm:px-6 lg:px-8 border-b border-[#17130E]/15">
      <div className="max-w-5xl lg:max-w-6xl mx-auto">
        
        {/* Main Poster Container matching exact Reference Design */}
        <div className="relative rounded-3xl overflow-hidden bg-[#E2D0B0] border-2 border-[#17130E]/20 shadow-parchment-deep p-4 sm:p-7 lg:p-9">
          
          {/* 1. Header Bar */}
          <div className="flex items-center justify-between pb-4 sm:pb-6 border-b border-[#17130E]/10">
            {/* Left Brand Identity */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              {/* Official Logo Emblem */}
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden shadow-md shrink-0 border border-[#17130E]/20 bg-white/30 flex items-center justify-center p-0.5">
                <Image
                  src="/images/logo.png"
                  alt="Yuva Shakti Sangam Official Logo"
                  width={56}
                  height={56}
                  className="w-full h-full object-contain"
                  priority
                />
              </div>

              {/* Title & Slogan */}
              <div className="flex flex-col">
                <div className="font-display font-black text-xl sm:text-2xl text-[#17130E] tracking-tight leading-none uppercase">
                  YUVA <span className="text-[#F05A12]">SHAKTI</span> SANGAM
                </div>
                <div className="text-[11px] sm:text-xs font-devanagari font-black text-[#5A4839] flex items-center gap-1 mt-0.5 select-none whitespace-nowrap">
                  <span className="text-[#F05A12]">युवा शक्ति</span>
                  <span>•</span>
                  <span className="text-[#17130E]">राष्ट्र शक्ति</span>
                </div>
              </div>
            </div>

            {/* Right Action Buttons */}
            <div className="flex items-center gap-2 sm:gap-3">
              {eventConfig.instagramUrl && (
                <a
                  href={eventConfig.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-[#17130E] text-[#F2DFBD] hover:text-[#F05A12] hover:bg-[#24170D] transition-colors flex items-center justify-center shadow-sm"
                  title="Follow us on Instagram @yuvashaktisangam"
                >
                  <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
              )}

              <Link
                href="/register"
                className="px-4 sm:px-6 py-2.5 rounded-xl bg-[#F05A12] hover:bg-[#C8460B] text-white text-xs sm:text-sm font-black uppercase tracking-wider shadow-bhagwa-sm transition-all active:scale-95 flex items-center gap-1.5"
              >
                <span>REGISTER (₹50)</span>
              </Link>

              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2.5 rounded-xl bg-[#17130E] text-[#F2DFBD] hover:bg-[#24170D] transition-colors"
                aria-label="Toggle Menu"
              >
                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Quick Drawer if Menu Clicked */}
          {menuOpen && (
            <div className="my-3 p-4 rounded-2xl bg-[#17130E] text-[#F2DFBD] text-xs font-bold uppercase tracking-wider space-y-2 animate-in fade-in duration-150 border border-[#F05A12]/30">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                <a href="#big-idea" onClick={() => setMenuOpen(false)} className="p-2.5 rounded-lg bg-[#24170D] hover:text-[#F05A12] transition-colors">The Big Idea</a>
                <a href="#chief-guest" onClick={() => setMenuOpen(false)} className="p-2.5 rounded-lg bg-[#24170D] text-[#FFA000] hover:text-[#F05A12] transition-colors">Dignitaries</a>
                <a href="#why-attend" onClick={() => setMenuOpen(false)} className="p-2.5 rounded-lg bg-[#24170D] hover:text-[#F05A12] transition-colors">Why Attend</a>
                <a href="#experience" onClick={() => setMenuOpen(false)} className="p-2.5 rounded-lg bg-[#24170D] hover:text-[#F05A12] transition-colors">Experience</a>
                <a href="#samvaad" onClick={() => setMenuOpen(false)} className="p-2.5 rounded-lg bg-[#24170D] hover:text-[#F05A12] transition-colors">Yuva Samvaad</a>
                <a href="#what-can-you-do" onClick={() => setMenuOpen(false)} className="p-2.5 rounded-lg bg-[#24170D] hover:text-[#F05A12] transition-colors">Action Areas</a>
                <a href="#about-rss" onClick={() => setMenuOpen(false)} className="p-2.5 rounded-lg bg-[#24170D] hover:text-[#F05A12] transition-colors">About RSS</a>
                <a href="#event-info" onClick={() => setMenuOpen(false)} className="p-2.5 rounded-lg bg-[#24170D] hover:text-[#F05A12] transition-colors">Venue & FAQ</a>
              </div>
            </div>
          )}

          {/* 2. Hero Visual Composition (Real Typography on Left + Prominent Saffron Flag Artwork on Right) */}
          <div className="relative mt-4 sm:mt-6 min-h-[500px] sm:min-h-[560px] lg:min-h-[620px] rounded-2xl overflow-hidden flex flex-col justify-between">
            
            {/* High-Resolution Artwork with Fully Visible Fluttering Saffron Flag */}
            <div className="absolute inset-0 z-0">
              {/* Desktop / Tablet Wide Artwork */}
              <div className="hidden sm:block absolute inset-0">
                <Image
                  src="/images/hero-flag-wide.jpg"
                  alt="Youth proudly raising the saffron Bhagwa Dhwaj against temple horizon"
                  fill
                  priority
                  className="object-cover object-right lg:object-center mix-blend-multiply opacity-95"
                />
              </div>

              {/* Mobile Vertical Artwork */}
              <div className="block sm:hidden absolute inset-0">
                <Image
                  src="/images/hero-flag-mobile.jpg"
                  alt="Youth proudly raising the saffron Bhagwa Dhwaj against temple horizon"
                  fill
                  priority
                  className="object-cover object-right mix-blend-multiply opacity-95"
                />
              </div>

              {/* Smooth Natural Parchment Gradient Overlay on Left for Maximum Typography Crispness */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#E2D0B0] via-[#E2D0B0]/80 sm:via-[#E2D0B0]/60 to-transparent w-full sm:w-3/5 pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#E2D0B0] via-[#E2D0B0]/30 to-transparent h-24 pointer-events-none" />
            </div>

            {/* Foreground Real HTML Poster Typography */}
            <div className="relative z-10 max-w-sm sm:max-w-md lg:max-w-lg p-2 sm:p-4 space-y-4 sm:space-y-5">
              
              {/* Overline Mottos */}
              <div className="space-y-0.5">
                <p className="font-display font-black text-xs sm:text-sm tracking-widest text-[#17130E] uppercase">
                  THE ENERGY OF YOUTH
                </p>
                <p className="font-display font-black text-xs sm:text-sm tracking-widest text-[#C8460B] uppercase">
                  THE STRENGTH OF NATION
                </p>
              </div>

              {/* Massive Distressed Display Headline */}
              <div className="space-y-0 select-none">
                <h1 className="font-display font-black text-6xl sm:text-7xl lg:text-8xl text-[#17130E] tracking-tight leading-[0.88] uppercase distressed-title">
                  YUVA <br />
                  <span className="text-[#F05A12]">
                    SHAKTI
                  </span> <br />
                  SANGAM
                </h1>

                {/* Devanagari Slogan */}
                <div className="font-devanagari font-black text-2xl sm:text-3xl pt-2 flex items-center gap-2">
                  <span className="text-[#F05A12]">युवा शक्ति</span>
                  <span className="text-[#5A4839]">•</span>
                  <span className="text-[#17130E]">राष्ट्र शक्ति</span>
                </div>
              </div>

              {/* Event Poster Metadata & Chief Guest Callout */}
              <div className="space-y-2.5 pt-1 text-[#17130E] font-display font-black text-xs sm:text-sm uppercase tracking-wider">
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-[#F05A12] shrink-0 stroke-[2.5]" />
                  <span>{eventConfig.dateDisplay}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-[#F05A12] shrink-0 stroke-[2.5]" />
                  <span>{eventConfig.timeDisplay}</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#F05A12] shrink-0 stroke-[2.5] mt-0.5" />
                  <span className="leading-snug">{eventConfig.venueName.toUpperCase()} • MANINAGAR</span>
                </div>

                {/* Dignitaries Spotlight Badges */}
                <div className="pt-1.5 flex flex-col gap-1.5">
                  <a
                    href="#chief-guest"
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#17130E] text-[#FAF4EC] hover:bg-[#24170D] transition-colors border border-[#F05A12]/40 shadow-sm group"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#F05A12] animate-pulse shrink-0" />
                    <span className="text-[10px] sm:text-[11px] font-bold text-[#FFA000] uppercase shrink-0">Chief Guest:</span>
                    <span className="text-[11px] sm:text-xs font-black uppercase text-white group-hover:text-[#F05A12] transition-colors truncate">
                      Rupesh Makwana (Guinness Record Holder)
                    </span>
                  </a>

                  <a
                    href="#chief-guest"
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#17130E] text-[#FAF4EC] hover:bg-[#24170D] transition-colors border border-[#F05A12]/40 shadow-sm group"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#FFA000] shrink-0" />
                    <span className="text-[10px] sm:text-[11px] font-bold text-[#FFA000] uppercase shrink-0">Guest of Honor:</span>
                    <span className="text-[11px] sm:text-xs font-black uppercase text-white group-hover:text-[#F05A12] transition-colors truncate">
                      Nidhi Mehta (National Yoga Player 🇮🇳)
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Integrated "READY TO JOIN THE SANGAM?" Card with Intricate Indian Mandala */}
          <div className="relative mt-8 sm:mt-10 rounded-2xl bg-[#F2DFBD] border border-[#17130E]/20 p-5 sm:p-8 shadow-parchment-card overflow-hidden">
            {/* Intricate Mandala Watermark on the Right */}
            <div className="absolute -right-12 -top-12 sm:-right-8 sm:-top-8 w-64 sm:w-80 h-64 sm:h-80 pointer-events-none opacity-30 mix-blend-multiply">
              <Image
                src="/images/mandala-pattern.jpg"
                alt="Sacred Mandala Motif"
                fill
                className="object-contain"
              />
            </div>

            <div className="relative z-10 max-w-xl space-y-3.5">
              <div>
                <h2 className="font-display font-black text-2xl sm:text-4xl text-[#17130E] uppercase tracking-tight leading-none">
                  READY TO JOIN <br />
                  <span className="text-[#F05A12] italic font-black">THE SANGAM?</span>
                </h2>
                {/* Saffron hand-drawn decorative underline */}
                <div className="w-36 h-1.5 bg-[#F05A12] rounded-full mt-1 opacity-80" />
              </div>

              <div className="text-xs sm:text-sm font-medium text-[#5A4839] space-y-0.5">
                <p>Bring your questions. Bring your energy.</p>
                <p className="text-[#F05A12] font-bold">Bring your ideas for Bharat.</p>
              </div>

              {/* Pass Inclusions Pill */}
              <div className="inline-flex flex-wrap items-center justify-center gap-2 py-1.5 px-3 rounded-xl bg-[#17130E] text-[#FAF4EC] text-[11px] font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#FFA000]" />
                <span>OFFICIAL ID CARD</span>
                <span>•</span>
                <span>E-CERTIFICATE</span>
                <span>•</span>
                <span className="text-[#FFA000]">HIGH TEA INCLUDED</span>
              </div>

              {/* Large Saffron CTA Button */}
              <div className="pt-1">
                <Link
                  href="/register"
                  className="w-full py-4 px-6 rounded-xl btn-bhagwa-primary text-sm sm:text-base font-black uppercase tracking-wider flex items-center justify-center gap-2 group"
                >
                  <span>JOIN THE SANGAM (₹50)</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* 3-Column Trust Strip */}
              <div className="pt-4 border-t border-[#17130E]/15 grid grid-cols-3 gap-2 sm:gap-4 text-center text-[#17130E]">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2">
                  <Ticket className="w-4 h-4 text-[#F05A12]" />
                  <div className="text-left">
                    <span className="text-[10px] sm:text-xs font-black uppercase block leading-none">₹50 ONLY</span>
                    <span className="text-[9px] sm:text-[10px] text-[#5A4839] block leading-tight">ENTRY PASS</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 border-x border-[#17130E]/15 px-1 sm:px-2">
                  <ShieldCheck className="w-4 h-4 text-[#F05A12]" />
                  <div className="text-left">
                    <span className="text-[10px] sm:text-xs font-black uppercase block leading-none">VERIFIED</span>
                    <span className="text-[9px] sm:text-[10px] text-[#5A4839] block leading-tight">DIGITAL QR PASS</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2">
                  <Users className="w-4 h-4 text-[#F05A12]" />
                  <div className="text-left">
                    <span className="text-[10px] sm:text-xs font-black uppercase block leading-none">OPEN FOR</span>
                    <span className="text-[9px] sm:text-[10px] text-[#5A4839] block leading-tight">YOUTH 16–35</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Live Countdown Timer */}
          <div className="mt-8">
            <Countdown />
          </div>
        </div>

      </div>
    </section>
  );
}
