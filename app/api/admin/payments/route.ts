import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const method = searchParams.get("method") || "";
    const status = searchParams.get("status") || "";
    const limit = parseInt(searchParams.get("limit") || "100", 10);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const offset = (page - 1) * limit;

    const supabase = getAdminClient();

    let query = supabase
      .from("payments")
      .select(`
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
          registration_id,
          name,
          phone,
          city
        )
      `, { count: "exact" });

    if (method && method !== "all") {
      query = query.eq("method", method);
    }

    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    query = query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    const { data: payments, error, count } = await query;

    if (error) {
      console.error("Admin payments query error:", error);
      return NextResponse.json({ success: false, error: "Failed to fetch payments." }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      payments,
      total: count,
      page,
      limit,
    });
  } catch (error: any) {
    console.error("Payments API error:", error);
    return NextResponse.json({ success: false, error: "Server error." }, { status: 500 });
  }
}
