"use client";

import React, { useEffect, useState } from "react";
import { Home, Gamepad2, MessageSquare, Flag, Edit3 } from "lucide-react";
import { LUMA_REGISTRATION_URL } from "@/lib/config";

export default function MobileBottomNav() {
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      const sections = [
        { id: "hero", name: "home" },
        { id: "experience", name: "experience" },
        { id: "samvaad", name: "samvaad" },
        { id: "about-rss", name: "about-rss" },
      ];

      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.name);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#141210]/95 backdrop-blur-lg border-t border-[#EAE0D0]/10 px-3 py-2.5 pb-[max(0.6rem,env(safe-area-inset-bottom))] shadow-2xl">
      <nav className="flex items-center justify-between max-w-md mx-auto">
        {/* 1. Home */}
        <a
          href="#"
          className={`flex flex-col items-center gap-1 transition-colors ${
            activeSection === "home" ? "text-[#E65100]" : "text-[#A8A29E] hover:text-[#FAF4EC]"
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-black uppercase tracking-wider">HOME</span>
        </a>

        {/* 2. Experience */}
        <a
          href="#experience"
          className={`flex flex-col items-center gap-1 transition-colors ${
            activeSection === "experience" ? "text-[#E65100]" : "text-[#A8A29E] hover:text-[#FAF4EC]"
          }`}
        >
          <Gamepad2 className="w-5 h-5" />
          <span className="text-[10px] font-black uppercase tracking-wider">EXPERIENCE</span>
        </a>

        {/* 3. Samvaad */}
        <a
          href="#samvaad"
          className={`flex flex-col items-center gap-1 transition-colors ${
            activeSection === "samvaad" ? "text-[#E65100]" : "text-[#A8A29E] hover:text-[#FAF4EC]"
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-[10px] font-black uppercase tracking-wider">SAMVAAD</span>
        </a>

        {/* 4. About RSS */}
        <a
          href="#about-rss"
          className={`flex flex-col items-center gap-1 transition-colors ${
            activeSection === "about-rss" ? "text-[#E65100]" : "text-[#A8A29E] hover:text-[#FAF4EC]"
          }`}
        >
          <Flag className="w-5 h-5" />
          <span className="text-[10px] font-black uppercase tracking-wider">ABOUT RSS</span>
        </a>

        {/* 5. Register Button Pill matching reference */}
        <a
          href={LUMA_REGISTRATION_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#E65100] text-white text-[11px] font-black uppercase tracking-wider shadow-bhagwa-sm transition-transform active:scale-95"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>REGISTER</span>
        </a>
      </nav>
    </div>
  );
}
