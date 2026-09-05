import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";

export async function GET(req: NextRequest) {
  try {
    const supabase = getAdminClient();

    // Query audit_logs for all volunteer checkin & payment events
    const { data: logs, error } = await supabase
      .from("audit_logs")
      .select("id, action, entity_id, details, created_at")
      .in("action", ["participant_checkin", "cash_collected", "spot_online_payment"])
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Volunteer stats audit_logs query error:", error);
      return NextResponse.json({ success: false, error: "Failed to load volunteer logs." }, { status: 500 });
    }

    const volunteerMap: Record<string, {
      volunteer_name: string;
      total_scans: number;
      cash_collected_count: number;
      cash_collected_amount: number;
      online_collected_count: number;
      online_collected_amount: number;
      total_money_collected: number;
      last_active: string;
      recent_actions: any[];
    }> = {};

    const transactions: any[] = [];

    (logs || []).forEach((log) => {
      const details = (log.details as any) || {};
      const vol = details.volunteer_name || "Unknown Volunteer";

      if (!volunteerMap[vol]) {
        volunteerMap[vol] = {
          volunteer_name: vol,
          total_scans: 0,
          cash_collected_count: 0,
          cash_collected_amount: 0,
          online_collected_count: 0,
          online_collected_amount: 0,
          total_money_collected: 0,
          last_active: log.created_at,
          recent_actions: [],
        };
      }

      const item = {
        id: log.id,
        volunteer_name: vol,
        action: log.action,
        participant_name: details.participant_name || "Attendee",
        registration_id: details.registration_id || "-",
        amount: details.amount || 0,
        payment_method: details.payment_method || (log.action === "cash_collected" ? "cash" : log.action === "spot_online_payment" ? "online" : null),
        utr: details.utr || null,
        notes: details.notes || null,
        timestamp: log.created_at,
      };

      transactions.push(item);

      if (volunteerMap[vol].recent_actions.length < 5) {
        volunteerMap[vol].recent_actions.push(item);
      }

      if (log.action === "participant_checkin") {
        volunteerMap[vol].total_scans++;
      } else if (log.action === "cash_collected") {
        volunteerMap[vol].cash_collected_count++;
        volunteerMap[vol].cash_collected_amount += (Number(details.amount) || 50);
        volunteerMap[vol].total_money_collected += (Number(details.amount) || 50);
      } else if (log.action === "spot_online_payment") {
        volunteerMap[vol].online_collected_count++;
        volunteerMap[vol].online_collected_amount += (Number(details.amount) || 50);
        volunteerMap[vol].total_money_collected += (Number(details.amount) || 50);
      }
    });

    const volunteers = Object.values(volunteerMap).sort(
      (a, b) => b.total_money_collected - a.total_money_collected || b.total_scans - a.total_scans
    );

    const summary = {
      total_volunteers_active: volunteers.length,
      total_cash_collected: volunteers.reduce((sum, v) => sum + v.cash_collected_amount, 0),
      total_online_collected: volunteers.reduce((sum, v) => sum + v.online_collected_amount, 0),
      total_revenue_handled: volunteers.reduce((sum, v) => sum + v.total_money_collected, 0),
      total_scans_logged: volunteers.reduce((sum, v) => sum + v.total_scans, 0),
    };

    return NextResponse.json({
      success: true,
      summary,
      volunteers,
      transactions,
    });
  } catch (error: any) {
    console.error("Volunteer stats error:", error);
    return NextResponse.json({ success: false, error: "Server error generating volunteer stats." }, { status: 500 });
  }
}
