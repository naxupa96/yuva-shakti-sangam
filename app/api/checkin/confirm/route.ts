import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";
import { getVolunteerCookieName, verifyVolunteerToken } from "@/lib/auth/volunteer";
import { getAdminCookieName, verifyAdminToken } from "@/lib/auth/admin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      token_or_id,
      participant_id,
      method = "qr_scan",
      device_info,
      mark_as_paid = false,
      notes,
    } = body;

    const pid = participant_id ? String(participant_id).trim() : "";
    let rawIdentifier = (token_or_id || participant_id || "").toString().trim();

    if (!pid && !rawIdentifier) {
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
    let participant: any = null;

    // Fast-path: Direct UUID lookup if participant_id is valid
    if (/^[0-9a-fA-F-]{36}$/.test(pid)) {
      const { data: byId } = await supabase
        .from("participants")
        .select("*")
        .eq("id", pid)
        .limit(1);
      if (byId && byId.length > 0) {
        participant = byId[0];
      }
    }

    // Secondary search by token, registration ID, or clean URL
    if (!participant) {
      let clean = rawIdentifier;
      if (clean.includes("/ticket/")) {
        clean = clean.split("/ticket/")[1].split(/[?#]/)[0].trim();
      }
      const tokenMatch = clean.match(/yss_[a-fA-F0-9]+/);
      if (tokenMatch) {
        clean = tokenMatch[0];
      }

      let query = supabase.from("participants").select("*");
      if (/^[0-9a-fA-F-]{36}$/.test(clean)) {
        query = query.eq("id", clean);
      } else if (clean.startsWith("yss_")) {
        query = query.eq("qr_token", clean);
      } else if (clean.toUpperCase().startsWith("YSS-")) {
        query = query.ilike("registration_id", `%${clean.toUpperCase()}%`);
      } else if (/^\d{1,6}$/.test(clean)) {
        const padded = clean.padStart(6, "0");
        query = query.or(`registration_id.ilike.%${padded}%,registration_id.ilike.%${clean}%`);
      } else {
        query = query.or(`qr_token.eq.${clean},registration_id.ilike.%${clean}%,name.ilike.%${clean}%`);
      }

      const { data: participants, error: fetchErr } = await query.limit(1);
      if (fetchErr) {
        console.error("Participant fetch error in confirm:", fetchErr);
      }
      if (participants && participants.length > 0) {
        participant = participants[0];
      }
    }

    if (!participant) {
      return NextResponse.json({ success: false, error: "Participant not found." }, { status: 404 });
    }

    // If already checked in, inform client with full participant record
    if (participant.checked_in) {
      return NextResponse.json({
        success: true,
        already_checked_in: true,
        code: "ALREADY_CHECKED_IN",
        message: `Participant is already checked in at ${participant.check_in_time ? new Date(participant.check_in_time).toLocaleTimeString("en-IN") : "venue"}.`,
        participant,
      });
    }

    // 3. Mark check-in
    const now = new Date().toISOString();
    const isValidUUID = (val: any): boolean =>
      typeof val === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);

    const updatePayload: Record<string, any> = {
      checked_in: true,
      check_in_time: now,
    };

    if (isValidUUID(operatorName)) {
      updatePayload.checked_in_by = operatorName;
    }

    if (mark_as_paid && participant.payment_status !== "paid") {
      updatePayload.payment_status = "paid";
      updatePayload.payment_method = participant.payment_method || "gate_cleared";
    }

    const { data: updated, error: updateErr } = await supabase
      .from("participants")
      .update(updatePayload)
      .eq("id", participant.id)
      .select()
      .single();

    if (updateErr) {
      console.error("Check-in update error:", updateErr);
      return NextResponse.json({ success: false, error: updateErr.message || "Failed to update check-in record in database." }, { status: 500 });
    }

    // 4. Log audit trail (safe failover: audit failure does not block gate check-in)
    try {
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
          marked_paid: mark_as_paid,
          notes: notes || null,
          timestamp: now,
        },
      });
    } catch (auditErr) {
      console.warn("Audit log insert non-fatal notice:", auditErr);
    }

    return NextResponse.json({
      success: true,
      already_checked_in: false,
      message: "Check-in successful.",
      operator: operatorName,
      participant: updated || { ...participant, ...updatePayload },
    });
  } catch (error: any) {
    console.error("Check-in confirm error:", error);
    return NextResponse.json({ success: false, error: error.message || "Server check-in error." }, { status: 500 });
  }
}
