"use client";

import React, { useState, useEffect } from "react";
import {
  Download,
  Share2,
  CheckCircle2,
  Loader2,
  FileText,
  Image as ImageIcon,
  Award,
  Sparkles,
  Ticket,
} from "lucide-react";
import confetti from "canvas-confetti";
import { Participant } from "@/types/registration";
import {
  generateCertificatePdf,
  generateCertificatePng,
  generateCertificateDataUrl,
  formatParticipantName,
} from "@/lib/ticket/certificate-generator";
import { downloadBlob } from "@/lib/ticket/generator";

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
  const [certDataUrl, setCertDataUrl] = useState<string>("");
  const [loadingPreview, setLoadingPreview] = useState(true);

  const formattedName = formatParticipantName(participant.name || "Participant");

  // Render on-screen preview image using the official certificate template
  useEffect(() => {
    let isMounted = true;
    generateCertificateDataUrl(participant)
      .then((url) => {
        if (isMounted) {
          setCertDataUrl(url);
          setLoadingPreview(false);
        }
      })
      .catch((err) => {
        console.error("Preview render error:", err);
        if (isMounted) setLoadingPreview(false);
      });

    // Trigger celebratory confetti on certificate reveal
    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.5 },
        colors: ["#E65100", "#FFA000", "#15803D", "#FFFFFF", "#B45309"],
      });
    } catch (e) {
      // Safe fallback
    }

    return () => {
      isMounted = false;
    };
  }, [participant]);

  const handleDownloadPdf = async () => {
    setDownloadingPdf(true);
    try {
      const blob = await generateCertificatePdf(participant);
      const safeName = formattedName.replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "_");
      downloadBlob(
        blob,
        `Yuva-Shakti-Sangam-Certificate-${participant.registration_id}-${safeName}.pdf`
      );
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
      const safeName = formattedName.replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "_");
      downloadBlob(
        blob,
        `Yuva-Shakti-Sangam-Certificate-${participant.registration_id}-${safeName}.png`
      );
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
          title: `Yuva Shakti Sangam Certificate - ${formattedName}`,
          text: shareText,
          url: certUrl,
        });
        setShared(true);
      } catch (e) {
        // User cancelled
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
          Congratulations, {formattedName}!
        </h2>
        <p className="text-xs text-[#5A4839]">
          Thank you for joining Yuva Shakti Sangam and contributing towards a cultured, organised and stronger nation.
        </p>
      </div>

      {/* Visual Official Certificate Container */}
      <div className="relative rounded-3xl bg-[#1C140E] p-2 sm:p-3 shadow-2xl overflow-hidden border-2 border-[#D97706]">
        {loadingPreview ? (
          <div className="aspect-[3000/1998] w-full rounded-2xl bg-[#F5EADC] flex flex-col items-center justify-center gap-3 p-6 text-center">
            <Loader2 className="w-8 h-8 text-[#E65100] animate-spin" />
            <div className="space-y-1">
              <span className="text-sm font-bold text-[#1C140E] block">
                Rendering Official Certificate...
              </span>
              <span className="text-xs text-[#5A4839] block">
                Customizing with your name: {formattedName}
              </span>
            </div>
          </div>
        ) : (
          <div className="relative group overflow-hidden rounded-2xl">
            {/* Real Customized Official Certificate Image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={certDataUrl}
              alt={`Yuva Shakti Sangam Certificate of Participation - ${formattedName}`}
              className="w-full h-auto object-contain rounded-2xl shadow-inner transition-transform duration-300 group-hover:scale-[1.01]"
            />

            <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-[#1C140E]/80 backdrop-blur-md border border-[#FFA000]/40 flex items-center gap-1.5 text-[10px] font-mono text-amber-200">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>OFFICIAL 300 DPI</span>
            </div>
          </div>
        )}
      </div>

      {/* Primary Action Buttons: Download PDF & Save Photo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={handleDownloadPdf}
          disabled={downloadingPdf}
          className="py-4 px-5 rounded-2xl btn-bhagwa-primary text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all cursor-pointer disabled:opacity-60"
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
          className="py-4 px-5 rounded-2xl bg-[#1C140E] hover:bg-[#2A1D15] text-[#FAF4EC] text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all cursor-pointer disabled:opacity-60 border border-[#D97706]/40"
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
