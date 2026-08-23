import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";
import { getPaymentProvider } from "@/lib/payment/provider";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature") ||
                      req.headers.get("x-webhook-signature") ||
                      req.headers.get("x-cashfree-signature") || "";

    const provider = getPaymentProvider();
    const result = await provider.handleWebhook(rawBody, signature);

    if (!result.verified) {
      console.warn("Webhook signature validation failed");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    if (result.status === "paid" && (result.orderId || result.paymentId)) {
      const supabase = getAdminClient();

      // Find participant by gateway_order_id in payments or matching notes
      const { data: paymentRecord } = await supabase
        .from("payments")
        .select("id, participant_id, status")
        .eq("gateway_order_id", result.orderId)
        .maybeSingle();

      if (paymentRecord) {
        if (paymentRecord.status !== "paid") {
          // Update participant
          await supabase
            .from("participants")
            .update({ payment_status: "paid", updated_at: new Date().toISOString() })
            .eq("id", paymentRecord.participant_id);

          // Update payment record
          await supabase
            .from("payments")
            .update({
              status: "paid",
              gateway_payment_id: result.paymentId,
              paid_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq("id", paymentRecord.id);

          // Audit log
          await supabase.from("audit_logs").insert({
            action: "webhook_payment_captured",
            entity_type: "payment",
            entity_id: paymentRecord.id,
            details: {
              order_id: result.orderId,
              payment_id: result.paymentId,
              amount: result.amount,
            },
          });
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
