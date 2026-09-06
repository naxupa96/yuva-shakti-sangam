import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";
import { getVolunteerCookieName, verifyVolunteerToken } from "@/lib/auth/volunteer";
import { getAdminCookieName, verifyAdminToken } from "@/lib/auth/admin";

export async function POST(req: NextRequest) {
  try {
    const { participant_id, notes } = await req.json();

    if (!participant_id) {
      return NextResponse.json({ success: false, error: "Missing participant ID for cash collection." }, { status: 400 });
    }

    // 1. Identify operator (volunteer name or admin)
    const volunteerCookie = req.cookies.get(getVolunteerCookieName())?.value;
    const { valid: isVolValid, username: volName } = await verifyVolunteerToken(volunteerCookie);

    const adminCookie = req.cookies.get(getAdminCookieName())?.value;
    const { valid: isAdminValid, username: adminName } = await verifyAdminToken(adminCookie);

    const operatorName = isVolValid ? (volName || "Volunteer") : isAdminValid ? (adminName || "Admin") : "Volunteer";

    const supabase = getAdminClient();

    // 2. Fetch participant
    const { data: participant, error: pErr } = await supabase
      .from("participants")
      .select("*")
      .eq("id", participant_id)
      .single();

    if (pErr || !participant) {
      return NextResponse.json({ success: false, error: "Participant not found." }, { status: 404 });
    }

    const now = new Date().toISOString();
    const collectionNotes = `Collected ₹50 cash by volunteer: ${operatorName}${notes ? ` | ${notes}` : ""}`;

    // 3. Update participant to paid and checked in
    const { data: updatedParticipant, error: updateErr } = await supabase
      .from("participants")
      .update({
        payment_status: "paid",
        payment_method: "cash",
        checked_in: true,
        check_in_time: now,
        checked_in_by: operatorName,
      })
      .eq("id", participant_id)
      .select()
      .single();

    if (updateErr) {
      console.error("Participant update error on cash collect:", updateErr);
      return NextResponse.json({ success: false, error: "Failed to update participant record." }, { status: 500 });
    }

    // 4. Record entry in payments ledger
    const { data: paymentRecord, error: payErr } = await supabase
      .from("payments")
      .insert({
        participant_id: participant.id,
        method: "cash",
        amount: 50,
        currency: "INR",
        status: "paid",
        gateway: "manual_cash",
        paid_at: now,
        notes: collectionNotes,
      })
      .select()
      .single();

    if (payErr) {
      console.warn("Payment row insert notice:", payErr.message);
    }

    // 5. Log audit trail with exact volunteer name and money amount
    await supabase.from("audit_logs").insert({
      action: "cash_collected",
      entity_type: "participant",
      entity_id: participant.id,
      details: {
        volunteer_name: operatorName,
        amount: 50,
        currency: "INR",
        payment_method: "cash",
        registration_id: participant.registration_id,
        participant_name: participant.name,
        participant_phone: participant.phone,
        notes: collectionNotes,
        payment_id: paymentRecord?.id || null,
        timestamp: now,
      },
    });

    return NextResponse.json({
      success: true,
      message: `₹50 cash recorded by ${operatorName}. Entry granted!`,
      operator: operatorName,
      amount: 50,
      participant: updatedParticipant,
    });
  } catch (error: any) {
    console.error("Cash collection error:", error);
    return NextResponse.json({ success: false, error: "Failed to record cash payment." }, { status: 500 });
  }
}
