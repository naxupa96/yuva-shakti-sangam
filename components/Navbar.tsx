"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { navItems } from "@/lib/data";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!scrolled && !isOpen) {
    return null;
  }

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 bg-[#E7CEA3]/95 backdrop-blur-md border-b border-[#17130E]/15 shadow-md animate-in slide-in-from-top duration-200"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Emblem & Name */}
          <a href="#" className="flex items-center gap-3 group">
            {/* Om Emblem Badge */}
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#17130E] border border-[#F05A12]/40 flex items-center justify-center text-[#F05A12] text-xl sm:text-2xl font-bold shadow-sm">
              <span>ॐ</span>
            </div>

            {/* Typography */}
            <div className="flex flex-col">
              <div className="font-display font-black text-lg sm:text-2xl text-[#17130E] tracking-tight leading-none uppercase">
                YUVA <span className="text-[#F05A12]">SHAKTI</span> SANGAM
              </div>
              <div className="text-[10px] sm:text-xs font-devanagari font-bold text-[#5A4839] flex items-center gap-1.5 mt-0.5">
                <span className="text-[#F05A12]">युवा शक्ति</span>
                <span>•</span>
                <span className="text-[#17130E]">राष्ट्र शक्ति</span>
              </div>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-extrabold uppercase tracking-wider text-[#5A4839]">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="hover:text-[#F05A12] transition-colors py-1"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Register Action CTA */}
          <div className="flex items-center gap-3">
            <Link
              href="/register"
              className="px-5 py-2.5 rounded-xl btn-bhagwa-primary text-xs font-black uppercase tracking-wider flex items-center gap-1.5"
            >
              <span>REGISTER (₹50)</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-xl bg-[#17130E] text-[#F2DFBD] hover:bg-[#24170D] transition-colors"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-[#17130E]/15 animate-in slide-in-from-top-2 duration-150">
            <div className="flex flex-col space-y-3 font-display font-bold text-sm tracking-wider text-[#17130E]">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-2 rounded-lg hover:bg-[#F2DFBD] hover:text-[#F05A12] transition-colors"
                >
                  {item.label}
                </a>
              ))}
              <div className="pt-2">
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center py-3 rounded-xl btn-bhagwa-primary text-xs font-black uppercase tracking-wider"
                >
                  REGISTER NOW (₹50)
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
