import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();

    if (!query || typeof query !== "string" || !query.trim()) {
      return NextResponse.json({ success: false, error: "Please provide a QR token, Registration ID, or phone number." }, { status: 400 });
    }

    const trimmed = query.trim();
    const supabase = getAdminClient();

    // Check staff session if available
    const authClient = await createServerSupabaseClient();
    const { data: { user } } = await authClient.auth.getUser();

    // Search by exact qr_token, upper registration_id, or phone
    const cleanPhone = trimmed.replace(/\D/g, "");

    let queryBuilder = supabase
      .from("participants")
      .select("*");

    if (trimmed.startsWith("yss_")) {
      queryBuilder = queryBuilder.eq("qr_token", trimmed);
    } else if (trimmed.toUpperCase().startsWith("YSS-")) {
      queryBuilder = queryBuilder.eq("registration_id", trimmed.toUpperCase());
    } else if (cleanPhone.length >= 10) {
      queryBuilder = queryBuilder.eq("phone", cleanPhone);
    } else {
      // General match on registration_id or name
      queryBuilder = queryBuilder.or(`registration_id.ilike.%${trimmed}%,name.ilike.%${trimmed}%`);
    }

    const { data: participants, error } = await queryBuilder.limit(5);

    if (error || !participants || participants.length === 0) {
      return NextResponse.json({
        success: false,
        error: "No matching participant found for this QR or query.",
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      participant: participants[0],
      totalMatches: participants.length,
      allMatches: participants,
      staffUser: user ? { id: user.id, email: user.email } : null,
    });
  } catch (error: any) {
    console.error("Check-in lookup error:", error);
    return NextResponse.json({ success: false, error: "Lookup failed." }, { status: 500 });
  }
}
