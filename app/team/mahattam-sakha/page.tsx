"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Building,
  User,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Users,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Calculator,
} from "lucide-react";
import {
  VASTI_STHAN_DATA,
  VASTI_CONFIG,
  VASTI_LIST,
  TIMING_OPTIONS,
  VALID_DATES,
  TimingOption,
} from "@/lib/mahattam-sakha-data";

export default function MahattamSakhaFormPage() {
  const [reporterName, setReporterName] = useState("");
  const [date, setDate] = useState<string>("2026-10-02");
  const [vasti, setVasti] = useState<string>("");
  const [sthan, setSthan] = useState<string>("");
  const [timing, setTiming] = useState<TimingOption>("Prabhat");

  // Attendance fields
  const [tarun, setTarun] = useState<string>("");
  const [bal, setBal] = useState<string>("");
  const [shishu, setShishu] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  // States
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<any | null>(null);

  // Auto-fill reporter name from local storage or volunteer session if available
  useEffect(() => {
    try {
      const storedName = localStorage.getItem("mahattam_reporter_name");
      if (storedName) {
        setReporterName(storedName);
      } else {
        // Try fetching current volunteer session
        fetch("/api/volunteer/session")
          .then((r) => r.json())
          .then((data) => {
            if (data?.user?.name) {
              setReporterName(data.user.name);
            }
          })
          .catch(() => {});
      }
    } catch {}
  }, []);

  // When vasti changes, reset sthan
  const handleVastiChange = (selectedVasti: string) => {
    setVasti(selectedVasti);
    setSthan("");
  };

  // Upasthiti calculation: Yog = Tarun + Bal
  const tarunNum = Math.max(0, parseInt(tarun, 10) || 0);
  const balNum = Math.max(0, parseInt(bal, 10) || 0);
  const shishuNum = Math.max(0, parseInt(shishu, 10) || 0);
  const yogNum = tarunNum + balNum;

  // Available sthans for the selected vasti
  const availableSthans = vasti && VASTI_STHAN_DATA[vasti] ? VASTI_STHAN_DATA[vasti] : [];
  const currentSthanConfig = vasti && VASTI_CONFIG[vasti] ? VASTI_CONFIG[vasti].find((s) => s.name === sthan) : null;

  const handleSthanChange = (selectedSthan: string) => {
    setSthan(selectedSthan);
    if (vasti && VASTI_CONFIG[vasti]) {
      const match = VASTI_CONFIG[vasti].find((s) => s.name === selectedSthan);
      if (match?.preferredTiming) {
        setTiming(match.preferredTiming);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!reporterName.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!vasti) {
      setError("Please select a Vasti.");
      return;
    }

    if (!sthan) {
      setError("Please select a Sthan.");
      return;
    }

    setSubmitting(true);

    try {
      // Remember reporter name for next entry
      try {
        localStorage.setItem("mahattam_reporter_name", reporterName.trim());
      } catch {}

      const res = await fetch("/api/mahattam-sakha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reporter_name: reporterName.trim(),
          date,
          vasti,
          sthan,
          timing,
          tarun: tarunNum,
          bal: balNum,
          shishu: shishuNum,
          notes: notes.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Failed to submit attendance. Please try again.");
        setSubmitting(false);
        return;
      }

      setSuccessData(data.entry);
      // Reset form numbers and sthan while keeping name, date & vasti for convenience
      setTarun("");
      setBal("");
      setShishu("");
      setNotes("");
    } catch (err: any) {
      setError(err.message || "An unexpected network error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EAE0D0] bg-parchment-texture text-[#1C1917] py-8 px-4 sm:px-6">
      <div className="max-w-xl mx-auto">
        {/* Header Banner */}
        <div className="bg-[#1C1917] text-[#FAF4EC] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#292524] mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-[#E65100]/20 to-transparent rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-[#E65100]/20 text-[#FFA000] border border-[#E65100]/30">
              <ShieldCheck className="w-3.5 h-3.5" /> Team Portal • महोत्तम शाखा
            </span>
            <span className="text-[11px] font-mono text-[#D6C2A8]/70">
              2 Oct – 8 Oct 2026
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-display font-black uppercase tracking-tight text-white mb-2">
            Mahattam Shakha <span className="text-[#FFA000]">Attendance</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#D6C2A8] font-medium leading-relaxed">
            Fill the daily attendance for your respective Vasti and Sthan. Upasthiti for{" "}
            <span className="text-white font-bold underline decoration-[#FFA000]">Tarun</span> and{" "}
            <span className="text-white font-bold underline decoration-[#FFA000]">Bal</span> is automatically combined into{" "}
            <span className="text-[#FFA000] font-bold">Yog</span>, while{" "}
            <span className="text-white font-bold underline decoration-[#22C55E]">Shishu</span> is counted separately.
          </p>
        </div>

        {/* Success Alert */}
        {successData && (
          <div className="mb-6 p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-500/40 text-emerald-950 shadow-md animate-in fade-in slide-in-from-top-2">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-bold text-sm text-emerald-900 mb-1">
                  Attendance Recorded Successfully!
                </h3>
                <p className="text-xs text-emerald-800">
                  Entry for <strong>{successData.vasti}</strong> ({successData.sthan}) on{" "}
                  <strong>{successData.date}</strong> ({successData.timing}) was saved.
                </p>
                <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-mono">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 font-bold border border-emerald-200">
                    Tarun: {successData.tarun}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 font-bold border border-emerald-200">
                    Bal: {successData.bal}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 font-black border border-amber-300">
                    Yog (T+B): {successData.yog}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 font-bold border border-emerald-200">
                    Shishu: {successData.shishu}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSuccessData(null)}
                  className="mt-3 text-xs text-emerald-700 underline font-semibold hover:text-emerald-900 cursor-pointer"
                >
                  Dismiss / Add Another Sthan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border-2 border-red-500/40 text-red-900 flex items-start gap-3 shadow-sm animate-in fade-in">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="text-xs font-semibold leading-relaxed">{error}</div>
          </div>
        )}

        {/* The Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-[#F5EBE1] border-2 border-[#292524]/20 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6"
        >
          {/* Section 1: Reporter Info */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-[#5A4839] mb-2">
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-[#E65100]" /> Name of Person Filling Form *
              </span>
            </label>
            <input
              type="text"
              required
              value={reporterName}
              onChange={(e) => setReporterName(e.target.value)}
              placeholder="e.g. Aryan Vaghela / Rahul Sharma"
              className="w-full px-4 py-3 rounded-xl bg-white border border-[#292524]/30 focus:border-[#E65100] focus:ring-2 focus:ring-[#E65100]/20 font-medium text-sm text-[#1C1917] outline-none transition-all placeholder:text-[#5A4839]/40"
            />
          </div>

          {/* Section 2: Date & Timing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-[#5A4839] mb-2">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#E65100]" /> Date (तारीख) *
                </span>
              </label>
              <select
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white border border-[#292524]/30 focus:border-[#E65100] focus:ring-2 focus:ring-[#E65100]/20 font-semibold text-sm text-[#1C1917] outline-none transition-all cursor-pointer"
              >
                {VALID_DATES.map((d) => {
                  const [yyyy, mm, dd] = d.split("-");
                  return (
                    <option key={d} value={d}>
                      {dd}/{mm}/{yyyy}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-[#5A4839] mb-2">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#E65100]" /> Timing (वेळ) *
                </span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {TIMING_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setTiming(opt)}
                    className={`py-3 px-3 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      timing === opt
                        ? "bg-[#E65100] text-white border-[#E65100] shadow-sm scale-[1.02]"
                        : "bg-white text-[#5A4839] border-[#292524]/20 hover:border-[#292524]/40"
                    }`}
                  >
                    {opt === "Prabhat" ? "🌅 Prabhat" : "🌇 Shayam"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: Cascading Vasti & Sthan */}
          <div className="p-4 rounded-2xl bg-[#EFE3D5] border border-[#292524]/15 space-y-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-[#5A4839] mb-2">
                <span className="flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-[#E65100]" /> Select Vasti (वस्ती) *
                </span>
              </label>
              <select
                required
                value={vasti}
                onChange={(e) => handleVastiChange(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white border border-[#292524]/30 focus:border-[#E65100] focus:ring-2 focus:ring-[#E65100]/20 font-bold text-sm text-[#1C1917] outline-none transition-all cursor-pointer"
              >
                <option value="">-- Choose Vasti --</option>
                {VASTI_LIST.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-[#5A4839] mb-2">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#E65100]" /> Select Sthan (स्थान) *
                </span>
              </label>
              <select
                required
                disabled={!vasti}
                value={sthan}
                onChange={(e) => handleSthanChange(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl bg-white border border-[#292524]/30 focus:border-[#E65100] focus:ring-2 focus:ring-[#E65100]/20 font-semibold text-sm text-[#1C1917] outline-none transition-all ${
                  !vasti ? "opacity-50 cursor-not-allowed bg-gray-100" : "cursor-pointer"
                }`}
              >
                <option value="">
                  {vasti ? `-- Select Sthan for ${vasti} --` : "-- First choose a Vasti above --"}
                </option>
                {availableSthans.map((s) => {
                  const detail = vasti && VASTI_CONFIG[vasti] ? VASTI_CONFIG[vasti].find((item) => item.name === s) : null;
                  return (
                    <option key={s} value={s}>
                      {s} {detail?.defaultTime ? `• (${detail.defaultTime})` : ""}
                    </option>
                  );
                })}
              </select>
              {currentSthanConfig && (
                <div className="mt-2.5 p-2.5 rounded-xl bg-white border border-[#292524]/20 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-[#E65100]">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Time: {currentSthanConfig.defaultTime || "Standard"}</span>
                  </div>
                  {currentSthanConfig.category && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#E65100]/10 text-[#E65100] border border-[#E65100]/20">
                      Type: {currentSthanConfig.category}
                    </span>
                  )}
                </div>
              )}
              {vasti && availableSthans.length > 0 && !currentSthanConfig && (
                <p className="text-[11px] text-[#5A4839]/80 mt-1.5 font-medium">
                  Showing {availableSthans.length} verified sthan{availableSthans.length > 1 ? "s" : ""} under{" "}
                  <strong>{vasti}</strong>
                </p>
              )}
            </div>
          </div>

          {/* Section 4: Upasthiti (Attendance) Breakdown */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#292524]/15 pb-2">
              <span className="text-xs font-black uppercase tracking-widest text-[#5A4839] flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#E65100]" /> Upasthiti (उपस्थिति) Details
              </span>
              <span className="text-[11px] font-semibold text-[#5A4839]/70">
                Count numbers
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Tarun */}
              <div className="bg-white p-4 rounded-2xl border border-[#292524]/20 shadow-sm">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#5A4839] mb-1">
                  Tarun (तरुण)
                </label>
                <p className="text-[11px] text-[#5A4839]/60 mb-2">Youth members</p>
                <input
                  type="number"
                  min="0"
                  inputMode="numeric"
                  value={tarun}
                  onChange={(e) => setTarun(e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FAF6F0] border border-[#292524]/20 text-lg font-black text-[#1C1917] focus:bg-white focus:border-[#E65100] outline-none transition-all"
                />
              </div>

              {/* Bal */}
              <div className="bg-white p-4 rounded-2xl border border-[#292524]/20 shadow-sm">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#5A4839] mb-1">
                  Bal (बाल)
                </label>
                <p className="text-[11px] text-[#5A4839]/60 mb-2">School-age children</p>
                <input
                  type="number"
                  min="0"
                  inputMode="numeric"
                  value={bal}
                  onChange={(e) => setBal(e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FAF6F0] border border-[#292524]/20 text-lg font-black text-[#1C1917] focus:bg-white focus:border-[#E65100] outline-none transition-all"
                />
              </div>
            </div>

            {/* Calculated Yog Highlight Card */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-amber-700" />
                <div>
                  <div className="text-xs font-black uppercase tracking-wider text-amber-950">
                    Upasthiti of Yog (योग)
                  </div>
                  <div className="text-[11px] text-amber-800">
                    Tarun ({tarunNum}) + Bal ({balNum})
                  </div>
                </div>
              </div>
              <div className="text-3xl font-black font-display text-amber-950">
                {yogNum}
              </div>
            </div>

            {/* Shishu (Kept separate) */}
            <div className="bg-white p-4 rounded-2xl border-2 border-emerald-600/30 shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-black uppercase tracking-wider text-emerald-950">
                  Shishu (शिशु) • Kept Separate
                </label>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Separate Metric
                </span>
              </div>
              <p className="text-[11px] text-[#5A4839]/70 mb-2">Young toddlers / tiny tots</p>
              <input
                type="number"
                min="0"
                inputMode="numeric"
                value={shishu}
                onChange={(e) => setShishu(e.target.value)}
                placeholder="0"
                className="w-full px-4 py-2.5 rounded-xl bg-[#FAF6F0] border border-[#292524]/20 text-lg font-black text-emerald-950 focus:bg-white focus:border-emerald-600 outline-none transition-all"
              />
            </div>
          </div>

          {/* Section 5: Optional Remarks / Notes */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-[#5A4839] mb-2">
              Additional Notes / Remarks (वैकल्पिक)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special remarks regarding this Shakha session..."
              className="w-full px-4 py-3 rounded-xl bg-white border border-[#292524]/30 focus:border-[#E65100] focus:ring-2 focus:ring-[#E65100]/20 font-medium text-xs text-[#1C1917] outline-none transition-all placeholder:text-[#5A4839]/40 resize-none"
            />
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#E65100] to-[#F57C00] text-white font-display font-black text-sm uppercase tracking-wider shadow-lg hover:shadow-xl hover:from-[#BF360C] hover:to-[#E65100] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed transform active:scale-[0.99]"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Recording Attendance...</span>
              </>
            ) : (
              <>
                <span>Submit Mahattam Shakha Attendance</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="mt-6 text-center text-xs text-[#5A4839]/70 font-medium">
          Protected Team Access • Yuva Shakti Sangam 2026
        </div>
      </div>
    </div>
  );
}
