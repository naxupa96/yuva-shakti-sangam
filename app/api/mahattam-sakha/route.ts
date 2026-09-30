import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";
import { MahattamSakhaEntry, VASTI_STHAN_DATA, VALID_DATES } from "@/lib/mahattam-sakha-data";
import { verifyAdminToken, getAdminCookieName } from "@/lib/auth/admin";
import { verifyVolunteerToken, getVolunteerCookieName } from "@/lib/auth/volunteer";

const ACTION_TYPE = "MAHATTAM_SAKHA_ENTRY";

// Helper to check authentication (Admin or Team Member/Volunteer)
async function isAuthenticated(req: NextRequest) {
  const adminCookie = req.cookies.get(getAdminCookieName())?.value;
  const { valid: isAdmin } = await verifyAdminToken(adminCookie);
  if (isAdmin) return true;

  const volunteerCookie = req.cookies.get(getVolunteerCookieName())?.value;
  const { valid: isVolunteer } = await verifyVolunteerToken(volunteerCookie);
  if (isVolunteer) return true;

  return false;
}

/**
 * GET: Retrieve Mahattam Shakha entries (Admin & authorized team view)
 */
export async function GET(req: NextRequest) {
  try {
    const isAuthed = await isAuthenticated(req);
    if (!isAuthed) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const vastiFilter = searchParams.get("vasti");
    const dateFilter = searchParams.get("date");
    const timingFilter = searchParams.get("timing");

    const supabase = getAdminClient();
    const { data: logs, error } = await supabase
      .from("audit_logs")
      .select("*")
      .eq("action", ACTION_TYPE)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching Mahattam Shakha logs:", error);
      return NextResponse.json(
        { success: false, error: "Failed to fetch entries" },
        { status: 500 }
      );
    }

    let entries: MahattamSakhaEntry[] = (logs || []).map((log) => {
      const details = (log.details as any) || {};
      const tarun = Number(details.tarun) || 0;
      const bal = Number(details.bal) || 0;
      const shishu = Number(details.shishu) || 0;
      const yog = tarun + bal;

      return {
        id: log.id,
        reporter_name: details.reporter_name || "Team Member",
        date: details.date || "",
        vasti: details.vasti || "",
        sthan: details.sthan || "",
        timing: details.timing || "Prabhat",
        tarun,
        bal,
        yog,
        shishu,
        notes: details.notes || "",
        created_at: log.created_at,
      };
    });

    if (vastiFilter && vastiFilter !== "all") {
      entries = entries.filter((e) => e.vasti === vastiFilter);
    }
    if (dateFilter && dateFilter !== "all") {
      entries = entries.filter((e) => e.date === dateFilter);
    }
    if (timingFilter && timingFilter !== "all") {
      entries = entries.filter((e) => e.timing === timingFilter);
    }

    // Calculate aggregated stats
    const stats = entries.reduce(
      (acc, curr) => {
        acc.total_entries += 1;
        acc.total_tarun += curr.tarun;
        acc.total_bal += curr.bal;
        acc.total_yog += curr.yog;
        acc.total_shishu += curr.shishu;
        return acc;
      },
      {
        total_entries: 0,
        total_tarun: 0,
        total_bal: 0,
        total_yog: 0,
        total_shishu: 0,
      }
    );

    return NextResponse.json({
      success: true,
      entries,
      stats,
    });
  } catch (err: any) {
    console.error("API error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST: Submit new Mahattam Shakha attendance record
 */
export async function POST(req: NextRequest) {
  try {
    const isAuthed = await isAuthenticated(req);
    if (!isAuthed) {
      return NextResponse.json(
        { success: false, error: "Access denied. Please log in as team member or admin." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      reporter_name,
      date,
      vasti,
      sthan,
      timing,
      tarun,
      bal,
      shishu,
      notes,
    } = body;

    // Validation
    if (!reporter_name || typeof reporter_name !== "string" || !reporter_name.trim()) {
      return NextResponse.json(
        { success: false, error: "Name of the person filling the form is required." },
        { status: 400 }
      );
    }

    if (!date || !VALID_DATES.includes(date as any)) {
      return NextResponse.json(
        { success: false, error: "Date must be between 02/10/2026 and 08/10/2026." },
        { status: 400 }
      );
    }

    if (!vasti || !VASTI_STHAN_DATA[vasti]) {
      return NextResponse.json(
        { success: false, error: "Please select a valid Vasti." },
        { status: 400 }
      );
    }

    if (!sthan || !sthan.trim()) {
      return NextResponse.json(
        { success: false, error: "Please select a valid Sthan." },
        { status: 400 }
      );
    }

    if (!["Prabhat", "Shayam"].includes(timing)) {
      return NextResponse.json(
        { success: false, error: "Timing must be Prabhat or Shayam." },
        { status: 400 }
      );
    }

    const parsedTarun = Math.max(0, parseInt(tarun, 10) || 0);
    const parsedBal = Math.max(0, parseInt(bal, 10) || 0);
    const parsedShishu = Math.max(0, parseInt(shishu, 10) || 0);
    const parsedYog = parsedTarun + parsedBal;

    const entryPayload = {
      reporter_name: reporter_name.trim(),
      date,
      vasti,
      sthan: sthan.trim(),
      timing,
      tarun: parsedTarun,
      bal: parsedBal,
      yog: parsedYog,
      shishu: parsedShishu,
      notes: (notes || "").trim(),
    };

    const supabase = getAdminClient();
    const { data, error } = await supabase.from("audit_logs").insert([
      {
        action: ACTION_TYPE,
        entity_type: "mahattam_sakha",
        entity_id: null,
        details: entryPayload,
      },
    ]).select();

    if (error) {
      console.error("Failed to insert Mahattam Shakha log:", error);
      return NextResponse.json(
        { success: false, error: "Failed to record entry in database." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Mahattam Shakha attendance recorded successfully!",
      entry: {
        id: data?.[0]?.id,
        ...entryPayload,
        created_at: data?.[0]?.created_at,
      },
    });
  } catch (err: any) {
    console.error("Submission error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to submit attendance." },
      { status: 500 }
    );
  }
}
