import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";

export async function GET(_req: NextRequest) {
  try {
    const supabase = getAdminClient();

    // 1. Fetch live records from participants and payments
    const [participantsRes, paymentsRes] = await Promise.all([
      supabase
        .from("participants")
        .select("id, payment_status, payment_method, checked_in"),
      supabase
        .from("payments")
        .select("amount, status, method"),
    ]);

    if (participantsRes.error) {
      console.error("Participants stats error:", participantsRes.error);
      return NextResponse.json({ success: false, error: "Failed to load participant statistics." }, { status: 500 });
    }

    const participants = participantsRes.data || [];
    const payments = paymentsRes.data || [];

    const total_registered = participants.length;
    const total_paid = participants.filter((p) => p.payment_status === "paid").length;
    const total_pending = participants.filter((p) => p.payment_status !== "paid").length;
    const total_checked_in = participants.filter((p) => p.checked_in === true).length;
    const check_in_percentage =
      total_paid > 0 ? Number(((total_checked_in / total_paid) * 100).toFixed(1)) : 0;

    let online_paid_count = 0;
    let online_revenue = 0;
    let cash_paid_count = 0;
    let cash_revenue = 0;
    let cash_pending_count = 0;
    let pending_cash_amount = 0;

    // Aggregate from payments table
    payments.forEach((p) => {
      const amt = Number(p.amount) || 50;
      if (p.status === "paid") {
        if (p.method === "online") {
          online_paid_count++;
          online_revenue += amt;
        } else {
          cash_paid_count++;
          cash_revenue += amt;
        }
      } else if (p.status === "pending" && p.method === "cash") {
        cash_pending_count++;
        pending_cash_amount += amt;
      }
    });

    // Fallback reconciliation if payments rows were unpopulated
    if (online_paid_count === 0 && online_revenue === 0) {
      online_paid_count = participants.filter(
        (p) => p.payment_status === "paid" && p.payment_method === "online"
      ).length;
      online_revenue = online_paid_count * 50;
    }

    if (cash_paid_count === 0 && cash_revenue === 0) {
      cash_paid_count = participants.filter(
        (p) => p.payment_status === "paid" && p.payment_method === "cash"
      ).length;
      cash_revenue = cash_paid_count * 50;
    }

    if (cash_pending_count === 0 && pending_cash_amount === 0) {
      cash_pending_count = participants.filter(
        (p) => p.payment_status !== "paid" && p.payment_method === "cash"
      ).length;
      pending_cash_amount = cash_pending_count * 50;
    }

    const total_revenue = online_revenue + cash_revenue;

    const stats = {
      total_registered,
      total_paid,
      total_pending,
      total_checked_in,
      check_in_percentage,
      online_paid_count,
      cash_paid_count,
      cash_pending_count,
      online_revenue,
      cash_revenue,
      total_revenue,
      pending_cash_amount,
    };

    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (error: any) {
    console.error("Admin stats error:", error);
    return NextResponse.json({ success: false, error: "Server error fetching stats." }, { status: 500 });
  }
}
