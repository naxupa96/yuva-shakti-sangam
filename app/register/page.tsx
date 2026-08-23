"use client";

import React, { useState } from "react";
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
  HelpCircle,
} from "lucide-react";
import { eventConfig, LUMA_REGISTRATION_URL } from "@/lib/config";
import { CornerOrnament, MandalaMotif, DevanagariWatermark } from "@/components/Decorations";
import { PaymentMethod, RegistrationInput } from "@/types/registration";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function RegisterPage() {
  const router = useRouter();
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

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
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

    setLoading(true);

    try {
      // 1. Submit registration
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
        return;
      }

      const participant = data.participant;

      // 2. Handle Online vs. Cash
      if (formData.payment_method === "online") {
        const paymentOrder = data.payment_order;

        if (paymentOrder?.mock_mode) {
          // Dev / Test Mock verification
          const verifyRes = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              participant_id: participant.id,
              order_id: paymentOrder.order_id,
              payment_id: `mock_pay_${Date.now()}`,
              signature: "mock_signature_valid",
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            router.push(`/register/success?token=${participant.qr_token}&id=${participant.registration_id}&method=online&status=paid`);
            return;
          }
        }

        // Live Razorpay Checkout
        if (paymentOrder?.gateway === "razorpay") {
          const scriptLoaded = await loadRazorpayScript();
          if (!scriptLoaded) {
            setErrorMessage("Failed to load payment gateway. Please try paying via Cash or refresh.");
            setLoading(false);
            return;
          }

          const options = {
            key: paymentOrder.key_id,
            amount: Math.round(paymentOrder.amount * 100),
            currency: paymentOrder.currency || "INR",
            name: eventConfig.name,
            description: "Entry Pass Registration Fee",
            order_id: paymentOrder.order_id,
            prefill: {
              name: participant.name,
              contact: participant.phone,
              email: participant.email || "",
            },
            theme: {
              color: "#F05A12",
            },
            handler: async function (res: any) {
              setLoading(true);
              const verifyRes = await fetch("/api/payment/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  participant_id: participant.id,
                  order_id: res.razorpay_order_id || paymentOrder.order_id,
                  payment_id: res.razorpay_payment_id,
                  signature: res.razorpay_signature,
                }),
              });

              const verifyData = await verifyRes.json();
              if (verifyData.success) {
                router.push(`/register/success?token=${participant.qr_token}&id=${participant.registration_id}&method=online&status=paid`);
              } else {
                setErrorMessage("Payment recorded but server verification pending. Check your ticket status.");
                router.push(`/ticket/${participant.qr_token}`);
              }
            },
            modal: {
              ondismiss: function () {
                setLoading(false);
                setErrorMessage("Payment was not completed. You can re-attempt online payment or choose Cash at event.");
              },
            },
          };

          const rzp = new window.Razorpay(options);
          rzp.open();
          return;
        }

        // Fallback redirection for Cashfree/other hosted checkout
        router.push(`/register/success?token=${participant.qr_token}&id=${participant.registration_id}&method=online&status=pending`);
      } else {
        // Cash payment registration
        router.push(`/register/success?token=${participant.qr_token}&id=${participant.registration_id}&method=cash&status=pending`);
      }
    } catch (err: any) {
      console.error("Submission error:", err);
      setErrorMessage("Network error during registration. Please check your connection and try again.");
      setLoading(false);
    }
  };

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
                {/* Online Option */}
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
                        <CreditCard className="w-4 h-4 text-[#E65100]" />
                        <span className="text-sm font-black uppercase tracking-wider text-[#1C1917]">
                          PAY ₹50 ONLINE
                        </span>
                      </div>
                      <p className="text-xs text-[#5A4839]">
                        Instant confirmed digital QR pass via UPI (GPay, PhonePe, Paytm), Cards, or NetBanking.
                      </p>
                      <span className="inline-block text-[10px] font-black uppercase tracking-wider text-green-700 bg-green-100 px-2 py-0.5 rounded">
                        ✓ INSTANT ENTRY ACTIVATION
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
                        Get your QR ticket now. Pay ₹50 in cash to an authorized event volunteer upon arrival.
                      </p>
                      <span className="inline-block text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                        ⏳ PAYMENT PENDING UNTIL ENTRY
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

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
                    <span>GENERATING SECURE TICKET...</span>
                  </>
                ) : (
                  <>
                    <span>
                      {formData.payment_method === "online" ? "PROCEED TO PAY ₹50 ONLINE" : "COMPLETE REGISTRATION (PAY CASH AT EVENT)"}
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
