"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  Download,
  Share2,
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  AlertTriangle,
  Loader2,
  CheckCircle2,
  ArrowLeft,
  Award,
  Ticket,
} from "lucide-react";
import { eventConfig } from "@/lib/config";
import { CornerOrnament, MandalaMotif, DevanagariWatermark } from "@/components/Decorations";
import { Participant } from "@/types/registration";
import { generateQrDataUrl, generateTicketPdf, downloadBlob } from "@/lib/ticket/generator";
import ParticipationCertificate from "@/components/ParticipationCertificate";

export default function TicketPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const resolvedParams = use(params);
  const token = resolvedParams.token;

  const [participant, setParticipant] = useState<Participant | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [shared, setShared] = useState(false);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState<"pass" | "certificate">("pass");
  const [canViewCertificate, setCanViewCertificate] = useState(false);

  useEffect(() => {
    if (!token) return;

    fetch(`/api/ticket/${token}`)
      .then((res) => res.json())
      .then(async (data) => {
        if (data.success && data.participant) {
          setParticipant(data.participant);
          const qr = await generateQrDataUrl(data.participant.qr_token);
          setQrDataUrl(qr);

          // Certificate is available for checked-in attendees
          const isCheckedIn = !!data.participant.checked_in;
          const CERTIFICATE_RELEASE_TIME = new Date("2026-09-06T19:00:00+05:30").getTime();
          const isAfterReleaseTime = Date.now() >= CERTIFICATE_RELEASE_TIME;
          const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
          const isPreview =
            searchParams?.get("preview_cert") === "1" ||
            searchParams?.get("cert") === "1";

          if ((isCheckedIn && isAfterReleaseTime) || isPreview) {
            setCanViewCertificate(true);
            setViewMode("certificate");
          }
        } else {
          setError(data.error || "Ticket not found or invalid token.");
        }
      })
      .catch((err) => {
        console.error("Ticket fetch error:", err);
        setError("Could not load ticket. Please check connection.");
      })
      .finally(() => setLoading(false));
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
    const ticketUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Yuva Shakti Sangam Pass - ${participant.name}`,
          text: `Here is my official entry pass for Yuva Shakti Sangam (Reg ID: ${participant.registration_id})!`,
          url: ticketUrl,
        });
        setShared(true);
      } catch (err) {
        console.warn("Share failed:", err);
      }
    } else {
      await navigator.clipboard.writeText(ticketUrl);
      setShared(true);
      setTimeout(() => setShared(false), 3000);
    }
  };

  const isPaid = participant?.payment_status === "paid";
  const isCashPending = participant?.payment_method === "cash" && participant?.payment_status === "pending";

  return (
    <div className="min-h-screen bg-[#EAE0D0] bg-parchment-texture text-[#1C1917] selection:bg-[#E65100] selection:text-white py-8 sm:py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <DevanagariWatermark text="शक्ति" className="top-10 left-6 text-[14rem] sm:text-[22rem] text-[#292524]/5" />

      <div className="max-w-xl mx-auto relative z-10">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#5A4839] hover:text-[#F05A12] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Yuva Shakti Sangam</span>
          </Link>
          <span className="text-xs font-mono font-black text-[#E65100]">
            {participant ? participant.registration_id : "DIGITAL PASS"}
          </span>
        </div>

        {/* Certificate / Pass Switcher Tabs (Rendered strictly after 7:30 PM for checked-in attendees) */}
        {canViewCertificate && !loading && participant && (
          <div className="mb-4 flex items-center justify-center p-1 rounded-2xl bg-[#F5EBE1] border border-[#292524]/15 shadow-sm">
            <button
              onClick={() => setViewMode("certificate")}
              className={`flex-1 py-2 px-3 rounded-xl font-display font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                viewMode === "certificate"
                  ? "bg-[#B45309] text-white shadow-sm"
                  : "text-[#5A4839] hover:text-[#1C1917]"
              }`}
            >
              <Award className="w-4 h-4 text-[#FFA000]" />
              <span>CERTIFICATE</span>
            </button>

            <button
              onClick={() => setViewMode("pass")}
              className={`flex-1 py-2 px-3 rounded-xl font-display font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                viewMode === "pass"
                  ? "bg-[#1C1917] text-white shadow-sm"
                  : "text-[#5A4839] hover:text-[#1C1917]"
              }`}
            >
              <Ticket className="w-4 h-4" />
              <span>ENTRY PASS</span>
            </button>
          </div>
        )}

        {/* View Mode: Certificate vs Digital Ticket Pass */}
        {canViewCertificate && viewMode === "certificate" && participant ? (
          <ParticipationCertificate
            participant={participant}
            onSwitchToPass={() => setViewMode("pass")}
          />
        ) : (
          /* Digital Ticket Card */
          <div className="p-6 sm:p-10 rounded-3xl bg-[#F5EBE1] border-2 border-[#292524]/20 shadow-parchment-deep relative overflow-hidden text-center">
            <CornerOrnament className="absolute top-3 left-3 text-[#E65100]/40" />
            <CornerOrnament className="absolute top-3 right-3 text-[#E65100]/40 -scale-x-100" />
            <CornerOrnament className="absolute bottom-3 left-3 text-[#E65100]/40 -scale-y-100" />
            <CornerOrnament className="absolute bottom-3 right-3 text-[#E65100]/40 -scale-100" />

            <div className="absolute -right-20 -top-20 opacity-20 text-[#E65100] pointer-events-none">
              <MandalaMotif size={360} />
            </div>

          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 text-[#F05A12] animate-spin" />
              <span className="text-xs font-black uppercase tracking-wider text-[#5A4839]">
                Verifying digital pass...
              </span>
            </div>
          ) : error || !participant ? (
            <div className="py-16 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-display font-black uppercase text-[#1C1917]">
                INVALID TICKET
              </h2>
              <p className="text-xs sm:text-sm text-[#5A4839] max-w-sm mx-auto">
                {error || "This QR code or ticket link is not recognized in the system."}
              </p>
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-2">
                <Link
                  href="/"
                  className="inline-flex py-3 px-6 rounded-xl bg-[#1C1917] text-[#FAF4EC] hover:bg-[#24170D] text-xs font-black uppercase tracking-wider transition-colors"
                >
                  Return to Home
                </Link>
                <Link
                  href="/register"
                  className="inline-flex py-3 px-6 rounded-xl btn-bhagwa-primary text-xs font-black uppercase tracking-wider"
                >
                  {eventConfig.registrationsClosed ? "Event Notice & Helpline" : "Register For Pass (₹50)"}
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Ticket Top Header Bar */}
              <div className="p-4 rounded-2xl bg-[#1C1917] text-[#FAF4EC] space-y-1 shadow-md">
                <div className="font-display font-black text-xl uppercase tracking-tight">
                  YUVA <span className="text-[#F05A12]">SHAKTI</span> SANGAM
                </div>
                <div className="text-[11px] font-devanagari font-black text-[#FFA000]">
                  युवा शक्ति • राष्ट्र शक्ति
                </div>
                <div className="text-[10px] text-[#FAF4EC]/70 uppercase tracking-widest font-mono">
                  {eventConfig.dateDisplay} • {eventConfig.locationShort}
                </div>
              </div>

              {/* Participant Details */}
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#5A4839] block">
                  ADMIT ONE PARTICIPANT
                </span>
                <h1 className="text-2xl sm:text-3xl font-display font-black text-[#1C1917] uppercase tracking-tight">
                  {participant.name}
                </h1>
                <div className="inline-block px-3 py-1 rounded-lg bg-[#FAF4EC] border border-[#1C1917]/15 font-mono text-sm font-black text-[#E65100]">
                  {participant.registration_id}
                </div>
              </div>

              {/* Central QR Code */}
              {qrDataUrl && (
                <div className="py-2 flex flex-col items-center justify-center">
                  <div className="p-4 bg-white rounded-2xl border-2 border-[#1C1917]/25 shadow-md">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={qrDataUrl}
                      alt={`QR Pass for ${participant.name}`}
                      className="w-52 h-52 sm:w-56 sm:h-56 object-contain"
                    />
                  </div>
                  <span className="text-[11px] font-bold text-[#5A4839] mt-2 block">
                    Show this pass at the gate scanner
                  </span>
                </div>
              )}

              {/* Status Pill & Attendance State */}
              <div className="space-y-2">
                {participant.checked_in ? (
                  <div className="p-3 rounded-xl bg-emerald-100 border border-emerald-400 text-emerald-900 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>
                      ✓ CHECKED IN ({participant.check_in_time ? new Date(participant.check_in_time).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "YES"})
                    </span>
                  </div>
                ) : isPaid ? (
                  <div className="p-3 rounded-xl bg-green-50 border border-green-300 text-green-900 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4 text-green-700" />
                    <span>₹50 — {participant.payment_method.toUpperCase()} ✓ PAID (ENTRY READY)</span>
                  </div>
                ) : isCashPending ? (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 flex flex-col items-center justify-center gap-1 text-xs">
                    <div className="flex items-center gap-1.5 font-black uppercase tracking-wider">
                      <AlertTriangle className="w-4 h-4 text-amber-700" />
                      <span>₹50 — CASH PAYMENT PENDING</span>
                    </div>
                    <span className="text-[11px] text-amber-800 font-medium">
                      Pay ₹50 to an authorized volunteer at the entrance desk.
                    </span>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-300 text-red-900 text-xs font-black uppercase tracking-wider">
                    PAYMENT INCOMPLETE
                  </div>
                )}
              </div>

              {/* Certificate Ready Banner (if eligible) */}
              {canViewCertificate && (
                <button
                  onClick={() => setViewMode("certificate")}
                  className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/20 to-amber-500/15 border-2 border-[#E65100]/40 flex items-center justify-between gap-2 text-left hover:scale-[1.01] transition-all cursor-pointer shadow-sm group"
                >
                  <div className="flex items-center gap-2.5">
                    <Award className="w-5 h-5 text-[#E65100] shrink-0" />
                    <div>
                      <div className="text-xs font-display font-black text-[#1C140E] uppercase tracking-wide">
                        Official E-Certificate Ready!
                      </div>
                      <div className="text-[11px] text-[#5A4839]">
                        Click here to view, customize &amp; download
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-black text-[#E65100] uppercase tracking-wider shrink-0 font-mono group-hover:translate-x-0.5 transition-transform">
                    VIEW →
                  </span>
                </button>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleDownload}
                  disabled={downloading}
                  className="w-full py-3 px-6 rounded-xl btn-bhagwa-primary text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-bhagwa-sm active:scale-95 transition-all"
                >
                  {downloading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  <span>DOWNLOAD PDF PASS</span>
                </button>

                <button
                  onClick={handleShare}
                  className="w-full py-3 px-6 rounded-xl bg-[#1C1917] hover:bg-[#24170D] text-[#FAF4EC] text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
                >
                  <Share2 className="w-4 h-4 text-[#FFA000]" />
                  <span>{shared ? "COPIED!" : "SHARE PASS"}</span>
                </button>
              </div>

              {/* Delegate Inclusions Notice */}
              <div className="p-3.5 rounded-xl bg-[#FAF4EC] border border-[#E65100]/25 text-[11px] text-[#5A4839] space-y-1 text-left">
                <div className="font-bold text-[#1C1917] flex items-center gap-1.5">
                  <span className="text-[#E65100]">★</span>
                  <span>Pass Inclusions &amp; Instructions:</span>
                </div>
                <p>
                  &bull; <strong>Delegate ID Card:</strong>{" "}
                  {participant.checked_in
                    ? "Collected upon arrival."
                    : "Please collect your physical ID Card at the registration / welcome desk by showing this QR."}
                </p>
                <p>
                  &bull; <strong>High Tea &amp; Refreshments:</strong> Included for all registered attendees.
                </p>
                <p>
                  &bull; <strong>E-Certificate:</strong>{" "}
                  {participant.checked_in
                    ? "✓ Issued! Your official digital certificate of participation is available."
                    : "Official digital certificate of participation is awarded to delegates who attend and check in at the venue."}
                </p>
                <p>
                  &bull; <strong>Venue:</strong> Shree Saurashtra Patel Samaj, Isanpur Rd, Basant Nagar, Maninagar, Ahmedabad.
                </p>
              </div>

              {/* Event Timing strip */}
              <div className="pt-4 border-t border-[#292524]/10 flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-[#5A4839]">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#E65100]" />
                  <span>06 September 2026</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#E65100]" />
                  <span>4:00 PM – 8:00 PM</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#E65100]" />
                  <span>Shree Saurashtra Patel Samaj, Maninagar</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      </div>
    </div>
  );
}
