import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";

export async function GET(_req: NextRequest) {
  try {
    const supabase = getAdminClient();

    const { data: stats, error } = await supabase.rpc("get_admin_dashboard_stats");

    if (error) {
      console.error("Dashboard stats RPC error:", error);
      return NextResponse.json({ success: false, error: "Failed to load dashboard statistics." }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (error: any) {
    console.error("Admin stats error:", error);
    return NextResponse.json({ success: false, error: "Server error fetching stats." }, { status: 500 });
  }
}
