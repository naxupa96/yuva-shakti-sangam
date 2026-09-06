"use client";

import React, { useState, useEffect } from "react";
import {
  Download,
  Share2,
  CheckCircle2,
  Loader2,
  FileText,
  Image as ImageIcon,
  ExternalLink,
  Award,
  Sparkles,
  Ticket,
} from "lucide-react";
import confetti from "canvas-confetti";
import { Participant } from "@/types/registration";
import {
  generateCertificatePdf,
  generateCertificatePng,
} from "@/lib/ticket/certificate-generator";
import { downloadBlob } from "@/lib/ticket/generator";
import { CornerOrnament, DevanagariWatermark } from "@/components/Decorations";

interface ParticipationCertificateProps {
  participant: Participant;
  onSwitchToPass?: () => void;
}

export default function ParticipationCertificate({
  participant,
  onSwitchToPass,
}: ParticipationCertificateProps) {
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [downloadingPng, setDownloadingPng] = useState(false);
  const [shared, setShared] = useState(false);

  // Trigger celebratory confetti on initial certificate reveal
  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#E65100", "#FFA000", "#15803D", "#FFFFFF", "#B45309"],
      });
    } catch (e) {
      // safe fallback
    }
  }, []);

  const handleDownloadPdf = async () => {
    setDownloadingPdf(true);
    try {
      const blob = await generateCertificatePdf(participant);
      downloadBlob(blob, `Yuva-Shakti-Sangam-Certificate-${participant.registration_id}.pdf`);
    } catch (err) {
      console.error("PDF certificate generation error:", err);
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handleDownloadPng = async () => {
    setDownloadingPng(true);
    try {
      const blob = await generateCertificatePng(participant);
      downloadBlob(blob, `Yuva-Shakti-Sangam-Certificate-${participant.registration_id}.png`);
    } catch (err) {
      console.error("PNG certificate generation error:", err);
    } finally {
      setDownloadingPng(false);
    }
  };

  const handleShare = async () => {
    const certUrl = window.location.href;
    const shareText = `I proudly participated in Yuva Shakti Sangam national youth assembly on 6 September 2026 at Ahmedabad! Here is my official Certificate of Participation: ${certUrl}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Yuva Shakti Sangam Certificate - ${participant.name}`,
          text: shareText,
          url: certUrl,
        });
        setShared(true);
      } catch (e) {
        // user cancelled or share failed
      }
    } else {
      await navigator.clipboard.writeText(certUrl);
      setShared(true);
      setTimeout(() => setShared(false), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Celebration Header */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#B45309]/20 via-[#E65100]/25 to-[#B45309]/20 border border-[#E65100]/40 text-center space-y-1 shadow-md animate-in fade-in">
        <div className="flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest text-[#B45309]">
          <Award className="w-4 h-4 text-[#E65100]" />
          <span>OFFICIAL PARTICIPATION CERTIFICATE</span>
          <Sparkles className="w-4 h-4 text-[#FFA000]" />
        </div>
        <h2 className="text-xl sm:text-2xl font-display font-black text-[#1C140E] uppercase tracking-tight">
          Congratulations, {participant.name}!
        </h2>
        <p className="text-xs text-[#5A4839]">
          Thank you for joining Yuva Shakti Sangam today and being a torchbearer for Bharat&apos;s youth.
        </p>
      </div>

      {/* Visual Certificate Container (A4 Landscape aspect ratio) */}
      <div className="relative rounded-3xl bg-[#FDF8EE] border-4 border-[#B45309] shadow-2xl p-6 sm:p-10 text-center overflow-hidden">
        {/* Inner Gold Hairline Frame */}
        <div className="absolute inset-2 sm:inset-3 border-2 border-[#D97706]/70 rounded-2xl pointer-events-none" />
        <div className="absolute inset-3 sm:inset-4 border border-[#1C140E]/30 rounded-xl pointer-events-none" />

        {/* Corner Ornaments */}
        <CornerOrnament className="absolute top-4 left-4 text-[#B45309]/60" />
        <CornerOrnament className="absolute top-4 right-4 text-[#B45309]/60 -scale-x-100" />
        <CornerOrnament className="absolute bottom-4 left-4 text-[#B45309]/60 -scale-y-100" />
        <CornerOrnament className="absolute bottom-4 right-4 text-[#B45309]/60 -scale-100" />

        {/* Devanagari Background Watermark */}
        <DevanagariWatermark
          text="संगम"
          className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[12rem] sm:text-[18rem] text-[#B45309]/5 select-none pointer-events-none"
        />

        <div className="relative z-10 space-y-5">
          {/* Certificate Header */}
          <div className="space-y-1">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#B45309] block">
              Rashtriya Swayamsevak Sangh (RSS)
            </span>
            <h1 className="text-2xl sm:text-4xl font-display font-black uppercase text-[#1C140E] tracking-tight">
              YUVA <span className="text-[#E65100]">SHAKTI</span> SANGAM
            </h1>
            <div className="text-[11px] font-devanagari font-black text-[#E65100] tracking-wide">
              युवा शक्ति • राष्ट्र शक्ति
            </div>
            <div className="w-24 h-0.5 bg-[#D97706] mx-auto mt-2" />
          </div>

          {/* Ribbon */}
          <div className="inline-block px-6 py-2 rounded-xl bg-[#1C140E] text-white shadow-md">
            <span className="font-display font-black text-xs sm:text-sm uppercase tracking-widest text-amber-300">
              CERTIFICATE OF PARTICIPATION
            </span>
            <span className="text-[11px] font-devanagari block text-white/80 font-bold">
              साभार प्रमाण पत्र
            </span>
          </div>

          {/* Recipient */}
          <div className="space-y-1.5 pt-1">
            <p className="text-xs sm:text-sm text-[#5A4839] font-medium italic">
              This is proudly presented to
            </p>
            <h3 className="text-2xl sm:text-3xl font-display font-black text-[#1C140E] uppercase tracking-wide underline decoration-[#E65100] decoration-2 underline-offset-8">
              {participant.name}
            </h3>
          </div>

          {/* Citation */}
          <div className="max-w-md mx-auto text-xs sm:text-sm text-[#4A3B32] leading-relaxed pt-2">
            for active participation and enthusiastic presence in the national youth assembly{" "}
            <strong>YUVA SHAKTI SANGAM</strong>, contributing ideas, energy, and leadership towards
            nation-building (राष्ट्र निर्माण).
          </div>

          {/* Verified Details Card */}
          <div className="max-w-md mx-auto p-3 sm:p-4 rounded-xl bg-[#F5EADC] border border-[#D97706]/40 text-left text-xs font-mono grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <span className="text-[9px] text-[#5A4839] uppercase font-bold block">DATE & VENUE</span>
              <span className="font-bold text-[#1C140E]">06 September 2026</span>
              <span className="text-[10px] text-[#5A4839] block truncate">Maninagar, Ahmedabad</span>
            </div>
            <div>
              <span className="text-[9px] text-[#5A4839] uppercase font-bold block">REGISTRATION & STATUS</span>
              <span className="font-bold text-[#B45309]">{participant.registration_id}</span>
              <span className="text-[10px] text-emerald-700 font-bold block flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Verified Attendee</span>
              </span>
            </div>
          </div>

          {/* Bottom Signatures & Official Badge */}
          <div className="pt-4 border-t border-[#1C140E]/15 flex flex-wrap items-center justify-between gap-4 text-left">
            <div className="flex items-center gap-2.5">
              <div className="w-12 h-12 rounded-full border-2 border-dashed border-[#D97706] bg-amber-100/60 flex flex-col items-center justify-center text-center p-1 text-[8px] font-black text-[#B45309]">
                <span>OFFICIAL</span>
                <span className="text-[#1C140E]">SEAL</span>
                <span>2026</span>
              </div>
              <div className="text-[10px] font-mono text-[#5A4839]">
                <span className="font-bold text-[#1C140E] block">Yuva Shakti Sangam</span>
                <span>Karnavati, Gujarat</span>
              </div>
            </div>

            <div className="text-right">
              <div className="w-32 border-b border-[#1C140E]/60 pb-1 mb-1" />
              <span className="text-[11px] font-bold text-[#1C140E] block">
                Organizing Committee
              </span>
              <span className="text-[9px] text-[#5A4839] font-mono block">
                Yuva Shakti Sangam 2026
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons: Download PDF, Image, Share, Switch to Pass */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={handleDownloadPdf}
          disabled={downloadingPdf}
          className="py-3.5 px-5 rounded-2xl btn-bhagwa-primary text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all cursor-pointer disabled:opacity-60"
        >
          {downloadingPdf ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <FileText className="w-4 h-4" />
          )}
          <span>DOWNLOAD PDF CERTIFICATE</span>
        </button>

        <button
          onClick={handleDownloadPng}
          disabled={downloadingPng}
          className="py-3.5 px-5 rounded-2xl bg-[#1C140E] hover:bg-[#2A1D15] text-[#FAF4EC] text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all cursor-pointer disabled:opacity-60"
        >
          {downloadingPng ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <ImageIcon className="w-4 h-4 text-[#FFA000]" />
          )}
          <span>SAVE AS IMAGE (PHOTO)</span>
        </button>
      </div>

      {/* Share & Switch Controls */}
      <div className="flex items-center justify-between gap-2 pt-1">
        {onSwitchToPass && (
          <button
            onClick={onSwitchToPass}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5A4839] hover:text-[#E65100] transition-colors cursor-pointer"
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>View Entry Pass</span>
          </button>
        )}

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B45309] hover:text-[#E65100] transition-colors cursor-pointer ml-auto"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>{shared ? "LINK COPIED!" : "SHARE CERTIFICATE"}</span>
        </button>
      </div>
    </div>
  );
}
