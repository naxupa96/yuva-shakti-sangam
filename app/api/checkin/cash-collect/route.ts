import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { participant_id, notes } = await req.json();

    if (!participant_id) {
      return NextResponse.json({ success: false, error: "Missing participant ID for cash collection." }, { status: 400 });
    }

    const authClient = await createServerSupabaseClient();
    const { data: { user } } = await authClient.auth.getUser();

    const staffId = user ? user.id : null;
    const supabase = getAdminClient();

    // Call atomic RPC
    const { data: result, error } = await supabase.rpc("record_cash_payment", {
      p_participant_id: participant_id,
      p_staff_id: staffId,
      p_notes: notes || "Collected on-ground at check-in desk",
    });

    if (error) {
      console.error("Record cash payment RPC error:", error);
      return NextResponse.json({ success: false, error: "Database error recording cash payment." }, { status: 500 });
    }

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    // Return updated participant
    const { data: updatedParticipant } = await supabase
      .from("participants")
      .select("*")
      .eq("id", participant_id)
      .single();

    return NextResponse.json({
      success: true,
      result,
      participant: updatedParticipant,
    });
  } catch (error: any) {
    console.error("Cash collection error:", error);
    return NextResponse.json({ success: false, error: "Failed to record cash payment." }, { status: 500 });
  }
}
