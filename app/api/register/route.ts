import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { getAdminClient } from "@/lib/supabase/admin";
import { getPaymentProvider } from "@/lib/payment/provider";
import { RegistrationInput } from "@/types/registration";

export async function POST(req: NextRequest) {
  try {
    const body: RegistrationInput = await req.json();

    // 1. Validation
    const name = (body.name || "").trim();
    const phone = (body.phone || "").replace(/\D/g, "");
    const email = (body.email || "").trim().toLowerCase();
    const age = Number(body.age);
    const city = (body.city || "").trim();
    const college = (body.college || "").trim();
    const referralSource = (body.referral_source || "").trim();
    const samvaadQuestion = (body.samvaad_question || "").trim();
    const interests = Array.isArray(body.interests) ? body.interests : [];
    const paymentMethod = body.payment_method;

    if (!name || name.length < 2) {
      return NextResponse.json({ success: false, error: "Please enter your full name." }, { status: 400 });
    }

    if (!phone || phone.length < 10) {
      return NextResponse.json({ success: false, error: "Please enter a valid 10-digit mobile number." }, { status: 400 });
    }

    if (isNaN(age) || age < 12 || age > 80) {
      return NextResponse.json({ success: false, error: "Please enter a valid age (12–80)." }, { status: 400 });
    }

    if (!city) {
      return NextResponse.json({ success: false, error: "Please specify your city." }, { status: 400 });
    }

    if (paymentMethod !== "online" && paymentMethod !== "cash") {
      return NextResponse.json({ success: false, error: "Invalid payment method selected." }, { status: 400 });
    }

    const supabase = getAdminClient();

    // 2. Check for existing active registration by phone
    const { data: existingParticipant } = await supabase
      .from("participants")
      .select("*")
      .eq("phone", phone)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existingParticipant && existingParticipant.payment_status === "paid") {
      return NextResponse.json({
        success: true,
        already_registered: true,
        message: "You are already registered and confirmed for Yuva Shakti Sangam!",
        participant: existingParticipant,
      });
    }

    // 3. Generate Cryptographic QR Token
    const qrToken = `yss_${crypto.randomBytes(20).toString("hex")}`;

    // 4. Create participant record in Supabase
    let newParticipant: any = null;
    const interestStr = interests.join(", ");
    let combinedReferral = referralSource;
    if (samvaadQuestion) {
      combinedReferral = combinedReferral ? `${combinedReferral} | Q: ${samvaadQuestion}` : `Q: ${samvaadQuestion}`;
    }
    if (interestStr) {
      combinedReferral = combinedReferral ? `${combinedReferral} | Interests: ${interestStr}` : `Interests: ${interestStr}`;
    }

    const insertData: any = {
      name,
      phone,
      email: email || null,
      age,
      city,
      college: college || null,
      referral_source: combinedReferral || null,
      payment_method: paymentMethod,
      payment_status: "pending",
      qr_token: qrToken,
    };

    if (samvaadQuestion) {
      insertData.samvaad_question = samvaadQuestion;
    }
    if (interests.length > 0) {
      insertData.interests = interests;
    }

    const { data: inserted, error: insertError } = await supabase
      .from("participants")
      .insert(insertData)
      .select("*")
      .single();

    if (insertError) {
      // Fallback without dynamic columns if schema doesn't have them yet
      delete insertData.samvaad_question;
      delete insertData.interests;
      const { data: fallbackInsert, error: fallbackError } = await supabase
        .from("participants")
        .insert(insertData)
        .select("*")
        .single();

      if (fallbackError || !fallbackInsert) {
        console.error("Database registration error:", fallbackError || insertError);
        return NextResponse.json(
          { success: false, error: "Registration could not be saved. Please try again." },
          { status: 500 }
        );
      }
      newParticipant = fallbackInsert;
    } else {
      newParticipant = inserted;
    }

    // 5. Payment processing
    if (paymentMethod === "online") {
      const provider = getPaymentProvider();
      try {
        const order = await provider.createOrder({
          amount: 50,
          currency: "INR",
          receipt: newParticipant.registration_id,
          notes: {
            participant_id: newParticipant.id,
            registration_id: newParticipant.registration_id,
            phone: newParticipant.phone,
          },
          customer: {
            name: newParticipant.name,
            phone: newParticipant.phone,
            email: newParticipant.email || undefined,
          },
        });

        // Store initial pending payment record
        await supabase.from("payments").insert({
          participant_id: newParticipant.id,
          method: "online",
          amount: 50,
          currency: "INR",
          status: "pending",
          gateway: order.gateway,
          gateway_order_id: order.order_id,
        });

        return NextResponse.json({
          success: true,
          participant: newParticipant,
          payment_order: order,
        });
      } catch (err: any) {
        console.error("Payment order generation error:", err);
        return NextResponse.json(
          {
            success: false,
            error: "Payment gateway initialized with error. Please select Cash or try again.",
          },
          { status: 500 }
        );
      }
    }

    // 6. Cash Registration flow
    return NextResponse.json({
      success: true,
      participant: newParticipant,
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
