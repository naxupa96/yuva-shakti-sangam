"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  MessageSquareQuote,
  Search,
  Download,
  Filter,
  ArrowLeft,
  CheckCircle2,
  Clock,
  ExternalLink,
  Loader2,
  RefreshCw,
  Star,
  Copy,
  Check,
  Users,
  MapPin,
  GraduationCap,
  Phone,
  Tag,
  Sparkles,
  Share2,
} from "lucide-react";
import { Participant } from "@/types/registration";
import { extractQuestion, extractInterests, extractReferralSource } from "@/lib/participant-helpers";
import { CornerOrnament } from "@/components/Decorations";

export default function AdminQuestionsPage() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [attendanceFilter, setAttendanceFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [interestFilter, setInterestFilter] = useState("all");
  const [starredOnly, setStarredOnly] = useState(false);
  const [starredIds, setStarredIds] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Load starred questions from local storage for moderator workflow
  useEffect(() => {
    try {
      const saved = localStorage.getItem("yss_starred_questions");
      if (saved) {
        setStarredIds(JSON.parse(saved));
      }
    } catch (e) {
      console.warn("Could not load starred questions:", e);
    }
  }, []);

  const toggleStar = (id: string) => {
    setStarredIds((prev) => {
      const next = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
      try {
        localStorage.setItem("yss_starred_questions", JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      // Fetch all participants with questions
      const params = new URLSearchParams({
        has_question: "true",
        limit: "1000",
      });

      const res = await fetch(`/api/admin/participants?${params.toString()}`);
      const data = await res.json();

      if (data.success && Array.isArray(data.participants)) {
        setParticipants(data.participants);
      }
    } catch (err) {
      console.error("Failed to load questions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  // Compute list of all unique interests present in questions
  const availableInterests = useMemo(() => {
    const set = new Set<string>();
    participants.forEach((p) => {
      const ints = extractInterests(p);
      ints.forEach((i) => set.add(i));
    });
    return Array.from(set).sort();
  }, [participants]);

  // Filter questions based on search and controls
  const filteredQuestions = useMemo(() => {
    return participants.filter((p) => {
      const question = extractQuestion(p);
      if (!question) return false;

      // Starred filter
      if (starredOnly && !starredIds.includes(p.id)) return false;

      // Attendance filter
      if (attendanceFilter === "checked_in" && !p.checked_in) return false;
      if (attendanceFilter === "not_checked_in" && p.checked_in) return false;

      // Payment filter
      if (paymentFilter === "paid" && p.payment_status !== "paid") return false;
      if (paymentFilter === "pending" && p.payment_status === "paid") return false;

      // Interest filter
      if (interestFilter !== "all") {
        const ints = extractInterests(p);
        if (!ints.includes(interestFilter)) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesQuestion = question.toLowerCase().includes(q);
        const matchesName = (p.name || "").toLowerCase().includes(q);
        const matchesCity = (p.city || "").toLowerCase().includes(q);
        const matchesCollege = (p.college || "").toLowerCase().includes(q);
        const matchesPhone = (p.phone || "").includes(q);
        const matchesRegId = (p.registration_id || "").toLowerCase().includes(q);

        if (!matchesQuestion && !matchesName && !matchesCity && !matchesCollege && !matchesPhone && !matchesRegId) {
          return false;
        }
      }

      return true;
    });
  }, [participants, searchQuery, attendanceFilter, paymentFilter, interestFilter, starredOnly, starredIds]);

  const handleCopyQuestion = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportCsv = () => {
    const params = new URLSearchParams({
      has_question: "true",
      export: "csv",
    });
    window.open(`/api/admin/participants?${params.toString()}`, "_blank");
  };

  // Metrics
  const totalQuestions = participants.length;
  const checkedInQuestions = participants.filter((p) => p.checked_in).length;
  const starredQuestionsCount = participants.filter((p) => starredIds.includes(p.id)).length;
  const paidQuestionsCount = participants.filter((p) => p.payment_status === "paid").length;

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
                <span className="w-2 h-2 rounded-full bg-[#E65100] animate-pulse" />
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#E65100] uppercase">
                  OPEN MIC & PANEL MODERATOR HUB
                </span>
              </div>
              <h1 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tight text-[#1C1917]">
                YOUTH SAMVAAD QUESTIONS
              </h1>
              <p className="text-xs text-[#5A4839]">
                Live attendee inquiries and dialogue topics for the 06 September Youth Sangam
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/admin/participants"
              className="px-3.5 py-2 rounded-xl bg-[#F5EBE1] border border-[#1C1917]/15 hover:bg-[#1C1917] hover:text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all text-[#1C1917]"
            >
              <Users className="w-3.5 h-3.5 text-[#E65100]" />
              <span>Participant List</span>
            </Link>

            <button
              onClick={handleExportCsv}
              className="px-3.5 py-2 rounded-xl bg-[#FAF4EC] border border-[#1C1917]/15 hover:border-[#E65100] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all text-[#1C1917] cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#5A4839]" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={fetchQuestions}
              disabled={loading}
              className="px-3.5 py-2 rounded-xl bg-[#1C1917] text-white hover:bg-[#2E241E] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#FFA000]" : ""}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Metric Overview Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[#F5EBE1] border-2 border-[#1C1917]/15 shadow-parchment-card space-y-2 relative overflow-hidden">
            <CornerOrnament className="absolute top-2 right-2 text-[#E65100]/20 -scale-x-100" />
            <div className="flex items-center justify-between text-[#5A4839]">
              <span className="text-[11px] font-black uppercase tracking-wider">TOTAL SUBMISSIONS</span>
              <MessageSquareQuote className="w-4 h-4 text-[#E65100]" />
            </div>
            <div className="text-3xl font-display font-black text-[#1C1917]">
              {totalQuestions}
            </div>
            <div className="text-[11px] text-[#5A4839] font-medium">
              Questions from registered youth
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#F5EBE1] border-2 border-[#1C1917]/15 shadow-parchment-card space-y-2 relative overflow-hidden">
            <CornerOrnament className="absolute top-2 right-2 text-[#E65100]/20 -scale-x-100" />
            <div className="flex items-center justify-between text-[#5A4839]">
              <span className="text-[11px] font-black uppercase tracking-wider">IN VENUE (LIVE)</span>
              <CheckCircle2 className="w-4 h-4 text-green-600" />
            </div>
            <div className="text-3xl font-display font-black text-green-700">
              {checkedInQuestions}
            </div>
            <div className="text-[11px] text-green-800 font-bold">
              Checked-in & seated in auditorium
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#F5EBE1] border-2 border-[#1C1917]/15 shadow-parchment-card space-y-2 relative overflow-hidden">
            <CornerOrnament className="absolute top-2 right-2 text-[#E65100]/20 -scale-x-100" />
            <div className="flex items-center justify-between text-[#5A4839]">
              <span className="text-[11px] font-black uppercase tracking-wider">SHORTLISTED</span>
              <Star className="w-4 h-4 text-[#FFA000] fill-[#FFA000]" />
            </div>
            <div className="text-3xl font-display font-black text-[#FFA000]">
              {starredQuestionsCount}
            </div>
            <div className="text-[11px] text-[#5A4839] font-medium">
              Starred for stage moderation
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#F5EBE1] border-2 border-[#1C1917]/15 shadow-parchment-card space-y-2 relative overflow-hidden">
            <CornerOrnament className="absolute top-2 right-2 text-[#E65100]/20 -scale-x-100" />
            <div className="flex items-center justify-between text-[#5A4839]">
              <span className="text-[11px] font-black uppercase tracking-wider">PAID & VERIFIED</span>
              <Sparkles className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-3xl font-display font-black text-blue-700">
              {paidQuestionsCount}
            </div>
            <div className="text-[11px] text-blue-800 font-medium">
              Verified registrations
            </div>
          </div>
        </div>

        {/* Search and Filters Bar */}
        <div className="p-4 rounded-2xl bg-[#F5EBE1] border-2 border-[#1C1917]/15 shadow-sm space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Search Input */}
            <div className="relative lg:col-span-2">
              <Search className="w-4 h-4 text-[#5A4839] absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search question keyword, speaker name, city, college..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FAF4EC] border border-[#292524]/20 text-xs font-medium text-[#1C1917] focus:outline-none focus:border-[#E65100]"
              />
            </div>

            {/* Attendance Filter */}
            <select
              value={attendanceFilter}
              onChange={(e) => setAttendanceFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-[#FAF4EC] border border-[#292524]/20 text-xs font-bold text-[#1C1917] focus:outline-none"
            >
              <option value="all">Audience: All Registrations</option>
              <option value="checked_in">Audience: In Venue Only (✓ Checked In)</option>
              <option value="not_checked_in">Audience: Not Yet Checked In</option>
            </select>

            {/* Topic Filter */}
            <select
              value={interestFilter}
              onChange={(e) => setInterestFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-[#FAF4EC] border border-[#292524]/20 text-xs font-bold text-[#1C1917] focus:outline-none"
            >
              <option value="all">Topic: All Interests</option>
              {availableInterests.map((interest) => (
                <option key={interest} value={interest}>
                  Topic: {interest}
                </option>
              ))}
            </select>

            {/* Starred Filter Button */}
            <button
              onClick={() => setStarredOnly(!starredOnly)}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all border ${
                starredOnly
                  ? "bg-[#FFA000] text-black border-[#FFA000] shadow-sm"
                  : "bg-[#FAF4EC] text-[#1C1917] border-[#292524]/20 hover:border-[#FFA000]"
              }`}
            >
              <Star className={`w-4 h-4 ${starredOnly ? "fill-black" : "text-[#FFA000]"}`} />
              <span>{starredOnly ? "Showing Starred" : "Starred Only"}</span>
            </button>
          </div>
        </div>

        {/* Questions Feed */}
        {loading ? (
          <div className="p-16 rounded-3xl bg-[#F5EBE1] border-2 border-[#1C1917]/15 text-center text-[#5A4839] space-y-3">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#E65100]" />
            <p className="text-xs font-bold uppercase tracking-wider">
              Loading Youth Samvaad Questions...
            </p>
          </div>
        ) : filteredQuestions.length === 0 ? (
          <div className="p-16 rounded-3xl bg-[#F5EBE1] border-2 border-[#1C1917]/15 text-center text-[#5A4839] space-y-3">
            <MessageSquareQuote className="w-12 h-12 mx-auto text-[#5A4839]/40" />
            <h3 className="font-display font-black text-lg text-[#1C1917] uppercase">
              No Questions Match Current Filters
            </h3>
            <p className="text-xs max-w-sm mx-auto">
              Try adjusting your search query, audience attendance filter, or topic selections.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-[#5A4839] px-1">
              <span>
                Showing <strong className="text-[#1C1917]">{filteredQuestions.length}</strong> questions
              </span>
              <span className="font-mono text-[11px]">Click star to shortlist for onstage panel</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredQuestions.map((p) => {
                const question = extractQuestion(p);
                const interests = extractInterests(p);
                const isStarred = starredIds.includes(p.id);
                const isCopied = copiedId === p.id;

                return (
                  <div
                    key={p.id}
                    className={`p-5 rounded-3xl border-2 transition-all flex flex-col justify-between space-y-4 shadow-parchment-card ${
                      isStarred
                        ? "bg-amber-50/90 border-[#FFA000] shadow-md"
                        : "bg-[#F5EBE1] border-[#1C1917]/15 hover:border-[#E65100]/40"
                    }`}
                  >
                    {/* Top: Star Button & Attendee Badges */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {p.checked_in ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            ✓ IN VENUE
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-zinc-100 text-zinc-600 border border-zinc-200">
                            Registered
                          </span>
                        )}

                        {p.payment_status === "paid" ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-green-50 text-green-700 border border-green-200">
                            PAID
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-50 text-amber-700 border border-amber-200">
                            PENDING
                          </span>
                        )}

                        <span className="font-mono text-[10px] font-bold text-[#E65100] px-2 py-0.5 rounded-md bg-[#FAF4EC] border border-[#292524]/10">
                          {p.registration_id}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleCopyQuestion(p.id, question)}
                          className="p-2 rounded-xl bg-[#FAF4EC] hover:bg-[#1C1917] hover:text-white text-[#5A4839] border border-[#292524]/15 transition-colors cursor-pointer"
                          title="Copy Question"
                        >
                          {isCopied ? (
                            <Check className="w-3.5 h-3.5 text-green-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>

                        <button
                          onClick={() => toggleStar(p.id)}
                          className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                            isStarred
                              ? "bg-[#FFA000] text-black border-[#FFA000]"
                              : "bg-[#FAF4EC] hover:bg-amber-100 text-zinc-400 hover:text-[#FFA000] border-[#292524]/15"
                          }`}
                          title={isStarred ? "Unstar Question" : "Star / Shortlist for Panel"}
                        >
                          <Star className={`w-3.5 h-3.5 ${isStarred ? "fill-black" : ""}`} />
                        </button>
                      </div>
                    </div>

                    {/* Question Content */}
                    <div className="p-4 rounded-2xl bg-white/90 border border-[#292524]/10 shadow-xs">
                      <p className="text-sm sm:text-base font-serif font-medium text-[#1C1917] leading-relaxed italic">
                        &ldquo;{question}&rdquo;
                      </p>
                    </div>

                    {/* Interested Areas Tags */}
                    {interests.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {interests.map((int, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md bg-[#FAF4EC] border border-[#292524]/15 text-[10px] font-bold text-[#5A4839]"
                          >
                            #{int}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Attendee Profile Info */}
                    <div className="pt-3 border-t border-[#292524]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div>
                        <div className="font-display font-black text-sm uppercase text-[#1C1917]">
                          {p.name}
                          <span className="text-[11px] font-normal text-[#5A4839] normal-case ml-1.5">
                            ({p.age} yrs)
                          </span>
                        </div>
                        <div className="text-[11px] text-[#5A4839] flex flex-wrap items-center gap-2 mt-0.5">
                          <span className="flex items-center gap-0.5 font-bold">
                            <MapPin className="w-3 h-3 text-[#E65100]" />
                            {p.city}
                          </span>
                          {p.college && (
                            <span className="flex items-center gap-0.5 truncate max-w-[200px]">
                              <GraduationCap className="w-3 h-3 text-[#E65100]" />
                              {p.college}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <a
                          href={`tel:${p.phone}`}
                          className="px-2.5 py-1.5 rounded-lg bg-[#FAF4EC] border border-[#292524]/15 text-[#1C1917] hover:text-[#E65100] font-mono font-bold text-[11px] flex items-center gap-1 transition-colors"
                        >
                          <Phone className="w-3 h-3" />
                          <span>+91 {p.phone}</span>
                        </a>

                        <Link
                          href={`/ticket/${p.qr_token}`}
                          target="_blank"
                          className="p-1.5 rounded-lg bg-[#1C1917] text-[#FAF4EC] hover:text-[#FFA000] transition-colors"
                          title="View Digital Pass"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
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
