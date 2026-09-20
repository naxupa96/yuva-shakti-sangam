import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";
import { extractRating, extractFeedback } from "@/lib/participant-helpers";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = (searchParams.get("token") || "").trim();

    if (!token) {
      return NextResponse.json({ success: false, error: "Missing token" }, { status: 400 });
    }

    const supabase = getAdminClient();

    // 1. Fetch participant by qr_token
    const { data: participant, error: pError } = await supabase
      .from("participants")
      .select("id, registration_id, name, referral_source")
      .eq("qr_token", token)
      .maybeSingle();

    if (pError || !participant) {
      return NextResponse.json({ success: false, error: "Participant not found" }, { status: 404 });
    }

    // 2. Check audit_logs first
    const { data: auditLogs } = await supabase
      .from("audit_logs")
      .select("*")
      .eq("action", "EVENT_FEEDBACK")
      .eq("entity_id", participant.id)
      .order("created_at", { ascending: false })
      .limit(1);

    if (auditLogs && auditLogs.length > 0) {
      const log = auditLogs[0];
      const details = (log.details as any) || {};
      return NextResponse.json({
        success: true,
        feedback: {
          id: log.id,
          participant_id: participant.id,
          registration_id: participant.registration_id,
          participant_name: participant.name,
          rating: Number(details.rating) || 5,
          feedback_text: details.feedback_text || "",
          created_at: log.created_at,
        },
      });
    }

    // 3. Fallback check from referral_source mirror
    const rating = extractRating(participant);
    const feedbackText = extractFeedback(participant);

    if (rating !== null) {
      return NextResponse.json({
        success: true,
        feedback: {
          id: participant.id,
          participant_id: participant.id,
          registration_id: participant.registration_id,
          participant_name: participant.name,
          rating,
          feedback_text: feedbackText,
          created_at: new Date().toISOString(),
        },
      });
    }

    return NextResponse.json({
      success: true,
      feedback: null,
    });
  } catch (error: any) {
    console.error("GET feedback error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const token = (body.qr_token || "").trim();
    const rating = Number(body.rating);
    const feedbackText = (body.feedback_text || "").trim();

    if (!token) {
      return NextResponse.json({ success: false, error: "Valid participant token is required." }, { status: 400 });
    }

    if (isNaN(rating) || rating < 1 || rating > 5) {
      return NextResponse.json({ success: false, error: "Please provide a valid rating between 1 and 5 stars." }, { status: 400 });
    }

    if (!feedbackText || feedbackText.length < 3) {
      return NextResponse.json({ success: false, error: "Please share a few words in your feedback." }, { status: 400 });
    }

    const supabase = getAdminClient();

    // 1. Verify participant
    const { data: participant, error: pError } = await supabase
      .from("participants")
      .select("id, registration_id, name, phone, city, college, referral_source")
      .eq("qr_token", token)
      .maybeSingle();

    if (pError || !participant) {
      return NextResponse.json({ success: false, error: "Invalid ticket token or participant not found." }, { status: 404 });
    }

    // 2. Prepare payload
    const feedbackPayload = {
      participant_id: participant.id,
      registration_id: participant.registration_id,
      participant_name: participant.name,
      participant_phone: participant.phone,
      rating: Math.round(rating),
      feedback_text: feedbackText,
      city: participant.city,
      college: participant.college,
      submitted_at: new Date().toISOString(),
    };

    // 3. Write to audit_logs
    const { data: logEntry, error: logError } = await supabase
      .from("audit_logs")
      .insert({
        actor_id: null,
        action: "EVENT_FEEDBACK",
        entity_type: "event_feedback",
        entity_id: participant.id,
        details: feedbackPayload,
      })
      .select("*")
      .single();

    if (logError) {
      console.warn("Audit log insert warning:", logError);
    }

    // 4. Mirror into participant referral_source (preserving existing tags)
    let currentRef = participant.referral_source || "";
    // Remove previous rating and feedback if updating
    currentRef = currentRef
      .replace(/(?:^|\|\s*)Rating:\s*\d(?:\.\d)?(?:\/5)?/gi, "")
      .replace(/(?:^|\|\s*)Feedback:\s*[^|]+/gi, "")
      .trim();

    const sanitizedFeedback = feedbackText.replace(/\|/g, "-").replace(/\n/g, " ").slice(0, 300);
    const feedbackTag = `Rating: ${rating}/5 | Feedback: ${sanitizedFeedback}`;
    const updatedRef = currentRef ? `${currentRef} | ${feedbackTag}` : feedbackTag;

    const { error: updateError } = await supabase
      .from("participants")
      .update({ referral_source: updatedRef })
      .eq("id", participant.id);

    if (updateError) {
      console.warn("Participant referral_source update warning:", updateError);
    }

    return NextResponse.json({
      success: true,
      message: "Thank you for your valuable feedback!",
      feedback: {
        id: logEntry?.id || participant.id,
        participant_id: participant.id,
        registration_id: participant.registration_id,
        participant_name: participant.name,
        rating,
        feedback_text: feedbackText,
        created_at: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error("POST feedback error:", error);
    return NextResponse.json({ success: false, error: "Failed to submit feedback. Please try again." }, { status: 500 });
  }
}
