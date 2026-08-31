import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";
import {
  extractQuestion,
  extractInterests,
  extractReferralSource,
} from "@/lib/participant-helpers";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = (searchParams.get("search") || "").trim().toLowerCase();
    const paymentStatus = searchParams.get("payment_status") || "";
    const paymentMethod = searchParams.get("payment_method") || "";
    const checkedIn = searchParams.get("checked_in") || "";
    const hasQuestion = searchParams.get("has_question") || "";
    const isExport = searchParams.get("export") === "csv";
    const limit = isExport ? 5000 : parseInt(searchParams.get("limit") || "100", 10);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const offset = (page - 1) * limit;

    const supabase = getAdminClient();

    let query = supabase
      .from("participants")
      .select("*", { count: "exact" });

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

    query = query.order("created_at", { ascending: false });

    // When searching or filtering by question (which might be in referral_source or samvaad_question column),
    // fetch records and filter in-memory with high fidelity
    if (search || hasQuestion === "true" || hasQuestion === "false") {
      const { data: rawParticipants, error } = await query.limit(2000);

      if (error) {
        console.error("Admin participants query error:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch participants." }, { status: 500 });
      }

      let filtered = (rawParticipants || []).map((p) => {
        const question = extractQuestion(p);
        const interests = extractInterests(p);
        const cleanReferral = extractReferralSource(p);
        return {
          ...p,
          samvaad_question: question || p.samvaad_question || null,
          interests: interests.length > 0 ? interests : p.interests || null,
          referral_source: cleanReferral || p.referral_source || null,
          has_question: Boolean(question),
        };
      });

      if (hasQuestion === "true") {
        filtered = filtered.filter((p) => Boolean(p.samvaad_question && p.samvaad_question.trim()));
      } else if (hasQuestion === "false") {
        filtered = filtered.filter((p) => !p.samvaad_question || !p.samvaad_question.trim());
      }

      if (search) {
        filtered = filtered.filter((p) => {
          const name = (p.name || "").toLowerCase();
          const regId = (p.registration_id || "").toLowerCase();
          const phone = (p.phone || "").toLowerCase();
          const email = (p.email || "").toLowerCase();
          const city = (p.city || "").toLowerCase();
          const college = (p.college || "").toLowerCase();
          const qText = (p.samvaad_question || "").toLowerCase();
          const refText = (p.referral_source || "").toLowerCase();
          const interestsStr = Array.isArray(p.interests) ? p.interests.join(" ").toLowerCase() : "";

          return (
            name.includes(search) ||
            regId.includes(search) ||
            phone.includes(search) ||
            email.includes(search) ||
            city.includes(search) ||
            college.includes(search) ||
            qText.includes(search) ||
            refText.includes(search) ||
            interestsStr.includes(search)
          );
        });
      }

      const total = filtered.length;
      const paginated = isExport ? filtered : filtered.slice(offset, offset + limit);

      if (isExport) {
        return generateParticipantsCsv(paginated);
      }

      return NextResponse.json({
        success: true,
        participants: paginated,
        total,
        page,
        limit,
      });
    }

    // Default paginated DB query
    query = query.range(offset, offset + limit - 1);
    const { data: participants, error, count } = await query;

    if (error) {
      console.error("Admin participants query error:", error);
      return NextResponse.json({ success: false, error: "Failed to fetch participants." }, { status: 500 });
    }

    const normalized = (participants || []).map((p) => {
      const question = extractQuestion(p);
      const interests = extractInterests(p);
      const cleanReferral = extractReferralSource(p);
      return {
        ...p,
        samvaad_question: question || p.samvaad_question || null,
        interests: interests.length > 0 ? interests : p.interests || null,
        referral_source: cleanReferral || p.referral_source || null,
        has_question: Boolean(question),
      };
    });

    if (isExport) {
      return generateParticipantsCsv(normalized);
    }

    return NextResponse.json({
      success: true,
      participants: normalized,
      total: count,
      page,
      limit,
    });
  } catch (error: any) {
    console.error("Participants API error:", error);
    return NextResponse.json({ success: false, error: "Server error." }, { status: 500 });
  }
}

function generateParticipantsCsv(participants: any[]) {
  const headers = [
    "Registration ID",
    "Full Name",
    "Mobile Number",
    "Email",
    "Age",
    "City",
    "College / Org",
    "Youth Samvaad Question",
    "Areas of Interest",
    "Referral Source",
    "Payment Method",
    "Payment Status",
    "Amount (INR)",
    "Checked In",
    "Check-in Time",
    "Registered At",
  ];

  const rows = participants.map((p) => {
    const question = extractQuestion(p);
    const interests = extractInterests(p).join(", ");
    const referral = extractReferralSource(p);

    return [
      `"${p.registration_id}"`,
      `"${(p.name || "").replace(/"/g, '""')}"`,
      `"${p.phone}"`,
      `"${p.email || ""}"`,
      p.age,
      `"${(p.city || "").replace(/"/g, '""')}"`,
      `"${(p.college || "").replace(/"/g, '""')}"`,
      `"${question.replace(/"/g, '""')}"`,
      `"${interests.replace(/"/g, '""')}"`,
      `"${referral.replace(/"/g, '""')}"`,
      `"${(p.payment_method || "").toUpperCase()}"`,
      `"${(p.payment_status || "").toUpperCase()}"`,
      p.payment_status === "paid" ? 50 : 0,
      p.checked_in ? "YES" : "NO",
      `"${p.check_in_time ? new Date(p.check_in_time).toLocaleString("en-IN") : ""}"`,
      `"${new Date(p.created_at).toLocaleString("en-IN")}"`,
    ];
  });

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

  return new NextResponse(csvContent, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="Yuva-Shakti-Sangam-Participants-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}

