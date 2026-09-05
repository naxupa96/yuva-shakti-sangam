"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Camera,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Banknote,
  ShieldCheck,
  RefreshCw,
  Loader2,
  ArrowLeft,
  Volume2,
  VolumeX,
  Zap,
  MessageSquareQuote,
} from "lucide-react";
import { Html5Qrcode } from "html5-qrcode";
import { Participant } from "@/types/registration";
import { extractQuestion } from "@/lib/participant-helpers";

export default function CheckinPage() {
  const [tab, setTab] = useState<"scan" | "search">("scan");
  const [scannerActive, setScannerActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const [scannedParticipant, setScannedParticipant] = useState<Participant | null>(null);
  const [scanState, setScanState] = useState<
    "idle" | "paid" | "cash_pending" | "already_checked_in" | "invalid" | "checked_in_success"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [cashModalOpen, setCashModalOpen] = useState(false);
  const [collectingCash, setCollectingCash] = useState(false);
  const [checkingIn, setCheckingIn] = useState(false);

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const playFeedbackSound = (type: "success" | "warning" | "error") => {
    if (!soundEnabled) return;
    try {
      if (!audioContextRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (!ctx) return;
      if (ctx.state === "suspended") ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === "success") {
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1); // A5
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      } else if (type === "warning") {
        osc.frequency.setValueAtTime(392, ctx.currentTime); // G4
        osc.frequency.setValueAtTime(329.63, ctx.currentTime + 0.15); // E4
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      } else {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(220, ctx.currentTime); // A3
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      }

      // Haptic vibration if supported on mobile
      if (navigator.vibrate) {
        if (type === "success") navigator.vibrate([80, 50, 100]);
        else if (type === "warning") navigator.vibrate([150, 100, 150]);
        else navigator.vibrate([300]);
      }
    } catch (e) {
      console.warn("Audio feedback error:", e);
    }
  };

  const handleLookup = async (query: string) => {
    if (!query.trim()) return;
    setLoading(true);
    setErrorMessage("");

    try {
      // Extract clean token if full URL was scanned
      let cleanQuery = query.trim();
      if (cleanQuery.includes("/ticket/")) {
        cleanQuery = cleanQuery.split("/ticket/")[1].split("?")[0].split("#")[0];
      }

      const res = await fetch("/api/checkin/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: cleanQuery }),
      });

      const data = await res.json();

      if (!res.ok || !data.success || !data.participant) {
        setScanState("invalid");
        setScannedParticipant(null);
        setErrorMessage(data.error || "Ticket not recognized.");
        playFeedbackSound("error");
        setLoading(false);
        return;
      }

      const p: Participant = data.participant;
      setScannedParticipant(p);

      if (p.checked_in) {
        setScanState("already_checked_in");
        playFeedbackSound("warning");
      } else if (p.payment_status === "paid") {
        setScanState("paid");
        playFeedbackSound("success");
      } else if (p.payment_status === "pending") {
        setScanState("cash_pending");
        playFeedbackSound("warning");
      } else {
        setScanState("invalid");
        setErrorMessage("Payment status invalid or refunded.");
        playFeedbackSound("error");
      }
    } catch (err: any) {
      console.error("Lookup error:", err);
      setScanState("invalid");
      setErrorMessage("Network error verifying QR code.");
      playFeedbackSound("error");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    if (!scannedParticipant) return;
    setCheckingIn(true);

    try {
      const res = await fetch("/api/checkin/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token_or_id: scannedParticipant.qr_token || scannedParticipant.registration_id,
          method: tab === "scan" ? "qr_scan" : "manual_search",
        }),
      });

      const data = await res.json();

      if (data.success) {
        setScanState("checked_in_success");
        if (data.participant) {
          setScannedParticipant(data.participant);
        }
        playFeedbackSound("success");
      } else {
        if (data.code === "ALREADY_CHECKED_IN") {
          setScanState("already_checked_in");
          playFeedbackSound("warning");
        } else if (data.code === "PAYMENT_PENDING") {
          setScanState("cash_pending");
          playFeedbackSound("warning");
        } else {
          setErrorMessage(data.error || "Check-in failed.");
          playFeedbackSound("error");
        }
      }
    } catch (err) {
      console.error("Check-in confirm error:", err);
      setErrorMessage("Network error completing check-in.");
      playFeedbackSound("error");
    } finally {
      setCheckingIn(false);
    }
  };

  const handleConfirmCashCollection = async () => {
    if (!scannedParticipant) return;
    setCollectingCash(true);

    try {
      const res = await fetch("/api/checkin/cash-collect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          participant_id: scannedParticipant.id,
          notes: "Collected ₹50 cash at entrance gate",
        }),
      });

      const data = await res.json();

      if (data.success && data.participant) {
        setScannedParticipant(data.participant);
        setCashModalOpen(false);
        setScanState("paid");
        playFeedbackSound("success");
      } else {
        setErrorMessage(data.error || "Failed to record cash payment.");
        playFeedbackSound("error");
      }
    } catch (err) {
      console.error("Cash collection error:", err);
      setErrorMessage("Network error recording cash.");
      playFeedbackSound("error");
    } finally {
      setCollectingCash(false);
    }
  };

  const resetScan = () => {
    setScanState("idle");
    setScannedParticipant(null);
    setErrorMessage("");
    setSearchQuery("");
  };

  // Setup HTML5 QR Code Scanner
  useEffect(() => {
    let html5QrCode: Html5Qrcode | null = null;

    if (tab === "scan" && scanState === "idle") {
      const startScanner = async () => {
        try {
          html5QrCode = new Html5Qrcode("reader");
          scannerRef.current = html5QrCode;

          await html5QrCode.start(
            { facingMode: "environment" },
            {
              fps: 10,
              qrbox: { width: 250, height: 250 },
              aspectRatio: 1.0,
            },
            (decodedText) => {
              if (html5QrCode && html5QrCode.isScanning) {
                html5QrCode.stop().catch((e) => console.warn(e));
                setScannerActive(false);
              }
              handleLookup(decodedText);
            },
            () => {}
          );
          setScannerActive(true);
        } catch (err) {
          console.warn("Camera start warning:", err);
          setScannerActive(false);
        }
      };

      startScanner();
    }

    return () => {
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().catch((e) => console.warn(e));
      }
      scannerRef.current = null;
    };
  }, [tab, scanState]);

  return (
    <div className="min-h-screen bg-[#17130E] text-[#FAF4EC] selection:bg-[#E65100] selection:text-white p-3 sm:p-6">
      {/* Top Mobile Bar */}
      <div className="max-w-md mx-auto space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#FAF4EC]/10">
          <Link
            href="/admin"
            className="p-2 rounded-xl bg-[#24170D] text-[#FAF4EC] hover:text-[#E65100] flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>

          <div className="text-center">
            <h1 className="font-display font-black text-base uppercase tracking-tight text-[#FAF4EC]">
              VOLUNTEER CHECK-IN
            </h1>
            <span className="text-[10px] font-mono text-[#FFA000] uppercase block">
              EVENT GATE SCANNER
            </span>
          </div>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-xl bg-[#24170D] text-[#FAF4EC] hover:text-[#FFA000]"
            aria-label="Toggle Sound"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#22C55E]" /> : <VolumeX className="w-4 h-4 text-zinc-500" />}
          </button>
        </div>

        {/* Tab Toggle: Camera Scan vs Manual Search */}
        <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-[#24170D] border border-[#FAF4EC]/10">
          <button
            onClick={() => {
              setTab("scan");
              resetScan();
            }}
            className={`py-2.5 px-3 rounded-xl font-display font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
              tab === "scan"
                ? "bg-[#E65100] text-white shadow-md"
                : "text-[#FAF4EC]/70 hover:text-white"
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>CAMERA SCAN</span>
          </button>

          <button
            onClick={() => {
              setTab("search");
              resetScan();
            }}
            className={`py-2.5 px-3 rounded-xl font-display font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
              tab === "search"
                ? "bg-[#E65100] text-white shadow-md"
                : "text-[#FAF4EC]/70 hover:text-white"
            }`}
          >
            <Search className="w-4 h-4" />
            <span>SEARCH / ID</span>
          </button>
        </div>

        {/* 1. Camera Scanning View */}
        {tab === "scan" && scanState === "idle" && (
          <div className="p-4 rounded-3xl bg-[#24170D] border-2 border-[#FAF4EC]/15 space-y-4">
            <div className="relative rounded-2xl overflow-hidden bg-black aspect-square flex items-center justify-center border border-[#FAF4EC]/20">
              <div id="reader" className="w-full h-full" />
              {!scannerActive && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-3 bg-black/80">
                  <Camera className="w-10 h-10 text-[#FFA000] animate-pulse" />
                  <p className="text-xs font-bold text-[#FAF4EC]/80">
                    Requesting camera access... Please point camera at participant QR pass.
                  </p>
                </div>
              )}
            </div>

            <div className="text-center text-xs font-bold text-[#FAF4EC]/60 flex items-center justify-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#FFA000]" />
              <span>Instant audio feedback enabled on verification</span>
            </div>
          </div>
        )}

        {/* 2. Manual Search View */}
        {tab === "search" && scanState === "idle" && (
          <div className="p-5 rounded-3xl bg-[#24170D] border-2 border-[#FAF4EC]/15 space-y-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-[#FAF4EC]/80 mb-2">
                Enter Registration ID, Phone or Name
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLookup(searchQuery)}
                  placeholder="e.g. YSS-2026-000001 or 9876543210"
                  className="w-full px-4 py-3 rounded-xl bg-[#17130E] border border-[#FAF4EC]/20 text-sm font-medium text-[#FAF4EC] placeholder:text-[#FAF4EC]/40 focus:outline-none focus:border-[#E65100]"
                />
                <button
                  onClick={() => handleLookup(searchQuery)}
                  disabled={loading || !searchQuery.trim()}
                  className="px-5 py-3 rounded-xl btn-bhagwa-primary text-xs font-black uppercase tracking-wider flex items-center justify-center shrink-0 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 3. Result States */}

        {/* STATE A: VERIFIED & READY FOR CHECK-IN (GREEN) */}
        {scanState === "paid" && scannedParticipant && (
          <div className="p-6 rounded-3xl bg-green-950/80 border-2 border-green-500 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-green-500 text-black flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-7 h-7 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-green-400 block">
                  PAYMENT VERIFIED
                </span>
                <span className="text-lg font-display font-black text-white uppercase block">
                  ENTRY ALLOWED
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-green-500/30 space-y-2 text-left">
              <div>
                <span className="text-[10px] font-bold uppercase text-zinc-400 block">NAME</span>
                <span className="text-xl font-display font-black text-white uppercase">
                  {scannedParticipant.name}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-xs">
                <div>
                  <span className="text-[9px] text-zinc-400 uppercase font-bold block">REG ID</span>
                  <span className="font-mono font-bold text-[#FFA000]">{scannedParticipant.registration_id}</span>
                </div>
                <div>
                  <span className="text-[9px] text-zinc-400 uppercase font-bold block">PAYMENT</span>
                  <span className="font-bold text-green-400">₹50 — {scannedParticipant.payment_method.toUpperCase()} PAID</span>
                </div>
              </div>

              {extractQuestion(scannedParticipant) && (
                <div className="mt-2 p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-left">
                  <div className="flex items-center gap-1 font-bold text-[10px] uppercase text-[#FFA000]">
                    <MessageSquareQuote className="w-3 h-3" />
                    <span>Submitted Samvaad Question</span>
                  </div>
                  <p className="text-[11px] text-white/90 italic mt-0.5 line-clamp-2">
                    &ldquo;{extractQuestion(scannedParticipant)}&rdquo;
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <button
                onClick={handleCheckIn}
                disabled={checkingIn}
                className="w-full py-4 px-6 rounded-2xl bg-green-500 hover:bg-green-400 text-black font-display font-black text-base uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all disabled:opacity-60"
              >
                {checkingIn ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>CHECK IN PARTICIPANT</span>
                  </>
                )}
              </button>

              <button
                onClick={resetScan}
                className="w-full py-2.5 px-4 rounded-xl bg-black/40 hover:bg-black/60 text-xs font-bold uppercase tracking-wider text-zinc-400"
              >
                Scan Next Participant
              </button>
            </div>
          </div>
        )}

        {/* STATE B: CASH PAYMENT PENDING (RED / AMBER) */}
        {scanState === "cash_pending" && scannedParticipant && (
          <div className="p-6 rounded-3xl bg-amber-950/80 border-2 border-amber-500 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-black flex items-center justify-center shrink-0">
                <Banknote className="w-7 h-7 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 block">
                  PAYMENT PENDING
                </span>
                <span className="text-lg font-display font-black text-white uppercase block">
                  COLLECT ₹50 CASH
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-amber-500/30 space-y-2 text-left">
              <div>
                <span className="text-[10px] font-bold uppercase text-zinc-400 block">PARTICIPANT</span>
                <span className="text-xl font-display font-black text-white uppercase">
                  {scannedParticipant.name}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-xs">
                <div>
                  <span className="text-[9px] text-zinc-400 uppercase font-bold block">REG ID</span>
                  <span className="font-mono font-bold text-[#FFA000]">{scannedParticipant.registration_id}</span>
                </div>
                <div>
                  <span className="text-[9px] text-zinc-400 uppercase font-bold block">STATUS</span>
                  <span className="font-bold text-amber-400">₹50 — NOT PAID</span>
                </div>
              </div>

              {extractQuestion(scannedParticipant) && (
                <div className="mt-2 p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-left">
                  <div className="flex items-center gap-1 font-bold text-[10px] uppercase text-[#FFA000]">
                    <MessageSquareQuote className="w-3 h-3" />
                    <span>Submitted Samvaad Question</span>
                  </div>
                  <p className="text-[11px] text-white/90 italic mt-0.5 line-clamp-2">
                    &ldquo;{extractQuestion(scannedParticipant)}&rdquo;
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <button
                onClick={() => setCashModalOpen(true)}
                className="w-full py-4 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-display font-black text-base uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
              >
                <Banknote className="w-5 h-5" />
                <span>COLLECT ₹50 & MARK PAID</span>
              </button>

              <button
                onClick={resetScan}
                className="w-full py-2.5 px-4 rounded-xl bg-black/40 hover:bg-black/60 text-xs font-bold uppercase tracking-wider text-zinc-400"
              >
                Cancel / Scan Next
              </button>
            </div>
          </div>
        )}

        {/* STATE C: ALREADY CHECKED IN (WARNING) */}
        {scanState === "already_checked_in" && scannedParticipant && (
          <div className="p-6 rounded-3xl bg-yellow-950/80 border-2 border-yellow-500 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-yellow-500 text-black flex items-center justify-center shrink-0">
                <AlertTriangle className="w-7 h-7 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-yellow-400 block">
                  DUPLICATE SCAN
                </span>
                <span className="text-lg font-display font-black text-white uppercase block">
                  ALREADY CHECKED IN
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-yellow-500/30 space-y-2 text-left text-xs">
              <div>
                <span className="text-[9px] text-zinc-400 uppercase font-bold block">PARTICIPANT</span>
                <span className="text-lg font-display font-black text-white uppercase">
                  {scannedParticipant.name}
                </span>
              </div>
              <div className="pt-2 border-t border-white/10 text-yellow-300 font-medium">
                Checked in at:{" "}
                <span className="font-bold text-white">
                  {scannedParticipant.check_in_time
                    ? new Date(scannedParticipant.check_in_time).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
                    : "Earlier today"}
                </span>
              </div>
            </div>

            <button
              onClick={resetScan}
              className="w-full py-3 px-6 rounded-xl btn-bhagwa-primary text-xs font-black uppercase tracking-wider"
            >
              Scan Next Participant
            </button>
          </div>
        )}

        {/* STATE D: CHECK-IN SUCCESSFUL (CELEBRATION) */}
        {scanState === "checked_in_success" && scannedParticipant && (
          <div className="p-8 rounded-3xl bg-green-900 border-2 border-green-400 text-center space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="w-16 h-16 rounded-full bg-green-400 text-black flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-display font-black text-white uppercase tracking-tight">
                CHECK-IN SUCCESSFUL!
              </h2>
              <p className="text-base text-green-200 font-bold uppercase">
                Welcome, {scannedParticipant.name}!
              </p>
              <p className="text-xs font-mono text-green-300">
                Pass: {scannedParticipant.registration_id}
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={resetScan}
                className="w-full py-3.5 px-6 rounded-xl bg-white hover:bg-zinc-100 text-black font-display font-black text-sm uppercase tracking-wider shadow-md active:scale-95 transition-all"
              >
                Scan Next Participant →
              </button>
            </div>
          </div>
        )}

        {/* STATE E: INVALID / ERROR */}
        {scanState === "invalid" && (
          <div className="p-6 rounded-3xl bg-red-950/80 border-2 border-red-500 text-center space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="w-14 h-14 rounded-full bg-red-500 text-white flex items-center justify-center mx-auto">
              <XCircle className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-display font-black text-white uppercase">
                INVALID TICKET
              </h2>
              <p className="text-xs text-red-200">
                {errorMessage || "This QR code or registration ID is not recognized. Please redirect attendee to the Registration Help Desk."}
              </p>
            </div>

            <button
              onClick={resetScan}
              className="w-full py-3 px-6 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black uppercase tracking-wider"
            >
              Scan Again
            </button>
          </div>
        )}
      </div>

      {/* Cash Collection Modal */}
      {cashModalOpen && scannedParticipant && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-sm w-full p-6 rounded-3xl bg-[#24170D] border-2 border-amber-500 space-y-4 text-center shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-black flex items-center justify-center mx-auto">
              <Banknote className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="font-display font-black text-lg uppercase text-white">
                CONFIRM CASH PAYMENT
              </h3>
              <p className="text-xs text-zinc-300">
                Collect registration fee from participant:
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-black/50 border border-white/10 text-left text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-zinc-400">Participant:</span>
                <span className="font-bold text-white uppercase">{scannedParticipant.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Registration ID:</span>
                <span className="font-mono text-[#FFA000]">{scannedParticipant.registration_id}</span>
              </div>
              <div className="flex justify-between border-t border-white/10 pt-1 text-sm">
                <span className="font-bold text-white">Amount Due:</span>
                <span className="font-bold text-green-400">₹50 (CASH)</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setCashModalOpen(false)}
                className="w-1/2 py-3 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-bold uppercase tracking-wider"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmCashCollection}
                disabled={collectingCash}
                className="w-1/2 py-3 rounded-xl bg-green-500 hover:bg-green-400 text-black font-display font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1 shadow-md"
              >
                {collectingCash ? <Loader2 className="w-4 h-4 animate-spin" /> : "CONFIRM ₹50"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
