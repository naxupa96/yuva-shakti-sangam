"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Mail,
  Send,
  CheckCircle2,
  AlertTriangle,
  Users,
  Loader2,
  ArrowLeft,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Eye,
  Key,
} from "lucide-react";
import { CornerOrnament } from "@/components/Decorations";

export default function AdminEmailBroadcastPage() {
  const [loading, setLoading] = useState(true);
  const [hasResendKey, setHasResendKey] = useState(false);
  const [totalCheckedIn, setTotalCheckedIn] = useState(0);
  const [eligibleCount, setEligibleCount] = useState(0);
  const [senderEmail, setSenderEmail] = useState("");
  const [sampleRecipients, setSampleRecipients] = useState<any[]>([]);

  // Test send state
  const [testEmail, setTestEmail] = useState("");
  const [sendingTest, setSendingTest] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // Broadcast state
  const [sendingBroadcast, setSendingBroadcast] = useState(false);
  const [broadcastResult, setBroadcastResult] = useState<{
    success: boolean;
    sent_count: number;
    failed_count: number;
    total_recipients: number;
    errors?: string[];
  } | null>(null);
  const [confirmBroadcast, setConfirmBroadcast] = useState(false);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/email");
      const data = await res.json();
      if (data.success) {
        setHasResendKey(data.has_resend_key);
        setTotalCheckedIn(data.total_checked_in);
        setEligibleCount(data.eligible_count);
        setSenderEmail(data.sender_email);
        setSampleRecipients(data.sample_recipients || []);
      }
    } catch (err) {
      console.error("Failed to load email status:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleSendTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmail || !testEmail.includes("@")) {
      setTestResult({ success: false, message: "Please enter a valid test email address." });
      return;
    }

    setSendingTest(true);
    setTestResult(null);

    try {
      const res = await fetch("/api/admin/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          test_mode: true,
          test_email: testEmail.trim(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setTestResult({ success: true, message: data.message || "Test email delivered!" });
      } else {
        setTestResult({ success: false, message: data.error || "Failed to send test email." });
      }
    } catch (err: any) {
      setTestResult({ success: false, message: "Network error sending test email." });
    } finally {
      setSendingTest(false);
    }
  };

  const handleBroadcast = async () => {
    setSendingBroadcast(true);
    setBroadcastResult(null);

    try {
      const res = await fetch("/api/admin/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ test_mode: false }),
      });

      const data = await res.json();
      if (data.success) {
        setBroadcastResult({
          success: true,
          sent_count: data.sent_count,
          failed_count: data.failed_count,
          total_recipients: data.total_recipients,
          errors: data.errors,
        });
        setConfirmBroadcast(false);
      } else {
        setBroadcastResult({
          success: false,
          sent_count: 0,
          failed_count: 0,
          total_recipients: eligibleCount,
          errors: [data.error || "Broadcast failed."],
        });
      }
    } catch (err) {
      setBroadcastResult({
        success: false,
        sent_count: 0,
        failed_count: 0,
        total_recipients: eligibleCount,
        errors: ["Network error during broadcast."],
      });
    } finally {
      setSendingBroadcast(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EAE0D0] bg-parchment-texture text-[#1C1917] p-4 sm:p-8 selection:bg-[#E65100] selection:text-white">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Bar */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="p-2.5 rounded-xl bg-[#F5EBE1] border border-[#1C1917]/15 hover:bg-[#1C1917] hover:text-white transition-colors"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#E65100] animate-pulse" />
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#E65100] uppercase">
                  ATTENDEE BROADCAST DISPATCHER
                </span>
              </div>
              <h1 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tight text-[#1C1917]">
                CERTIFICATE &amp; FEEDBACK EMAIL
              </h1>
              <p className="text-xs text-[#5A4839]">
                Dispatch email to all checked-in participants instructing them to scan their physical ID card QR code, download their certificate, and submit feedback.
              </p>
            </div>
          </div>
        </div>

        {/* Resend Status Banner */}
        {!hasResendKey && (
          <div className="p-5 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-900 space-y-2">
            <div className="flex items-center gap-2 font-black text-xs uppercase tracking-wider">
              <Key className="w-4 h-4 text-amber-700" />
              <span>Resend API Key Notice</span>
            </div>
            <p className="text-xs">
              <code>RESEND_API_KEY</code> is not currently set in your environment variables. Add <code>RESEND_API_KEY=re_...</code> to <code>.env.local</code> (or your Vercel deployment settings) to send live emails.
            </p>
          </div>
        )}

        {/* Audience Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-[#F5EBE1] border-2 border-[#1C1917]/15 shadow-parchment-card space-y-2 relative overflow-hidden">
            <CornerOrnament className="absolute top-2 right-2 text-[#E65100]/20 -scale-x-100" />
            <span className="text-[10px] font-black uppercase tracking-wider text-[#5A4839]">
              CHECKED-IN AUDIENCE
            </span>
            <div className="text-3xl font-display font-black text-[#1C1917]">
              {loading ? "..." : totalCheckedIn}
            </div>
            <span className="text-[11px] text-[#5A4839]">Total attendees verified at gate</span>
          </div>

          <div className="p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-300 shadow-parchment-card space-y-2 relative overflow-hidden">
            <CornerOrnament className="absolute top-2 right-2 text-emerald-700/20 -scale-x-100" />
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800">
              READY TO RECEIVE
            </span>
            <div className="text-3xl font-display font-black text-emerald-700">
              {loading ? "..." : eligibleCount}
            </div>
            <span className="text-[11px] text-emerald-800 font-bold">
              Attendees with valid email addresses
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-[#F5EBE1] border-2 border-[#1C1917]/15 shadow-parchment-card space-y-2 relative overflow-hidden">
            <CornerOrnament className="absolute top-2 right-2 text-[#E65100]/20 -scale-x-100" />
            <span className="text-[10px] font-black uppercase tracking-wider text-[#5A4839]">
              SENDER ADDRESS
            </span>
            <div className="text-xs font-mono font-bold text-[#E65100] truncate">
              {senderEmail || "onboarding@resend.dev"}
            </div>
            <span className="text-[11px] text-[#5A4839]">Resend authenticated sender</span>
          </div>
        </div>

        {/* Email Content Preview Card */}
        <div className="p-6 rounded-3xl bg-[#F5EBE1] border-2 border-[#1C1917]/15 shadow-parchment-card space-y-4">
          <div className="flex items-center justify-between border-b border-[#292524]/10 pb-3">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-[#E65100]" />
              <h2 className="font-display font-black text-lg text-[#1C1917] uppercase">
                Email Template Preview
              </h2>
            </div>
            <span className="text-[10px] font-mono font-bold bg-[#FAF4EC] px-2.5 py-1 rounded-md border border-[#292524]/10">
              HTML &bull; Responsive &bull; Parchment Theme
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#292524]/10 space-y-2 text-xs text-[#5A4839]">
            <p><strong>Subject:</strong> Your Official Certificate of Participation &amp; Feedback • Yuva Shakti Sangam</p>
            <p><strong>Message Highlights:</strong></p>
            <ul className="list-disc list-inside space-y-1 pl-1">
              <li>Congratulates attendee for participating in the 06 September youth assembly.</li>
              <li>Instructs them to <strong>scan the QR code printed on their physical ID card</strong>.</li>
              <li>Includes direct one-click button to view &amp; customize their 300 DPI Certificate.</li>
              <li>Instructs them to submit <strong>event feedback &amp; 5-star rating</strong> below their certificate.</li>
            </ul>
          </div>
        </div>

        {/* Test Send Section */}
        <div className="p-6 rounded-3xl bg-[#F5EBE1] border-2 border-[#1C1917]/15 shadow-parchment-card space-y-4">
          <h3 className="font-display font-black text-base text-[#1C1917] uppercase">
            Step 1: Send a Test Email First
          </h3>
          <p className="text-xs text-[#5A4839]">
            Verify how the email looks in your inbox before sending to all attendees.
          </p>

          <form onSubmit={handleSendTest} className="flex flex-col sm:flex-row items-center gap-3">
            <input
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="Enter your email (e.g. nakshatrapandya@gmail.com)"
              className="flex-1 w-full p-3 rounded-xl bg-[#FAF4EC] border border-[#292524]/20 text-xs font-medium text-[#1C1917] focus:outline-none focus:border-[#E65100]"
            />
            <button
              type="submit"
              disabled={sendingTest || !hasResendKey}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#1C1917] text-white hover:bg-[#2E241E] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {sendingTest ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#FFA000]" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span>Send Test</span>
            </button>
          </form>

          {testResult && (
            <div
              className={`p-3 rounded-xl text-xs font-medium ${
                testResult.success
                  ? "bg-green-100 text-green-800 border border-green-300"
                  : "bg-red-100 text-red-800 border border-red-300"
              }`}
            >
              {testResult.message}
            </div>
          )}
        </div>

        {/* Full Broadcast Section */}
        <div className="p-6 rounded-3xl bg-[#FAF4EC] border-2 border-[#E65100]/40 shadow-parchment-deep space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#E65100]" />
            <h3 className="font-display font-black text-lg text-[#1C1917] uppercase">
              Step 2: Broadcast to All {eligibleCount} Checked-in Attendees
            </h3>
          </div>

          <p className="text-xs text-[#5A4839]">
            This will send the official email to all {eligibleCount} checked-in participants who have an email address recorded.
          </p>

          {broadcastResult && (
            <div
              className={`p-4 rounded-2xl text-xs space-y-2 ${
                broadcastResult.success
                  ? "bg-green-50 border-2 border-green-300 text-green-900"
                  : "bg-red-50 border-2 border-red-300 text-red-900"
              }`}
            >
              <div className="font-bold text-sm">
                {broadcastResult.success
                  ? `✓ Broadcast Complete! Sent to ${broadcastResult.sent_count} attendees.`
                  : "Broadcast Error"}
              </div>
              {broadcastResult.failed_count > 0 && (
                <div>Failed for {broadcastResult.failed_count} recipients.</div>
              )}
              {broadcastResult.errors && broadcastResult.errors.length > 0 && (
                <div className="font-mono text-[11px]">
                  Errors: {broadcastResult.errors.join(", ")}
                </div>
              )}
            </div>
          )}

          {!confirmBroadcast ? (
            <button
              onClick={() => setConfirmBroadcast(true)}
              disabled={sendingBroadcast || eligibleCount === 0 || !hasResendKey}
              className="py-4 px-6 rounded-2xl btn-bhagwa-primary text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              <Mail className="w-4 h-4" />
              <span>Broadcast Email to All {eligibleCount} Attendees</span>
            </button>
          ) : (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 space-y-3">
              <div className="flex items-center gap-2 text-xs font-black text-amber-900 uppercase">
                <AlertTriangle className="w-4 h-4 text-amber-700" />
                <span>Confirm Broadcast to {eligibleCount} Attendees?</span>
              </div>
              <p className="text-xs text-amber-800">
                Are you sure you want to send the Certificate &amp; Feedback announcement email to all {eligibleCount} checked-in participants?
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleBroadcast}
                  disabled={sendingBroadcast}
                  className="py-2.5 px-5 rounded-xl bg-[#E65100] text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 hover:bg-[#D84315] cursor-pointer disabled:opacity-50"
                >
                  {sendingBroadcast ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  <span>Yes, Start Broadcast</span>
                </button>

                <button
                  onClick={() => setConfirmBroadcast(false)}
                  disabled={sendingBroadcast}
                  className="py-2.5 px-4 rounded-xl bg-white border border-[#292524]/20 text-xs font-bold text-[#5A4839] hover:text-[#1C1917] cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
