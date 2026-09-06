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

    let clean = trimmed;
    if (clean.includes("/ticket/")) {
      clean = clean.split("/ticket/")[1].split(/[?#]/)[0].trim();
    }
    const tokenMatch = clean.match(/yss_[a-fA-F0-9]+/);
    if (tokenMatch) {
      clean = tokenMatch[0];
    }

    const cleanPhone = clean.replace(/\D/g, "");

    let queryBuilder = supabase
      .from("participants")
      .select("*");

    if (/^[0-9a-fA-F-]{36}$/.test(clean)) {
      queryBuilder = queryBuilder.eq("id", clean);
    } else if (clean.startsWith("yss_")) {
      queryBuilder = queryBuilder.eq("qr_token", clean);
    } else if (clean.toUpperCase().startsWith("YSS-")) {
      queryBuilder = queryBuilder.ilike("registration_id", `%${clean.toUpperCase()}%`);
    } else if (/^\d{1,6}$/.test(clean)) {
      // Direct numeric ID (e.g. 126 or 000126)
      const padded = clean.padStart(6, "0");
      queryBuilder = queryBuilder.or(`registration_id.ilike.%${padded}%,registration_id.ilike.%${clean}%`);
    } else if (cleanPhone.length >= 10) {
      queryBuilder = queryBuilder.ilike("phone", `%${cleanPhone}%`);
    } else {
      // General match on registration_id or name
      queryBuilder = queryBuilder.or(`registration_id.ilike.%${clean}%,name.ilike.%${clean}%`);
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
