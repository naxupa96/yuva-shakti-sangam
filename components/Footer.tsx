"use client";

import React from "react";
import { ArrowUpRight, Flame } from "lucide-react";
import { eventConfig, LUMA_REGISTRATION_URL } from "@/lib/config";
import { navItems } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="bg-[#141210] border-t border-[#292524] pt-16 pb-28 md:pb-16 px-4 sm:px-6 lg:px-8 text-xs text-[#A8A29E] relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-14">
          {/* Brand & Event Identity */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#241F1A] border border-[#E65100]/40 flex items-center justify-center text-[#E65100] font-bold text-xl">
                <span>ॐ</span>
              </div>
              <span className="font-display font-black text-xl text-[#FAF4EC] uppercase tracking-wider">
                YUVA <span className="text-[#E65100]">SHAKTI</span> SANGAM
              </span>
            </div>
            <p className="font-devanagari text-base text-[#E65100] font-bold">
              {eventConfig.taglineHindi}
            </p>
            <p className="text-xs text-[#A8A29E] max-w-sm leading-relaxed">
              {eventConfig.taglineEnglish}
            </p>
            <div className="pt-2 text-[11px] text-[#78716C] space-y-1">
              <p>📍 {eventConfig.location}</p>
              <p>📅 {eventConfig.dateDisplay} • {eventConfig.timeDisplay}</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#FAF4EC] block mb-4">
              QUICK NAVIGATION
            </span>
            <ul className="space-y-2.5">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="hover:text-[#E65100] transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Registration & Host Info */}
          <div className="space-y-4">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#FAF4EC] block mb-2">
                FREE REGISTRATION
              </span>
              <p className="text-xs text-[#A8A29E] mb-3">
                Prior registration is mandatory for entry and logistics.
              </p>
              <a
                href={LUMA_REGISTRATION_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#E65100] text-white text-xs font-black tracking-wider shadow-bhagwa-sm"
              >
                <span>REGISTER VIA LUMA</span>
                <ArrowUpRight className="w-4 h-4 stroke-[3]" />
              </a>
            </div>

            <div className="pt-3 border-t border-[#292524]">
              <span className="text-[10px] text-[#78716C] block uppercase font-bold">HOSTED BY</span>
              <span className="text-xs font-bold text-[#FAF4EC]">{eventConfig.host}</span>
            </div>
          </div>
        </div>

        {/* Bottom Credits Bar */}
        <div className="pt-8 border-t border-[#292524] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#78716C]">
          <p>© {new Date().getFullYear()} Yuva Shakti Sangam. All rights reserved.</p>
          <div className="flex items-center gap-1.5">
            <span>Building for Bharat</span>
            <span className="text-[#E65100]">✦</span>
            <span>Maninagar, Ahmedabad</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
