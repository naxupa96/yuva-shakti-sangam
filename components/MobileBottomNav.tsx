"use client";

import React, { useEffect, useState } from "react";
import { Home, Gamepad2, MessageSquare, Flag } from "lucide-react";

export default function MobileBottomNav() {
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 250;
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
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#17130E]/95 backdrop-blur-lg border-t border-[#E7CEA3]/15 px-4 py-2 pb-[max(0.6rem,env(safe-area-inset-bottom))] shadow-2xl">
      <nav className="grid grid-cols-4 max-w-md mx-auto items-center">
        {/* 1. Home */}
        <a
          href="#"
          className={`flex flex-col items-center justify-center gap-1 py-1 transition-colors ${
            activeSection === "home" ? "text-[#F05A12]" : "text-[#A89886] hover:text-[#F2DFBD]"
          }`}
        >
          <Home className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px] font-black uppercase tracking-wider">HOME</span>
        </a>

        {/* 2. Experience */}
        <a
          href="#experience"
          className={`flex flex-col items-center justify-center gap-1 py-1 transition-colors ${
            activeSection === "experience" ? "text-[#F05A12]" : "text-[#A89886] hover:text-[#F2DFBD]"
          }`}
        >
          <Gamepad2 className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px] font-black uppercase tracking-wider">EXPERIENCE</span>
        </a>

        {/* 3. Samvaad */}
        <a
          href="#samvaad"
          className={`flex flex-col items-center justify-center gap-1 py-1 transition-colors ${
            activeSection === "samvaad" ? "text-[#F05A12]" : "text-[#A89886] hover:text-[#F2DFBD]"
          }`}
        >
          <MessageSquare className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px] font-black uppercase tracking-wider">SAMVAAD</span>
        </a>

        {/* 4. About RSS */}
        <a
          href="#about-rss"
          className={`flex flex-col items-center justify-center gap-1 py-1 transition-colors ${
            activeSection === "about-rss" ? "text-[#F05A12]" : "text-[#A89886] hover:text-[#F2DFBD]"
          }`}
        >
          <Flag className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px] font-black uppercase tracking-wider whitespace-nowrap">ABOUT RSS</span>
        </a>
      </nav>
    </div>
  );
}
