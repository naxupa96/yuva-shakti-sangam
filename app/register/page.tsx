"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Ticket,
  CreditCard,
  Banknote,
  CheckCircle2,
  Loader2,
  AlertCircle,
  QrCode,
  Copy,
  Check,
  UploadCloud,
  FileImage,
  ExternalLink,
  ScanLine,
} from "lucide-react";
import { eventConfig, LUMA_REGISTRATION_URL } from "@/lib/config";
import { CornerOrnament, MandalaMotif, DevanagariWatermark } from "@/components/Decorations";
import { PaymentMethod, RegistrationInput } from "@/types/registration";

export default function RegisterPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<RegistrationInput>({
    name: "",
    phone: "",
    email: "",
    age: 21,
    city: "Ahmedabad",
    college: "",
    referral_source: "",
    payment_method: "online",
  });

  const [screenshotBase64, setScreenshotBase64] = useState<string>("");
  const [screenshotFileName, setScreenshotFileName] = useState<string>("");
  const [manualUtr, setManualUtr] = useState<string>("");
  const [copiedUpi, setCopiedUpi] = useState(false);

  const [loading, setLoading] = useState(false);
  const [ocrStatusText, setOcrStatusText] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showManualUtrField, setShowManualUtrField] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "age" ? parseInt(value, 10) || "" : value,
    }));
    setErrorMessage("");
  };

  const handlePaymentMethodSelect = (method: PaymentMethod) => {
    setFormData((prev) => ({ ...prev, payment_method: method }));
  };

  const handleCopyUpi = () => {
    if (eventConfig.upi?.id) {
      navigator.clipboard.writeText(eventConfig.upi.id);
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2500);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please upload an image file (PNG, JPG, JPEG, WEBP).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage("Image size exceeds 10MB. Please upload a smaller screenshot.");
      return;
    }

    setScreenshotFileName(file.name);
    setErrorMessage("");

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setScreenshotBase64(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // Client validation
    if (!formData.name.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }
    const cleanPhone = formData.phone.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      setErrorMessage("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (!formData.age || formData.age < 12 || formData.age > 80) {
      setErrorMessage("Please enter a valid age (12–80).");
      return;
    }
    if (!formData.city.trim()) {
      setErrorMessage("Please enter your city.");
      return;
    }

    if (formData.payment_method === "online") {
      if (!screenshotBase64 && !manualUtr.trim()) {
        setErrorMessage("Please upload your payment screenshot after completing the UPI payment.");
        return;
      }
      if (manualUtr && !/^[0-9]{12}$/.test(manualUtr.trim())) {
        setErrorMessage("UTR / UPI Ref Number must be exactly 12 digits.");
        return;
      }
    }

    setLoading(true);

    try {
      if (formData.payment_method === "online") {
        setOcrStatusText("Analyzing payment screenshot with AI Vision...");

        const response = await fetch("/api/payment/ocr-verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            phone: cleanPhone,
            screenshot_base64: screenshotBase64,
            manual_utr: manualUtr.trim() || undefined,
          }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          if (data.require_manual_utr) {
            setShowManualUtrField(true);
            setErrorMessage(
              data.error ||
                "Could not automatically detect the 12-digit UTR from the screenshot. Please enter your 12-digit UTR below."
            );
          } else {
            setErrorMessage(data.error || "Payment verification failed. Please try again.");
          }
          setLoading(false);
          setOcrStatusText("");
          return;
        }

        setOcrStatusText("Payment verified! Generating digital pass...");
        const participant = data.participant;
        router.push(
          `/register/success?token=${participant.qr_token}&id=${participant.registration_id}&method=online&status=paid`
        );
        return;
      }

      // Cash payment registration
      setOcrStatusText("Generating your cash entry pass...");
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          phone: cleanPhone,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setErrorMessage(data.error || "Registration could not be completed. Please try again.");
        setLoading(false);
        setOcrStatusText("");
        return;
      }

      const participant = data.participant;
      router.push(
        `/register/success?token=${participant.qr_token}&id=${participant.registration_id}&method=cash&status=pending`
      );
    } catch (err: any) {
      console.error("Submission error:", err);
      setErrorMessage("Network error during registration. Please check your connection and try again.");
      setLoading(false);
      setOcrStatusText("");
    }
  };

  const upiPayUrl = eventConfig.upi?.getUpiUrl?.() || `upi://pay?pa=${eventConfig.upi?.id}&pn=${encodeURIComponent(eventConfig.upi?.name || "")}&am=50&cu=INR&tn=Yuva%20Shakti%20Sangam`;

  return (
    <div className="min-h-screen bg-[#EAE0D0] bg-parchment-texture text-[#1C1917] selection:bg-[#E65100] selection:text-white py-8 sm:py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <DevanagariWatermark text="शक्ति" className="top-10 left-6 text-[14rem] sm:text-[22rem] text-[#292524]/5" />

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Navigation back */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#5A4839] hover:text-[#F05A12] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          <div className="text-[11px] font-devanagari font-black text-[#5A4839] flex items-center gap-1">
            <span className="text-[#F05A12]">युवा शक्ति</span>
            <span>•</span>
            <span>राष्ट्र शक्ति</span>
          </div>
        </div>

        {/* Main Registration Card */}
        <div className="p-6 sm:p-12 rounded-3xl bg-[#F5EBE1] border-2 border-[#292524]/15 shadow-parchment-deep relative overflow-hidden">
          <CornerOrnament className="absolute top-3 left-3 text-[#E65100]/40" />
          <CornerOrnament className="absolute top-3 right-3 text-[#E65100]/40 -scale-x-100" />
          <CornerOrnament className="absolute bottom-3 left-3 text-[#E65100]/40 -scale-y-100" />
          <CornerOrnament className="absolute bottom-3 right-3 text-[#E65100]/40 -scale-100" />

          {/* Background Mandala */}
          <div className="absolute -right-20 -top-20 opacity-20 text-[#E65100] pointer-events-none">
            <MandalaMotif size={400} />
          </div>

          {/* Header */}
          <div className="text-center space-y-3 mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1C1917] text-[#FAF4EC] text-xs font-black uppercase tracking-widest shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#FFA000]" />
              <span>OFFICIAL EVENT REGISTRATION</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-display font-black uppercase text-[#1C1917] tracking-tight leading-none">
              YUVA <span className="text-[#F05A12]">SHAKTI</span> SANGAM
            </h1>

            <div className="flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm font-bold text-[#5A4839] uppercase tracking-wider">
              <span>{eventConfig.dateDisplay}</span>
              <span>•</span>
              <span>{eventConfig.timeDisplay}</span>
              <span>•</span>
              <span>{eventConfig.locationShort}</span>
            </div>

            {/* Fee Banner */}
            <div className="mt-4 inline-block py-2 px-6 rounded-2xl bg-[#E65100]/10 border border-[#E65100]/30 text-[#E65100]">
              <span className="text-xs font-black uppercase tracking-widest block text-[#5A4839]">REGISTRATION PASS</span>
              <span className="text-2xl sm:text-3xl font-display font-black">₹50 ONLY</span>
            </div>
          </div>

          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-900 flex items-start gap-3 text-xs sm:text-sm font-medium">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>{errorMessage}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Required Fields Section */}
            <div className="space-y-4">
              <h2 className="text-xs font-black uppercase tracking-wider text-[#5A4839] border-b border-[#292524]/10 pb-2">
                1. PARTICIPANT INFORMATION
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-black uppercase tracking-wider text-[#1C1917] mb-1.5">
                    Full Name <span className="text-[#E65100]">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-4 py-3 rounded-xl bg-[#FAF4EC] border border-[#292524]/20 text-[#1C1917] placeholder:text-[#5A4839]/50 focus:outline-none focus:border-[#E65100] focus:ring-2 focus:ring-[#E65100]/20 font-medium text-sm transition-all"
                  />
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-[#1C1917] mb-1.5">
                    Mobile Number (WhatsApp) <span className="text-[#E65100]">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g. 9876543210"
                    maxLength={10}
                    className="w-full px-4 py-3 rounded-xl bg-[#FAF4EC] border border-[#292524]/20 text-[#1C1917] placeholder:text-[#5A4839]/50 focus:outline-none focus:border-[#E65100] focus:ring-2 focus:ring-[#E65100]/20 font-medium text-sm transition-all"
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-[#1C1917] mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. rahul@gmail.com"
                    className="w-full px-4 py-3 rounded-xl bg-[#FAF4EC] border border-[#292524]/20 text-[#1C1917] placeholder:text-[#5A4839]/50 focus:outline-none focus:border-[#E65100] focus:ring-2 focus:ring-[#E65100]/20 font-medium text-sm transition-all"
                  />
                </div>

                {/* Age */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-[#1C1917] mb-1.5">
                    Age (Years) <span className="text-[#E65100]">*</span>
                  </label>
                  <input
                    type="number"
                    name="age"
                    min={12}
                    max={80}
                    required
                    value={formData.age}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-[#FAF4EC] border border-[#292524]/20 text-[#1C1917] focus:outline-none focus:border-[#E65100] focus:ring-2 focus:ring-[#E65100]/20 font-medium text-sm transition-all"
                  />
                </div>

                {/* City */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-[#1C1917] mb-1.5">
                    City / Town <span className="text-[#E65100]">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g. Ahmedabad"
                    className="w-full px-4 py-3 rounded-xl bg-[#FAF4EC] border border-[#292524]/20 text-[#1C1917] placeholder:text-[#5A4839]/50 focus:outline-none focus:border-[#E65100] focus:ring-2 focus:ring-[#E65100]/20 font-medium text-sm transition-all"
                  />
                </div>

                {/* College / Organization */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-black uppercase tracking-wider text-[#1C1917] mb-1.5">
                    College / Organization / Workplace <span className="text-[#5A4839] font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    name="college"
                    value={formData.college}
                    onChange={handleChange}
                    placeholder="e.g. Gujarat University / TCS / Entrepreneur"
                    className="w-full px-4 py-3 rounded-xl bg-[#FAF4EC] border border-[#292524]/20 text-[#1C1917] placeholder:text-[#5A4839]/50 focus:outline-none focus:border-[#E65100] focus:ring-2 focus:ring-[#E65100]/20 font-medium text-sm transition-all"
                  />
                </div>

                {/* Referral source */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-black uppercase tracking-wider text-[#1C1917] mb-1.5">
                    How did you hear about Yuva Shakti Sangam? <span className="text-[#5A4839] font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    name="referral_source"
                    value={formData.referral_source}
                    onChange={handleChange}
                    placeholder="e.g. Friend, Instagram, College poster, WhatsApp"
                    className="w-full px-4 py-3 rounded-xl bg-[#FAF4EC] border border-[#292524]/20 text-[#1C1917] placeholder:text-[#5A4839]/50 focus:outline-none focus:border-[#E65100] focus:ring-2 focus:ring-[#E65100]/20 font-medium text-sm transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-4 pt-4 border-t border-[#292524]/10">
              <h2 className="text-xs font-black uppercase tracking-wider text-[#5A4839]">
                2. SELECT PAYMENT METHOD
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Online UPI Option */}
                <div
                  onClick={() => handlePaymentMethodSelect("online")}
                  className={`cursor-pointer p-4 rounded-2xl border-2 transition-all relative ${
                    formData.payment_method === "online"
                      ? "border-[#E65100] bg-[#FAF4EC] shadow-md ring-2 ring-[#E65100]/20"
                      : "border-[#292524]/15 bg-[#FAF4EC]/60 hover:border-[#292524]/30"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 shrink-0 ${
                      formData.payment_method === "online"
                        ? "border-[#E65100] bg-[#E65100]"
                        : "border-[#292524]/30"
                    }`}>
                      {formData.payment_method === "online" && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <QrCode className="w-4 h-4 text-[#E65100]" />
                        <span className="text-sm font-black uppercase tracking-wider text-[#1C1917]">
                          PAY ₹50 VIA UPI QR
                        </span>
                      </div>
                      <p className="text-xs text-[#5A4839]">
                        Scan QR code with Google Pay, PhonePe, or Paytm & upload screenshot. Instant pass activation!
                      </p>
                      <span className="inline-block text-[10px] font-black uppercase tracking-wider text-green-700 bg-green-100 px-2 py-0.5 rounded">
                        ✓ INSTANT AI CONFIRMATION
                      </span>
                    </div>
                  </div>
                </div>

                {/* Cash Option */}
                <div
                  onClick={() => handlePaymentMethodSelect("cash")}
                  className={`cursor-pointer p-4 rounded-2xl border-2 transition-all relative ${
                    formData.payment_method === "cash"
                      ? "border-[#E65100] bg-[#FAF4EC] shadow-md ring-2 ring-[#E65100]/20"
                      : "border-[#292524]/15 bg-[#FAF4EC]/60 hover:border-[#292524]/30"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 shrink-0 ${
                      formData.payment_method === "cash"
                        ? "border-[#E65100] bg-[#E65100]"
                        : "border-[#292524]/30"
                    }`}>
                      {formData.payment_method === "cash" && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <Banknote className="w-4 h-4 text-[#C8460B]" />
                        <span className="text-sm font-black uppercase tracking-wider text-[#1C1917]">
                          PAY ₹50 CASH AT EVENT
                        </span>
                      </div>
                      <p className="text-xs text-[#5A4839]">
                        Get your digital pass now. Pay ₹50 cash to an authorized volunteer at the entry counter.
                      </p>
                      <span className="inline-block text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                        ⏳ PAYMENT PENDING UNTIL ENTRY
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* UPI QR & Screenshot Upload Section (when Online is selected) */}
            {formData.payment_method === "online" && (
              <div className="p-5 sm:p-6 rounded-2xl bg-[#FAF4EC] border-2 border-[#E65100]/30 space-y-6 animate-in fade-in duration-300">
                <div className="text-center space-y-1">
                  <span className="text-[11px] font-black uppercase tracking-widest text-[#E65100] block">
                    STEP 1: SCAN & PAY ₹50
                  </span>
                  <h3 className="font-display font-black text-lg text-[#1C1917] uppercase">
                    SCAN OFFICIAL UPI QR CODE
                  </h3>
                </div>

                <div className="flex flex-col items-center justify-center space-y-4">
                  {/* QR Image Frame */}
                  <div className="p-3 bg-white rounded-2xl border-2 border-[#1C1917]/20 shadow-md inline-block relative group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={eventConfig.upi?.qrImageUrl || "/images/payment-qr.png"}
                      alt="UPI Payment QR Code"
                      className="w-52 h-52 sm:w-60 sm:h-60 object-contain rounded-lg"
                    />
                    <div className="text-center text-[10px] font-black text-[#5A4839] uppercase tracking-wider mt-2">
                      Scan with any UPI App
                    </div>
                  </div>

                  {/* Payee Details Pill */}
                  <div className="w-full max-w-sm p-3.5 rounded-xl bg-white/80 border border-[#1C1917]/15 space-y-2 text-center text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-[#5A4839] uppercase tracking-wider block">
                        Account Holder Name
                      </span>
                      <span className="font-black text-[#1C1917] uppercase text-sm">
                        {eventConfig.upi?.name || "KUSHAL GHANSHYAMBHAI"}
                      </span>
                    </div>

                    <div className="flex items-center justify-center gap-2 pt-1 border-t border-[#1C1917]/10">
                      <span className="font-mono font-bold text-[#E65100] text-xs">
                        {eventConfig.upi?.id || "7046232003@upi"}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyUpi}
                        className="px-2 py-1 rounded bg-[#FAF4EC] hover:bg-[#EAE0D0] text-[#1C1917] text-[10px] font-black uppercase flex items-center gap-1 border border-[#1C1917]/15"
                      >
                        {copiedUpi ? (
                          <>
                            <Check className="w-3 h-3 text-green-600" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 text-[#5A4839]" />
                            <span>Copy UPI</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Mobile Direct Pay Link */}
                  <div className="sm:hidden w-full max-w-sm">
                    <a
                      href={upiPayUrl}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#1C1917] text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#24170D] transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-[#FFA000]" />
                      <span>TAP TO PAY VIA GPAY / PHONEPE / PAYTM</span>
                    </a>
                  </div>
                </div>

                {/* Screenshot Upload Dropzone */}
                <div className="pt-4 border-t border-[#292524]/10 space-y-3">
                  <div className="text-center">
                    <span className="text-[11px] font-black uppercase tracking-widest text-[#E65100] block">
                      STEP 2: UPLOAD PAYMENT SCREENSHOT
                    </span>
                    <p className="text-xs text-[#5A4839]">
                      Our AI will automatically detect your 12-digit UTR and verify your payment in real-time.
                    </p>
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />

                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`cursor-pointer p-6 rounded-2xl border-2 border-dashed transition-all text-center flex flex-col items-center justify-center gap-2 ${
                      screenshotBase64
                        ? "border-green-600 bg-green-50/50"
                        : "border-[#E65100]/40 bg-white/60 hover:bg-white hover:border-[#E65100]"
                    }`}
                  >
                    {screenshotBase64 ? (
                      <div className="space-y-2 flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
                          <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <div>
                          <span className="text-xs font-black uppercase tracking-wider text-green-800 block">
                            SCREENSHOT READY FOR AI VERIFICATION
                          </span>
                          <span className="text-[11px] font-mono text-[#5A4839] block truncate max-w-xs">
                            {screenshotFileName || "Payment Screenshot Selected"}
                          </span>
                        </div>
                        <span className="text-[10px] text-[#E65100] underline font-bold">
                          Click to change screenshot
                        </span>
                      </div>
                    ) : (
                      <>
                        <div className="w-12 h-12 rounded-full bg-[#E65100]/10 text-[#E65100] flex items-center justify-center">
                          <UploadCloud className="w-6 h-6" />
                        </div>
                        <div>
                          <span className="text-xs font-black uppercase tracking-wider text-[#1C1917] block">
                            UPLOAD PAYMENT SCREENSHOT
                          </span>
                          <span className="text-[11px] text-[#5A4839]">
                            PNG, JPG, or JPEG (Max 10MB)
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Fallback Manual UTR Field */}
                  {showManualUtrField && (
                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 space-y-2 animate-in fade-in">
                      <label className="block text-xs font-black uppercase tracking-wider text-amber-900">
                        12-Digit UPI Reference / UTR Number <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        value={manualUtr}
                        onChange={(e) => setManualUtr(e.target.value.replace(/\D/g, "").slice(0, 12))}
                        placeholder="e.g. 423881923011"
                        maxLength={12}
                        className="w-full px-4 py-2.5 rounded-lg bg-white border border-amber-300 text-[#1C1917] font-mono text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                      <span className="text-[10px] text-amber-800 block">
                        Found in your GPay / PhonePe / Paytm receipt as &quot;UPI Ref No&quot; or &quot;UTR&quot;.
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Submit CTA */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-8 rounded-xl btn-bhagwa-primary text-base sm:text-lg font-black uppercase tracking-wider flex items-center justify-center gap-3 active:scale-95 transition-all shadow-bhagwa-md disabled:opacity-60 disabled:cursor-not-allowed group"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{ocrStatusText || "PROCESSING VERIFICATION..."}</span>
                  </>
                ) : (
                  <>
                    <span>
                      {formData.payment_method === "online"
                        ? "VERIFY PAYMENT & GET TICKET"
                        : "COMPLETE REGISTRATION (PAY CASH AT EVENT)"}
                    </span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Alternative Luma Link */}
          <div className="mt-8 pt-6 border-t border-[#292524]/10 text-center text-xs text-[#5A4839] space-y-2">
            <p>
              Prefer registering via Luma instead?{" "}
              <a
                href={LUMA_REGISTRATION_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#E65100] font-bold underline hover:text-[#C8460B]"
              >
                Register via Luma Platform
              </a>
            </p>
            <p className="text-[11px] text-[#5A4839]/80">
              Need assistance? WhatsApp Coordinators at +91 90547 37915 / +91 70462 32003
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
