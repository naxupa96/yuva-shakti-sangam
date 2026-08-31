"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Download,
  Filter,
  ArrowLeft,
  CheckCircle2,
  Clock,
  ExternalLink,
  Loader2,
  RefreshCw,
  Eye,
  MessageSquareQuote,
  Copy,
  Check,
  X,
  Phone,
  Mail,
  MapPin,
  GraduationCap,
  Sparkles,
  Tag,
} from "lucide-react";
import { Participant } from "@/types/registration";
import { extractQuestion, extractInterests, extractReferralSource } from "@/lib/participant-helpers";

export default function AdminParticipantsPage() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("all");
  const [paymentMethod, setPaymentMethod] = useState("all");
  const [checkedIn, setCheckedIn] = useState("all");
  const [hasQuestion, setHasQuestion] = useState("all");
  const [page, setPage] = useState(1);

  // Selected participant for detail modal
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [copiedQuestion, setCopiedQuestion] = useState(false);

  const fetchParticipants = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search,
        payment_status: paymentStatus,
        payment_method: paymentMethod,
        checked_in: checkedIn,
        has_question: hasQuestion,
        page: page.toString(),
        limit: "50",
      });

      const res = await fetch(`/api/admin/participants?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setParticipants(data.participants || []);
        setTotalCount(data.total || 0);
      }
    } catch (err) {
      console.error("Participants fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParticipants();
  }, [search, paymentStatus, paymentMethod, checkedIn, hasQuestion, page]);

  const handleExportCsv = () => {
    const params = new URLSearchParams({
      search,
      payment_status: paymentStatus,
      payment_method: paymentMethod,
      checked_in: checkedIn,
      has_question: hasQuestion,
      export: "csv",
    });
    window.open(`/api/admin/participants?${params.toString()}`, "_blank");
  };

  const handleCopyQuestion = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedQuestion(true);
    setTimeout(() => setCopiedQuestion(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#EAE0D0] bg-parchment-texture text-[#1C1917] p-4 sm:p-8 selection:bg-[#E65100] selection:text-white">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="p-2.5 rounded-xl bg-[#F5EBE1] border border-[#1C1917]/15 hover:bg-[#1C1917] hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tight text-[#1C1917]">
                PARTICIPANT DIRECTORY
              </h1>
              <p className="text-xs text-[#5A4839]">
                Total matching: <span className="font-bold text-[#1C1917]">{totalCount} participants</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/questions"
              className="px-4 py-2.5 rounded-xl bg-[#E65100] hover:bg-[#D84315] text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-md transition-all"
            >
              <MessageSquareQuote className="w-4 h-4" />
              <span>SAMVAAD QUESTIONS HUB</span>
            </Link>

            <button
              onClick={handleExportCsv}
              className="px-4 py-2.5 rounded-xl bg-[#1C1917] hover:bg-[#24170D] text-[#FAF4EC] text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#FFA000]" />
              <span>EXPORT AS CSV</span>
            </button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="p-4 rounded-2xl bg-[#F5EBE1] border-2 border-[#1C1917]/15 shadow-sm space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Search Input */}
            <div className="relative lg:col-span-1">
              <Search className="w-4 h-4 text-[#5A4839] absolute left-3 top-3.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search name, ID, phone, question..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#FAF4EC] border border-[#292524]/20 text-xs font-medium text-[#1C1917] focus:outline-none focus:border-[#E65100]"
              />
            </div>

            {/* Questions Filter */}
            <select
              value={hasQuestion}
              onChange={(e) => {
                setHasQuestion(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2.5 rounded-xl bg-[#FAF4EC] border border-[#292524]/20 text-xs font-bold text-[#1C1917] focus:outline-none focus:border-[#E65100]"
            >
              <option value="all">Questions: All</option>
              <option value="true">Questions: Has Question</option>
              <option value="false">Questions: No Question</option>
            </select>

            {/* Payment Status Filter */}
            <select
              value={paymentStatus}
              onChange={(e) => {
                setPaymentStatus(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2.5 rounded-xl bg-[#FAF4EC] border border-[#292524]/20 text-xs font-bold text-[#1C1917] focus:outline-none focus:border-[#E65100]"
            >
              <option value="all">Payment: All Statuses</option>
              <option value="paid">Payment: Paid</option>
              <option value="pending">Payment: Pending</option>
            </select>

            {/* Payment Method Filter */}
            <select
              value={paymentMethod}
              onChange={(e) => {
                setPaymentMethod(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2.5 rounded-xl bg-[#FAF4EC] border border-[#292524]/20 text-xs font-bold text-[#1C1917] focus:outline-none focus:border-[#E65100]"
            >
              <option value="all">Method: All Methods</option>
              <option value="online">Method: Online</option>
              <option value="cash">Method: Cash</option>
            </select>

            {/* Checked In Filter */}
            <select
              value={checkedIn}
              onChange={(e) => {
                setCheckedIn(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2.5 rounded-xl bg-[#FAF4EC] border border-[#292524]/20 text-xs font-bold text-[#1C1917] focus:outline-none focus:border-[#E65100]"
            >
              <option value="all">Attendance: All</option>
              <option value="true">Attendance: Checked In</option>
              <option value="false">Attendance: Not Checked In</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="rounded-2xl bg-[#F5EBE1] border-2 border-[#1C1917]/15 shadow-parchment-deep overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#1C1917] text-[#FAF4EC] font-display font-black uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4">Reg ID</th>
                  <th className="py-3.5 px-4">Participant</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">City / College</th>
                  <th className="py-3.5 px-4">Samvaad Question</th>
                  <th className="py-3.5 px-4">Payment</th>
                  <th className="py-3.5 px-4">Attendance</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#292524]/10 font-medium text-[#1C1917]">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-[#5A4839]">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#E65100]" />
                      Loading participant directory...
                    </td>
                  </tr>
                ) : participants.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-[#5A4839]">
                      No participants found matching the selected filters.
                    </td>
                  </tr>
                ) : (
                  participants.map((p) => {
                    const question = extractQuestion(p);
                    const interests = extractInterests(p);

                    return (
                      <tr
                        key={p.id}
                        className="hover:bg-[#FAF4EC] transition-colors cursor-pointer"
                        onClick={() => setSelectedParticipant(p)}
                      >
                        <td className="py-3 px-4 font-mono font-bold text-[#E65100] whitespace-nowrap">
                          {p.registration_id}
                        </td>
                        <td className="py-3 px-4 font-bold uppercase whitespace-nowrap">
                          {p.name}
                          <span className="text-[10px] font-normal block text-[#5A4839]">
                            {p.age} yrs
                          </span>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="font-mono text-xs block">{p.phone}</span>
                          {p.email && (
                            <span className="text-[10px] text-[#5A4839] block max-w-[140px] truncate">
                              {p.email}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 max-w-[180px] truncate">
                          <span className="block font-bold">{p.city}</span>
                          {p.college && (
                            <span className="text-[10px] text-[#5A4839] block truncate">
                              {p.college}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 max-w-[240px]">
                          {question ? (
                            <div className="space-y-1">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300">
                                <MessageSquareQuote className="w-3 h-3 text-[#E65100]" />
                                QUESTION
                              </span>
                              <p className="text-[11px] text-[#1C1917] line-clamp-2 italic">
                                &ldquo;{question}&rdquo;
                              </p>
                            </div>
                          ) : (
                            <span className="text-zinc-400 text-[11px]">—</span>
                          )}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="space-y-0.5">
                            {p.payment_status === "paid" ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-green-100 text-green-800">
                                <CheckCircle2 className="w-3 h-3" />
                                PAID
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-800">
                                <Clock className="w-3 h-3" />
                                PENDING
                              </span>
                            )}
                            <span className="text-[9px] uppercase font-bold text-[#5A4839] block">
                              {p.payment_method}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          {p.checked_in ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800">
                              ✓ CHECKED IN
                            </span>
                          ) : (
                            <span className="text-zinc-500 text-[11px]">No</span>
                          )}
                        </td>
                        <td
                          className="py-3 px-4 text-right whitespace-nowrap"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedParticipant(p)}
                              className="p-1.5 rounded-lg bg-[#FAF4EC] hover:bg-[#1C1917] hover:text-[#FFA000] text-[#1C1917] border border-[#292524]/20 transition-colors"
                              title="View Participant & Question Details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            <Link
                              href={`/ticket/${p.qr_token}`}
                              target="_blank"
                              className="p-1.5 rounded-lg bg-[#1C1917] text-[#FAF4EC] hover:text-[#FFA000] text-[11px] font-bold"
                              title="View Digital Ticket"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Pagination Footer */}
          <div className="p-4 bg-[#FAF4EC] border-t border-[#1C1917]/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#5A4839]">
            <div>
              Showing <span className="font-bold text-[#1C1917]">{participants.length}</span> of{" "}
              <span className="font-bold text-[#1C1917]">{totalCount}</span> participants
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
                disabled={participants.length < 50 || loading}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 rounded-lg bg-[#F5EBE1] border border-[#292524]/20 text-[11px] font-bold uppercase tracking-wider text-[#1C1917] disabled:opacity-40 cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Participant & Question Details Modal */}
      {selectedParticipant && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-2xl w-full my-8 bg-[#FAF4EC] border-2 border-[#1C1917]/20 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-6 bg-[#1C1917] text-[#FAF4EC] flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#FFA000]">
                  PARTICIPANT PROFILE & INQUIRY
                </span>
                <h2 className="text-xl sm:text-2xl font-display font-black uppercase tracking-tight text-white mt-0.5">
                  {selectedParticipant.name}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-mono text-xs text-[#FFA000] font-bold">
                    {selectedParticipant.registration_id}
                  </span>
                  <span className="text-white/40">•</span>
                  <span className="text-xs text-white/70">{selectedParticipant.age} Years Old</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedParticipant(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 text-xs text-[#1C1917] max-h-[75vh] overflow-y-auto">
              {/* Question Highlight Section */}
              {extractQuestion(selectedParticipant) ? (
                <div className="p-5 rounded-2xl bg-amber-50 border-2 border-amber-300 shadow-sm space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-[#E65100] text-white flex items-center justify-center">
                        <MessageSquareQuote className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono font-black uppercase tracking-wider text-[#E65100] block">
                          YOUTH SAMVAAD QUESTION
                        </span>
                        <span className="text-xs font-bold text-[#1C1917]">
                          Submitted for open discussion / panel
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleCopyQuestion(extractQuestion(selectedParticipant))}
                      className="px-3 py-1.5 rounded-lg bg-amber-200 hover:bg-amber-300 text-amber-900 font-bold text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {copiedQuestion ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-green-700" />
                          <span className="text-green-800">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  <blockquote className="text-sm font-medium text-[#1C1917] bg-white/80 p-4 rounded-xl border border-amber-200/80 leading-relaxed italic">
                    &ldquo;{extractQuestion(selectedParticipant)}&rdquo;
                  </blockquote>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-[#F5EBE1] border border-[#292524]/10 text-center text-[#5A4839]">
                  <p className="text-xs font-medium">No open-mic question was submitted during registration.</p>
                </div>
              )}

              {/* Areas of Interest */}
              {extractInterests(selectedParticipant).length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#5A4839] flex items-center gap-1">
                    <Tag className="w-3 h-3 text-[#E65100]" />
                    AREAS OF INTEREST
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {extractInterests(selectedParticipant).map((interest, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-[#EAE0D0] border border-[#292524]/15 text-[11px] font-bold text-[#1C1917]"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact & Demographics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-[#F5EBE1] border border-[#292524]/10 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-[#5A4839] flex items-center gap-1">
                    <Phone className="w-3 h-3 text-[#E65100]" /> Mobile Phone
                  </span>
                  <a
                    href={`tel:${selectedParticipant.phone}`}
                    className="font-mono font-bold text-sm text-[#1C1917] hover:text-[#E65100] block"
                  >
                    +91 {selectedParticipant.phone}
                  </a>
                </div>

                <div className="p-3.5 rounded-xl bg-[#F5EBE1] border border-[#292524]/10 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-[#5A4839] flex items-center gap-1">
                    <Mail className="w-3 h-3 text-[#E65100]" /> Email Address
                  </span>
                  {selectedParticipant.email ? (
                    <a
                      href={`mailto:${selectedParticipant.email}`}
                      className="font-medium text-xs text-[#1C1917] hover:text-[#E65100] truncate block"
                    >
                      {selectedParticipant.email}
                    </a>
                  ) : (
                    <span className="text-zinc-400">Not provided</span>
                  )}
                </div>

                <div className="p-3.5 rounded-xl bg-[#F5EBE1] border border-[#292524]/10 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-[#5A4839] flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#E65100]" /> City / Location
                  </span>
                  <span className="font-bold text-xs text-[#1C1917] block">
                    {selectedParticipant.city}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#F5EBE1] border border-[#292524]/10 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-[#5A4839] flex items-center gap-1">
                    <GraduationCap className="w-3 h-3 text-[#E65100]" /> College / Organization
                  </span>
                  <span className="font-medium text-xs text-[#1C1917] block truncate">
                    {selectedParticipant.college || "—"}
                  </span>
                </div>
              </div>

              {/* Status & Entry Info */}
              <div className="p-4 rounded-2xl bg-[#F5EBE1] border border-[#292524]/15 space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#5A4839] block">
                      Payment Status
                    </span>
                    {selectedParticipant.payment_status === "paid" ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-green-100 text-green-800 mt-1">
                        <CheckCircle2 className="w-3 h-3" /> PAID (₹50)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-800 mt-1">
                        <Clock className="w-3 h-3" /> PENDING CASH
                      </span>
                    )}
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#5A4839] block">
                      Method
                    </span>
                    <span className="font-bold text-xs uppercase block mt-1">
                      {selectedParticipant.payment_method}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#5A4839] block">
                      Gate Attendance
                    </span>
                    {selectedParticipant.checked_in ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 mt-1">
                        ✓ CHECKED IN
                      </span>
                    ) : (
                      <span className="text-zinc-500 font-medium block mt-1">Not Checked In</span>
                    )}
                  </div>
                </div>

                {extractReferralSource(selectedParticipant) && (
                  <div className="pt-2 border-t border-[#292524]/10">
                    <span className="text-[10px] uppercase font-bold text-[#5A4839] block">
                      How they heard about Yuva Shakti Sangam
                    </span>
                    <span className="text-xs font-medium text-[#1C1917] mt-0.5 block">
                      {extractReferralSource(selectedParticipant)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-[#F5EBE1] border-t border-[#292524]/15 flex items-center justify-between gap-3">
              <Link
                href={`/ticket/${selectedParticipant.qr_token}`}
                target="_blank"
                className="px-4 py-2 rounded-xl bg-[#1C1917] text-[#FAF4EC] hover:text-[#FFA000] text-xs font-black uppercase tracking-wider inline-flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>View Digital Pass</span>
              </Link>

              <button
                onClick={() => setSelectedParticipant(null)}
                className="px-4 py-2 rounded-xl bg-zinc-200 hover:bg-zinc-300 text-zinc-800 text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

