import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";
import { getVolunteerCookieName, verifyVolunteerToken } from "@/lib/auth/volunteer";
import { getAdminCookieName, verifyAdminToken } from "@/lib/auth/admin";

export async function GET(req: NextRequest) {
  try {
    // 1. Verify volunteer or admin authorization
    const volunteerToken = req.cookies.get(getVolunteerCookieName())?.value;
    const { valid: isVolValid } = await verifyVolunteerToken(volunteerToken);

    const adminToken = req.cookies.get(getAdminCookieName())?.value;
    const { valid: isAdminValid } = await verifyAdminToken(adminToken);

    if (!isVolValid && !isAdminValid) {
      return NextResponse.json({ success: false, error: "Unauthorized access to roster." }, { status: 401 });
    }

    const supabase = getAdminClient();

    // 2. Fetch all registered participants for offline cache
    const { data: participants, error } = await supabase
      .from("participants")
      .select("id, registration_id, name, phone, city, college, age, qr_token, payment_status, payment_method, checked_in, check_in_time, answers")
      .order("registration_id", { ascending: true });

    if (error) {
      console.error("Offline roster fetch error:", error);
      return NextResponse.json({ success: false, error: "Failed to fetch roster." }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      count: participants?.length || 0,
      timestamp: new Date().toISOString(),
      participants: participants || [],
    });
  } catch (error: any) {
    console.error("Roster API error:", error);
    return NextResponse.json({ success: false, error: "Server error downloading roster." }, { status: 500 });
  }
}
