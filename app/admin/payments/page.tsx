"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  CreditCard,
  Banknote,
  Search,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Loader2,
  Calendar,
} from "lucide-react";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [method, setMethod] = useState("all");
  const [status, setStatus] = useState("all");

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        method,
        status,
        limit: "100",
      });

      const res = await fetch(`/api/admin/payments?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setPayments(data.payments || []);
        setTotalCount(data.total || 0);
      }
    } catch (err) {
      console.error("Payments fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [method, status]);

  return (
    <div className="min-h-screen bg-[#EAE0D0] bg-parchment-texture text-[#1C1917] p-4 sm:p-8 selection:bg-[#E65100] selection:text-white">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="p-2.5 rounded-xl bg-[#F5EBE1] border border-[#1C1917]/15 hover:bg-[#1C1917] hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tight text-[#1C1917]">
                PAYMENTS & REVENUE LEDGER
              </h1>
              <p className="text-xs text-[#5A4839]">
                Total records: <span className="font-bold text-[#1C1917]">{totalCount}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Filter bar */}
        <div className="p-4 rounded-2xl bg-[#F5EBE1] border-2 border-[#1C1917]/15 flex flex-wrap gap-3">
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#FAF4EC] border border-[#292524]/20 text-xs font-bold text-[#1C1917]"
          >
            <option value="all">All Methods</option>
            <option value="online">Online Payments</option>
            <option value="cash">Cash Collections</option>
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#FAF4EC] border border-[#292524]/20 text-xs font-bold text-[#1C1917]"
          >
            <option value="all">All Statuses</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        {/* Payments Table */}
        <div className="rounded-2xl bg-[#F5EBE1] border-2 border-[#1C1917]/15 shadow-parchment-deep overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#1C1917] text-[#FAF4EC] font-display font-black uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4">Date / Time</th>
                  <th className="py-3.5 px-4">Participant</th>
                  <th className="py-3.5 px-4">Reg ID</th>
                  <th className="py-3.5 px-4">Method</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Gateway / Txn ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#292524]/10 font-medium text-[#1C1917]">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-[#5A4839]">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#E65100]" />
                      Loading payments ledger...
                    </td>
                  </tr>
                ) : payments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-[#5A4839]">
                      No payments found.
                    </td>
                  </tr>
                ) : (
                  payments.map((p) => (
                    <tr key={p.id} className="hover:bg-[#FAF4EC] transition-colors">
                      <td className="py-3 px-4 font-mono text-[11px] text-[#5A4839] whitespace-nowrap">
                        {p.paid_at
                          ? new Date(p.paid_at).toLocaleString("en-IN")
                          : new Date(p.created_at).toLocaleString("en-IN")}
                      </td>
                      <td className="py-3 px-4 font-bold uppercase whitespace-nowrap">
                        {p.participants?.name || "Participant"}
                      </td>
                      <td className="py-3 px-4 font-mono text-[#E65100] font-bold whitespace-nowrap">
                        {p.participants?.registration_id || "—"}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap uppercase font-bold text-[10px]">
                        <span className="inline-flex items-center gap-1.5">
                          {p.method === "online" ? (
                            <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                          ) : (
                            <Banknote className="w-3.5 h-3.5 text-amber-600" />
                          )}
                          {p.method}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-display font-black text-sm text-[#1C1917] whitespace-nowrap">
                        ₹{p.amount}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {p.status === "paid" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-green-100 text-green-800">
                            <CheckCircle2 className="w-3 h-3" />
                            PAID
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-800">
                            <Clock className="w-3 h-3" />
                            PENDING
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono text-[10px] text-[#5A4839] max-w-[180px] truncate">
                        {p.gateway_payment_id || p.gateway_order_id || p.notes || "—"}
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
