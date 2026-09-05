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
  QrCode,
  IndianRupee,
  Wifi,
  WifiOff,
  CloudUpload,
  Database,
  Copy,
  ExternalLink,
} from "lucide-react";
import { Html5Qrcode } from "html5-qrcode";
import QRCode from "qrcode";
import { Participant } from "@/types/registration";
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

export default function VolunteerScannerPage() {
  const [scannerActive, setScannerActive] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [torchOn, setTorchOn] = useState(false);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [sessionCheckins, setSessionCheckins] = useState(0);
  const [operatorName, setOperatorName] = useState<string>("Swayamsevak");
  const [sessionCash, setSessionCash] = useState<number>(0);
  const [sessionOnline, setSessionOnline] = useState<number>(0);
  const [paymentChoice, setPaymentChoice] = useState<"cash" | "upi">("cash");
  const [showPaymentQrModal, setShowPaymentQrModal] = useState<boolean>(false);
  const [copiedUpi, setCopiedUpi] = useState<boolean>(false);
  const [utrInput, setUtrInput] = useState<string>("");
  const [confirmingOnline, setConfirmingOnline] = useState<boolean>(false);

  const copyUpiId = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(OFFICIAL_UPI_ID);
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2000);
    }
  };

  const [scannedParticipant, setScannedParticipant] = useState<Participant | null>(null);
  const [scanState, setScanState] = useState<
    "idle" | "paid" | "cash_pending" | "already_checked_in" | "invalid" | "checked_in_success"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [collectingCash, setCollectingCash] = useState(false);
  const [checkingIn, setCheckingIn] = useState(false);

  // Offline Resilience States
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [offlineQueueCount, setOfflineQueueCount] = useState<number>(0);
  const [isSyncingQueue, setIsSyncingQueue] = useState<boolean>(false);
  const [rosterCount, setRosterCount] = useState<number>(0);
  const [isOfflineResult, setIsOfflineResult] = useState<boolean>(false);
  const [syncFeedback, setSyncFeedback] = useState<string>("");

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize network status, warm local attendee cache, and listen for reconnect
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
        setSyncFeedback(res.error || "Sync pending network reconnect.");
        setTimeout(() => setSyncFeedback(""), 4000);
      }
    } catch (err: any) {
      setSyncFeedback("Sync pending retry.");
      setTimeout(() => setSyncFeedback(""), 3000);
    } finally {
      setIsSyncingQueue(false);
    }
  };

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
    setIsOfflineResult(false);

    let cleanQuery = query.trim();
    if (cleanQuery.includes("/ticket/")) {
      cleanQuery = cleanQuery.split("/ticket/")[1].split("?")[0].split("#")[0];
    }

    // Fast-path: If device is offline, check local roster directly
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

  const handleConfirmCheckin = async () => {
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
      setSessionCheckins((c) => c + 1);
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
            method: "qr_scan",
          }),
        },
        2800
      );

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
      console.warn("Check-in network timeout, queuing offline action:", err);
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
      setSessionCheckins((c) => c + 1);
      setIsOfflineResult(true);
      playFeedbackSound("success");
    } finally {
      setCheckingIn(false);
    }
  };

  const handleCollectCash = async () => {
    if (!scannedParticipant) return;
    setCollectingCash(true);
    const payTime = new Date().toISOString();

    // If offline, queue cash action
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
      setScanState("checked_in_success");
      setSessionCheckins((c) => c + 1);
      setSessionCash((c) => c + 50);
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
            notes: "Collected ₹50 cash at volunteer gate scanner",
          }),
        },
        2800
      );

      const data = await res.json();

      if (data.success) {
        setScanState("checked_in_success");
        setSessionCheckins((c) => c + 1);
        setSessionCash((c) => c + 50);
        playFeedbackSound("success");
      } else {
        setErrorMessage(data.error || "Cash recording failed.");
        playFeedbackSound("error");
      }
    } catch (err) {
      console.warn("Cash collection network timeout, queuing offline action:", err);
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
      setScanState("checked_in_success");
      setSessionCheckins((c) => c + 1);
      setSessionCash((c) => c + 50);
      setIsOfflineResult(true);
      playFeedbackSound("success");
    } finally {
      setCollectingCash(false);
    }
  };

  const handleSpotOnlinePayment = async () => {
    if (!scannedParticipant) return;
    setConfirmingOnline(true);
    const payTime = new Date().toISOString();

    // If offline, queue spot online action
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      queueOfflineAction({
        type: "spot_online",
        participant_id: scannedParticipant.id,
        utr: utrInput,
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
      setScanState("checked_in_success");
      setSessionCheckins((c) => c + 1);
      setSessionOnline((c) => c + 50);
      setIsOfflineResult(true);
      playFeedbackSound("success");
      setConfirmingOnline(false);
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
            utr: utrInput,
            notes: "On-spot venue UPI verified",
          }),
        },
        2800
      );

      const data = await res.json();

      if (data.success) {
        setScanState("checked_in_success");
        setSessionCheckins((c) => c + 1);
        setSessionOnline((c) => c + 50);
        playFeedbackSound("success");
      } else {
        setErrorMessage(data.error || "Online verification failed.");
        playFeedbackSound("error");
      }
    } catch (err) {
      console.warn("Online payment network timeout, queuing offline action:", err);
      queueOfflineAction({
        type: "spot_online",
        participant_id: scannedParticipant.id,
        utr: utrInput,
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
      setScanState("checked_in_success");
      setSessionCheckins((c) => c + 1);
      setSessionOnline((c) => c + 50);
      setIsOfflineResult(true);
      playFeedbackSound("success");
    } finally {
      setConfirmingOnline(false);
    }
  };

  const resetScan = () => {
    setScannedParticipant(null);
    setScanState("idle");
    setErrorMessage("");
    setSearchQuery("");
    setUtrInput("");
    setPaymentChoice("cash");
    setIsOfflineResult(false);
  };

  // Fetch logged-in volunteer/admin operator identity
  useEffect(() => {
    fetch("/api/volunteer/session")
      .then((r) => r.json())
      .then((data) => {
        if (data?.authenticated && data?.user?.username) {
          setOperatorName(data.user.username);
        }
      })
      .catch((e) => console.warn("Session check error:", e));
  }, []);

  // Official 600x600 UPI QR code is pre-embedded via OFFICIAL_PAYMENT_QR_BASE64 for 100% offline & instant scan reliability

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
      <header className="px-3 sm:px-4 py-2.5 sm:py-3 bg-[#1C140E] border-b border-white/10 flex items-center justify-between z-20 shadow-md">
        <div className="flex items-center gap-2 sm:gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#E65100] text-white flex items-center justify-center font-display font-black text-xs shadow-md shrink-0">
            YS
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-mono font-bold tracking-wider text-[#FFA000] uppercase">
                VOLUNTEER SCANNER
              </span>
            </div>
            <p className="text-[11px] font-bold text-white/90 flex items-center gap-1">
              <span className="text-white/50 text-[10px]">OPERATOR:</span>
              <span className="text-[#FFA000] font-mono text-[11px] font-bold truncate max-w-[120px] sm:max-w-[200px]">
                {operatorName}
              </span>
            </p>
          </div>
        </div>

        {/* Header Controls & Live Counters */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Live counters badge */}
          <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] sm:text-[11px] font-mono">
            <span className="text-green-400 flex items-center gap-1 font-bold">
              <CheckCircle2 className="w-3 h-3" />
              <span>{sessionCheckins}</span>
            </span>
            <span className="text-white/20">|</span>
            <span className="text-[#FFA000] flex items-center gap-0.5 font-bold" title="Cash collected this session">
              <Banknote className="w-3 h-3" />
              <span>₹{sessionCash}</span>
            </span>
            <span className="text-white/20">|</span>
            <span className="text-blue-400 flex items-center gap-0.5 font-bold" title="UPI verified this session">
              <QrCode className="w-3 h-3" />
              <span>₹{sessionOnline}</span>
            </span>
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
            onClick={() => setShowPaymentQrModal(true)}
            className="px-2.5 py-1.5 rounded-xl bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/40 text-blue-300 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Show ₹50 UPI Payment QR"
          >
            <QrCode className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">₹50 QR</span>
            <span className="sm:hidden">QR</span>
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

      {/* Offline Resilience & Network Status Strip */}
      <div className="bg-[#1C140E] border-b border-white/10 px-3 sm:px-4 py-2 flex items-center justify-between text-xs z-10">
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
              <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
                <Wifi className="w-3.5 h-3.5" />
                <span>Live Mode</span>
              </span>
            ) : (
              <span className="text-amber-400 flex items-center gap-1 text-[11px]">
                <WifiOff className="w-3.5 h-3.5" />
                <span>Offline Cache Active</span>
              </span>
            )}
          </div>
          <span className="text-white/30 text-[10px]">|</span>
          <span className="text-[11px] font-mono text-white/60" title="Locally cached attendee directory">
            {rosterCount} cached
          </span>
        </div>

        <div className="flex items-center gap-2">
          {offlineQueueCount > 0 ? (
            <button
              onClick={triggerSync}
              disabled={isSyncingQueue}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#E65100] text-white font-bold text-[11px] animate-pulse hover:opacity-90 disabled:opacity-50 cursor-pointer"
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

      {/* Sync Feedback Toast */}
      {syncFeedback && (
        <div className="bg-[#E65100]/20 border-b border-[#E65100]/40 px-3 py-1.5 text-center text-xs font-bold text-[#FFA000] animate-fadeIn">
          {syncFeedback}
        </div>
      )}

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

              {/* Offline Verification Notice */}
              {isOfflineResult && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold">
                  <WifiOff className="w-3.5 h-3.5 shrink-0" />
                  <span>Offline Record • Actions Queued for Server Sync</span>
                </div>
              )}

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
                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-amber-900/40 border border-amber-500/40 text-amber-300 flex items-center gap-3">
                    <Banknote className="w-8 h-8 text-amber-400 shrink-0" />
                    <div>
                      <h3 className="font-display font-black text-sm uppercase text-amber-400">
                        ₹50 ENTRY FEE REQUIRED
                      </h3>
                      <p className="text-xs text-amber-200">
                        Choose payment method: Cash or UPI.
                      </p>
                    </div>
                  </div>

                  {/* Payment Method Switcher Tabs */}
                  <div className="grid grid-cols-2 gap-2 p-1 bg-[#1C140E] rounded-xl border border-white/10">
                    <button
                      type="button"
                      onClick={() => setPaymentChoice("cash")}
                      className={`py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        paymentChoice === "cash"
                          ? "bg-[#FFA000] text-[#14100D] shadow-md font-black"
                          : "text-white/60 hover:text-white"
                      }`}
                    >
                      <Banknote className="w-4 h-4" />
                      <span>Cash (₹50)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentChoice("upi")}
                      className={`py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        paymentChoice === "upi"
                          ? "bg-blue-600 text-white shadow-md font-black"
                          : "text-white/60 hover:text-white"
                      }`}
                    >
                      <QrCode className="w-4 h-4" />
                      <span>Online UPI (₹50)</span>
                    </button>
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

                {scanState === "cash_pending" && paymentChoice === "cash" && (
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

                {scanState === "cash_pending" && paymentChoice === "upi" && (
                  <div className="space-y-3 animate-in fade-in duration-150">
                    <div className="p-3.5 rounded-2xl bg-[#1C140E] border border-blue-500/30 flex flex-col items-center text-center space-y-2.5">
                      <div className="flex items-center justify-between w-full px-1">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-blue-300">
                          Scan with GPay / PhonePe / Paytm / BHIM
                        </p>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono font-bold">
                          ₹{OFFICIAL_UPI_AMOUNT}
                        </span>
                      </div>

                      {/* Official Verified Merchant QR Container */}
                      <div className="p-3 bg-white rounded-2xl shadow-xl flex items-center justify-center border-2 border-blue-400/40">
                        <img
                          src={OFFICIAL_PAYMENT_QR_BASE64}
                          alt="Official ₹50 Payment QR"
                          className="w-48 h-48 max-w-full aspect-square block"
                          style={{ imageRendering: "pixelated" }}
                        />
                      </div>

                      <div className="w-full space-y-1.5 pt-1">
                        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs font-mono">
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

                        <div className="flex items-center justify-between px-1 text-[10px] text-white/50">
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

                      <div className="w-full pt-1">
                        <input
                          type="text"
                          value={utrInput}
                          onChange={(e) => setUtrInput(e.target.value)}
                          placeholder="Optional: Enter UPI UTR / Ref No..."
                          className="w-full px-3 py-2 rounded-xl bg-[#29201A] border border-white/15 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-blue-400 font-mono text-center"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleSpotOnlinePayment}
                      disabled={confirmingOnline}
                      className="w-full py-4 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer disabled:opacity-50"
                    >
                      {confirmingOnline ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <CheckCircle2 className="w-5 h-5" />
                          <span>VERIFY ₹50 UPI & GRANT ENTRY</span>
                        </>
                      )}
                    </button>
                  </div>
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
              <div className="p-3 bg-white rounded-2xl shadow-2xl inline-block mx-auto border-2 border-blue-400">
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
      </main>

      {/* Bottom Compact Footer Bar */}
      <footer className="px-4 py-2.5 bg-[#1C140E] border-t border-white/10 text-[11px] font-mono text-white/60 z-20 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span>Duty: <strong className="text-white">{operatorName}</strong></span>
        </div>
        <div className="flex items-center gap-3">
          <span>Cash in Hand: <strong className="text-[#FFA000]">₹{sessionCash}</strong></span>
          <span className="text-white/20">|</span>
          <span>UPI Verified: <strong className="text-blue-400">₹{sessionOnline}</strong></span>
          <span className="text-white/20">|</span>
          <span>Check-ins: <strong className="text-green-400">{sessionCheckins}</strong></span>
        </div>
      </footer>
    </div>
  );
}
