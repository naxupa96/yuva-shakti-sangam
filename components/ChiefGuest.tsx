"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Trophy,
  Award,
  Flame,
  Zap,
  Compass,
  Clock,
  Medal,
  HeartHandshake,
  BookOpen,
  Sparkles,
  ArrowRight,
  Eye,
  X,
  CheckCircle2,
  MapPin,
  GraduationCap,
  Maximize2,
} from "lucide-react";
import { chiefGuestData, ChiefGuestGalleryItem, ChiefGuestRecord } from "@/lib/data";
import { CornerOrnament, DevanagariWatermark, OrnamentalDivider } from "./Decorations";

const iconMap: Record<string, React.ElementType> = {
  Trophy,
  Flame,
  Zap,
  Compass,
  Clock,
  Medal,
  Award,
};

export default function ChiefGuest() {
  const [activeTab, setActiveTab] = useState<"overview" | "records" | "initiatives" | "gallery">("overview");
  const [selectedImage, setSelectedImage] = useState<ChiefGuestGalleryItem | null>(null);

  return (
    <section
      id="chief-guest"
      className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#EAE0D0] bg-parchment-texture relative overflow-hidden border-b border-[#17130E]/15"
    >
      <DevanagariWatermark
        text="अतिथि"
        className="top-10 right-4 text-[12rem] sm:text-[22rem] text-[#17130E]/5 pointer-events-none select-none"
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#17130E] text-[#FAF4EC] text-xs font-black uppercase tracking-widest shadow-sm">
            <Trophy className="w-3.5 h-3.5 text-[#FFA000]" />
            <span>CHIEF GUEST & KEYNOTE SPEAKER • મુખ્ય અતિથિ વિશેષ</span>
          </div>

          <div className="space-y-1">
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-black uppercase text-[#17130E] tracking-tight leading-tight">
              MEET <span className="text-[#F05A12]">RUPESH MAKWANA</span>
            </h2>
            <div className="font-devanagari font-black text-2xl sm:text-3xl text-[#5A4839] flex items-center justify-center gap-2 pt-0.5">
              <span className="text-[#F05A12]">{chiefGuestData.nameGujarati}</span>
              <span>•</span>
              <span className="text-[#17130E]">{chiefGuestData.mottoGujarati}</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm md:text-base text-[#5A4839] max-w-2xl mx-auto leading-relaxed font-medium">
            Guinness World Record Holder, Gujarat Gaurav Ratna Awardee, National Ultra-Athlete, and Founder of the
            nationwide <span className="text-[#F05A12] font-black">&ldquo;SAVE YOUTH SAVE NATION&rdquo;</span> mission.
          </p>
        </div>

        {/* Hero Spotlight Card */}
        <div className="rounded-3xl bg-[#F2DFBD] border-2 border-[#17130E]/15 shadow-parchment-deep p-6 sm:p-9 lg:p-10 relative overflow-hidden mb-12">
          <CornerOrnament className="absolute top-3 left-3 text-[#F05A12]/40" />
          <CornerOrnament className="absolute top-3 right-3 text-[#F05A12]/40 -scale-x-100" />
          <CornerOrnament className="absolute bottom-3 left-3 text-[#F05A12]/40 -scale-y-100" />
          <CornerOrnament className="absolute bottom-3 right-3 text-[#F05A12]/40 -scale-100" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center relative z-10">
            {/* Left Portrait & Badge Column */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 rounded-3xl overflow-hidden border-4 border-[#F05A12]/40 shadow-2xl bg-[#17130E] group">
                <Image
                  src="/images/chief-guest/portrait.jpg"
                  alt="Rupesh Makwana - Chief Guest Yuva Shakti Sangam"
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  priority
                />

                {/* Gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#17130E]/90 via-transparent to-transparent pointer-events-none" />

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-3 inset-x-3 text-center">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F05A12] text-white text-[11px] font-black uppercase tracking-wider shadow-md">
                    <Sparkles className="w-3 h-3 text-[#FFA000]" />
                    GUINNESS RECORD HOLDER
                  </span>
                </div>
              </div>

              {/* Coaching & Location Badges */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2 max-w-sm text-center">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#17130E] px-2.5 py-1 rounded-lg bg-[#E7CEA3] border border-[#17130E]/15 shadow-sm">
                  <MapPin className="w-3.5 h-3.5 text-[#F05A12]" />
                  {chiefGuestData.location}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#17130E] px-2.5 py-1 rounded-lg bg-[#E7CEA3] border border-[#17130E]/15 shadow-sm">
                  <GraduationCap className="w-3.5 h-3.5 text-[#F05A12]" />
                  NSNIS Patiala Coach (2021)
                </span>
              </div>
            </div>

            {/* Right Biography & Highlights Column */}
            <div className="lg:col-span-7 space-y-5 text-left">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#F05A12]">
                  <Flame className="w-4 h-4 fill-[#F05A12]" />
                  <span>રાષ્ટ્ર પ્રથમ • NATION FIRST</span>
                </div>
                <h3 className="text-2xl sm:text-4xl font-display font-black uppercase text-[#17130E] tracking-tight">
                  {chiefGuestData.name}
                </h3>
                <p className="text-xs sm:text-sm font-bold text-[#C8460B]">
                  {chiefGuestData.title}
                </p>
              </div>

              {/* Bio Paragraph */}
              <p className="text-xs sm:text-sm text-[#5A4839] leading-relaxed">
                {chiefGuestData.bioSummary}
              </p>

              {/* Awards Pill Strip */}
              <div className="space-y-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#17130E] block">
                  Honors & Accolades:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {chiefGuestData.awards.map((award, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#17130E] text-[#FAF4EC] text-[11px] font-bold tracking-wide"
                    >
                      <CheckCircle2 className="w-3 h-3 text-[#FFA000]" />
                      {award}
                    </span>
                  ))}
                </div>
              </div>

              {/* Mission Statement Box */}
              <div className="p-4 rounded-2xl bg-[#E7CEA3] border border-[#F05A12]/30 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded bg-[#F05A12] text-white">
                    CORE MISSION
                  </span>
                  <span className="text-xs font-black uppercase tracking-wider text-[#17130E]">
                    &ldquo;{chiefGuestData.missionStatement.split("&")[0]}&rdquo;
                  </span>
                </div>
                <p className="text-[11px] text-[#5A4839] leading-normal pt-0.5">
                  Running the nationwide youth initiative <strong className="text-[#17130E]">SAVE YOUTH SAVE NATION</strong> since 2017 to eradicate drug addiction and inspire physical fitness and character development.
                </p>
              </div>

              {/* Live Samvaad Keynote Link */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Link
                  href="/register"
                  className="px-6 py-3 rounded-xl btn-bhagwa-primary text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-bhagwa-sm"
                >
                  <span>REGISTER TO HEAR KEYNOTE</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="#samvaad"
                  className="px-5 py-3 rounded-xl bg-[#17130E] hover:bg-[#24170D] text-[#F2DFBD] text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>ABOUT YUVA SAMVAAD</span>
                  <ChevronRight className="w-4 h-4 text-[#FFA000]" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Stat Impact Metric Ribbon */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-14">
          {chiefGuestData.keyStats.map((stat, idx) => (
            <div
              key={idx}
              className="p-4 sm:p-5 rounded-2xl bg-[#F2DFBD] border border-[#17130E]/15 shadow-parchment-card text-center space-y-1 hover:border-[#F05A12]/50 transition-colors"
            >
              <span className="font-display font-black text-2xl sm:text-3xl text-[#F05A12] block tracking-tight">
                {stat.value}
              </span>
              <span className="text-xs font-black uppercase text-[#17130E] block leading-tight">
                {stat.label}
              </span>
              <span className="text-[10px] text-[#5A4839] block leading-tight">
                {stat.sublabel}
              </span>
            </div>
          ))}
        </div>

        {/* Interactive Tabs Navigation */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 sm:px-6 py-2.5 rounded-xl font-display font-black text-xs sm:text-sm uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "overview"
                ? "btn-bhagwa-primary shadow-bhagwa-sm scale-105"
                : "bg-[#F2DFBD] text-[#17130E] border border-[#17130E]/15 hover:border-[#F05A12]/60"
            }`}
          >
            Key Records & Feats
          </button>
          <button
            onClick={() => setActiveTab("initiatives")}
            className={`px-4 sm:px-6 py-2.5 rounded-xl font-display font-black text-xs sm:text-sm uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "initiatives"
                ? "btn-bhagwa-primary shadow-bhagwa-sm scale-105"
                : "bg-[#F2DFBD] text-[#17130E] border border-[#17130E]/15 hover:border-[#F05A12]/60"
            }`}
          >
            Grassroots Seva & Mission
          </button>
          <button
            onClick={() => setActiveTab("gallery")}
            className={`px-4 sm:px-6 py-2.5 rounded-xl font-display font-black text-xs sm:text-sm uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "gallery"
                ? "btn-bhagwa-primary shadow-bhagwa-sm scale-105"
                : "bg-[#F2DFBD] text-[#17130E] border border-[#17130E]/15 hover:border-[#F05A12]/60"
            }`}
          >
            Certificates & Media ({chiefGuestData.gallery.length})
          </button>
        </div>

        {/* Tab 1: Key Records & Feats */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 animate-in fade-in duration-300">
            {chiefGuestData.records.map((rec: ChiefGuestRecord) => {
              const IconComponent = iconMap[rec.iconName] || Trophy;
              const isGuinness = rec.id === "guinness-6000km";
              return (
                <div
                  key={rec.id}
                  className={`p-5 sm:p-6 rounded-2xl border transition-all duration-200 shadow-parchment-card flex flex-col justify-between ${
                    isGuinness
                      ? "bg-[#FAF4EC] border-2 border-[#F05A12] ring-2 ring-[#F05A12]/20 md:col-span-2 lg:col-span-2"
                      : "bg-[#F2DFBD] border-[#17130E]/15 hover:border-[#F05A12]/50"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded bg-[#17130E] text-[#FAF4EC]">
                        {rec.badge}
                      </span>
                      <IconComponent className={`w-5 h-5 shrink-0 ${isGuinness ? "text-[#F05A12]" : "text-[#5A4839]"}`} />
                    </div>

                    <div className="space-y-1">
                      <span className="font-display font-black text-xl sm:text-2xl text-[#F05A12] block tracking-tight">
                        {rec.metric}
                      </span>
                      <h4 className="font-display font-bold text-sm sm:text-base text-[#17130E] uppercase leading-snug">
                        {rec.title}
                      </h4>
                    </div>

                    <p className="text-xs text-[#5A4839] leading-relaxed">
                      {rec.description}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-[#17130E]/10 flex items-center justify-between text-[11px] font-bold text-[#5A4839]">
                    <span>Timeline: {rec.year}</span>
                    <span className="text-[#F05A12] uppercase">Verified Feat ✓</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: Grassroots Seva & Initiatives */}
        {activeTab === "initiatives" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {chiefGuestData.initiatives.map((item) => (
              <div
                key={item.id}
                className="p-6 sm:p-8 rounded-3xl bg-[#F2DFBD] border-2 border-[#17130E]/15 shadow-parchment-deep grid grid-cols-1 lg:grid-cols-12 gap-6 items-center"
              >
                {/* Visual Image */}
                <div className="lg:col-span-5 relative h-56 sm:h-64 rounded-2xl overflow-hidden border border-[#17130E]/20 shadow-md">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-lg bg-[#17130E]/90 text-[#FAF4EC] text-[10px] font-black uppercase tracking-wider backdrop-blur-sm">
                      {item.impactTag}
                    </span>
                  </div>
                </div>

                {/* Initiative Description */}
                <div className="lg:col-span-7 space-y-3 text-left">
                  <div className="space-y-1">
                    <span className="text-xs font-devanagari font-bold text-[#F05A12]">
                      {item.titleGujarati}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-display font-black text-[#17130E] uppercase tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-xs font-bold text-[#C8460B] tracking-wide">
                      {item.tagline}
                    </p>
                  </div>

                  <p className="text-xs sm:text-sm text-[#5A4839] leading-relaxed">
                    {item.description}
                  </p>

                  <div className="pt-2 flex items-center gap-2 text-xs font-black text-[#17130E]">
                    <CheckCircle2 className="w-4 h-4 text-[#F05A12]" />
                    <span>Free Community Upliftment • Dedicated Volunteer Service</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Certificate & Media Lightbox Gallery */}
        {activeTab === "gallery" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {chiefGuestData.gallery.map((gItem) => (
                <div
                  key={gItem.id}
                  onClick={() => setSelectedImage(gItem)}
                  className="group rounded-2xl bg-[#F2DFBD] border border-[#17130E]/15 overflow-hidden shadow-parchment-card hover:border-[#F05A12] transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="relative h-64 sm:h-72 w-full bg-[#17130E]/10 overflow-hidden">
                    <Image
                      src={gItem.image}
                      alt={gItem.title}
                      fill
                      className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-1.5 font-bold text-xs uppercase tracking-wider backdrop-blur-[2px]">
                      <Maximize2 className="w-4 h-4" />
                      <span>Click to Enlarge</span>
                    </div>
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#17130E]/90 text-[#FFA000] text-[9px] font-black uppercase">
                      {gItem.category}
                    </span>
                  </div>

                  <div className="p-4 text-left space-y-0.5">
                    <h4 className="font-display font-bold text-sm text-[#17130E] uppercase">
                      {gItem.title}
                    </h4>
                    <p className="text-[11px] text-[#5A4839] truncate">
                      {gItem.subtitle}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <OrnamentalDivider className="mt-14 opacity-30 text-[#F05A12]" />
      </div>

      {/* Lightbox Modal for Certificates and Media */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-3xl w-full max-h-[90vh] bg-[#F2DFBD] rounded-3xl p-4 sm:p-6 border-2 border-[#F05A12] shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#17130E]/15 mb-3">
              <div>
                <span className="text-[10px] font-mono font-black uppercase text-[#F05A12]">
                  {selectedImage.category}
                </span>
                <h3 className="font-display font-black text-base sm:text-xl text-[#17130E] uppercase">
                  {selectedImage.title}
                </h3>
                <p className="text-xs text-[#5A4839]">
                  {selectedImage.subtitle}
                </p>
              </div>

              <button
                onClick={() => setSelectedImage(null)}
                className="p-2 rounded-xl bg-[#17130E] text-[#F2DFBD] hover:bg-[#F05A12] hover:text-white transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Image Display */}
            <div className="relative w-full h-[60vh] rounded-xl overflow-hidden bg-[#17130E]/5">
              <Image
                src={selectedImage.image}
                alt={selectedImage.title}
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function ChevronRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
