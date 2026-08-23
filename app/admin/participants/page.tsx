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
} from "lucide-react";
import { Participant } from "@/types/registration";

export default function AdminParticipantsPage() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("all");
  const [paymentMethod, setPaymentMethod] = useState("all");
  const [checkedIn, setCheckedIn] = useState("all");
  const [page, setPage] = useState(1);

  const fetchParticipants = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search,
        payment_status: paymentStatus,
        payment_method: paymentMethod,
        checked_in: checkedIn,
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
  }, [search, paymentStatus, paymentMethod, checkedIn, page]);

  const handleExportCsv = () => {
    const params = new URLSearchParams({
      search,
      payment_status: paymentStatus,
      payment_method: paymentMethod,
      checked_in: checkedIn,
      export: "csv",
    });
    window.open(`/api/admin/participants?${params.toString()}`, "_blank");
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
                Total registered: <span className="font-bold text-[#1C1917]">{totalCount} participants</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCsv}
              className="px-4 py-2.5 rounded-xl bg-[#1C1917] hover:bg-[#24170D] text-[#FAF4EC] text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-md"
            >
              <Download className="w-4 h-4 text-[#FFA000]" />
              <span>EXPORT AS CSV</span>
            </button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="p-4 rounded-2xl bg-[#F5EBE1] border-2 border-[#1C1917]/15 shadow-sm space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-[#5A4839] absolute left-3 top-3.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search name, ID, phone..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#FAF4EC] border border-[#292524]/20 text-xs font-medium text-[#1C1917] focus:outline-none focus:border-[#E65100]"
              />
            </div>

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
                  <th className="py-3.5 px-4">Name</th>
                  <th className="py-3.5 px-4">Phone</th>
                  <th className="py-3.5 px-4">City / College</th>
                  <th className="py-3.5 px-4">Method</th>
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
                  participants.map((p) => (
                    <tr key={p.id} className="hover:bg-[#FAF4EC] transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-[#E65100] whitespace-nowrap">
                        {p.registration_id}
                      </td>
                      <td className="py-3 px-4 font-bold uppercase whitespace-nowrap">
                        {p.name}
                        <span className="text-[10px] font-normal block text-[#5A4839]">{p.age} yrs</span>
                      </td>
                      <td className="py-3 px-4 font-mono whitespace-nowrap">
                        {p.phone}
                      </td>
                      <td className="py-3 px-4 max-w-[200px] truncate">
                        <span className="block font-bold">{p.city}</span>
                        {p.college && <span className="text-[10px] text-[#5A4839] block truncate">{p.college}</span>}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap uppercase font-bold text-[10px]">
                        {p.payment_method}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
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
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <Link
                          href={`/ticket/${p.qr_token}`}
                          target="_blank"
                          className="inline-flex items-center gap-1 p-1.5 rounded-lg bg-[#1C1917] text-[#FAF4EC] hover:text-[#FFA000] text-[11px] font-bold"
                          title="View Digital Ticket"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
