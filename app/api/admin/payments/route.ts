import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const method = searchParams.get("method") || "";
    const status = searchParams.get("status") || "";
    const search = (searchParams.get("search") || "").trim().toLowerCase();
    const isExport = searchParams.get("export") === "csv";
    const limit = isExport ? 5000 : parseInt(searchParams.get("limit") || "100", 10);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const offset = (page - 1) * limit;

    const supabase = getAdminClient();

    // 1. Fetch live ledger financial aggregates directly from DB
    const { data: allLedger } = await supabase
      .from("payments")
      .select("amount, status, method");

    let totalRevenue = 0;
    let onlineRevenue = 0;
    let cashRevenue = 0;
    let pendingCashAmount = 0;
    let paidCount = 0;
    let pendingCount = 0;

    (allLedger || []).forEach((row) => {
      const amt = Number(row.amount) || 50;
      if (row.status === "paid") {
        totalRevenue += amt;
        paidCount++;
        if (row.method === "online") {
          onlineRevenue += amt;
        } else {
          cashRevenue += amt;
        }
      } else if (row.status === "pending") {
        pendingCount++;
        if (row.method === "cash") {
          pendingCashAmount += amt;
        }
      }
    });

    // 2. Fetch payments with participant information
    let query = supabase
      .from("payments")
      .select(
        `
        id,
        participant_id,
        method,
        amount,
        currency,
        status,
        gateway,
        gateway_order_id,
        gateway_payment_id,
        paid_at,
        created_at,
        notes,
        participants (
          id,
          registration_id,
          name,
          phone,
          city,
          checked_in
        )
      `,
        { count: "exact" }
      );

    if (method && method !== "all") {
      query = query.eq("method", method);
    }

    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    query = query.order("created_at", { ascending: false });

    // If searching, fetch filtered range
    let payments: any[] = [];
    let count = 0;

    if (search) {
      // Fetch larger set to search across joined participant fields safely
      const { data: rawPayments, error } = await query.limit(1000);
      if (error) {
        console.error("Admin payments search error:", error);
        return NextResponse.json({ success: false, error: "Search query error." }, { status: 500 });
      }

      const filtered = (rawPayments || []).filter((p: any) => {
        const name = (p.participants?.name || "").toLowerCase();
        const regId = (p.participants?.registration_id || "").toLowerCase();
        const phone = (p.participants?.phone || "").toLowerCase();
        const city = (p.participants?.city || "").toLowerCase();
        const txnId = (p.gateway_payment_id || "").toLowerCase();
        const notes = (p.notes || "").toLowerCase();

        return (
          name.includes(search) ||
          regId.includes(search) ||
          phone.includes(search) ||
          city.includes(search) ||
          txnId.includes(search) ||
          notes.includes(search)
        );
      });

      count = filtered.length;
      payments = filtered.slice(offset, offset + limit);
    } else {
      query = query.range(offset, offset + limit - 1);
      const res = await query;
      if (res.error) {
        console.error("Admin payments query error:", res.error);
        return NextResponse.json({ success: false, error: "Failed to fetch payments." }, { status: 500 });
      }
      payments = res.data || [];
      count = res.count || 0;
    }

    // 3. Export CSV handler
    if (isExport) {
      const headers = [
        "Payment ID",
        "Date",
        "Registration ID",
        "Participant Name",
        "Phone",
        "City",
        "Method",
        "Amount (INR)",
        "Status",
        "Gateway / Txn ID",
        "Notes",
      ];

      const csvRows = [headers.join(",")];

      payments.forEach((p) => {
        const row = [
          `"${p.id}"`,
          `"${p.paid_at ? new Date(p.paid_at).toLocaleString("en-IN") : new Date(p.created_at).toLocaleString("en-IN")}"`,
          `"${p.participants?.registration_id || ""}"`,
          `"${(p.participants?.name || "").replace(/"/g, '""')}"`,
          `"${p.participants?.phone || ""}"`,
          `"${(p.participants?.city || "").replace(/"/g, '""')}"`,
          `"${p.method}"`,
          p.amount,
          `"${p.status.toUpperCase()}"`,
          `"${(p.gateway_payment_id || p.gateway_order_id || "").replace(/"/g, '""')}"`,
          `"${(p.notes || "").replace(/"/g, '""')}"`,
        ];
        csvRows.push(row.join(","));
      });

      return new NextResponse(csvRows.join("\n"), {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="yss_payments_ledger_${new Date().toISOString().slice(0, 10)}.csv"`,
        },
      });
    }

    return NextResponse.json({
      success: true,
      payments,
      total: count,
      page,
      limit,
      metrics: {
        total_revenue: totalRevenue,
        online_revenue: onlineRevenue,
        cash_revenue: cashRevenue,
        pending_cash_amount: pendingCashAmount,
        paid_count: paidCount,
        pending_count: pendingCount,
        total_records: (allLedger || []).length,
      },
    });
  } catch (error: any) {
    console.error("Payments API error:", error);
    return NextResponse.json({ success: false, error: "Server error fetching payments ledger." }, { status: 500 });
  }
}

/**
 * PATCH endpoint: Updates payment status & updates linked participant in database
 */
export async function PATCH(req: NextRequest) {
  try {
    const { payment_id, status, notes } = await req.json();

    if (!payment_id || !status) {
      return NextResponse.json({ success: false, error: "Payment ID and status required." }, { status: 400 });
    }

    const supabase = getAdminClient();

    // Fetch existing payment
    const { data: payment, error: fetchErr } = await supabase
      .from("payments")
      .select("id, participant_id, status, method")
      .eq("id", payment_id)
      .single();

    if (fetchErr || !payment) {
      return NextResponse.json({ success: false, error: "Payment record not found." }, { status: 404 });
    }

    const updatePayload: any = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (status === "paid") {
      updatePayload.paid_at = new Date().toISOString();
    }
    if (notes !== undefined) {
      updatePayload.notes = notes;
    }

    // 1. Update payments table
    const { data: updatedPayment, error: updateErr } = await supabase
      .from("payments")
      .update(updatePayload)
      .eq("id", payment_id)
      .select()
      .single();

    if (updateErr) {
      console.error("Payment update error:", updateErr);
      return NextResponse.json({ success: false, error: "Failed to update payment." }, { status: 500 });
    }

    // 2. Synchronize linked participant payment_status
    if (payment.participant_id) {
      await supabase
        .from("participants")
        .update({
          payment_status: status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", payment.participant_id);
    }

    return NextResponse.json({
      success: true,
      message: `Payment status updated to ${status}.`,
      payment: updatedPayment,
    });
  } catch (error: any) {
    console.error("Payment PATCH error:", error);
    return NextResponse.json({ success: false, error: "Server error updating payment." }, { status: 500 });
  }
}

/**
 * POST endpoint: Reconciles all participants into the payments ledger
 */
export async function POST(_req: NextRequest) {
  try {
    const supabase = getAdminClient();
    const { data: participants } = await supabase.from("participants").select("*");
    const { data: payments } = await supabase.from("payments").select("participant_id");
    const existingIds = new Set((payments || []).map((p) => p.participant_id));

    const missing = (participants || []).filter((p) => !existingIds.has(p.id));
    let syncedCount = 0;

    for (const p of missing) {
      await supabase.from("payments").insert({
        participant_id: p.id,
        method: p.payment_method || "cash",
        amount: 50,
        currency: "INR",
        status: p.payment_status || "pending",
        gateway: p.payment_method === "online" ? "upi_ocr" : "manual_cash",
        paid_at: p.payment_status === "paid" ? p.updated_at || p.created_at : null,
        created_at: p.created_at,
        notes:
          p.payment_status === "paid"
            ? "Reconciled paid ledger record"
            : "Pending on-ground cash collection at gate",
      });
      syncedCount++;
    }

    return NextResponse.json({
      success: true,
      message: `Ledger synchronized successfully. Reconciled ${syncedCount} records.`,
      synced: syncedCount,
    });
  } catch (error: any) {
    console.error("Ledger sync error:", error);
    return NextResponse.json({ success: false, error: "Failed to synchronize ledger." }, { status: 500 });
  }
}
