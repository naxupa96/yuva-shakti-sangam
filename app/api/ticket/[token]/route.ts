import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    if (!token) {
      return NextResponse.json({ success: false, error: "Missing ticket token" }, { status: 400 });
    }

    const supabase = getAdminClient();

    const { data: participant, error } = await supabase
      .from("participants")
      .select("id, registration_id, name, email, phone, age, city, college, payment_method, payment_status, qr_token, checked_in, check_in_time, created_at")
      .eq("qr_token", token)
      .maybeSingle();

    if (error || !participant) {
      return NextResponse.json({ success: false, error: "Ticket not found or invalid token." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      participant,
    });
  } catch (error: any) {
    console.error("Ticket fetch error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch ticket." }, { status: 500 });
  }
}
