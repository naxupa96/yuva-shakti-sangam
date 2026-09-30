"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  Building,
  User,
  Users,
  Search,
  Filter,
  Download,
  RefreshCw,
  Loader2,
  TrendingUp,
  FileSpreadsheet,
  PlusCircle,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import {
  MahattamSakhaEntry,
  VASTI_LIST,
  VALID_DATES,
  TIMING_OPTIONS,
} from "@/lib/mahattam-sakha-data";

export default function AdminMahattamSakhaPage() {
  const [entries, setEntries] = useState<MahattamSakhaEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVasti, setSelectedVasti] = useState("all");
  const [selectedDate, setSelectedDate] = useState("all");
  const [selectedTiming, setSelectedTiming] = useState("all");

  const fetchEntries = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    try {
      const res = await fetch("/api/mahattam-sakha");
      const data = await res.json();
      if (data.success && Array.isArray(data.entries)) {
        setEntries(data.entries);
      }
    } catch (err) {
      console.error("Failed to load entries:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  // Filtered entries
  const filteredEntries = useMemo(() => {
    return entries.filter((item) => {
      // Vasti filter
      if (selectedVasti !== "all" && item.vasti !== selectedVasti) {
        return false;
      }
      // Date filter
      if (selectedDate !== "all" && item.date !== selectedDate) {
        return false;
      }
      // Timing filter
      if (selectedTiming !== "all" && item.timing !== selectedTiming) {
        return false;
      }
      // Search query (reporter, sthan, vasti, notes)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          (item.reporter_name || "").toLowerCase().includes(q) ||
          (item.sthan || "").toLowerCase().includes(q) ||
          (item.vasti || "").toLowerCase().includes(q) ||
          (item.notes || "").toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [entries, selectedVasti, selectedDate, selectedTiming, searchQuery]);

  // Aggregate metrics for filtered data
  const aggregatedStats = useMemo(() => {
    return filteredEntries.reduce(
      (acc, curr) => {
        acc.entriesCount += 1;
        acc.tarunTotal += curr.tarun;
        acc.balTotal += curr.bal;
        acc.yogTotal += curr.yog;
        acc.shishuTotal += curr.shishu;
        return acc;
      },
      {
        entriesCount: 0,
        tarunTotal: 0,
        balTotal: 0,
        yogTotal: 0,
        shishuTotal: 0,
      }
    );
  }, [filteredEntries]);

  // Export to CSV
  const exportToCSV = () => {
    if (filteredEntries.length === 0) return;

    const headers = [
      "ID",
      "Date",
      "Timing",
      "Vasti",
      "Sthan",
      "Tarun",
      "Bal",
      "Yog (Tarun+Bal)",
      "Shishu",
      "Reported By",
      "Remarks",
      "Submitted At",
    ];

    const rows = filteredEntries.map((e) => [
      `"${e.id || ""}"`,
      `"${e.date}"`,
      `"${e.timing}"`,
      `"${e.vasti}"`,
      `"${e.sthan}"`,
      e.tarun,
      e.bal,
      e.yog,
      e.shishu,
      `"${(e.reporter_name || "").replace(/"/g, '""')}"`,
      `"${(e.notes || "").replace(/"/g, '""')}"`,
      `"${e.created_at || ""}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `Mahattam_Sakha_Attendance_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#F5EBE1] border-2 border-[#292524]/20 rounded-3xl p-6 shadow-md">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-[#E65100]/15 text-[#E65100] border border-[#E65100]/30 mb-2">
            महोत्तम शाखा • Daily Report
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-black uppercase text-[#1C1917] tracking-tight">
            Mahattam Shakha <span className="text-[#E65100]">Admin View</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#5A4839] font-medium mt-1">
            Track daily attendance submitted by team members across all Vastis & Sthans (2/10/2026 to 8/10/2026).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/team/mahattam-sakha"
            target="_blank"
            className="px-4 py-2.5 rounded-xl bg-white border border-[#292524]/20 hover:border-[#E65100] text-[#1C1917] font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4 text-[#E65100]" />
            <span>Open Entry Form</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#5A4839]/60" />
          </Link>

          <button
            onClick={() => fetchEntries(true)}
            disabled={refreshing}
            className="p-2.5 rounded-xl bg-white border border-[#292524]/20 hover:bg-[#FAF6F0] text-[#1C1917] transition-all cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin text-[#E65100]" : ""}`} />
          </button>

          <button
            onClick={exportToCSV}
            disabled={filteredEntries.length === 0}
            className="px-4 py-2.5 rounded-xl bg-[#1C1917] text-[#FAF4EC] hover:bg-[#292524] font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow transition-all cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4 text-[#FFA000]" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-[#F5EBE1] border-2 border-[#292524]/20 rounded-2xl p-4 shadow-sm">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#5A4839]">
            Total Entries
          </div>
          <div className="text-2xl sm:text-3xl font-black font-display text-[#1C1917] mt-1">
            {aggregatedStats.entriesCount}
          </div>
          <div className="text-[11px] text-[#5A4839]/70 mt-0.5">Reported sessions</div>
        </div>

        <div className="bg-[#F5EBE1] border-2 border-[#292524]/20 rounded-2xl p-4 shadow-sm">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#5A4839]">
            Tarun (तरुण)
          </div>
          <div className="text-2xl sm:text-3xl font-black font-display text-[#E65100] mt-1">
            {aggregatedStats.tarunTotal}
          </div>
          <div className="text-[11px] text-[#5A4839]/70 mt-0.5">Youth attendees</div>
        </div>

        <div className="bg-[#F5EBE1] border-2 border-[#292524]/20 rounded-2xl p-4 shadow-sm">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#5A4839]">
            Bal (बाल)
          </div>
          <div className="text-2xl sm:text-3xl font-black font-display text-[#E65100] mt-1">
            {aggregatedStats.balTotal}
          </div>
          <div className="text-[11px] text-[#5A4839]/70 mt-0.5">Children attendees</div>
        </div>

        <div className="bg-amber-500/10 border-2 border-amber-500/40 rounded-2xl p-4 shadow-sm">
          <div className="text-[11px] font-black uppercase tracking-wider text-amber-950 flex items-center justify-between">
            <span>Yog (योग = T+B)</span>
            <span className="text-[10px] bg-amber-200/80 px-1.5 py-0.5 rounded text-amber-900 font-bold">Key</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-display text-amber-950 mt-1">
            {aggregatedStats.yogTotal}
          </div>
          <div className="text-[11px] text-amber-800 font-medium mt-0.5">Combined Yog Upasthiti</div>
        </div>

        <div className="col-span-2 lg:col-span-1 bg-emerald-500/10 border-2 border-emerald-500/40 rounded-2xl p-4 shadow-sm">
          <div className="text-[11px] font-black uppercase tracking-wider text-emerald-950 flex items-center justify-between">
            <span>Shishu (शिशु)</span>
            <span className="text-[10px] bg-emerald-200/80 px-1.5 py-0.5 rounded text-emerald-900 font-bold">Separate</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-display text-emerald-950 mt-1">
            {aggregatedStats.shishuTotal}
          </div>
          <div className="text-[11px] text-emerald-800 font-medium mt-0.5">Kept distinct metric</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#F5EBE1] border-2 border-[#292524]/20 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#5A4839]/60" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by team member name, sthan, vasti, or notes..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-[#292524]/20 text-xs font-semibold text-[#1C1917] outline-none focus:border-[#E65100]"
          />
        </div>

        {/* Vasti Filter */}
        <div className="w-full md:w-44">
          <select
            value={selectedVasti}
            onChange={(e) => setSelectedVasti(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-white border border-[#292524]/20 text-xs font-bold text-[#1C1917] outline-none cursor-pointer focus:border-[#E65100]"
          >
            <option value="all">All Vastis (सभी वस्ती)</option>
            {VASTI_LIST.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>

        {/* Date Filter */}
        <div className="w-full md:w-36">
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-white border border-[#292524]/20 text-xs font-bold text-[#1C1917] outline-none cursor-pointer focus:border-[#E65100]"
          >
            <option value="all">All Dates</option>
            {VALID_DATES.map((d) => {
              const [yyyy, mm, dd] = d.split("-");
              return (
                <option key={d} value={d}>
                  {dd}/{mm}
                </option>
              );
            })}
          </select>
        </div>

        {/* Timing Filter */}
        <div className="w-full md:w-32">
          <select
            value={selectedTiming}
            onChange={(e) => setSelectedTiming(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-white border border-[#292524]/20 text-xs font-bold text-[#1C1917] outline-none cursor-pointer focus:border-[#E65100]"
          >
            <option value="all">All Timings</option>
            {TIMING_OPTIONS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table Data */}
      <div className="bg-[#F5EBE1] border-2 border-[#292524]/20 rounded-3xl shadow-lg overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#E65100]" />
            <p className="text-xs font-bold uppercase tracking-wider text-[#5A4839]">
              Loading Mahattam Shakha records...
            </p>
          </div>
        ) : filteredEntries.length === 0 ? (
          <div className="py-16 text-center px-4">
            <Building className="w-10 h-10 text-[#5A4839]/40 mx-auto mb-2" />
            <h3 className="font-bold text-sm text-[#1C1917]">No attendance records found</h3>
            <p className="text-xs text-[#5A4839] mt-1 max-w-sm mx-auto">
              No entries match the selected filters. Use the "Open Entry Form" button to submit a new entry.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#1C1917] text-[#FAF4EC] text-[11px] font-black uppercase tracking-wider">
                  <th className="py-3 px-4">Date & Timing</th>
                  <th className="py-3 px-4">Vasti</th>
                  <th className="py-3 px-4">Sthan</th>
                  <th className="py-3 px-4 text-center">Tarun</th>
                  <th className="py-3 px-4 text-center">Bal</th>
                  <th className="py-3 px-4 text-center bg-[#E65100] text-white">Yog (T+B)</th>
                  <th className="py-3 px-4 text-center">Shishu</th>
                  <th className="py-3 px-4">Reported By</th>
                  <th className="py-3 px-4">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#292524]/10 text-xs text-[#1C1917]">
                {filteredEntries.map((row) => {
                  const [yyyy, mm, dd] = (row.date || "").split("-");
                  const formattedDate = dd && mm ? `${dd}/${mm}/${yyyy}` : row.date;

                  return (
                    <tr
                      key={row.id || Math.random()}
                      className="hover:bg-white/60 transition-colors"
                    >
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-bold">{formattedDate}</div>
                        <div className="text-[10px] text-[#5A4839] flex items-center gap-1 font-semibold">
                          <span>{row.timing === "Prabhat" ? "🌅 Prabhat" : "🌇 Shayam"}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-bold text-[#E65100] whitespace-nowrap">
                        {row.vasti}
                      </td>

                      <td className="py-3 px-4 font-semibold text-[#1C1917]">
                        {row.sthan}
                      </td>

                      <td className="py-3 px-4 text-center font-bold font-mono">
                        {row.tarun}
                      </td>

                      <td className="py-3 px-4 text-center font-bold font-mono">
                        {row.bal}
                      </td>

                      <td className="py-3 px-4 text-center font-black font-mono text-amber-950 bg-amber-500/10">
                        {row.yog}
                      </td>

                      <td className="py-3 px-4 text-center font-bold font-mono text-emerald-800 bg-emerald-500/5">
                        {row.shishu}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-bold text-[#1C1917] flex items-center gap-1">
                          <User className="w-3 h-3 text-[#5A4839]" />
                          <span>{row.reporter_name}</span>
                        </div>
                        {row.created_at && (
                          <div className="text-[10px] text-[#5A4839]/60 font-mono">
                            {new Date(row.created_at).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-4 text-[11px] text-[#5A4839] max-w-xs truncate">
                        {row.notes || "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
