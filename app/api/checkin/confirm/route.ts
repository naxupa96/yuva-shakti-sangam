import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { token_or_id, method = "qr_scan", device_info } = await req.json();

    if (!token_or_id) {
      return NextResponse.json({ success: false, error: "Missing token or ID for check-in." }, { status: 400 });
    }

    const authClient = await createServerSupabaseClient();
    const { data: { user } } = await authClient.auth.getUser();

    const staffId = user ? user.id : null;
    const supabase = getAdminClient();

    // Execute atomic RPC function
    const { data: result, error } = await supabase.rpc("check_in_participant", {
      p_token_or_id: token_or_id,
      p_staff_id: staffId,
      p_method: method,
      p_device_info: device_info || "web_volunteer_scanner",
    });

    if (error) {
      console.error("Check-in RPC error:", error);
      return NextResponse.json({ success: false, error: "Database error processing check-in." }, { status: 500 });
    }

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Check-in confirm error:", error);
    return NextResponse.json({ success: false, error: "Server check-in error." }, { status: 500 });
  }
}
