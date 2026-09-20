import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";
import { extractRating, extractFeedback } from "@/lib/participant-helpers";
import { EventFeedback, FeedbackStats } from "@/types/feedback";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = (searchParams.get("search") || "").trim().toLowerCase();
    const ratingFilter = searchParams.get("rating") || "all";
    const attendanceFilter = searchParams.get("attendance") || "all";
    const isExport = searchParams.get("export") === "csv";

    const supabase = getAdminClient();

    // 1. Fetch all audit logs with action = 'EVENT_FEEDBACK'
    const { data: rawLogs, error: logError } = await supabase
      .from("audit_logs")
      .select("*")
      .eq("action", "EVENT_FEEDBACK")
      .order("created_at", { ascending: false });

    if (logError) {
      console.error("Feedback logs query error:", logError);
    }

    // 2. Also fetch participants to enrich checked_in status and detect mirrored feedback
    const { data: participants, error: pError } = await supabase
      .from("participants")
      .select("id, registration_id, name, phone, city, college, checked_in, referral_source, created_at");

    if (pError) {
      console.error("Participants query error in feedback API:", pError);
    }

    const participantMap = new Map<string, any>();
    (participants || []).forEach((p) => {
      participantMap.set(p.id, p);
      if (p.registration_id) {
        participantMap.set(p.registration_id, p);
      }
    });

    const feedbackList: EventFeedback[] = [];
    const seenParticipants = new Set<string>();

    // Process structured audit logs
    (rawLogs || []).forEach((log) => {
      const details = (log.details as any) || {};
      const participantId = log.entity_id || details.participant_id;
      const participant = participantId ? participantMap.get(participantId) : null;

      if (participantId && seenParticipants.has(participantId)) {
        return; // already processed newest entry
      }
      if (participantId) seenParticipants.add(participantId);

      feedbackList.push({
        id: log.id,
        participant_id: participantId || "",
        registration_id: details.registration_id || participant?.registration_id || "",
        participant_name: details.participant_name || participant?.name || "Participant",
        participant_phone: details.participant_phone || participant?.phone || "",
        rating: Number(details.rating) || 5,
        feedback_text: details.feedback_text || "",
        created_at: log.created_at || details.submitted_at || new Date().toISOString(),
        city: details.city || participant?.city || "",
        college: details.college || participant?.college || "",
        checked_in: participant?.checked_in ?? true,
      });
    });

    // Check participants for any feedback mirrored in referral_source not in audit_logs
    (participants || []).forEach((p) => {
      if (!seenParticipants.has(p.id)) {
        const rating = extractRating(p);
        const feedbackText = extractFeedback(p);
        if (rating !== null) {
          seenParticipants.add(p.id);
          feedbackList.push({
            id: p.id,
            participant_id: p.id,
            registration_id: p.registration_id,
            participant_name: p.name,
            participant_phone: p.phone,
            rating,
            feedback_text: feedbackText,
            created_at: p.created_at || new Date().toISOString(),
            city: p.city,
            college: p.college,
            checked_in: p.checked_in,
          });
        }
      }
    });

    // Compute Overall Statistics before filtering
    let totalScore = 0;
    let fiveStar = 0;
    let fourStar = 0;
    let threeStar = 0;
    let twoStar = 0;
    let oneStar = 0;
    let checkedInCount = 0;

    feedbackList.forEach((f) => {
      totalScore += f.rating;
      if (f.rating === 5) fiveStar++;
      else if (f.rating === 4) fourStar++;
      else if (f.rating === 3) threeStar++;
      else if (f.rating === 2) twoStar++;
      else if (f.rating === 1) oneStar++;
      if (f.checked_in) checkedInCount++;
    });

    const stats: FeedbackStats = {
      total_feedback: feedbackList.length,
      average_rating: feedbackList.length > 0 ? Number((totalScore / feedbackList.length).toFixed(2)) : 5.0,
      five_star_count: fiveStar,
      four_star_count: fourStar,
      three_star_count: threeStar,
      two_star_count: twoStar,
      one_star_count: oneStar,
      checked_in_feedback_count: checkedInCount,
    };

    // Apply Filters
    let filtered = feedbackList.filter((f) => {
      // Rating filter
      if (ratingFilter !== "all") {
        const targetRating = parseInt(ratingFilter, 10);
        if (f.rating !== targetRating) return false;
      }

      // Attendance filter
      if (attendanceFilter === "checked_in" && !f.checked_in) return false;
      if (attendanceFilter === "not_checked_in" && f.checked_in) return false;

      // Keyword search
      if (search) {
        const q = search.toLowerCase();
        const matchesName = (f.participant_name || "").toLowerCase().includes(q);
        const matchesText = (f.feedback_text || "").toLowerCase().includes(q);
        const matchesRegId = (f.registration_id || "").toLowerCase().includes(q);
        const matchesPhone = (f.participant_phone || "").includes(q);
        const matchesCity = (f.city || "").toLowerCase().includes(q);
        const matchesCollege = (f.college || "").toLowerCase().includes(q);

        if (!matchesName && !matchesText && !matchesRegId && !matchesPhone && !matchesCity && !matchesCollege) {
          return false;
        }
      }

      return true;
    });

    // Export CSV
    if (isExport) {
      return generateFeedbackCsv(filtered);
    }

    return NextResponse.json({
      success: true,
      feedback: filtered,
      stats,
      total: filtered.length,
    });
  } catch (error: any) {
    console.error("Admin feedback API error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch feedback." }, { status: 500 });
  }
}

function generateFeedbackCsv(feedbackList: EventFeedback[]) {
  const headers = [
    "Registration ID",
    "Participant Name",
    "Mobile Number",
    "City",
    "College / Org",
    "Star Rating (out of 5)",
    "Attendee Feedback",
    "Checked In",
    "Submitted At",
  ];

  const rows = feedbackList.map((f) => {
    return [
      `"${f.registration_id}"`,
      `"${(f.participant_name || "").replace(/"/g, '""')}"`,
      `"${f.participant_phone || ""}"`,
      `"${(f.city || "").replace(/"/g, '""')}"`,
      `"${(f.college || "").replace(/"/g, '""')}"`,
      f.rating,
      `"${(f.feedback_text || "").replace(/"/g, '""')}"`,
      f.checked_in ? "YES" : "NO",
      `"${new Date(f.created_at).toLocaleString("en-IN")}"`,
    ];
  });

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

  return new NextResponse(csvContent, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="Yuva-Shakti-Sangam-Feedback-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
