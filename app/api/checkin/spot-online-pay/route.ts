import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";
import { getVolunteerCookieName, verifyVolunteerToken } from "@/lib/auth/volunteer";
import { getAdminCookieName, verifyAdminToken } from "@/lib/auth/admin";

export async function POST(req: NextRequest) {
  try {
    const { participant_id, utr, notes } = await req.json();

    if (!participant_id) {
      return NextResponse.json({ success: false, error: "Missing participant ID for online verification." }, { status: 400 });
    }

    // 1. Identify operator (volunteer name or admin)
    const volunteerCookie = req.cookies.get(getVolunteerCookieName())?.value;
    const { valid: isVolValid, username: volName } = await verifyVolunteerToken(volunteerCookie);

    const adminCookie = req.cookies.get(getAdminCookieName())?.value;
    const { valid: isAdminValid, username: adminName } = await verifyAdminToken(adminCookie);

    const operatorName = isVolValid ? (volName || "Volunteer") : isAdminValid ? (adminName || "Admin") : "Volunteer";

    const supabase = getAdminClient();

    // 2. Fetch participant
    const { data: pRows, error: pErr } = await supabase
      .from("participants")
      .select("*")
      .eq("id", participant_id)
      .limit(1);

    const participant = pRows?.[0];

    if (pErr || !participant) {
      return NextResponse.json({ success: false, error: "Participant not found." }, { status: 404 });
    }

    const cleanUtr = utr ? String(utr).trim() : "";
    const now = new Date().toISOString();
    const verificationNotes = `On-spot UPI ₹50 verified by volunteer: ${operatorName}${cleanUtr ? ` | UTR: ${cleanUtr}` : " | Screen Verified"}${notes ? ` | ${notes}` : ""}`;

    const isValidUUID = (val: any): boolean =>
      typeof val === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);

    const updatePayload: Record<string, any> = {
      payment_status: "paid",
      payment_method: "online",
      checked_in: true,
      check_in_time: now,
    };

    if (isValidUUID(operatorName)) {
      updatePayload.checked_in_by = operatorName;
    }

    // 3. Update participant to paid (online) and checked in
    const { data: updatedRows, error: updateErr } = await supabase
      .from("participants")
      .update(updatePayload)
      .eq("id", participant_id)
      .select();

    if (updateErr) {
      console.error("Participant update error on online verify:", updateErr);
      return NextResponse.json({ success: false, error: updateErr.message || "Failed to update participant status." }, { status: 500 });
    }

    const updatedParticipant = updatedRows?.[0] || { ...participant, ...updatePayload };

    // 4. Record entry in payments ledger
    const { data: paymentRows, error: payErr } = await supabase
      .from("payments")
      .insert({
        participant_id: participant.id,
        method: "online",
        amount: 50,
        currency: "INR",
        status: "paid",
        gateway: "venue_upi",
        gateway_payment_id: cleanUtr || null,
        paid_at: now,
        notes: verificationNotes,
      })
      .select();

    const paymentRecord = paymentRows?.[0] || null;

    if (payErr) {
      console.warn("Payment ledger insert notice:", payErr.message);
    }

    // 5. Log audit trail with exact volunteer name, amount, and UTR
    await supabase.from("audit_logs").insert({
      action: "spot_online_payment",
      entity_type: "participant",
      entity_id: participant.id,
      details: {
        volunteer_name: operatorName,
        amount: 50,
        currency: "INR",
        payment_method: "online",
        utr: cleanUtr || "screen_verified",
        registration_id: participant.registration_id,
        participant_name: participant.name,
        participant_phone: participant.phone,
        notes: verificationNotes,
        payment_id: paymentRecord?.id || null,
        timestamp: now,
      },
    });

    return NextResponse.json({
      success: true,
      message: `₹50 UPI payment verified by ${operatorName}. Entry granted!`,
      operator: operatorName,
      amount: 50,
      utr: cleanUtr || null,
      participant: updatedParticipant,
    });
  } catch (error: any) {
    console.error("Spot online payment error:", error);
    return NextResponse.json({ success: false, error: "Failed to record spot online payment." }, { status: 500 });
  }
}
