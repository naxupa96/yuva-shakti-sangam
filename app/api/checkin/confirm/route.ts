import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";
import { getVolunteerCookieName, verifyVolunteerToken } from "@/lib/auth/volunteer";
import { getAdminCookieName, verifyAdminToken } from "@/lib/auth/admin";

export async function POST(req: NextRequest) {
  try {
    const { token_or_id, participant_id, method = "qr_scan", device_info } = await req.json();
    const identifier = (token_or_id || participant_id || "").toString().trim();

    if (!identifier) {
      return NextResponse.json({ success: false, error: "Missing token or ID for check-in." }, { status: 400 });
    }

    // 1. Identify operator (volunteer name or admin)
    const volunteerCookie = req.cookies.get(getVolunteerCookieName())?.value;
    const { valid: isVolValid, username: volName } = await verifyVolunteerToken(volunteerCookie);

    const adminCookie = req.cookies.get(getAdminCookieName())?.value;
    const { valid: isAdminValid, username: adminName } = await verifyAdminToken(adminCookie);

    const operatorName = isVolValid ? (volName || "Volunteer") : isAdminValid ? (adminName || "Admin") : "Volunteer";

    const supabase = getAdminClient();

    // 2. Fetch participant
    let query = supabase.from("participants").select("*");
    if (identifier.startsWith("yss_")) {
      query = query.eq("qr_token", identifier);
    } else if (identifier.toUpperCase().startsWith("YSS-")) {
      query = query.eq("registration_id", identifier.toUpperCase());
    } else if (/^[0-9a-fA-F-]{36}$/.test(identifier)) {
      query = query.eq("id", identifier);
    } else {
      query = query.or(`qr_token.eq.${identifier},registration_id.ilike.${identifier},id.eq.${identifier}`);
    }

    const { data: participants, error: fetchErr } = await query.limit(1);
    if (fetchErr || !participants || participants.length === 0) {
      return NextResponse.json({ success: false, error: "Participant not found." }, { status: 404 });
    }

    const participant = participants[0];

    if (participant.checked_in) {
      return NextResponse.json({
        success: true,
        already_checked_in: true,
        message: "Participant is already checked in.",
        participant,
      });
    }

    // 3. Mark check-in
    const now = new Date().toISOString();
    const { data: updated, error: updateErr } = await supabase
      .from("participants")
      .update({
        checked_in: true,
        check_in_time: now,
      })
      .eq("id", participant.id)
      .select()
      .single();

    if (updateErr) {
      console.error("Check-in update error:", updateErr);
      return NextResponse.json({ success: false, error: "Failed to update check-in record." }, { status: 500 });
    }

    // 4. Log audit trail: Record WHICH volunteer scanned WHOM
    await supabase.from("audit_logs").insert({
      action: "participant_checkin",
      entity_type: "participant",
      entity_id: participant.id,
      details: {
        volunteer_name: operatorName,
        method: method,
        device_info: device_info || "volunteer_web_scanner",
        registration_id: participant.registration_id,
        participant_name: participant.name,
        participant_phone: participant.phone,
        timestamp: now,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Check-in successful.",
      operator: operatorName,
      participant: updated,
    });
  } catch (error: any) {
    console.error("Check-in confirm error:", error);
    return NextResponse.json({ success: false, error: "Server check-in error." }, { status: 500 });
  }
}
