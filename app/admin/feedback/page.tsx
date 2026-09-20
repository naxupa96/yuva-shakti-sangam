"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Star,
  Search,
  Download,
  Filter,
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  Loader2,
  RefreshCw,
  Copy,
  Check,
  Users,
  MapPin,
  GraduationCap,
  Phone,
  Sparkles,
  MessageSquareHeart,
  TrendingUp,
  Award,
} from "lucide-react";
import { EventFeedback, FeedbackStats } from "@/types/feedback";
import { CornerOrnament } from "@/components/Decorations";

export default function AdminFeedbackPage() {
  const [feedbackList, setFeedbackList] = useState<EventFeedback[]>([]);
  const [stats, setStats] = useState<FeedbackStats>({
    average_rating: 5.0,
    total_feedback: 0,
    five_star_count: 0,
    four_star_count: 0,
    three_star_count: 0,
    two_star_count: 0,
    one_star_count: 0,
    checked_in_feedback_count: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [attendanceFilter, setAttendanceFilter] = useState("all");
  const [starredOnly, setStarredOnly] = useState(false);
  const [starredIds, setStarredIds] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Load pinned feedback from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("yss_starred_feedback");
      if (saved) setStarredIds(JSON.parse(saved));
    } catch {}
  }, []);

  const toggleStar = (id: string) => {
    setStarredIds((prev) => {
      const next = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
      try {
        localStorage.setItem("yss_starred_feedback", JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const fetchFeedback = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/feedback");
      const data = await res.json();
      if (data.success && Array.isArray(data.feedback)) {
        setFeedbackList(data.feedback);
        if (data.stats) {
          setStats(data.stats);
        }
      }
    } catch (err) {
      console.error("Failed to load feedback:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  // Filtered feedback computed client side
  const filteredFeedback = useMemo(() => {
    return feedbackList.filter((f) => {
      // Starred filter
      if (starredOnly && !starredIds.includes(f.id)) return false;

      // Rating filter
      if (ratingFilter !== "all") {
        if (f.rating !== parseInt(ratingFilter, 10)) return false;
      }

      // Attendance filter
      if (attendanceFilter === "checked_in" && !f.checked_in) return false;
      if (attendanceFilter === "not_checked_in" && f.checked_in) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = (f.participant_name || "").toLowerCase().includes(q);
        const matchesText = (f.feedback_text || "").toLowerCase().includes(q);
        const matchesCity = (f.city || "").toLowerCase().includes(q);
        const matchesCollege = (f.college || "").toLowerCase().includes(q);
        const matchesPhone = (f.participant_phone || "").includes(q);
        const matchesRegId = (f.registration_id || "").toLowerCase().includes(q);

        if (!matchesName && !matchesText && !matchesCity && !matchesCollege && !matchesPhone && !matchesRegId) {
          return false;
        }
      }

      return true;
    });
  }, [feedbackList, searchQuery, ratingFilter, attendanceFilter, starredOnly, starredIds]);

  const handleCopyQuote = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportCsv = () => {
    const params = new URLSearchParams({ export: "csv" });
    window.open(`/api/admin/feedback?${params.toString()}`, "_blank");
  };

  const fiveStarPercentage =
    stats.total_feedback > 0
      ? Math.round((stats.five_star_count / stats.total_feedback) * 100)
      : 100;

  return (
    <div className="min-h-screen bg-[#EAE0D0] bg-parchment-texture text-[#1C1917] p-4 sm:p-8 selection:bg-[#E65100] selection:text-white">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Bar */}
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
                <span className="w-2 h-2 rounded-full bg-[#FFA000] animate-pulse" />
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#E65100] uppercase">
                  PARTICIPANT FEEDBACK &amp; RATINGS
                </span>
              </div>
              <h1 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tight text-[#1C1917]">
                EVENT REVIEWS &amp; 5-STAR RATINGS
              </h1>
              <p className="text-xs text-[#5A4839]">
                Live feedback submitted by attendees directly via their digital ID card passes
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/admin/participants"
              className="px-3.5 py-2 rounded-xl bg-[#F5EBE1] border border-[#1C1917]/15 hover:bg-[#1C1917] hover:text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all text-[#1C1917]"
            >
              <Users className="w-3.5 h-3.5 text-[#E65100]" />
              <span>Participants</span>
            </Link>

            <button
              onClick={handleExportCsv}
              className="px-3.5 py-2 rounded-xl bg-[#FAF4EC] border border-[#1C1917]/15 hover:border-[#E65100] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all text-[#1C1917] cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#5A4839]" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={fetchFeedback}
              disabled={loading}
              className="px-3.5 py-2 rounded-xl bg-[#1C1917] text-white hover:bg-[#2E241E] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#FFA000]" : ""}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Average Rating */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#FAF4EC] to-[#F5EBE1] border-2 border-[#FFA000]/60 shadow-parchment-card space-y-2 relative overflow-hidden">
            <CornerOrnament className="absolute top-2 right-2 text-[#E65100]/20 -scale-x-100" />
            <div className="flex items-center justify-between text-[#5A4839]">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#B45309]">
                AVERAGE RATING
              </span>
              <Star className="w-4 h-4 text-[#FFA000] fill-[#FFA000]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-display font-black text-[#1C1917]">
                {stats.average_rating.toFixed(1)}
              </span>
              <span className="text-sm font-bold text-[#5A4839]">/ 5.0</span>
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-3.5 h-3.5 ${
                    s <= Math.round(stats.average_rating)
                      ? "text-[#FFA000] fill-[#FFA000]"
                      : "text-zinc-300"
                  }`}
                />
              ))}
              <span className="text-[10px] text-[#5A4839] font-medium ml-1">
                ({stats.total_feedback} reviews)
              </span>
            </div>
          </div>

          {/* Total Reviews */}
          <div className="p-5 rounded-2xl bg-[#F5EBE1] border-2 border-[#1C1917]/15 shadow-parchment-card space-y-2 relative overflow-hidden">
            <CornerOrnament className="absolute top-2 right-2 text-[#E65100]/20 -scale-x-100" />
            <div className="flex items-center justify-between text-[#5A4839]">
              <span className="text-[11px] font-black uppercase tracking-wider">TOTAL RESPONSES</span>
              <MessageSquareHeart className="w-4 h-4 text-[#E65100]" />
            </div>
            <div className="text-3xl font-display font-black text-[#1C1917]">
              {stats.total_feedback}
            </div>
            <div className="text-[11px] text-[#5A4839] font-medium">
              Submitted by verified participants
            </div>
          </div>

          {/* 5-Star Delight Ratio */}
          <div className="p-5 rounded-2xl bg-[#F5EBE1] border-2 border-[#1C1917]/15 shadow-parchment-card space-y-2 relative overflow-hidden">
            <CornerOrnament className="absolute top-2 right-2 text-[#E65100]/20 -scale-x-100" />
            <div className="flex items-center justify-between text-[#5A4839]">
              <span className="text-[11px] font-black uppercase tracking-wider">5-STAR RATINGS</span>
              <Sparkles className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-display font-black text-emerald-700">
              {stats.five_star_count}
            </div>
            <div className="text-[11px] text-emerald-800 font-bold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>{fiveStarPercentage}% of total feedback</span>
            </div>
          </div>

          {/* In-Venue Attendee Reviews */}
          <div className="p-5 rounded-2xl bg-[#F5EBE1] border-2 border-[#1C1917]/15 shadow-parchment-card space-y-2 relative overflow-hidden">
            <CornerOrnament className="absolute top-2 right-2 text-[#E65100]/20 -scale-x-100" />
            <div className="flex items-center justify-between text-[#5A4839]">
              <span className="text-[11px] font-black uppercase tracking-wider">ATTENDEE REVIEWS</span>
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-3xl font-display font-black text-blue-700">
              {stats.checked_in_feedback_count}
            </div>
            <div className="text-[11px] text-blue-800 font-medium">
              From checked-in attendees
            </div>
          </div>
        </div>

        {/* Rating Breakdown Strip */}
        <div className="p-4 rounded-2xl bg-[#FAF4EC] border border-[#292524]/15 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="font-bold text-[#1C1917] uppercase tracking-wider text-[11px]">
            Rating Breakdown:
          </span>
          <div className="flex flex-wrap items-center gap-4">
            {[5, 4, 3, 2, 1].map((r) => {
              const count =
                r === 5
                  ? stats.five_star_count
                  : r === 4
                  ? stats.four_star_count
                  : r === 3
                  ? stats.three_star_count
                  : r === 2
                  ? stats.two_star_count
                  : stats.one_star_count;

              return (
                <button
                  key={r}
                  onClick={() => setRatingFilter(ratingFilter === r.toString() ? "all" : r.toString())}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                    ratingFilter === r.toString()
                      ? "bg-[#FFA000] text-black border-[#FFA000] font-black"
                      : "bg-white border-[#292524]/10 hover:border-[#FFA000] text-[#5A4839]"
                  }`}
                >
                  <span className="font-bold">{r}★</span>
                  <span className="px-1.5 py-0.2 rounded-md bg-black/5 font-mono text-[11px]">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 rounded-2xl bg-[#F5EBE1] border-2 border-[#1C1917]/15 shadow-sm space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search Input */}
            <div className="relative lg:col-span-2">
              <Search className="w-4 h-4 text-[#5A4839] absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search feedback text, attendee name, city, phone..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FAF4EC] border border-[#292524]/20 text-xs font-medium text-[#1C1917] focus:outline-none focus:border-[#E65100]"
              />
            </div>

            {/* Rating Filter */}
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-[#FAF4EC] border border-[#292524]/20 text-xs font-bold text-[#1C1917] focus:outline-none"
            >
              <option value="all">Rating: All (1 to 5 Stars)</option>
              <option value="5">Rating: 5 Stars Only ★★★★★</option>
              <option value="4">Rating: 4 Stars Only ★★★★</option>
              <option value="3">Rating: 3 Stars Only ★★★</option>
              <option value="2">Rating: 2 Stars Only ★★</option>
              <option value="1">Rating: 1 Star Only ★</option>
            </select>

            {/* Attendance Filter */}
            <select
              value={attendanceFilter}
              onChange={(e) => setAttendanceFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-[#FAF4EC] border border-[#292524]/20 text-xs font-bold text-[#1C1917] focus:outline-none"
            >
              <option value="all">Audience: All Submissions</option>
              <option value="checked_in">Audience: In Venue Only (✓ Checked In)</option>
              <option value="not_checked_in">Audience: Not Checked In</option>
            </select>
          </div>
        </div>

        {/* Feedback Feed */}
        {loading ? (
          <div className="p-16 rounded-3xl bg-[#F5EBE1] border-2 border-[#1C1917]/15 text-center text-[#5A4839] space-y-3">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#E65100]" />
            <p className="text-xs font-bold uppercase tracking-wider">
              Loading Event Feedback...
            </p>
          </div>
        ) : filteredFeedback.length === 0 ? (
          <div className="p-16 rounded-3xl bg-[#F5EBE1] border-2 border-[#1C1917]/15 text-center text-[#5A4839] space-y-3">
            <MessageSquareHeart className="w-12 h-12 mx-auto text-[#5A4839]/40" />
            <h3 className="font-display font-black text-lg text-[#1C1917] uppercase">
              No Feedback Matches Current Filters
            </h3>
            <p className="text-xs max-w-sm mx-auto">
              Try clearing filters or search terms. As delegates scan their ID card certificates, their reviews will appear here live!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-[#5A4839] px-1">
              <span>
                Showing <strong className="text-[#1C1917]">{filteredFeedback.length}</strong> feedback reviews
              </span>
              <span className="font-mono text-[11px]">Click star to pin for highlights</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredFeedback.map((f) => {
                const isStarred = starredIds.includes(f.id);
                const isCopied = copiedId === f.id;

                return (
                  <div
                    key={f.id}
                    className={`p-5 rounded-3xl border-2 transition-all flex flex-col justify-between space-y-4 shadow-parchment-card ${
                      isStarred
                        ? "bg-amber-50/90 border-[#FFA000] shadow-md"
                        : "bg-[#F5EBE1] border-[#1C1917]/15 hover:border-[#E65100]/40"
                    }`}
                  >
                    {/* Top Bar: Stars + Badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((starVal) => (
                            <Star
                              key={starVal}
                              className={`w-4 h-4 ${
                                starVal <= f.rating
                                  ? "text-[#FFA000] fill-[#FFA000]"
                                  : "text-zinc-300"
                              }`}
                            />
                          ))}
                          <span className="text-xs font-bold text-[#E65100] ml-1">
                            {f.rating}/5 Stars
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                          {f.checked_in ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                              IN VENUE
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-medium bg-zinc-100 text-zinc-600 border border-zinc-200">
                              Registered
                            </span>
                          )}

                          <span className="font-mono text-[9px] font-bold text-[#E65100] px-1.5 py-0.5 rounded bg-[#FAF4EC] border border-[#292524]/10">
                            {f.registration_id}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleCopyQuote(f.id, f.feedback_text)}
                          className="p-2 rounded-xl bg-[#FAF4EC] hover:bg-[#1C1917] hover:text-white text-[#5A4839] border border-[#292524]/15 transition-colors cursor-pointer"
                          title="Copy Feedback Quote"
                        >
                          {isCopied ? (
                            <Check className="w-3.5 h-3.5 text-green-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>

                        <button
                          onClick={() => toggleStar(f.id)}
                          className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                            isStarred
                              ? "bg-[#FFA000] text-black border-[#FFA000]"
                              : "bg-[#FAF4EC] hover:bg-amber-100 text-zinc-400 hover:text-[#FFA000] border-[#292524]/15"
                          }`}
                          title={isStarred ? "Unpin Feedback" : "Pin Feedback"}
                        >
                          <Star className={`w-3.5 h-3.5 ${isStarred ? "fill-black" : ""}`} />
                        </button>
                      </div>
                    </div>

                    {/* Feedback Quote */}
                    <div className="p-4 rounded-2xl bg-white/90 border border-[#292524]/10 shadow-xs">
                      <p className="text-sm font-serif font-medium text-[#1C1917] leading-relaxed italic">
                        &ldquo;{f.feedback_text}&rdquo;
                      </p>
                    </div>

                    {/* Participant Info */}
                    <div className="pt-3 border-t border-[#292524]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div>
                        <div className="font-display font-black text-sm uppercase text-[#1C1917]">
                          {f.participant_name}
                        </div>
                        <div className="text-[11px] text-[#5A4839] flex flex-wrap items-center gap-2 mt-0.5">
                          {f.city && (
                            <span className="flex items-center gap-0.5 font-bold">
                              <MapPin className="w-3 h-3 text-[#E65100]" />
                              {f.city}
                            </span>
                          )}
                          {f.college && (
                            <span className="flex items-center gap-0.5 truncate max-w-[200px]">
                              <GraduationCap className="w-3 h-3 text-[#E65100]" />
                              {f.college}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        {f.participant_phone && (
                          <a
                            href={`tel:${f.participant_phone}`}
                            className="px-2 py-1 rounded-lg bg-[#FAF4EC] border border-[#292524]/15 text-[#1C1917] hover:text-[#E65100] font-mono text-[11px] flex items-center gap-1 transition-colors"
                          >
                            <Phone className="w-3 h-3" />
                            <span>{f.participant_phone}</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
