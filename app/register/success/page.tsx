"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import confetti from "canvas-confetti";
import {
  CheckCircle2,
  Download,
  Share2,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Loader2,
  Ticket as TicketIcon,
} from "lucide-react";
import { eventConfig } from "@/lib/config";
import { CornerOrnament, MandalaMotif, DevanagariWatermark } from "@/components/Decorations";
import { Participant } from "@/types/registration";
import { generateQrDataUrl, generateTicketPdf, downloadBlob } from "@/lib/ticket/generator";

function SuccessContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const registrationId = searchParams.get("id") || "";

  const [participant, setParticipant] = useState<Participant | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [shared, setShared] = useState(false);

  useEffect(() => {
    // Fire festive celebratory confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#F05A12", "#FFA000", "#17130E", "#22C55E"],
    });

    if (token) {
      fetch(`/api/ticket/${token}`)
        .then((res) => res.json())
        .then(async (data) => {
          if (data.success && data.participant) {
            setParticipant(data.participant);
            const qr = await generateQrDataUrl(data.participant.qr_token);
            setQrDataUrl(qr);

            // Auto-trigger ticket download
            try {
              const pdfBlob = await generateTicketPdf(data.participant);
              downloadBlob(pdfBlob, `Yuva-Shakti-Sangam-${data.participant.registration_id}.pdf`);
            } catch (pdfErr) {
              console.warn("Auto download prevented or failed:", pdfErr);
            }
          }
        })
        .catch((err) => console.error("Ticket fetch error:", err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const handleDownload = async () => {
    if (!participant) return;
    setDownloading(true);
    try {
      const pdfBlob = await generateTicketPdf(participant);
      downloadBlob(pdfBlob, `Yuva-Shakti-Sangam-${participant.registration_id}.pdf`);
    } catch (err) {
      console.error("Manual download error:", err);
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    if (!participant) return;
    const ticketUrl = `${window.location.origin}/ticket/${participant.qr_token}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Yuva Shakti Sangam Pass - ${participant.name}`,
          text: `Here is my official entry pass for Yuva Shakti Sangam (Reg ID: ${participant.registration_id})!`,
          url: ticketUrl,
        });
        setShared(true);
      } catch (err) {
        console.warn("Share cancelled or failed:", err);
      }
    } else {
      // Fallback copy to clipboard
      await navigator.clipboard.writeText(ticketUrl);
      setShared(true);
      setTimeout(() => setShared(false), 3000);
    }
  };

  const isPaid = participant?.payment_status === "paid";
  const isCashPending = participant?.payment_method === "cash" && participant?.payment_status === "pending";

  return (
    <div className="min-h-screen bg-[#EAE0D0] bg-parchment-texture text-[#1C1917] selection:bg-[#E65100] selection:text-white py-8 sm:py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <DevanagariWatermark text="संगम" className="top-10 left-6 text-[14rem] sm:text-[22rem] text-[#292524]/5" />

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Main Card */}
        <div className="p-6 sm:p-12 rounded-3xl bg-[#F5EBE1] border-2 border-[#292524]/15 shadow-parchment-deep relative overflow-hidden text-center">
          <CornerOrnament className="absolute top-3 left-3 text-[#E65100]/40" />
          <CornerOrnament className="absolute top-3 right-3 text-[#E65100]/40 -scale-x-100" />
          <CornerOrnament className="absolute bottom-3 left-3 text-[#E65100]/40 -scale-y-100" />
          <CornerOrnament className="absolute bottom-3 right-3 text-[#E65100]/40 -scale-100" />

          {/* Background Mandala */}
          <div className="absolute -right-24 -top-24 opacity-20 text-[#E65100] pointer-events-none">
            <MandalaMotif size={420} />
          </div>

          {/* Top Status Icon & Badge */}
          <div className="flex flex-col items-center justify-center space-y-3 mb-6">
            <div className="w-16 h-16 rounded-3xl bg-green-100 border-2 border-green-600/30 flex items-center justify-center text-green-700 shadow-md">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-[#1C1917] text-[#FAF4EC] text-xs font-black uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-[#FFA000]" />
              <span>REGISTRATION CONFIRMED</span>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl font-display font-black uppercase text-[#1C1917] tracking-tight leading-none mb-2">
            YOU&apos;RE <span className="text-[#F05A12]">REGISTERED!</span>
          </h1>

          <p className="text-sm sm:text-base text-[#5A4839] font-medium max-w-md mx-auto mb-6">
            Welcome to Yuva Shakti Sangam. Your digital entry pass has been generated.
          </p>

          {/* Loading or Ticket Summary Box */}
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 text-[#F05A12] animate-spin" />
              <span className="text-xs font-black uppercase tracking-wider text-[#5A4839]">
                Preparing your digital ticket...
              </span>
            </div>
          ) : participant ? (
            <div className="max-w-md mx-auto p-6 rounded-2xl bg-[#FAF4EC] border-2 border-[#1C1917]/15 shadow-parchment-card text-center space-y-4 mb-8">
              {/* Participant Name & Reg ID */}
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#5A4839] block">
                  PARTICIPANT NAME
                </span>
                <span className="text-xl sm:text-2xl font-display font-black text-[#1C1917] uppercase block">
                  {participant.name}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#5A4839] block">
                  REGISTRATION ID
                </span>
                <span className="text-base sm:text-lg font-mono font-black text-[#F05A12] tracking-wider block">
                  {participant.registration_id}
                </span>
              </div>

              {/* QR Code Container */}
              {qrDataUrl && (
                <div className="py-2 flex flex-col items-center justify-center">
                  <div className="p-3 bg-white rounded-2xl border-2 border-[#1C1917]/20 shadow-sm inline-block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={qrDataUrl}
                      alt={`QR pass for ${participant.name}`}
                      className="w-48 h-48 sm:w-52 sm:h-52 object-contain"
                    />
                  </div>
                  <span className="text-[11px] font-bold text-[#5A4839] mt-2 block">
                    Keep this QR ready at the entrance gate
                  </span>
                </div>
              )}

              {/* Payment Status Pill */}
              <div className="pt-2">
                {isPaid ? (
                  <div className="p-3 rounded-xl bg-green-50 border border-green-300 text-green-900 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4 text-green-700" />
                    <span>₹50 — {participant.payment_method.toUpperCase()} ✓ PAID (VERIFIED)</span>
                  </div>
                ) : isCashPending ? (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 flex flex-col items-center justify-center gap-1 text-xs">
                    <div className="flex items-center gap-1.5 font-black uppercase tracking-wider">
                      <AlertTriangle className="w-4 h-4 text-amber-700" />
                      <span>₹50 — CASH PAYMENT PENDING</span>
                    </div>
                    <span className="text-[11px] text-amber-800 font-medium">
                      Please pay ₹50 in cash to an authorized volunteer at the entry desk.
                    </span>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-300 text-red-900 text-xs font-black uppercase tracking-wider">
                    PAYMENT NOT COMPLETED
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-[#FAF4EC] border border-[#1C1917]/15 text-xs text-[#5A4839]">
              Registration received: {registrationId}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto mb-8">
            <button
              onClick={handleDownload}
              disabled={downloading || !participant}
              className="w-full py-3.5 px-6 rounded-xl btn-bhagwa-primary text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-bhagwa-sm active:scale-95 transition-all disabled:opacity-60"
            >
              {downloading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>GENERATING PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>DOWNLOAD TICKET (PDF)</span>
                </>
              )}
            </button>

            <button
              onClick={handleShare}
              disabled={!participant}
              className="w-full py-3.5 px-6 rounded-xl bg-[#1C1917] hover:bg-[#24170D] text-[#FAF4EC] text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all disabled:opacity-60"
            >
              <Share2 className="w-4 h-4 text-[#FFA000]" />
              <span>{shared ? "LINK COPIED!" : "SHARE TICKET"}</span>
            </button>
          </div>

          {/* Delegate Inclusions Notice */}
          <div className="p-3.5 rounded-xl bg-[#FAF4EC] border border-[#E65100]/25 text-[11px] text-[#5A4839] space-y-1 text-left max-w-2xl mx-auto mb-6">
            <div className="font-bold text-[#1C1917] flex items-center gap-1.5">
              <span className="text-[#E65100]">★</span>
              <span>Pass Inclusions &amp; Venue Details:</span>
            </div>
            <p>
              &bull; <strong>Delegate ID Card:</strong> Official ID badge will be issued at the check-in welcome counter upon scanning this QR.
            </p>
            <p>
              &bull; <strong>High Tea &amp; Refreshments:</strong> Included for all registered attendees.
            </p>
            <p>
              &bull; <strong>Official E-Certificate:</strong> Verifiable digital certificate of participation will be issued post-event.
            </p>
            <p>
              &bull; <strong>Venue:</strong> Shree Saurashtra Patel Samaj, Isanpur Rd, Chandranagar Society, Basant Nagar, Maninagar, Ahmedabad.
            </p>
          </div>

          {/* Event Quick Logistics */}
          <div className="pt-6 border-t border-[#292524]/10 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto text-xs font-bold text-[#1C1917]">
            <div className="p-3 rounded-xl bg-[#FAF4EC] flex items-center gap-2 justify-center">
              <Calendar className="w-4 h-4 text-[#E65100]" />
              <span>{eventConfig.dateDisplay}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#FAF4EC] flex items-center gap-2 justify-center">
              <Clock className="w-4 h-4 text-[#E65100]" />
              <span>{eventConfig.timeDisplay}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#FAF4EC] flex items-center gap-2 justify-center">
              <MapPin className="w-4 h-4 text-[#E65100]" />
              <span>Shree Saurashtra Patel Samaj, Maninagar</span>
            </div>
          </div>

          {/* Bottom Back Button */}
          <div className="mt-8 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#5A4839] hover:text-[#F05A12] transition-colors"
            >
              <span>RETURN TO MAIN HOMEPAGE</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegistrationSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#EAE0D0] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#F05A12] animate-spin" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
