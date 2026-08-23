import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const paymentStatus = searchParams.get("payment_status") || "";
    const paymentMethod = searchParams.get("payment_method") || "";
    const checkedIn = searchParams.get("checked_in") || "";
    const isExport = searchParams.get("export") === "csv";
    const limit = isExport ? 5000 : parseInt(searchParams.get("limit") || "100", 10);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const offset = (page - 1) * limit;

    const supabase = getAdminClient();

    let query = supabase
      .from("participants")
      .select("*", { count: "exact" });

    if (search.trim()) {
      const q = search.trim();
      query = query.or(`name.ilike.%${q}%,registration_id.ilike.%${q}%,phone.ilike.%${q}%,city.ilike.%${q}%,college.ilike.%${q}%`);
    }

    if (paymentStatus && paymentStatus !== "all") {
      query = query.eq("payment_status", paymentStatus);
    }

    if (paymentMethod && paymentMethod !== "all") {
      query = query.eq("payment_method", paymentMethod);
    }

    if (checkedIn === "true") {
      query = query.eq("checked_in", true);
    } else if (checkedIn === "false") {
      query = query.eq("checked_in", false);
    }

    query = query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    const { data: participants, error, count } = await query;

    if (error) {
      console.error("Admin participants query error:", error);
      return NextResponse.json({ success: false, error: "Failed to fetch participants." }, { status: 500 });
    }

    // If CSV export requested:
    if (isExport) {
      const headers = [
        "Registration ID",
        "Full Name",
        "Mobile Number",
        "Email",
        "Age",
        "City",
        "College / Org",
        "Payment Method",
        "Payment Status",
        "Amount (INR)",
        "Checked In",
        "Check-in Time",
        "Registered At",
      ];

      const rows = (participants || []).map((p) => [
        `"${p.registration_id}"`,
        `"${(p.name || "").replace(/"/g, '""')}"`,
        `"${p.phone}"`,
        `"${p.email || ""}"`,
        p.age,
        `"${(p.city || "").replace(/"/g, '""')}"`,
        `"${(p.college || "").replace(/"/g, '""')}"`,
        `"${p.payment_method.toUpperCase()}"`,
        `"${p.payment_status.toUpperCase()}"`,
        p.payment_status === "paid" ? 50 : 0,
        p.checked_in ? "YES" : "NO",
        `"${p.check_in_time ? new Date(p.check_in_time).toLocaleString("en-IN") : ""}"`,
        `"${new Date(p.created_at).toLocaleString("en-IN")}"`,
      ]);

      const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

      return new NextResponse(csvContent, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="Yuva-Shakti-Sangam-Participants-${new Date().toISOString().slice(0, 10)}.csv"`,
        },
      });
    }

    return NextResponse.json({
      success: true,
      participants,
      total: count,
      page,
      limit,
    });
  } catch (error: any) {
    console.error("Participants API error:", error);
    return NextResponse.json({ success: false, error: "Server error." }, { status: 500 });
  }
}
