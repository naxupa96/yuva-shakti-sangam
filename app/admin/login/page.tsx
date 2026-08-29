"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { Lock, Mail, ArrowRight, Loader2, ShieldCheck, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { CornerOrnament, MandalaMotif } from "@/components/Decorations";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("redirect") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const supabase = createClient();
      let formattedEmail = email.trim();
      if (formattedEmail === "yuvashakti@admin" || formattedEmail === "yuvashakti") {
        formattedEmail = "yuvashakti@admin.com";
      } else if (!formattedEmail.includes("@")) {
        formattedEmail = `${formattedEmail}@admin.com`;
      }

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: formattedEmail,
        password: password,
      });

      if (authError) {
        setError(authError.message || "Invalid credentials. Please check your email and password.");
        setLoading(false);
        return;
      }

      if (data.user) {
        // Force full refresh to activate cookie session in middleware
        window.location.href = redirectTarget.startsWith("/admin") ? redirectTarget : "/admin";
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError("An unexpected error occurred during login.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EAE0D0] bg-parchment-texture text-[#1C1917] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      <div className="max-w-md w-full relative z-10">
        <div className="p-8 sm:p-10 rounded-3xl bg-[#F5EBE1] border-2 border-[#292524]/20 shadow-parchment-deep relative overflow-hidden">
          <CornerOrnament className="absolute top-3 left-3 text-[#E65100]/40" />
          <CornerOrnament className="absolute top-3 right-3 text-[#E65100]/40 -scale-x-100" />
          <CornerOrnament className="absolute bottom-3 left-3 text-[#E65100]/40 -scale-y-100" />
          <CornerOrnament className="absolute bottom-3 right-3 text-[#E65100]/40 -scale-100" />

          {/* Background Mandala */}
          <div className="absolute -right-20 -top-20 opacity-15 text-[#E65100] pointer-events-none">
            <MandalaMotif size={320} />
          </div>

          <div className="text-center space-y-2 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#1C1917] text-[#FFA000] flex items-center justify-center mx-auto shadow-md">
              <Lock className="w-6 h-6" />
            </div>

            <h1 className="font-display font-black text-2xl sm:text-3xl uppercase text-[#1C1917] tracking-tight">
              STAFF PORTAL
            </h1>
            <p className="text-xs font-bold text-[#5A4839] uppercase tracking-wider">
              Yuva Shakti Sangam Organizers
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3.5 rounded-xl bg-red-100 border border-red-300 text-red-900 text-xs flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {message && (
            <div className="mb-4 p-3.5 rounded-xl bg-green-100 border border-green-300 text-green-900 text-xs flex items-center gap-2 font-medium">
              <ShieldCheck className="w-4 h-4 text-green-600 shrink-0" />
              <span>{message}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-[#1C1917] mb-1">
                Organizer Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#5A4839] absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yuvashakti@admin.com or organizer email"
                  autoComplete="username"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#FAF4EC] border border-[#292524]/20 text-sm font-medium text-[#1C1917] focus:outline-none focus:border-[#E65100] focus:ring-2 focus:ring-[#E65100]/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-[#1C1917] mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#5A4839] absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#FAF4EC] border border-[#292524]/20 text-sm font-medium text-[#1C1917] focus:outline-none focus:border-[#E65100] focus:ring-2 focus:ring-[#E65100]/20"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl btn-bhagwa-primary text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-bhagwa-sm active:scale-95 transition-all disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>SIGN IN TO ADMIN</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#292524]/10 text-center">
            <Link
              href="/"
              className="text-[11px] font-black uppercase tracking-wider text-[#5A4839] hover:text-[#E65100] transition-colors"
            >
              ← Back to Main Website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#EAE0D0] bg-parchment-texture flex items-center justify-center p-6 text-[#1C1917]">
          <div className="p-8 rounded-3xl bg-[#F5EBE1] border border-[#292524]/20 flex items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-[#E65100]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#5A4839]">
              Loading Staff Portal...
            </span>
          </div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}

