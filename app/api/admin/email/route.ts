import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getAdminClient } from "@/lib/supabase/admin";
import { generateCertificateEmailHtml } from "@/lib/email/template";
import { eventConfig } from "@/lib/config";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const supabase = getAdminClient();

    // Fetch checked-in participants with valid email addresses
    const { data: participants, error } = await supabase
      .from("participants")
      .select("id, registration_id, name, email, phone, qr_token, checked_in, check_in_time")
      .eq("checked_in", true)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    const eligible = (participants || []).filter(
      (p) => p.email && p.email.trim().includes("@")
    );

    const hasResendKey = Boolean(process.env.RESEND_API_KEY);

    return NextResponse.json({
      success: true,
      total_checked_in: participants?.length || 0,
      eligible_count: eligible.length,
      has_resend_key: hasResendKey,
      sender_email: process.env.RESEND_FROM_EMAIL || "Yuva Shakti Sangam <onboarding@resend.dev>",
      sample_recipients: eligible.slice(0, 10).map((p) => ({
        id: p.id,
        name: p.name,
        email: p.email,
        registration_id: p.registration_id,
      })),
    });
  } catch (err: any) {
    console.error("Email status error:", err);
    return NextResponse.json({ success: false, error: "Server error." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const rawFrom = (process.env.RESEND_FROM_EMAIL || "").trim();
    // Resend requires verified custom domain; if @gmail.com is provided, use onboarding@resend.dev with reply-to
    const isGmailSender = rawFrom.includes("@gmail.com");
    const fromEmail = !rawFrom || isGmailSender
      ? "Yuva Shakti Sangam <onboarding@resend.dev>"
      : rawFrom;
    const replyTo = "yuvashaktisangam2047@gmail.com";

    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: "RESEND_API_KEY is missing in your environment variables (.env.local). Please set RESEND_API_KEY to broadcast.",
        },
        { status: 400 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const isTest = Boolean(body.test_mode);
    const testRecipient = (body.test_email || "").trim();

    const resend = new Resend(apiKey);
    const supabase = getAdminClient();
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || eventConfig.siteUrl || "https://yuvashaktisangam.me";

    // If test mode is requested, send only to test email
    if (isTest) {
      if (!testRecipient || !testRecipient.includes("@")) {
        return NextResponse.json({ success: false, error: "Please provide a valid test email address." }, { status: 400 });
      }

      const sampleHtml = generateCertificateEmailHtml({
        participantName: "Sample Participant",
        registrationId: "YSS-2026-000001",
        ticketUrl: `${baseUrl}/ticket/sample_token`,
      });

      const { data, error } = await resend.emails.send({
        from: fromEmail,
        reply_to: replyTo,
        to: testRecipient,
        subject: "Certificate of Participation & Event Feedback • Yuva Shakti Sangam",
        html: sampleHtml,
      });

      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        message: `Test email sent successfully to ${testRecipient}!`,
        id: data?.id,
      });
    }

    // Production Broadcast to all checked-in participants
    const { data: participants, error: pErr } = await supabase
      .from("participants")
      .select("id, registration_id, name, email, qr_token, checked_in")
      .eq("checked_in", true);

    if (pErr) {
      return NextResponse.json({ success: false, error: pErr.message }, { status: 500 });
    }

    const recipients = (participants || []).filter(
      (p) => p.email && p.email.trim().includes("@")
    );

    if (recipients.length === 0) {
      return NextResponse.json({ success: false, error: "No checked-in participants with valid email addresses found." }, { status: 404 });
    }

    let sentCount = 0;
    let failedCount = 0;
    const errors: string[] = [];

    // Send in batches with rate-limit respect
    for (const p of recipients) {
      try {
        const ticketUrl = `${baseUrl}/ticket/${p.qr_token}`;
        const html = generateCertificateEmailHtml({
          participantName: p.name,
          registrationId: p.registration_id,
          ticketUrl,
        });

        const { error: sendErr } = await resend.emails.send({
          from: fromEmail,
          reply_to: replyTo,
          to: p.email!,
          subject: "Your Official Certificate of Participation & Feedback • Yuva Shakti Sangam",
          html,
        });


        if (sendErr) {
          failedCount++;
          errors.push(`${p.email}: ${sendErr.message}`);
        } else {
          sentCount++;
        }
      } catch (err: any) {
        failedCount++;
        errors.push(`${p.email}: ${err.message}`);
      }

      // Small throttle to avoid hitting Resend rate limits
      await new Promise((resolve) => setTimeout(resolve, 80));
    }

    // Log broadcast action in audit logs
    await supabase.from("audit_logs").insert({
      action: "BROADCAST_EMAIL",
      entity_type: "certificate_feedback_email",
      details: {
        sent_count: sentCount,
        failed_count: failedCount,
        total_recipients: recipients.length,
        timestamp: new Date().toISOString(),
      },
    });

    return NextResponse.json({
      success: true,
      sent_count: sentCount,
      failed_count: failedCount,
      total_recipients: recipients.length,
      errors: errors.slice(0, 5),
    });
  } catch (error: any) {
    console.error("Email broadcast error:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to broadcast emails." }, { status: 500 });
  }
}
