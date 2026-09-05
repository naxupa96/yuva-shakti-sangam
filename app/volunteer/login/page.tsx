"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import {
  Lock,
  User,
  ArrowRight,
  Loader2,
  ShieldCheck,
  AlertCircle,
  Eye,
  EyeOff,
  QrCode,
} from "lucide-react";
import { CornerOrnament, MandalaMotif } from "@/components/Decorations";

function VolunteerLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("redirect") || "/volunteer";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/volunteer/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Invalid volunteer credentials. Please check your username and password.");
        setLoading(false);
        return;
      }

      setMessage("Access verified! Opening scanner...");

      setTimeout(() => {
        window.location.href = redirectTarget.startsWith("/volunteer") ? redirectTarget : "/volunteer";
      }, 400);
    } catch (err: any) {
      console.error("Volunteer login error:", err);
      setError("An unexpected network error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EAE0D0] bg-parchment-texture text-[#1C1917] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden selection:bg-[#E65100] selection:text-white">
      {/* Ambient background decoration */}
      <div className="absolute -right-24 -top-24 opacity-15 text-[#E65100] pointer-events-none animate-spin-slow">
        <MandalaMotif size={380} />
      </div>
      <div className="absolute -left-24 -bottom-24 opacity-10 text-[#FFA000] pointer-events-none">
        <MandalaMotif size={340} />
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="p-7 sm:p-9 rounded-3xl bg-[#F5EBE1] border-2 border-[#292524]/20 shadow-parchment-deep relative overflow-hidden">
          <CornerOrnament className="absolute top-3 left-3 text-[#E65100]/40" />
          <CornerOrnament className="absolute top-3 right-3 text-[#E65100]/40 -scale-x-100" />
          <CornerOrnament className="absolute bottom-3 left-3 text-[#E65100]/40 -scale-y-100" />
          <CornerOrnament className="absolute bottom-3 right-3 text-[#E65100]/40 -scale-100" />

          {/* Header */}
          <div className="text-center space-y-2 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-[#1C1917] text-[#FFA000] flex items-center justify-center mx-auto shadow-md border border-[#FFA000]/20">
              <QrCode className="w-7 h-7 text-[#FFA000]" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E65100]/10 text-[#E65100] text-[10px] font-mono font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#E65100] animate-pulse" />
              Gate Check-in Desk
            </div>

            <h1 className="font-display font-black text-2xl sm:text-3xl uppercase text-[#1C1917] tracking-tight">
              SWAYAMSEVAK PORTAL
            </h1>
            <p className="text-xs font-bold text-[#5A4839] uppercase tracking-wider">
              Yuva Shakti Sangam • Ticket Verification Scanner
            </p>
          </div>

          {/* Alerts */}
          {error && (
            <div className="mb-4 p-3.5 rounded-xl bg-red-100 border border-red-300 text-red-900 text-xs flex items-center gap-2.5 font-medium animate-shake">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {message && (
            <div className="mb-4 p-3.5 rounded-xl bg-green-100 border border-green-300 text-green-900 text-xs flex items-center gap-2.5 font-medium">
              <ShieldCheck className="w-4 h-4 text-green-600 shrink-0" />
              <span>{message}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-[#1C1917] mb-1.5">
                Your Name / Volunteer ID
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#5A4839] absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. Rahul Sharma, Amit, Gate 1"
                  autoComplete="username"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#FAF4EC] border border-[#292524]/20 text-sm font-medium text-[#1C1917] placeholder:text-[#5A4839]/40 focus:outline-none focus:border-[#E65100] focus:ring-2 focus:ring-[#E65100]/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-[#1C1917] mb-1.5">
                Passcode / Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#5A4839] absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                  className="w-full pl-10 pr-11 py-3 rounded-xl bg-[#FAF4EC] border border-[#292524]/20 text-sm font-medium text-[#1C1917] placeholder:text-[#5A4839]/40 focus:outline-none focus:border-[#E65100] focus:ring-2 focus:ring-[#E65100]/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  className="absolute right-3.5 top-3.5 text-[#5A4839] hover:text-[#1C1917] transition-colors focus:outline-none cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 px-6 rounded-xl btn-bhagwa-primary text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-bhagwa-sm active:scale-95 transition-all disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Passcode...</span>
                </>
              ) : (
                <>
                  <span>LAUNCH QR SCANNER</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#292524]/10 text-center">
            <Link
              href="/"
              className="text-[11px] font-black uppercase tracking-wider text-[#5A4839] hover:text-[#E65100] transition-colors inline-flex items-center gap-1"
            >
              ← Return to Main Website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VolunteerLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#EAE0D0] bg-parchment-texture flex items-center justify-center p-6 text-[#1C1917]">
          <div className="p-8 rounded-3xl bg-[#F5EBE1] border border-[#292524]/20 flex items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-[#E65100]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#5A4839]">
              Loading Swayamsevak Portal...
            </span>
          </div>
        </div>
      }
    >
      <VolunteerLoginForm />
    </Suspense>
  );
}
