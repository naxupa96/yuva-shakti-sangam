"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  CreditCard,
  Banknote,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  RefreshCw,
  Download,
  QrCode,
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  LogOut,
} from "lucide-react";
import { DashboardStats } from "@/types/registration";
import { createClient } from "@/lib/supabase/client";
import { CornerOrnament, MandalaMotif } from "@/components/Decorations";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    total_registered: 0,
    total_paid: 0,
    total_pending: 0,
    total_checked_in: 0,
    check_in_percentage: 0,
    online_paid_count: 0,
    cash_paid_count: 0,
    cash_pending_count: 0,
    online_revenue: 0,
    cash_revenue: 0,
    total_revenue: 0,
    pending_cash_amount: 0,
  });

  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      if (data.success && data.stats) {
        setStats(data.stats);
        setLastUpdated(new Date());
      }
    } catch (err) {
      console.error("Stats fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // Auto-refresh stats every 15 seconds during event
    const interval = setInterval(fetchStats, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/admin/login";
  };

  return (
    <div className="min-h-screen bg-[#EAE0D0] bg-parchment-texture text-[#1C1917] p-4 sm:p-8 selection:bg-[#E65100] selection:text-white">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Bar */}
        <div className="p-6 rounded-3xl bg-[#1C1917] text-[#FAF4EC] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#FFA000] uppercase">
                LIVE ORGANIZER COMMAND CENTER
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-display font-black uppercase tracking-tight mt-1">
              YUVA <span className="text-[#F05A12]">SHAKTI</span> SANGAM
            </h1>
            <p className="text-xs text-[#FAF4EC]/70 mt-0.5">
              06 September 2026 • Maninagar, Ahmedabad • Live Attendance & Revenue
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={fetchStats}
              disabled={loading}
              className="px-3.5 py-2 rounded-xl bg-[#24170D] border border-white/10 hover:border-[#FFA000]/40 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#FFA000]" : ""}`} />
              <span>Refresh</span>
            </button>

            <Link
              href="/admin/checkin"
              className="px-4 py-2 rounded-xl btn-bhagwa-primary text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-bhagwa-sm"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>QR Scanner</span>
            </Link>

            <button
              onClick={handleLogout}
              className="p-2 rounded-xl bg-[#24170D] border border-white/10 text-zinc-400 hover:text-white"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Core Metric Overview Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Registered Total */}
          <div className="p-5 rounded-2xl bg-[#F5EBE1] border-2 border-[#1C1917]/15 shadow-parchment-card space-y-2 relative overflow-hidden">
            <CornerOrnament className="absolute top-2 right-2 text-[#E65100]/20 -scale-x-100" />
            <div className="flex items-center justify-between text-[#5A4839]">
              <span className="text-[11px] font-black uppercase tracking-wider">TOTAL REGISTERED</span>
              <Users className="w-4 h-4 text-[#E65100]" />
            </div>
            <div className="text-3xl sm:text-4xl font-display font-black text-[#1C1917]">
              {stats.total_registered.toLocaleString()}
            </div>
            <div className="text-[11px] text-[#5A4839] flex items-center gap-1.5 font-medium">
              <span className="font-bold text-green-700">{stats.total_paid} Paid</span>
              <span>•</span>
              <span className="text-amber-700">{stats.total_pending} Pending</span>
            </div>
          </div>

          {/* Card 2: Attendance / Checked In */}
          <div className="p-5 rounded-2xl bg-[#F5EBE1] border-2 border-[#1C1917]/15 shadow-parchment-card space-y-2 relative overflow-hidden">
            <CornerOrnament className="absolute top-2 right-2 text-[#E65100]/20 -scale-x-100" />
            <div className="flex items-center justify-between text-[#5A4839]">
              <span className="text-[11px] font-black uppercase tracking-wider">CHECKED IN</span>
              <CheckCircle2 className="w-4 h-4 text-green-600" />
            </div>
            <div className="text-3xl sm:text-4xl font-display font-black text-[#1C1917]">
              {stats.total_checked_in.toLocaleString()}
            </div>
            <div className="text-[11px] text-green-700 font-bold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{stats.check_in_percentage}% Attendance Rate</span>
            </div>
          </div>

          {/* Card 3: Total Revenue Collected */}
          <div className="p-5 rounded-2xl bg-[#F5EBE1] border-2 border-[#1C1917]/15 shadow-parchment-card space-y-2 relative overflow-hidden">
            <CornerOrnament className="absolute top-2 right-2 text-[#E65100]/20 -scale-x-100" />
            <div className="flex items-center justify-between text-[#5A4839]">
              <span className="text-[11px] font-black uppercase tracking-wider">TOTAL COLLECTED</span>
              <ShieldCheck className="w-4 h-4 text-[#FFA000]" />
            </div>
            <div className="text-3xl sm:text-4xl font-display font-black text-[#1C1917]">
              ₹{stats.total_revenue.toLocaleString("en-IN")}
            </div>
            <div className="text-[11px] text-[#5A4839] font-medium">
              ₹50 entry fee per participant
            </div>
          </div>

          {/* Card 4: Pending Cash at Gate */}
          <div className="p-5 rounded-2xl bg-[#F5EBE1] border-2 border-[#1C1917]/15 shadow-parchment-card space-y-2 relative overflow-hidden">
            <CornerOrnament className="absolute top-2 right-2 text-[#E65100]/20 -scale-x-100" />
            <div className="flex items-center justify-between text-[#5A4839]">
              <span className="text-[11px] font-black uppercase tracking-wider">PENDING CASH</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-3xl sm:text-4xl font-display font-black text-amber-700">
              ₹{stats.pending_cash_amount.toLocaleString("en-IN")}
            </div>
            <div className="text-[11px] text-amber-800 font-medium">
              {stats.cash_pending_count} registrations to collect at gate
            </div>
          </div>
        </div>

        {/* Financial Breakdown Section */}
        <div className="p-6 rounded-3xl bg-[#F5EBE1] border-2 border-[#1C1917]/15 shadow-parchment-deep space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#292524]/10 pb-4">
            <div>
              <h2 className="text-xl font-display font-black uppercase text-[#1C1917]">
                COLLECTION BREAKDOWN
              </h2>
              <p className="text-xs text-[#5A4839]">
                Online Gateway settlements vs. On-ground Cash collected by volunteers
              </p>
            </div>

            <div className="text-xs font-mono text-[#5A4839]">
              Last updated: {lastUpdated.toLocaleTimeString("en-IN")}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Online Payment Box */}
            <div className="p-5 rounded-2xl bg-[#FAF4EC] border border-[#292524]/10 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-wider text-[#1C1917]">
                    ONLINE SETTLEMENTS
                  </span>
                </div>
                <span className="text-xs font-bold text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded-full">
                  {stats.online_paid_count} Transactions
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-display font-black text-[#1C1917]">
                ₹{stats.online_revenue.toLocaleString("en-IN")}
              </div>
              <p className="text-[11px] text-[#5A4839]">
                Processed via Payment Gateway (UPI / Cards / NetBanking)
              </p>
            </div>

            {/* Cash Payment Box */}
            <div className="p-5 rounded-2xl bg-[#FAF4EC] border border-[#292524]/10 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                    <Banknote className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-wider text-[#1C1917]">
                    ON-GROUND CASH COLLECTED
                  </span>
                </div>
                <span className="text-xs font-bold text-green-800 bg-green-50 px-2.5 py-0.5 rounded-full">
                  {stats.cash_paid_count} Received
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-display font-black text-[#1C1917]">
                ₹{stats.cash_revenue.toLocaleString("en-IN")}
              </div>
              <p className="text-[11px] text-[#5A4839]">
                Collected and verified by authorized volunteers at gate
              </p>
            </div>
          </div>
        </div>

        {/* Quick Management Shortcuts */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/admin/checkin"
            className="p-5 rounded-2xl bg-[#1C1917] text-[#FAF4EC] hover:bg-[#24170D] transition-all flex items-center justify-between shadow-lg group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F05A12] text-white flex items-center justify-center">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-display font-black uppercase block text-[#FAF4EC]">
                  VOLUNTEER SCANNER
                </span>
                <span className="text-[10px] text-[#FAF4EC]/70">Fast mobile QR gate entry</span>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-[#FFA000] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Link>

          <Link
            href="/admin/participants"
            className="p-5 rounded-2xl bg-[#F5EBE1] border-2 border-[#1C1917]/15 hover:border-[#F05A12] transition-all flex items-center justify-between shadow-parchment-card group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1C1917] text-[#FFA000] flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-display font-black uppercase block text-[#1C1917]">
                  PARTICIPANT LIST
                </span>
                <span className="text-[10px] text-[#5A4839]">Search, filters & attendance</span>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-[#F05A12] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Link>

          <Link
            href="/admin/payments"
            className="p-5 rounded-2xl bg-[#F5EBE1] border-2 border-[#1C1917]/15 hover:border-[#F05A12] transition-all flex items-center justify-between shadow-parchment-card group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1C1917] text-green-400 flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-display font-black uppercase block text-[#1C1917]">
                  PAYMENTS LEDGER
                </span>
                <span className="text-[10px] text-[#5A4839]">Financial transaction records</span>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-[#F05A12] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
