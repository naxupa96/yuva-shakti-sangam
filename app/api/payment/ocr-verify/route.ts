import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { getAdminClient } from "@/lib/supabase/admin";
import { parseUpiScreenshot } from "@/lib/payment/ocr-vision";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      screenshot_base64,
      manual_utr,
      participant_id,
      name,
      phone,
      email,
      age,
      city,
      college,
      referral_source,
    } = body;

    if (!screenshot_base64 && !manual_utr) {
      return NextResponse.json(
        { success: false, error: "Please upload your payment screenshot or enter your 12-digit UTR." },
        { status: 400 }
      );
    }

    let utr: string | null = manual_utr ? String(manual_utr).trim() : null;
    let ocrConfidence = 0;
    let payeeDetected: string | undefined;
    let rawTextSnippet: string | undefined;

    // 1. Run OCR if screenshot is provided
    if (screenshot_base64) {
      const ocrResult = await parseUpiScreenshot(screenshot_base64);
      rawTextSnippet = ocrResult.rawText;
      payeeDetected = ocrResult.payeeDetected;
      ocrConfidence = ocrResult.confidenceScore;

      if (!utr && ocrResult.utr) {
        utr = ocrResult.utr;
      }
    }

    // 2. Validate UTR format (Must be 12 digits for standard Indian UPI)
    if (!utr || !/^[0-9]{12}$/.test(utr)) {
      return NextResponse.json(
        {
          success: false,
          require_manual_utr: true,
          detected_text: rawTextSnippet,
          error: "Could not detect a valid 12-digit UTR number from the screenshot. Please enter it manually.",
        },
        { status: 400 }
      );
    }

    const supabase = getAdminClient();

    // 3. Prevent duplicate UTR submissions
    const { data: existingPayment } = await supabase
      .from("payments")
      .select("id, participant_id, created_at")
      .or(`gateway_payment_id.eq.${utr},notes.ilike.%${utr}%`)
      .limit(1)
      .maybeSingle();

    if (existingPayment) {
      return NextResponse.json(
        {
          success: false,
          error: `This UPI Reference / UTR (${utr}) has already been used for a registration. Each transaction can only be used once.`,
        },
        { status: 409 }
      );
    }

    let participant: any = null;

    // 4. Update existing participant or create a new one
    if (participant_id) {
      const { data: foundParticipant, error: fetchErr } = await supabase
        .from("participants")
        .select("*")
        .eq("id", participant_id)
        .single();

      if (fetchErr || !foundParticipant) {
        return NextResponse.json(
          { success: false, error: "Participant record not found." },
          { status: 404 }
        );
      }

      participant = foundParticipant;

      // Update participant payment status to paid
      const { data: updatedParticipant, error: updateErr } = await supabase
        .from("participants")
        .update({
          payment_method: "online",
          payment_status: "paid",
          updated_at: new Date().toISOString(),
        })
        .eq("id", participant.id)
        .select("*")
        .single();

      if (updateErr) {
        console.error("Failed to update participant:", updateErr);
        return NextResponse.json(
          { success: false, error: "Failed to update participant payment status." },
          { status: 500 }
        );
      }

      participant = updatedParticipant;
    } else {
      // Validate registration details
      const cleanName = (name || "").trim();
      const cleanPhone = (phone || "").replace(/\D/g, "");
      const cleanEmail = (email || "").trim().toLowerCase();
      const numAge = Number(age);
      const cleanCity = (city || "").trim();

      if (!cleanName || cleanName.length < 2) {
        return NextResponse.json({ success: false, error: "Please enter your full name." }, { status: 400 });
      }
      if (!cleanPhone || cleanPhone.length < 10) {
        return NextResponse.json({ success: false, error: "Please enter a valid 10-digit phone number." }, { status: 400 });
      }
      if (isNaN(numAge) || numAge < 12 || numAge > 80) {
        return NextResponse.json({ success: false, error: "Please enter a valid age (12–80)." }, { status: 400 });
      }
      if (!cleanCity) {
        return NextResponse.json({ success: false, error: "Please enter your city." }, { status: 400 });
      }

      // Check if already paid
      const { data: existingActive } = await supabase
        .from("participants")
        .select("*")
        .eq("phone", cleanPhone)
        .eq("payment_status", "paid")
        .limit(1)
        .maybeSingle();

      if (existingActive) {
        return NextResponse.json({
          success: true,
          already_registered: true,
          message: "You are already confirmed and registered!",
          participant: existingActive,
        });
      }

      const qrToken = `yss_${crypto.randomBytes(20).toString("hex")}`;
      const samvaadQuestion = (body.samvaad_question || "").trim();

      const insertData: any = {
        name: cleanName,
        phone: cleanPhone,
        email: cleanEmail || null,
        age: numAge,
        city: cleanCity,
        college: college ? college.trim() : null,
        referral_source: referral_source
          ? (samvaadQuestion ? `${referral_source.trim()} | Q: ${samvaadQuestion}` : referral_source.trim())
          : (samvaadQuestion ? `Q: ${samvaadQuestion}` : null),
        payment_method: "online",
        payment_status: "paid",
        qr_token: qrToken,
      };

      if (samvaadQuestion) {
        insertData.samvaad_question = samvaadQuestion;
      }

      const { data: newParticipant, error: insertErr } = await supabase
        .from("participants")
        .insert(insertData)
        .select("*")
        .single();

      if (insertErr) {
        delete insertData.samvaad_question;
        const { data: fallbackParticipant, error: fallbackErr } = await supabase
          .from("participants")
          .insert(insertData)
          .select("*")
          .single();

        if (fallbackErr || !fallbackParticipant) {
          console.error("Participant insert error:", fallbackErr || insertErr);
          return NextResponse.json(
            { success: false, error: "Failed to create participant record." },
            { status: 500 }
          );
        }
        participant = fallbackParticipant;
      } else {
        participant = newParticipant;
      }
    }

    // 5. Record payment in payments table
    await supabase.from("payments").insert({
      participant_id: participant.id,
      method: "online",
      amount: 50,
      currency: "INR",
      status: "paid",
      gateway: "upi_ocr",
      gateway_payment_id: utr,
      paid_at: new Date().toISOString(),
      notes: JSON.stringify({
        utr_number: utr,
        payee_detected: payeeDetected || "Kushal Ghanshyambhai",
        ocr_confidence: ocrConfidence,
        verified_at: new Date().toISOString(),
      }),
    });

    // 6. Record audit log
    await supabase.from("audit_logs").insert({
      action: "upi_ocr_payment_verified",
      entity_type: "participant",
      entity_id: participant.id,
      details: {
        utr,
        payee: payeeDetected,
        confidence: ocrConfidence,
        amount: 50,
      },
    });

    return NextResponse.json({
      success: true,
      participant,
      utr,
      token: participant.qr_token,
      registration_id: participant.registration_id,
    });
  } catch (error: any) {
    console.error("OCR verification endpoint error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to verify payment screenshot." },
      { status: 500 }
    );
  }
}
