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
  QrCode,
  Wifi,
  WifiOff,
  CloudUpload,
  Database,
  Copy,
  ExternalLink,
  X,
  Check,
} from "lucide-react";
import { Html5Qrcode } from "html5-qrcode";
import QRCode from "qrcode";
import { Participant } from "@/types/registration";
import { extractQuestion } from "@/lib/participant-helpers";
import {
  fetchAndCacheRoster,
  lookupParticipantOffline,
  queueOfflineAction,
  syncQueuedOfflineActions,
  getQueuedOfflineActions,
  getOfflineRoster,
  fetchWithTimeout,
} from "@/lib/offline-sync";
import {
  OFFICIAL_PAYMENT_QR_BASE64,
  OFFICIAL_UPI_ID,
  OFFICIAL_UPI_NAME,
  OFFICIAL_UPI_AMOUNT,
  OFFICIAL_UPI_URL,
} from "@/lib/payment-qr-data";

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

  // Online venue UPI payment states
  const [paymentMode, setPaymentMode] = useState<"cash" | "upi">("cash");
  const [showPaymentQrModal, setShowPaymentQrModal] = useState<boolean>(false);
  const [copiedUpi, setCopiedUpi] = useState<boolean>(false);
  const [utrNumber, setUtrNumber] = useState<string>("");
  const [verifyingOnline, setVerifyingOnline] = useState<boolean>(false);

  const copyUpiId = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(OFFICIAL_UPI_ID);
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2000);
    }
  };

  // Offline Resilience States
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [offlineQueueCount, setOfflineQueueCount] = useState<number>(0);
  const [isSyncingQueue, setIsSyncingQueue] = useState<boolean>(false);
  const [rosterCount, setRosterCount] = useState<number>(0);
  const [isOfflineResult, setIsOfflineResult] = useState<boolean>(false);
  const [syncFeedback, setSyncFeedback] = useState<string>("");

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize network status, warm local cache and setup listeners
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsOnline(navigator.onLine);
      const initialRoster = getOfflineRoster();
      setRosterCount(initialRoster.length);
      const initialQueue = getQueuedOfflineActions();
      setOfflineQueueCount(initialQueue.length);

      // Warm local attendee cache in background if online
      if (navigator.onLine) {
        fetchAndCacheRoster().then((res) => {
          if (res.success) setRosterCount(res.count);
        });
      }

      const handleOnline = () => {
        setIsOnline(true);
        triggerSync();
      };
      const handleOffline = () => {
        setIsOnline(false);
      };

      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);

      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      };
    }
  }, []);

  const triggerSync = async () => {
    const queue = getQueuedOfflineActions();
    if (queue.length === 0) return;

    setIsSyncingQueue(true);
    setSyncFeedback("Syncing queued actions...");
    try {
      const res = await syncQueuedOfflineActions();
      setOfflineQueueCount(res.remainingCount);
      if (res.success && res.syncedCount > 0) {
        setSyncFeedback(`Synced ${res.syncedCount} offline action(s) to server!`);
        const updatedRoster = getOfflineRoster();
        setRosterCount(updatedRoster.length);
        setTimeout(() => setSyncFeedback(""), 4000);
      } else if (!res.success) {
        setSyncFeedback(res.error || "Sync pending connection.");
        setTimeout(() => setSyncFeedback(""), 4000);
      }
    } catch (err: any) {
      setSyncFeedback("Sync pending retry.");
      setTimeout(() => setSyncFeedback(""), 3000);
    } finally {
      setIsSyncingQueue(false);
    }
  };

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
    setIsOfflineResult(false);

    let cleanQuery = query.trim();
    if (cleanQuery.includes("/ticket/")) {
      cleanQuery = cleanQuery.split("/ticket/")[1].split("?")[0].split("#")[0];
    }

    // Fast-path: If device reports offline, use local offline roster cache immediately
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      const offlineMatch = lookupParticipantOffline(cleanQuery);
      if (offlineMatch) {
        setIsOfflineResult(true);
        setScannedParticipant(offlineMatch);
        if (offlineMatch.checked_in) {
          setScanState("already_checked_in");
          playFeedbackSound("warning");
        } else if (offlineMatch.payment_status === "paid") {
          setScanState("paid");
          playFeedbackSound("success");
        } else if (offlineMatch.payment_status === "pending") {
          setScanState("cash_pending");
          playFeedbackSound("warning");
        } else {
          setScanState("invalid");
          setErrorMessage("Payment status invalid or refunded.");
          playFeedbackSound("error");
        }
      } else {
        setScanState("invalid");
        setScannedParticipant(null);
        setErrorMessage(`Offline Mode: Pass not found in local cache (${rosterCount} attendees cached).`);
        playFeedbackSound("error");
      }
      setLoading(false);
      return;
    }

    // Online attempt with fast timeout (falls back to local cache instead of hanging on congested cell towers)
    try {
      const res = await fetchWithTimeout(
        "/api/checkin/lookup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: cleanQuery }),
        },
        2800
      );

      const data = await res.json();

      if (!res.ok || !data.success || !data.participant) {
        // Fallback check against local cache before declaring invalid
        const fallbackMatch = lookupParticipantOffline(cleanQuery);
        if (fallbackMatch) {
          setIsOfflineResult(true);
          setScannedParticipant(fallbackMatch);
          if (fallbackMatch.checked_in) {
            setScanState("already_checked_in");
            playFeedbackSound("warning");
          } else if (fallbackMatch.payment_status === "paid") {
            setScanState("paid");
            playFeedbackSound("success");
          } else if (fallbackMatch.payment_status === "pending") {
            setScanState("cash_pending");
            playFeedbackSound("warning");
          } else {
            setScanState("invalid");
            setErrorMessage("Payment status invalid or refunded.");
            playFeedbackSound("error");
          }
          setLoading(false);
          return;
        }

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
      console.warn("Lookup network timeout/error, checking local roster:", err);
      // Cellular network lag / timeout fallback
      const offlineMatch = lookupParticipantOffline(cleanQuery);
      if (offlineMatch) {
        setIsOfflineResult(true);
        setScannedParticipant(offlineMatch);
        if (offlineMatch.checked_in) {
          setScanState("already_checked_in");
          playFeedbackSound("warning");
        } else if (offlineMatch.payment_status === "paid") {
          setScanState("paid");
          playFeedbackSound("success");
        } else if (offlineMatch.payment_status === "pending") {
          setScanState("cash_pending");
          playFeedbackSound("warning");
        } else {
          setScanState("invalid");
          setErrorMessage("Payment status invalid or refunded.");
          playFeedbackSound("error");
        }
      } else {
        setScanState("invalid");
        setErrorMessage("Network timed out and pass not found in local cache.");
        playFeedbackSound("error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    if (!scannedParticipant) return;
    setCheckingIn(true);
    const checkinTime = new Date().toISOString();

    // If offline, queue directly in outbox
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      queueOfflineAction({
        type: "confirm",
        participant_id: scannedParticipant.id,
        timestamp: checkinTime,
      });
      setOfflineQueueCount(getQueuedOfflineActions().length);
      setScannedParticipant({
        ...scannedParticipant,
        checked_in: true,
        check_in_time: checkinTime,
      });
      setScanState("checked_in_success");
      setIsOfflineResult(true);
      playFeedbackSound("success");
      setCheckingIn(false);
      return;
    }

    try {
      const res = await fetchWithTimeout(
        "/api/checkin/confirm",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token_or_id: scannedParticipant.qr_token || scannedParticipant.registration_id,
            participant_id: scannedParticipant.id,
            method: tab === "scan" ? "qr_scan" : "manual_search",
          }),
        },
        2800
      );

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
      console.warn("Checkin timeout, queuing offline action:", err);
      queueOfflineAction({
        type: "confirm",
        participant_id: scannedParticipant.id,
        timestamp: checkinTime,
      });
      setOfflineQueueCount(getQueuedOfflineActions().length);
      setScannedParticipant({
        ...scannedParticipant,
        checked_in: true,
        check_in_time: checkinTime,
      });
      setScanState("checked_in_success");
      setIsOfflineResult(true);
      playFeedbackSound("success");
    } finally {
      setCheckingIn(false);
    }
  };

  const handleConfirmCashCollection = async () => {
    if (!scannedParticipant) return;
    setCollectingCash(true);
    const payTime = new Date().toISOString();

    // If offline, queue cash collection action
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      queueOfflineAction({
        type: "cash",
        participant_id: scannedParticipant.id,
        timestamp: payTime,
      });
      setOfflineQueueCount(getQueuedOfflineActions().length);
      setScannedParticipant({
        ...scannedParticipant,
        payment_status: "paid",
        payment_method: "cash",
        checked_in: true,
        check_in_time: payTime,
      });
      setCashModalOpen(false);
      setScanState("checked_in_success");
      setIsOfflineResult(true);
      playFeedbackSound("success");
      setCollectingCash(false);
      return;
    }

    try {
      const res = await fetchWithTimeout(
        "/api/checkin/cash-collect",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            participant_id: scannedParticipant.id,
            notes: "Collected ₹50 cash at entrance gate",
          }),
        },
        2800
      );

      const data = await res.json();

      if (data.success && data.participant) {
        setScannedParticipant(data.participant);
        setCashModalOpen(false);
        setScanState("checked_in_success");
        playFeedbackSound("success");
      } else {
        setErrorMessage(data.error || "Failed to record cash payment.");
        playFeedbackSound("error");
      }
    } catch (err) {
      console.warn("Cash collection timeout, queuing offline action:", err);
      queueOfflineAction({
        type: "cash",
        participant_id: scannedParticipant.id,
        timestamp: payTime,
      });
      setOfflineQueueCount(getQueuedOfflineActions().length);
      setScannedParticipant({
        ...scannedParticipant,
        payment_status: "paid",
        payment_method: "cash",
        checked_in: true,
        check_in_time: payTime,
      });
      setCashModalOpen(false);
      setScanState("checked_in_success");
      setIsOfflineResult(true);
      playFeedbackSound("success");
    } finally {
      setCollectingCash(false);
    }
  };

  const handleSpotOnlinePay = async () => {
    if (!scannedParticipant) return;
    setVerifyingOnline(true);
    const payTime = new Date().toISOString();

    // If offline, queue spot online payment action
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      queueOfflineAction({
        type: "spot_online",
        participant_id: scannedParticipant.id,
        utr: utrNumber,
        timestamp: payTime,
      });
      setOfflineQueueCount(getQueuedOfflineActions().length);
      setScannedParticipant({
        ...scannedParticipant,
        payment_status: "paid",
        payment_method: "online",
        checked_in: true,
        check_in_time: payTime,
      });
      setCashModalOpen(false);
      setScanState("checked_in_success");
      setIsOfflineResult(true);
      playFeedbackSound("success");
      setVerifyingOnline(false);
      return;
    }

    try {
      const res = await fetchWithTimeout(
        "/api/checkin/spot-online-pay",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            participant_id: scannedParticipant.id,
            utr: utrNumber,
            notes: "On-spot UPI verified at admin check-in desk",
          }),
        },
        2800
      );

      const data = await res.json();

      if (data.success && data.participant) {
        setScannedParticipant(data.participant);
        setCashModalOpen(false);
        setScanState("checked_in_success");
        playFeedbackSound("success");
      } else {
        setErrorMessage(data.error || "Online verification failed.");
        playFeedbackSound("error");
      }
    } catch (err) {
      console.warn("Spot online pay timeout, queuing offline action:", err);
      queueOfflineAction({
        type: "spot_online",
        participant_id: scannedParticipant.id,
        utr: utrNumber,
        timestamp: payTime,
      });
      setOfflineQueueCount(getQueuedOfflineActions().length);
      setScannedParticipant({
        ...scannedParticipant,
        payment_status: "paid",
        payment_method: "online",
        checked_in: true,
        check_in_time: payTime,
      });
      setCashModalOpen(false);
      setScanState("checked_in_success");
      setIsOfflineResult(true);
      playFeedbackSound("success");
    } finally {
      setVerifyingOnline(false);
    }
  };

  const resetScan = () => {
    setScanState("idle");
    setScannedParticipant(null);
    setErrorMessage("");
    setSearchQuery("");
    setUtrNumber("");
    setPaymentMode("cash");
    setCashModalOpen(false);
    setIsOfflineResult(false);
  };

  // Official 600x600 UPI QR code is pre-embedded via OFFICIAL_PAYMENT_QR_BASE64 for 100% offline & instant scan reliability

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

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowPaymentQrModal(true)}
              className="px-2.5 py-1.5 rounded-xl bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/40 text-blue-300 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Show ₹50 UPI Payment QR Code"
            >
              <QrCode className="w-3.5 h-3.5 text-blue-400" />
              <span>₹50 QR</span>
            </button>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-xl bg-[#24170D] text-[#FAF4EC] hover:text-[#FFA000]"
              aria-label="Toggle Sound"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-[#22C55E]" /> : <VolumeX className="w-4 h-4 text-zinc-500" />}
            </button>
          </div>
        </div>

        {/* Offline Resilience & Network Status Strip */}
        <div className="flex items-center justify-between px-3 py-2 rounded-2xl bg-[#24170D] border border-[#FAF4EC]/10 text-xs">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isOnline ? "bg-emerald-400" : "bg-amber-400"
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  isOnline ? "bg-emerald-500" : "bg-amber-500"
                }`}
              />
            </span>
            <div className="flex items-center gap-1.5 font-bold">
              {isOnline ? (
                <span className="text-emerald-400 flex items-center gap-1">
                  <Wifi className="w-3.5 h-3.5" />
                  <span>Online Mode</span>
                </span>
              ) : (
                <span className="text-amber-400 flex items-center gap-1">
                  <WifiOff className="w-3.5 h-3.5" />
                  <span>Offline Backup Active</span>
                </span>
              )}
            </div>
            <span className="text-[#FAF4EC]/40 text-[10px]">|</span>
            <span className="text-[11px] font-mono text-[#FAF4EC]/60" title="Locally cached attendee directory">
              {rosterCount} cached
            </span>
          </div>

          <div className="flex items-center gap-2">
            {offlineQueueCount > 0 ? (
              <button
                onClick={triggerSync}
                disabled={isSyncingQueue}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#E65100] text-white font-bold text-[11px] animate-pulse hover:opacity-90 disabled:opacity-50"
                title="Sync offline actions to server"
              >
                {isSyncingQueue ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <CloudUpload className="w-3 h-3" />
                )}
                <span>Sync {offlineQueueCount} Queued</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  fetchAndCacheRoster().then((res) => {
                    if (res.success) {
                      setRosterCount(res.count);
                      setSyncFeedback(`Cache updated: ${res.count} attendees`);
                      setTimeout(() => setSyncFeedback(""), 3000);
                    }
                  });
                }}
                className="text-[10px] text-[#FFA000] hover:underline flex items-center gap-1 font-mono cursor-pointer"
                title="Refresh offline attendee cache"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Update Roster</span>
              </button>
            )}
          </div>
        </div>

        {/* Sync Feedback Alert */}
        {syncFeedback && (
          <div className="p-2.5 rounded-xl bg-[#E65100]/15 border border-[#E65100]/30 text-center text-xs font-bold text-[#FFA000] animate-in fade-in">
            {syncFeedback}
          </div>
        )}

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

            {isOfflineResult && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold">
                <WifiOff className="w-3.5 h-3.5 shrink-0" />
                <span>Offline Record • Changes Queued for Auto-Sync</span>
              </div>
            )}

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

        {/* STATE B: PAYMENT PENDING (CASH OR ON-SPOT UPI) */}
        {scanState === "cash_pending" && scannedParticipant && (
          <div className="p-5 sm:p-6 rounded-3xl bg-amber-950/80 border-2 border-amber-500 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-black flex items-center justify-center shrink-0">
                <Banknote className="w-7 h-7 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 block">
                  PAYMENT PENDING
                </span>
                <span className="text-lg font-display font-black text-white uppercase block">
                  ENTRY FEE REQUIRED (₹50)
                </span>
              </div>
            </div>

            {isOfflineResult && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold">
                <WifiOff className="w-3.5 h-3.5 shrink-0" />
                <span>Offline Record • Changes Queued for Auto-Sync</span>
              </div>
            )}

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

            {/* Payment Method Selector: Cash vs Online UPI */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2 p-1 bg-black/50 rounded-2xl border border-white/10">
                <button
                  type="button"
                  onClick={() => setPaymentMode("cash")}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    paymentMode === "cash"
                      ? "bg-amber-500 text-black shadow-lg font-black"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <Banknote className="w-4 h-4" />
                  <span>Cash (₹50)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMode("upi")}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    paymentMode === "upi"
                      ? "bg-blue-600 text-white shadow-lg font-black"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <QrCode className="w-4 h-4" />
                  <span>Online UPI (₹50)</span>
                </button>
              </div>

              {/* MODE 1: CASH */}
              {paymentMode === "cash" && (
                <div className="space-y-2">
                  <button
                    onClick={handleConfirmCashCollection}
                    disabled={collectingCash}
                    className="w-full py-4 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-display font-black text-base uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all cursor-pointer disabled:opacity-60"
                  >
                    {collectingCash ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Banknote className="w-5 h-5" />
                        <span>COLLECT ₹50 CASH & CHECK IN</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* MODE 2: ONLINE UPI */}
              {paymentMode === "upi" && (
                <div className="space-y-3 p-4 rounded-2xl bg-black/60 border border-blue-500/40 text-center animate-in fade-in duration-150">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[11px] font-mono font-bold text-blue-300 uppercase tracking-wider">
                      Attendee UPI QR Code
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono font-bold">
                      ₹{OFFICIAL_UPI_AMOUNT}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-300">
                    Show screen to attendee to scan with GPay / PhonePe / Paytm / BHIM
                  </p>

                  {/* QR Image Container - Clean Unclipped Square Modules */}
                  <div className="p-3.5 bg-white rounded-2xl shadow-2xl inline-block mx-auto border-2 border-blue-400">
                    <img
                      src={OFFICIAL_PAYMENT_QR_BASE64}
                      alt="Official Venue Payment QR"
                      className="w-48 h-48 max-w-full aspect-square block mx-auto"
                      style={{ imageRendering: "pixelated" }}
                    />
                  </div>

                  <div className="space-y-1.5 pt-1 text-left">
                    <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-zinc-900/90 border border-white/10 text-xs font-mono">
                      <div>
                        <span className="text-[9px] text-zinc-400 uppercase block">UPI ID</span>
                        <span className="font-bold text-white text-xs">{OFFICIAL_UPI_ID}</span>
                      </div>
                      <button
                        type="button"
                        onClick={copyUpiId}
                        className="px-2.5 py-1 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-[11px] font-sans font-bold flex items-center gap-1 transition-all cursor-pointer"
                      >
                        {copiedUpi ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="flex items-center justify-between px-1 text-[11px] text-zinc-400 font-mono">
                      <span>Payee: {OFFICIAL_UPI_NAME}</span>
                      <a
                        href={OFFICIAL_UPI_URL}
                        className="text-blue-400 hover:text-blue-300 flex items-center gap-1 font-sans underline"
                      >
                        <span>Pay in App</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  <div className="pt-1">
                    <input
                      type="text"
                      value={utrNumber}
                      onChange={(e) => setUtrNumber(e.target.value)}
                      placeholder="Optional: Enter UPI UTR / Ref No..."
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/20 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-400 font-mono text-center"
                    />
                  </div>

                  <button
                    onClick={handleSpotOnlinePay}
                    disabled={verifyingOnline}
                    className="w-full py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-display font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all cursor-pointer disabled:opacity-60"
                  >
                    {verifyingOnline ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        <span>VERIFY ₹50 UPI & CHECK IN</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              <button
                onClick={resetScan}
                className="w-full py-2.5 px-4 rounded-xl bg-black/40 hover:bg-black/60 text-xs font-bold uppercase tracking-wider text-zinc-400 cursor-pointer"
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
              {isOfflineResult && (
                <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 border border-amber-400/50 text-amber-300 text-[11px] font-bold">
                  <WifiOff className="w-3 h-3" />
                  <span>Recorded locally • Queued for server sync</span>
                </div>
              )}
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

      {/* Quick Standalone ₹50 Payment QR Modal for Queue/Direct Pay */}
      {showPaymentQrModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="relative w-full max-w-sm rounded-3xl bg-[#1C140E] border-2 border-blue-500/50 p-6 shadow-2xl text-center space-y-4">
            <button
              type="button"
              onClick={() => setShowPaymentQrModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold tracking-widest text-blue-400 uppercase">
                Yuva Shakti Sangam
              </span>
              <h2 className="text-xl font-display font-black text-white uppercase tracking-tight">
                Entry Fee: ₹{OFFICIAL_UPI_AMOUNT}
              </h2>
              <p className="text-xs text-zinc-300">
                Scan with any UPI app (GPay, PhonePe, Paytm, BHIM, Cred)
              </p>
            </div>

            {/* Official High-Res Verified QR Container */}
            <div className="p-3.5 bg-white rounded-2xl shadow-2xl inline-block mx-auto border-2 border-blue-400">
              <img
                src={OFFICIAL_PAYMENT_QR_BASE64}
                alt="Yuva Shakti Sangam ₹50 Payment QR"
                className="w-56 h-56 max-w-full aspect-square block mx-auto"
                style={{ imageRendering: "pixelated" }}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs font-mono">
                <div className="text-left">
                  <span className="text-[9px] text-white/40 uppercase block">UPI ID</span>
                  <span className="font-bold text-white text-xs">{OFFICIAL_UPI_ID}</span>
                </div>
                <button
                  type="button"
                  onClick={copyUpiId}
                  className="px-2.5 py-1 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-[11px] font-sans font-bold flex items-center gap-1 transition-all cursor-pointer"
                >
                  {copiedUpi ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between px-1 text-[11px] text-zinc-400">
                <span>Payee: {OFFICIAL_UPI_NAME}</span>
                <a
                  href={OFFICIAL_UPI_URL}
                  className="text-blue-400 hover:text-blue-300 flex items-center gap-1 font-sans underline"
                >
                  <span>Pay in App</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowPaymentQrModal(false)}
              className="w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold uppercase tracking-wider text-white transition-colors cursor-pointer"
            >
              Close QR Code
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
