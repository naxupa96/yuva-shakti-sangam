import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";
import { getPaymentProvider } from "@/lib/payment/provider";

export async function POST(req: NextRequest) {
  try {
    const { participant_id, order_id, payment_id, signature } = await req.json();

    if (!participant_id || !order_id || !payment_id) {
      return NextResponse.json(
        { success: false, error: "Missing required payment verification parameters." },
        { status: 400 }
      );
    }

    const provider = getPaymentProvider();
    const isValid = await provider.verifyPayment({
      orderId: order_id,
      paymentId: payment_id,
      signature,
    });

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Payment verification failed. Invalid gateway signature." },
        { status: 400 }
      );
    }

    const supabase = getAdminClient();

    // Fetch participant
    const { data: participant, error: fetchError } = await supabase
      .from("participants")
      .select("*")
      .eq("id", participant_id)
      .single();

    if (fetchError || !participant) {
      return NextResponse.json(
        { success: false, error: "Participant not found for payment." },
        { status: 404 }
      );
    }

    // Check if already paid to ensure idempotency
    if (participant.payment_status === "paid") {
      return NextResponse.json({
        success: true,
        message: "Payment already verified.",
        participant,
      });
    }

    // Update participant to paid
    const { data: updatedParticipant, error: updateError } = await supabase
      .from("participants")
      .update({
        payment_status: "paid",
        updated_at: new Date().toISOString(),
      })
      .eq("id", participant_id)
      .select("*")
      .single();

    if (updateError || !updatedParticipant) {
      console.error("Participant status update error:", updateError);
      return NextResponse.json(
        { success: false, error: "Failed to update participant payment status." },
        { status: 500 }
      );
    }

    // Record verified payment
    await supabase.from("payments").insert({
      participant_id,
      method: "online",
      amount: 50,
      currency: "INR",
      status: "paid",
      gateway: provider.name,
      gateway_order_id: order_id,
      gateway_payment_id: payment_id,
      gateway_signature: signature || null,
      paid_at: new Date().toISOString(),
    });

    // Record audit log
    await supabase.from("audit_logs").insert({
      action: "online_payment_verified",
      entity_type: "participant",
      entity_id: participant_id,
      details: {
        order_id,
        payment_id,
        gateway: provider.name,
        amount: 50,
      },
    });

    return NextResponse.json({
      success: true,
      participant: updatedParticipant,
    });
  } catch (error: any) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { success: false, error: "Server payment verification error." },
      { status: 500 }
    );
  }
}
