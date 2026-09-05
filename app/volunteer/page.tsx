"use client";

import React, { useState, useEffect, useRef } from "react";
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
  Volume2,
  VolumeX,
  Zap,
  LogOut,
  Sparkles,
  Phone,
  MapPin,
  X,
  Check,
  ArrowRight,
} from "lucide-react";
import { Html5Qrcode } from "html5-qrcode";
import { Participant } from "@/types/registration";

export default function VolunteerScannerPage() {
  const [scannerActive, setScannerActive] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [torchOn, setTorchOn] = useState(false);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [sessionCheckins, setSessionCheckins] = useState(0);

  const [scannedParticipant, setScannedParticipant] = useState<Participant | null>(null);
  const [scanState, setScanState] = useState<
    "idle" | "paid" | "cash_pending" | "already_checked_in" | "invalid" | "checked_in_success"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [collectingCash, setCollectingCash] = useState(false);
  const [checkingIn, setCheckingIn] = useState(false);

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Audio feedback synthesis
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

      // Mobile haptic vibration
      if (typeof navigator !== "undefined" && navigator.vibrate) {
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
        setErrorMessage(data.error || "Ticket QR code not recognized.");
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
      setErrorMessage("Network error verifying ticket.");
      playFeedbackSound("error");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmCheckin = async () => {
    if (!scannedParticipant) return;
    setCheckingIn(true);

    try {
      const res = await fetch("/api/checkin/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participant_id: scannedParticipant.id }),
      });

      const data = await res.json();

      if (data.success) {
        setScanState("checked_in_success");
        setSessionCheckins((c) => c + 1);
        playFeedbackSound("success");
      } else {
        setErrorMessage(data.error || "Check-in failed.");
        playFeedbackSound("error");
      }
    } catch (err) {
      setErrorMessage("Network error recording check-in.");
      playFeedbackSound("error");
    } finally {
      setCheckingIn(false);
    }
  };

  const handleCollectCash = async () => {
    if (!scannedParticipant) return;
    setCollectingCash(true);

    try {
      const res = await fetch("/api/checkin/cash-collect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          participant_id: scannedParticipant.id,
          notes: "Collected ₹50 cash at volunteer gate scanner",
        }),
      });

      const data = await res.json();

      if (data.success) {
        setScanState("checked_in_success");
        setSessionCheckins((c) => c + 1);
        playFeedbackSound("success");
      } else {
        setErrorMessage(data.error || "Cash recording failed.");
        playFeedbackSound("error");
      }
    } catch (err) {
      setErrorMessage("Network error recording cash.");
      playFeedbackSound("error");
    } finally {
      setCollectingCash(false);
    }
  };

  const resetScan = () => {
    setScannedParticipant(null);
    setScanState("idle");
    setErrorMessage("");
    setSearchQuery("");
  };

  // Camera Management
  const startScanner = async () => {
    try {
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode("volunteer-qr-reader");
      }

      await scannerRef.current.start(
        { facingMode: facingMode },
        {
          fps: 15,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        (decodedText) => {
          if (scanState === "idle") {
            handleLookup(decodedText);
          }
        },
        () => {}
      );
      setScannerActive(true);
    } catch (err) {
      console.error("Camera start error:", err);
      setScannerActive(false);
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      try {
        await scannerRef.current.stop();
        setScannerActive(false);
      } catch (err) {
        console.warn("Scanner stop error:", err);
      }
    }
  };

  useEffect(() => {
    startScanner();
    return () => {
      stopScanner();
    };
  }, [facingMode]);

  // Handle direct scan redirection (e.g. when volunteer scans with native phone camera)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const scanParam = params.get("scan") || params.get("token") || params.get("query");
      if (scanParam) {
        handleLookup(scanParam);
        // Clean up URL parameter to avoid re-triggering on refresh
        window.history.replaceState({}, "", window.location.pathname);
      }
    }
  }, []);

  const toggleTorch = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      try {
        const capabilities: any = scannerRef.current.getRunningTrackCapabilities();
        if (capabilities?.torch) {
          await scannerRef.current.applyVideoConstraints({
            advanced: [{ torch: !torchOn } as any],
          });
          setTorchOn(!torchOn);
        }
      } catch (e) {
        console.warn("Torch toggle not supported on this device.");
      }
    }
  };

  const handleLogout = async () => {
    await stopScanner();
    await fetch("/api/volunteer/logout", { method: "POST" });
    window.location.href = "/volunteer/login";
  };

  return (
    <div className="min-h-screen bg-[#14100D] text-[#FAF4EC] flex flex-col justify-between selection:bg-[#E65100] selection:text-white">
      {/* Top Volunteer Header Bar */}
      <header className="px-4 py-3 bg-[#1C140E] border-b border-white/10 flex items-center justify-between z-20 shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#E65100] text-white flex items-center justify-center font-display font-black text-xs shadow-md">
            YS
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-mono font-bold tracking-wider text-[#FFA000] uppercase">
                SWAYAMSEVAK SCANNER
              </span>
            </div>
            <p className="text-[11px] font-bold text-white/80">Gate Pass Desk</p>
          </div>
        </div>

        {/* Header Controls */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-green-400">
            <CheckCircle2 className="w-3 h-3 text-green-400" />
            <span>{sessionCheckins} checked-in</span>
          </div>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 transition-colors"
            title={soundEnabled ? "Mute audio feedback" : "Enable audio feedback"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-green-400" /> : <VolumeX className="w-4 h-4 text-white/40" />}
          </button>

          <button
            onClick={() => setFacingMode((m) => (m === "environment" ? "user" : "environment"))}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 transition-colors"
            title="Switch Camera"
          >
            <Camera className="w-4 h-4" />
          </button>

          <button
            onClick={toggleTorch}
            className={`p-2 rounded-xl transition-colors ${
              torchOn ? "bg-[#FFA000] text-[#1C140E]" : "bg-white/5 hover:bg-white/10 text-white/80"
            }`}
            title="Toggle Flashlight"
          >
            <Zap className="w-4 h-4" />
          </button>

          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className={`p-2 rounded-xl transition-colors ${
              searchOpen ? "bg-[#E65100] text-white" : "bg-white/5 hover:bg-white/10 text-white/80"
            }`}
            title="Manual Search / Mobile Lookup"
          >
            <Search className="w-4 h-4" />
          </button>

          <button
            onClick={handleLogout}
            className="p-2 rounded-xl bg-red-950/80 hover:bg-red-900 border border-red-800 text-red-300 transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Manual Search Bar Drawer */}
      {searchOpen && (
        <div className="bg-[#1C140E] border-b border-white/10 p-3 z-20 animate-fadeIn">
          <div className="max-w-md mx-auto flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-white/40 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLookup(searchQuery)}
                placeholder="Enter 10-digit mobile or Reg ID (e.g. YSS-2026-000007)..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#29201A] border border-white/15 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#FFA000]"
              />
            </div>
            <button
              onClick={() => handleLookup(searchQuery)}
              disabled={loading || !searchQuery.trim()}
              className="px-3.5 py-2 rounded-xl bg-[#E65100] hover:bg-[#F05A12] text-xs font-bold uppercase tracking-wider text-white disabled:opacity-50 cursor-pointer"
            >
              Verify
            </button>
          </div>
        </div>
      )}

      {/* Main Viewfinder Center */}
      <main className="flex-1 flex flex-col items-center justify-center p-3 relative overflow-hidden">
        <div className="w-full max-w-sm flex flex-col items-center">
          {/* QR Camera Container */}
          <div className="w-full aspect-square max-w-[340px] rounded-3xl bg-black border-2 border-[#FFA000]/40 overflow-hidden relative shadow-2xl flex items-center justify-center">
            {/* HTML5 QR Camera Element */}
            <div id="volunteer-qr-reader" className="w-full h-full object-cover" />

            {/* Target Reticle & Scanline */}
            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
              <div className="w-60 h-60 border-2 border-dashed border-[#FFA000]/60 rounded-2xl relative">
                {/* Laser animation */}
                <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#FFA000] to-transparent animate-scanline shadow-[0_0_8px_#FFA000]" />

                {/* Corner crosshairs */}
                <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-[#FFA000]" />
                <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-[#FFA000]" />
                <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-[#FFA000]" />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-[#FFA000]" />
              </div>
            </div>

            {/* Camera loading indicator */}
            {!scannerActive && (
              <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-6 text-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-[#FFA000]" />
                <p className="text-xs font-mono text-white/80">Activating camera scanner...</p>
                <button
                  onClick={startScanner}
                  className="px-4 py-2 rounded-xl bg-[#E65100] text-xs font-bold uppercase text-white"
                >
                  Enable Camera
                </button>
              </div>
            )}
          </div>

          <p className="text-xs font-mono text-white/50 text-center mt-3">
            Point camera at attendee pass QR code for instant gate clearance
          </p>
        </div>

        {/* Scanned Participant Result Modal / Slide-up Overlay */}
        {scannedParticipant && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
            <div className="w-full max-w-md bg-[#241A13] border-t-2 sm:border-2 border-white/20 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl space-y-4 relative">
              <button
                onClick={resetScan}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Status Banner */}
              {scanState === "paid" && (
                <div className="p-3.5 rounded-2xl bg-green-900/40 border border-green-500/40 text-green-300 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-500 text-[#14100D] flex items-center justify-center font-black shrink-0">
                    <Check className="w-6 h-6 stroke-[3]" />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-sm uppercase text-green-400">
                      TICKET VALID & PAID
                    </h3>
                    <p className="text-xs text-green-200">Online registration verified</p>
                  </div>
                </div>
              )}

              {scanState === "already_checked_in" && (
                <div className="p-3.5 rounded-2xl bg-amber-900/40 border border-amber-500/40 text-amber-300 flex items-center gap-3">
                  <AlertTriangle className="w-8 h-8 text-amber-400 shrink-0" />
                  <div>
                    <h3 className="font-display font-black text-sm uppercase text-amber-400">
                      ALREADY CHECKED IN
                    </h3>
                    <p className="text-xs text-amber-200">
                      This pass has already entered the venue.
                    </p>
                  </div>
                </div>
              )}

              {scanState === "cash_pending" && (
                <div className="p-3.5 rounded-2xl bg-amber-900/40 border border-amber-500/40 text-amber-300 flex items-center gap-3">
                  <Banknote className="w-8 h-8 text-amber-400 shrink-0" />
                  <div>
                    <h3 className="font-display font-black text-sm uppercase text-amber-400">
                      ₹50 CASH ENTRY REQUIRED
                    </h3>
                    <p className="text-xs text-amber-200">
                      Participant selected cash on arrival.
                    </p>
                  </div>
                </div>
              )}

              {scanState === "checked_in_success" && (
                <div className="p-4 rounded-2xl bg-emerald-900/60 border border-emerald-400 text-emerald-200 flex items-center gap-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 shrink-0" />
                  <div>
                    <h3 className="font-display font-black text-base uppercase text-white">
                      ENTRY CONFIRMED!
                    </h3>
                    <p className="text-xs text-emerald-200">Welcome to Yuva Shakti Sangam!</p>
                  </div>
                </div>
              )}

              {/* Participant Details Card */}
              <div className="p-4 rounded-2xl bg-[#1C140E] border border-white/10 space-y-2.5">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-[#FFA000] uppercase">
                      {scannedParticipant.registration_id}
                    </span>
                    <h2 className="font-display font-black text-lg text-white uppercase mt-0.5">
                      {scannedParticipant.name}
                    </h2>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-white/10 text-white/90">
                    Age: {scannedParticipant.age}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-white/80 pt-2 border-t border-white/10 font-mono">
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#FFA000]" />
                    <span>{scannedParticipant.phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#FFA000]" />
                    <span>{scannedParticipant.city}</span>
                  </div>
                </div>

                {scannedParticipant.college && (
                  <p className="text-[11px] text-white/60 truncate">
                    🎓 {scannedParticipant.college}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                {scanState === "paid" && (
                  <button
                    onClick={handleConfirmCheckin}
                    disabled={checkingIn}
                    className="w-full py-4 px-6 rounded-2xl bg-green-500 hover:bg-green-600 active:scale-95 text-[#14100D] font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer disabled:opacity-50"
                  >
                    {checkingIn ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <span>GRANT ENTRY & CHECK IN</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                )}

                {scanState === "cash_pending" && (
                  <button
                    onClick={handleCollectCash}
                    disabled={collectingCash}
                    className="w-full py-4 px-6 rounded-2xl bg-[#FFA000] hover:bg-[#FFB300] active:scale-95 text-[#14100D] font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer disabled:opacity-50"
                  >
                    {collectingCash ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Banknote className="w-5 h-5" />
                        <span>COLLECT ₹50 CASH & GRANT ENTRY</span>
                      </>
                    )}
                  </button>
                )}

                {(scanState === "checked_in_success" || scanState === "already_checked_in") && (
                  <button
                    onClick={resetScan}
                    className="w-full py-3.5 px-6 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <span>NEXT ATTENDEE (SCAN AGAIN)</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Invalid scan alert modal */}
        {scanState === "invalid" && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
            <div className="w-full max-w-sm bg-[#241A13] border-2 border-red-500/50 rounded-3xl p-6 shadow-2xl text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-red-950 text-red-500 flex items-center justify-center mx-auto border border-red-800">
                <XCircle className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-display font-black text-base text-red-400 uppercase">
                  INVALID TICKET QR
                </h3>
                <p className="text-xs text-white/80 mt-1">
                  {errorMessage || "No matching registration record found in system."}
                </p>
              </div>
              <button
                onClick={resetScan}
                className="w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold uppercase text-white"
              >
                Scan Next Attendee
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Compact Footer Bar */}
      <footer className="px-4 py-2 bg-[#1C140E] border-t border-white/10 text-center text-[11px] font-mono text-white/50 z-20">
        Yuva Shakti Sangam • Gate Clearance Terminal • Session Checked-in:{" "}
        <span className="text-[#FFA000] font-bold">{sessionCheckins}</span>
      </footer>
    </div>
  );
}
