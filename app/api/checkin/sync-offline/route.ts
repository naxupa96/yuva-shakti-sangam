import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";
import { getVolunteerCookieName, verifyVolunteerToken } from "@/lib/auth/volunteer";
import { getAdminCookieName, verifyAdminToken } from "@/lib/auth/admin";

interface OfflineAction {
  id: string;
  type: "confirm" | "cash" | "spot_online";
  participant_id: string;
  utr?: string;
  notes?: string;
  timestamp: string;
}

export async function POST(req: NextRequest) {
  try {
    const { actions } = await req.json();

    if (!Array.isArray(actions) || actions.length === 0) {
      return NextResponse.json({ success: false, error: "No actions provided for sync." }, { status: 400 });
    }

    // 1. Determine operator identity (Volunteer name or Admin)
    const volunteerToken = req.cookies.get(getVolunteerCookieName())?.value;
    const { valid: isVolValid, username: volName } = await verifyVolunteerToken(volunteerToken);

    const adminToken = req.cookies.get(getAdminCookieName())?.value;
    const { valid: isAdminValid, username: adminName } = await verifyAdminToken(adminToken);

    if (!isVolValid && !isAdminValid) {
      return NextResponse.json({ success: false, error: "Unauthorized session for offline sync." }, { status: 401 });
    }

    const operatorName = isVolValid ? (volName || "Volunteer") : isAdminValid ? (adminName || "Admin") : "Volunteer";
    const supabase = getAdminClient();

    const results: Array<{ id: string; success: boolean; error?: string }> = [];

    for (const action of actions as OfflineAction[]) {
      try {
        if (!action.participant_id) {
          results.push({ id: action.id, success: false, error: "Missing participant ID" });
          continue;
        }

        // Fetch participant
        const { data: participant, error: pErr } = await supabase
          .from("participants")
          .select("*")
          .eq("id", action.participant_id)
          .single();

        if (pErr || !participant) {
          results.push({ id: action.id, success: false, error: "Participant not found" });
          continue;
        }

        const actionTime = action.timestamp || new Date().toISOString();

        if (action.type === "confirm") {
          // Grant checkin
          await supabase
            .from("participants")
            .update({
              checked_in: true,
              check_in_time: actionTime,
            })
            .eq("id", participant.id);

          await supabase.from("audit_logs").insert({
            action: "participant_checkin",
            entity_type: "participant",
            entity_id: participant.id,
            details: {
              volunteer_name: operatorName,
              registration_id: participant.registration_id,
              participant_name: participant.name,
              participant_phone: participant.phone,
              method: "offline_sync",
              timestamp: actionTime,
              synced_at: new Date().toISOString(),
              offline_action_id: action.id,
            },
          });

          results.push({ id: action.id, success: true });
        } else if (action.type === "cash") {
          const notes = `Collected ₹50 cash by volunteer: ${operatorName} (offline synced)`;

          await supabase
            .from("participants")
            .update({
              payment_status: "paid",
              payment_method: "cash",
              checked_in: true,
              check_in_time: actionTime,
            })
            .eq("id", participant.id);

          const { data: payRecord } = await supabase
            .from("payments")
            .insert({
              participant_id: participant.id,
              method: "cash",
              amount: 50,
              currency: "INR",
              status: "paid",
              paid_at: actionTime,
              notes: notes,
            })
            .select()
            .single();

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
              notes: notes,
              payment_id: payRecord?.id || null,
              timestamp: actionTime,
              synced_at: new Date().toISOString(),
              offline_action_id: action.id,
            },
          });

          results.push({ id: action.id, success: true });
        } else if (action.type === "spot_online") {
          const cleanUtr = action.utr ? String(action.utr).trim() : "";
          const notes = `On-spot UPI ₹50 verified by volunteer: ${operatorName}${cleanUtr ? ` | UTR: ${cleanUtr}` : " | Screen Verified"} (offline synced)`;

          await supabase
            .from("participants")
            .update({
              payment_status: "paid",
              payment_method: "online",
              checked_in: true,
              check_in_time: actionTime,
            })
            .eq("id", participant.id);

          const { data: payRecord } = await supabase
            .from("payments")
            .insert({
              participant_id: participant.id,
              method: "online",
              amount: 50,
              currency: "INR",
              status: "paid",
              gateway: "venue_upi",
              gateway_payment_id: cleanUtr || null,
              paid_at: actionTime,
              notes: notes,
            })
            .select()
            .single();

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
              notes: notes,
              payment_id: payRecord?.id || null,
              timestamp: actionTime,
              synced_at: new Date().toISOString(),
              offline_action_id: action.id,
            },
          });

          results.push({ id: action.id, success: true });
        }
      } catch (err: any) {
        console.error("Error processing offline action:", action, err);
        results.push({ id: action.id, success: false, error: err.message || "Execution failed" });
      }
    }

    const successfulCount = results.filter((r) => r.success).length;

    return NextResponse.json({
      success: true,
      processed: successfulCount,
      total: actions.length,
      results,
    });
  } catch (error: any) {
    console.error("Offline sync batch error:", error);
    return NextResponse.json({ success: false, error: "Failed to process offline sync batch." }, { status: 500 });
  }
}
