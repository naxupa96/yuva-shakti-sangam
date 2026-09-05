"use client";

import React, { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import {
  CreditCard,
  Banknote,
  Search,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Loader2,
  RefreshCw,
  Download,
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  IndianRupee,
  Sparkles,
  Phone,
  MapPin,
  Check,
  Users,
  UserCheck,
  History,
  QrCode,
} from "lucide-react";
import { CornerOrnament } from "@/components/Decorations";

interface PaymentRecord {
  id: string;
  participant_id: string;
  method: "online" | "cash";
  amount: number;
  currency: string;
  status: "paid" | "pending";
  gateway?: string;
  gateway_order_id?: string;
  gateway_payment_id?: string;
  paid_at?: string;
  created_at: string;
  notes?: string;
  participants?: {
    id: string;
    registration_id: string;
    name: string;
    phone: string;
    city: string;
    checked_in: boolean;
  };
}

interface FinancialMetrics {
  total_revenue: number;
  online_revenue: number;
  cash_revenue: number;
  pending_cash_amount: number;
  paid_count: number;
  pending_count: number;
  total_records: number;
}

interface VolunteerAction {
  id: string;
  volunteer_name: string;
  action: string;
  participant_name: string;
  registration_id: string;
  amount: number;
  payment_method: string;
  utr?: string;
  notes?: string;
  timestamp: string;
}

interface VolunteerStat {
  volunteer_name: string;
  total_scans: number;
  cash_collected_count: number;
  cash_collected_amount: number;
  online_collected_count: number;
  online_collected_amount: number;
  total_money_collected: number;
  last_active: string;
  recent_actions: VolunteerAction[];
}

interface VolunteerSummary {
  total_volunteers_active: number;
  total_cash_collected: number;
  total_online_collected: number;
  total_revenue_handled: number;
  total_scans_logged: number;
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [metrics, setMetrics] = useState<FinancialMetrics>({
    total_revenue: 0,
    online_revenue: 0,
    cash_revenue: 0,
    pending_cash_amount: 0,
    paid_count: 0,
    pending_count: 0,
    total_records: 0,
  });

  const [activeTab, setActiveTab] = useState<"ledger" | "volunteers">("ledger");
  const [volunteerLoading, setVolunteerLoading] = useState(false);
  const [volunteerData, setVolunteerData] = useState<{
    summary: VolunteerSummary;
    volunteers: VolunteerStat[];
    transactions: VolunteerAction[];
  }>({
    summary: {
      total_volunteers_active: 0,
      total_cash_collected: 0,
      total_online_collected: 0,
      total_revenue_handled: 0,
      total_scans_logged: 0,
    },
    volunteers: [],
    transactions: [],
  });

  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [method, setMethod] = useState("all");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [feedback, setFeedback] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const fetchVolunteerStats = async () => {
    setVolunteerLoading(true);
    try {
      const res = await fetch("/api/admin/volunteer-stats");
      const data = await res.json();
      if (data.success) {
        setVolunteerData({
          summary: data.summary || {
            total_volunteers_active: 0,
            total_cash_collected: 0,
            total_online_collected: 0,
            total_revenue_handled: 0,
            total_scans_logged: 0,
          },
          volunteers: data.volunteers || [],
          transactions: data.transactions || [],
        });
      }
    } catch (err) {
      console.error("Failed to load volunteer stats:", err);
    } finally {
      setVolunteerLoading(false);
    }
  };

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        method,
        status,
        search: searchQuery,
        page: page.toString(),
        limit: "50",
      });

      const res = await fetch(`/api/admin/payments?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setPayments(data.payments || []);
        setTotalCount(data.total || 0);
        if (data.metrics) {
          setMetrics(data.metrics);
        }
      } else {
        setFeedback({
          message: data.error || "Could not retrieve ledger records. Please click Refresh.",
          type: "error",
        });
      }
    } catch (err) {
      console.error("Payments fetch error:", err);
      setFeedback({
        message: "Server connection error. Please ensure Next.js dev server is running and click Refresh.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
    fetchVolunteerStats();
  }, [method, status, page]);

  // Debounced search trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchPayments();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSyncLedger = async () => {
    setSyncing(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/admin/payments", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setFeedback({ message: data.message || "Ledger synchronized with participants.", type: "success" });
        await fetchPayments();
      } else {
        setFeedback({ message: data.error || "Failed to sync ledger.", type: "error" });
      }
    } catch (err) {
      setFeedback({ message: "Network error during sync.", type: "error" });
    } finally {
      setSyncing(false);
    }
  };

  const handleMarkAsPaid = async (paymentId: string) => {
    setUpdatingId(paymentId);
    try {
      const res = await fetch("/api/admin/payments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payment_id: paymentId,
          status: "paid",
          notes: "Collected & verified by organizer on " + new Date().toLocaleDateString("en-IN"),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setFeedback({ message: "Payment status marked as PAID.", type: "success" });
        await fetchPayments();
      } else {
        setFeedback({ message: data.error || "Failed to update payment.", type: "error" });
      }
    } catch (err) {
      setFeedback({ message: "Failed to update payment status.", type: "error" });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleExportCsv = () => {
    const params = new URLSearchParams({
      method,
      status,
      search: searchQuery,
      export: "csv",
    });
    window.location.href = `/api/admin/payments?${params.toString()}`;
  };

  return (
    <div className="min-h-screen bg-[#EAE0D0] bg-parchment-texture text-[#1C1917] p-4 sm:p-8 selection:bg-[#E65100] selection:text-white">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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
                <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse" />
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#E65100] uppercase">
                  DATABASE FINANCIAL LEDGER
                </span>
              </div>
              <h1 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tight text-[#1C1917]">
                PAYMENTS & REVENUE LEDGER
              </h1>
              <p className="text-xs text-[#5A4839]">
                Live transactions connected directly to PostgreSQL database
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleSyncLedger}
              disabled={syncing || loading}
              className="px-3.5 py-2 rounded-xl bg-[#FAF4EC] border border-[#1C1917]/15 hover:border-[#E65100] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all text-[#1C1917] cursor-pointer disabled:opacity-50"
              title="Synchronize database ledger records"
            >
              <Sparkles className={`w-3.5 h-3.5 text-[#E65100] ${syncing ? "animate-spin" : ""}`} />
              <span>{syncing ? "Syncing..." : "Sync Ledger"}</span>
            </button>

            <button
              onClick={handleExportCsv}
              className="px-3.5 py-2 rounded-xl bg-[#FAF4EC] border border-[#1C1917]/15 hover:border-[#E65100] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all text-[#1C1917] cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#5A4839]" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={async () => {
                await Promise.all([fetchPayments(), fetchVolunteerStats()]);
              }}
              disabled={loading || volunteerLoading}
              className="px-3.5 py-2 rounded-xl bg-[#1C1917] text-white hover:bg-[#2E241E] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading || volunteerLoading ? "animate-spin text-[#FFA000]" : ""}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`p-3.5 rounded-xl text-xs font-bold flex items-center gap-2 border ${
              feedback.type === "success"
                ? "bg-green-100 border-green-300 text-green-900"
                : "bg-red-100 border-red-300 text-red-900"
            }`}
          >
            {feedback.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Financial KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Revenue */}
          <div className="p-5 rounded-2xl bg-[#F5EBE1] border-2 border-[#1C1917]/15 shadow-parchment-card space-y-2 relative overflow-hidden">
            <CornerOrnament className="absolute top-2 right-2 text-[#E65100]/20 -scale-x-100" />
            <div className="flex items-center justify-between text-[#5A4839]">
              <span className="text-[11px] font-black uppercase tracking-wider">TOTAL COLLECTED</span>
              <ShieldCheck className="w-4 h-4 text-[#FFA000]" />
            </div>
            <div className="text-3xl font-display font-black text-[#1C1917]">
              ₹{metrics.total_revenue.toLocaleString("en-IN")}
            </div>
            <div className="text-[11px] text-green-700 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{metrics.paid_count} Verified Payments</span>
            </div>
          </div>

          {/* Online Payments */}
          <div className="p-5 rounded-2xl bg-[#F5EBE1] border-2 border-[#1C1917]/15 shadow-parchment-card space-y-2 relative overflow-hidden">
            <CornerOrnament className="absolute top-2 right-2 text-[#E65100]/20 -scale-x-100" />
            <div className="flex items-center justify-between text-[#5A4839]">
              <span className="text-[11px] font-black uppercase tracking-wider">ONLINE / UPI</span>
              <CreditCard className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-3xl font-display font-black text-[#1C1917]">
              ₹{metrics.online_revenue.toLocaleString("en-IN")}
            </div>
            <div className="text-[11px] text-blue-800 font-medium">
              Verified via UPI QR & OCR Vision
            </div>
          </div>

          {/* Cash In Hand */}
          <div className="p-5 rounded-2xl bg-[#F5EBE1] border-2 border-[#1C1917]/15 shadow-parchment-card space-y-2 relative overflow-hidden">
            <CornerOrnament className="absolute top-2 right-2 text-[#E65100]/20 -scale-x-100" />
            <div className="flex items-center justify-between text-[#5A4839]">
              <span className="text-[11px] font-black uppercase tracking-wider">CASH IN HAND</span>
              <Banknote className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-display font-black text-[#1C1917]">
              ₹{metrics.cash_revenue.toLocaleString("en-IN")}
            </div>
            <div className="text-[11px] text-emerald-800 font-medium">
              Collected physically at check-in desk
            </div>
          </div>

          {/* Pending Cash at Gate */}
          <div className="p-5 rounded-2xl bg-[#F5EBE1] border-2 border-[#1C1917]/15 shadow-parchment-card space-y-2 relative overflow-hidden">
            <CornerOrnament className="absolute top-2 right-2 text-[#E65100]/20 -scale-x-100" />
            <div className="flex items-center justify-between text-[#5A4839]">
              <span className="text-[11px] font-black uppercase tracking-wider">PENDING CASH</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-3xl font-display font-black text-amber-700">
              ₹{metrics.pending_cash_amount.toLocaleString("en-IN")}
            </div>
            <div className="text-[11px] text-amber-800 font-medium">
              {metrics.pending_count} registrations to collect at venue
            </div>
          </div>
        </div>

        {/* Navigation View Switcher */}
        <div className="flex items-center gap-2 border-b border-[#1C1917]/15 pb-2">
          <button
            onClick={() => setActiveTab("ledger")}
            className={`px-4 py-2.5 rounded-xl font-display font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "ledger"
                ? "bg-[#1C1917] text-[#FAF4EC] shadow-md"
                : "bg-[#F5EBE1] text-[#5A4839] hover:text-[#1C1917] border border-[#1C1917]/15"
            }`}
          >
            <CreditCard className="w-4 h-4 text-[#FFA000]" />
            <span>Master Payments Ledger ({totalCount})</span>
          </button>

          <button
            onClick={() => setActiveTab("volunteers")}
            className={`px-4 py-2.5 rounded-xl font-display font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "volunteers"
                ? "bg-[#1C1917] text-[#FAF4EC] shadow-md"
                : "bg-[#F5EBE1] text-[#5A4839] hover:text-[#1C1917] border border-[#1C1917]/15"
            }`}
          >
            <Users className="w-4 h-4 text-[#FFA000]" />
            <span>Volunteer Cash Handover & Audit ({volunteerData.volunteers.length} Active)</span>
          </button>
        </div>

        {activeTab === "volunteers" ? (
          /* Volunteer Cash Handover & Audit View */
          <div className="space-y-6">
            {/* Volunteer Collection KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-[#F5EBE1] border-2 border-[#1C1917]/15 shadow-parchment-card space-y-1">
                <div className="flex items-center justify-between text-[#5A4839]">
                  <span className="text-[11px] font-black uppercase tracking-wider">ACTIVE VOLUNTEERS</span>
                  <Users className="w-4 h-4 text-[#E65100]" />
                </div>
                <div className="text-3xl font-display font-black text-[#1C1917]">
                  {volunteerData.summary.total_volunteers_active}
                </div>
                <p className="text-[11px] text-[#5A4839]">Registered desk operators</p>
              </div>

              <div className="p-5 rounded-2xl bg-amber-50 border-2 border-amber-500/30 shadow-parchment-card space-y-1">
                <div className="flex items-center justify-between text-amber-800">
                  <span className="text-[11px] font-black uppercase tracking-wider">CASH TO SURRENDER</span>
                  <Banknote className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-3xl font-display font-black text-amber-900">
                  ₹{volunteerData.summary.total_cash_collected.toLocaleString("en-IN")}
                </div>
                <p className="text-[11px] text-amber-700 font-bold">Physical cash held by volunteers</p>
              </div>

              <div className="p-5 rounded-2xl bg-blue-50 border-2 border-blue-500/30 shadow-parchment-card space-y-1">
                <div className="flex items-center justify-between text-blue-800">
                  <span className="text-[11px] font-black uppercase tracking-wider">VENUE UPI VERIFIED</span>
                  <QrCode className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-3xl font-display font-black text-blue-900">
                  ₹{volunteerData.summary.total_online_collected.toLocaleString("en-IN")}
                </div>
                <p className="text-[11px] text-blue-700 font-medium">Direct bank transfer via QR</p>
              </div>

              <div className="p-5 rounded-2xl bg-[#F5EBE1] border-2 border-[#1C1917]/15 shadow-parchment-card space-y-1">
                <div className="flex items-center justify-between text-[#5A4839]">
                  <span className="text-[11px] font-black uppercase tracking-wider">TOTAL GATE SCANS</span>
                  <ShieldCheck className="w-4 h-4 text-green-600" />
                </div>
                <div className="text-3xl font-display font-black text-[#1C1917]">
                  {volunteerData.summary.total_scans_logged}
                </div>
                <p className="text-[11px] text-green-700 font-bold">Check-ins confirmed at gates</p>
              </div>
            </div>

            {/* Volunteer Collection Breakdown Table */}
            <div className="rounded-2xl bg-[#F5EBE1] border-2 border-[#1C1917]/15 shadow-parchment-deep overflow-hidden">
              <div className="px-5 py-4 bg-[#FAF4EC] border-b border-[#1C1917]/15 flex items-center justify-between">
                <div>
                  <h2 className="font-display font-black text-base uppercase text-[#1C1917]">
                    VOLUNTEER CASH HANDOVER LEDGER
                  </h2>
                  <p className="text-xs text-[#5A4839]">
                    Verify and reconcile physical cash received from each gate operator at end of shift
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-[10px] font-black uppercase tracking-wider">
                  TREASURY RECONCILIATION
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#1C1917] text-[#FAF4EC] font-display font-black uppercase tracking-wider text-[11px]">
                      <th className="py-3.5 px-4">Volunteer Name / ID</th>
                      <th className="py-3.5 px-4">Passes Scanned</th>
                      <th className="py-3.5 px-4">Cash Collected</th>
                      <th className="py-3.5 px-4">UPI Verified</th>
                      <th className="py-3.5 px-4">Total Money Handled</th>
                      <th className="py-3.5 px-4 text-right">Cash Handover Due</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#292524]/10 font-medium text-[#1C1917]">
                    {volunteerLoading ? (
                      <tr>
                        <td colSpan={6} className="py-10 text-center text-[#5A4839]">
                          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#E65100]" />
                          Loading volunteer collection records...
                        </td>
                      </tr>
                    ) : volunteerData.volunteers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-10 text-center text-[#5A4839]">
                          No volunteer gate operations recorded yet.
                        </td>
                      </tr>
                    ) : (
                      volunteerData.volunteers.map((vol) => (
                        <tr key={vol.volunteer_name} className="hover:bg-[#FAF4EC] transition-colors">
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="font-bold uppercase text-[#1C1917] flex items-center gap-1.5">
                              <UserCheck className="w-4 h-4 text-[#E65100]" />
                              <span>{vol.volunteer_name}</span>
                            </div>
                            <div className="text-[10px] text-[#5A4839] font-mono mt-0.5">
                              Last active: {new Date(vol.last_active).toLocaleTimeString("en-IN")}
                            </div>
                          </td>

                          <td className="py-3.5 px-4 font-mono font-bold whitespace-nowrap text-[#1C1917]">
                            {vol.total_scans} passes
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className="font-bold text-amber-800">
                              {vol.cash_collected_count} attendees
                            </span>{" "}
                            <span className="text-[#5A4839] text-[11px]">
                              (₹{vol.cash_collected_amount})
                            </span>
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className="font-bold text-blue-800">
                              {vol.online_collected_count} attendees
                            </span>{" "}
                            <span className="text-[#5A4839] text-[11px]">
                              (₹{vol.online_collected_amount})
                            </span>
                          </td>

                          <td className="py-3.5 px-4 font-mono font-bold whitespace-nowrap text-[#1C1917]">
                            ₹{vol.total_money_collected}
                          </td>

                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black uppercase bg-amber-100 text-amber-900 border border-amber-300 shadow-sm">
                              <Banknote className="w-3.5 h-3.5 text-amber-700" />
                              ₹{vol.cash_collected_amount} CASH
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Individual Transaction Audit Log */}
            <div className="rounded-2xl bg-[#F5EBE1] border-2 border-[#1C1917]/15 shadow-parchment-deep overflow-hidden">
              <div className="px-5 py-4 bg-[#FAF4EC] border-b border-[#1C1917]/15 flex items-center justify-between">
                <div>
                  <h2 className="font-display font-black text-base uppercase text-[#1C1917]">
                    LIVE GATE ACTIVITY AUDIT TRAIL
                  </h2>
                  <p className="text-xs text-[#5A4839]">
                    Detailed log of every gate scan, cash collection, and on-spot UPI verification
                  </p>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-mono text-[#5A4839]">
                  <History className="w-3.5 h-3.5 text-[#E65100]" />
                  <span>{volunteerData.transactions.length} Events Logged</span>
                </div>
              </div>

              <div className="overflow-x-auto max-h-[480px]">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="sticky top-0 z-10 bg-[#1C1917] text-[#FAF4EC] font-display font-black uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3 px-4">Time</th>
                      <th className="py-3 px-4">Volunteer Operator</th>
                      <th className="py-3 px-4">Action</th>
                      <th className="py-3 px-4">Participant Details</th>
                      <th className="py-3 px-4">Reg ID</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Verification Details / UTR</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#292524]/10 font-medium text-[#1C1917]">
                    {volunteerData.transactions.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-[#5A4839]">
                          No check-in or cash collection activity logged yet.
                        </td>
                      </tr>
                    ) : (
                      volunteerData.transactions.map((t) => (
                        <tr key={t.id} className="hover:bg-[#FAF4EC] transition-colors">
                          <td className="py-2.5 px-4 font-mono text-[11px] text-[#5A4839] whitespace-nowrap">
                            {new Date(t.timestamp).toLocaleTimeString("en-IN")}
                          </td>

                          <td className="py-2.5 px-4 font-bold uppercase whitespace-nowrap text-[#1C1917]">
                            <span className="inline-flex items-center gap-1">
                              <UserCheck className="w-3 h-3 text-[#E65100]" />
                              {t.volunteer_name}
                            </span>
                          </td>

                          <td className="py-2.5 px-4 whitespace-nowrap">
                            {t.action === "participant_checkin" && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-green-100 text-green-800">
                                <CheckCircle2 className="w-3 h-3" /> Check-in
                              </span>
                            )}
                            {t.action === "cash_collected" && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-800">
                                <Banknote className="w-3 h-3" /> Cash (₹50)
                              </span>
                            )}
                            {t.action === "spot_online_payment" && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-100 text-blue-800">
                                <QrCode className="w-3 h-3" /> UPI (₹50)
                              </span>
                            )}
                          </td>

                          <td className="py-2.5 px-4 font-bold uppercase whitespace-nowrap">
                            {t.participant_name}
                          </td>

                          <td className="py-2.5 px-4 font-mono font-black text-[#E65100] whitespace-nowrap">
                            {t.registration_id}
                          </td>

                          <td className="py-2.5 px-4 font-mono font-bold whitespace-nowrap">
                            {t.amount > 0 ? `₹${t.amount}` : "—"}
                          </td>

                          <td className="py-2.5 px-4 font-mono text-[11px] text-[#5A4839] max-w-[220px] truncate">
                            {t.utr ? `UTR: ${t.utr}` : t.notes || "Pass verified"}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          /* Master Payments Ledger View */
          <>
            {/* Filter and Search Bar */}
            <div className="p-4 rounded-2xl bg-[#F5EBE1] border-2 border-[#1C1917]/15 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between shadow-sm">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#5A4839] absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by participant name, phone, Reg ID, or UTR..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#FAF4EC] border border-[#292524]/20 text-xs font-medium text-[#1C1917] placeholder:text-[#5A4839]/60 focus:outline-none focus:border-[#E65100]"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <select
                  value={method}
                  onChange={(e) => {
                    setMethod(e.target.value);
                    setPage(1);
                  }}
                  className="px-3 py-2 rounded-xl bg-[#FAF4EC] border border-[#292524]/20 text-xs font-bold text-[#1C1917] focus:outline-none"
                >
                  <option value="all">All Methods</option>
                  <option value="online">Online / UPI</option>
                  <option value="cash">Cash Collection</option>
                </select>

                <select
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value);
                    setPage(1);
                  }}
                  className="px-3 py-2 rounded-xl bg-[#FAF4EC] border border-[#292524]/20 text-xs font-bold text-[#1C1917] focus:outline-none"
                >
                  <option value="all">All Statuses</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>

            {/* Payments Table */}
            <div className="rounded-2xl bg-[#F5EBE1] border-2 border-[#1C1917]/15 shadow-parchment-deep overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#1C1917] text-[#FAF4EC] font-display font-black uppercase tracking-wider text-[11px]">
                      <th className="py-3.5 px-4">Date / Time</th>
                      <th className="py-3.5 px-4">Participant Details</th>
                      <th className="py-3.5 px-4">Registration ID</th>
                      <th className="py-3.5 px-4">Method</th>
                      <th className="py-3.5 px-4">Amount</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Gateway Reference / Notes</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#292524]/10 font-medium text-[#1C1917]">
                    {loading ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-[#5A4839]">
                          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#E65100]" />
                          Loading database payments ledger...
                        </td>
                      </tr>
                    ) : payments.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-[#5A4839]">
                          No payment records match the current filter.
                        </td>
                      </tr>
                    ) : (
                      payments.map((p) => {
                        const isPaid = p.status === "paid";
                        const isUpdating = updatingId === p.id;

                        return (
                          <tr key={p.id} className="hover:bg-[#FAF4EC] transition-colors">
                            <td className="py-3 px-4 font-mono text-[11px] text-[#5A4839] whitespace-nowrap">
                              {p.paid_at
                                ? new Date(p.paid_at).toLocaleString("en-IN")
                                : new Date(p.created_at).toLocaleString("en-IN")}
                            </td>

                            <td className="py-3 px-4 whitespace-nowrap">
                              <div className="font-bold uppercase text-[#1C1917]">
                                {p.participants?.name || "Anonymous Participant"}
                              </div>
                              <div className="text-[10px] text-[#5A4839] flex items-center gap-2 mt-0.5">
                                {p.participants?.phone && (
                                  <span className="flex items-center gap-0.5">
                                    <Phone className="w-2.5 h-2.5" />
                                    {p.participants.phone}
                                  </span>
                                )}
                                {p.participants?.city && (
                                  <span className="flex items-center gap-0.5">
                                    <MapPin className="w-2.5 h-2.5" />
                                    {p.participants.city}
                                  </span>
                                )}
                              </div>
                            </td>

                            <td className="py-3 px-4 font-mono text-[#E65100] font-black whitespace-nowrap">
                              {p.participants?.registration_id || "—"}
                            </td>

                            <td className="py-3 px-4 whitespace-nowrap uppercase font-bold text-[10px]">
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${
                                  p.method === "online"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-amber-100 text-amber-800"
                                }`}
                              >
                                {p.method === "online" ? (
                                  <CreditCard className="w-3 h-3 text-blue-600" />
                                ) : (
                                  <Banknote className="w-3 h-3 text-amber-600" />
                                )}
                                {p.method === "online" ? "UPI / Online" : "Cash"}
                              </span>
                            </td>

                            <td className="py-3 px-4 font-display font-black text-sm text-[#1C1917] whitespace-nowrap">
                              ₹{p.amount}
                            </td>

                            <td className="py-3 px-4 whitespace-nowrap">
                              {isPaid ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-green-100 text-green-800 border border-green-200">
                                  <CheckCircle2 className="w-3 h-3" />
                                  PAID
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-800 border border-amber-200">
                                  <Clock className="w-3 h-3" />
                                  PENDING
                                </span>
                              )}
                            </td>

                            <td className="py-3 px-4 font-mono text-[10px] text-[#5A4839] max-w-[220px]">
                              {p.notes && p.notes.includes("volunteer:") ? (
                                <div className="flex flex-col gap-0.5">
                                  <span className="font-bold text-[#E65100] inline-flex items-center gap-1">
                                    <UserCheck className="w-3 h-3 text-[#E65100]" />
                                    {p.notes.split("volunteer:")[1]?.split("|")[0]?.trim()}
                                  </span>
                                  <span className="text-[9px] text-[#5A4839] truncate">
                                    {p.gateway_payment_id ? `UTR: ${p.gateway_payment_id}` : p.notes}
                                  </span>
                                </div>
                              ) : (
                                <span className="truncate block max-w-[200px]">
                                  {p.gateway_payment_id || p.gateway_order_id || p.notes || "—"}
                                </span>
                              )}
                            </td>

                            <td className="py-3 px-4 text-right whitespace-nowrap">
                              {!isPaid ? (
                                <button
                                  onClick={() => handleMarkAsPaid(p.id)}
                                  disabled={isUpdating}
                                  className="px-2.5 py-1 rounded-lg bg-green-600 hover:bg-green-700 text-white text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 transition-all cursor-pointer disabled:opacity-50"
                                >
                                  {isUpdating ? (
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                  ) : (
                                    <Check className="w-3 h-3" />
                                  )}
                                  <span>Mark Received</span>
                                </button>
                              ) : (
                                <span className="text-[11px] text-green-700 font-bold">Settled</span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Footer & Pagination */}
              <div className="p-4 bg-[#FAF4EC] border-t border-[#1C1917]/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#5A4839]">
                <div>
                  Showing <span className="font-bold text-[#1C1917]">{payments.length}</span> of{" "}
                  <span className="font-bold text-[#1C1917]">{totalCount}</span> total records
                </div>

                <div className="flex items-center gap-2">
                  <button
                    disabled={page <= 1 || loading}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="px-3 py-1.5 rounded-lg bg-[#F5EBE1] border border-[#292524]/20 text-[11px] font-bold uppercase tracking-wider text-[#1C1917] disabled:opacity-40 cursor-pointer"
                  >
                    Previous
                  </button>
                  <span className="px-2 text-xs font-mono font-bold text-[#1C1917]">Page {page}</span>
                  <button
                    disabled={payments.length < 50 || loading}
                    onClick={() => setPage((p) => p + 1)}
                    className="px-3 py-1.5 rounded-lg bg-[#F5EBE1] border border-[#292524]/20 text-[11px] font-bold uppercase tracking-wider text-[#1C1917] disabled:opacity-40 cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
