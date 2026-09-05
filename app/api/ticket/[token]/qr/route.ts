import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";
import { getAdminClient } from "@/lib/supabase/admin";
import { eventConfig } from "@/lib/config";

/**
 * Public, read-only endpoint returning a high-resolution QR code PNG
 * for a participant's existing qr_token.
 * Encodes: https://<siteUrl>/ticket/<qr_token>
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    if (!token) {
      return new NextResponse("Missing ticket token", { status: 400 });
    }

    const supabase = getAdminClient();

    // Verify token exists in database (read-only)
    const { data: participant, error } = await supabase
      .from("participants")
      .select("id, registration_id, qr_token")
      .eq("qr_token", token)
      .maybeSingle();

    if (error || !participant) {
      return new NextResponse("Ticket not found or invalid token", { status: 404 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || eventConfig.siteUrl || "https://yuvashaktisangam.me";
    const qrTarget = `${siteUrl}/ticket/${participant.qr_token}`;

    const pngBuffer = await QRCode.toBuffer(qrTarget, {
      type: "png",
      errorCorrectionLevel: "H",
      margin: 2,
      width: 500,
      color: {
        dark: "#17130E",
        light: "#FFFFFF",
      },
    });

    return new NextResponse(new Uint8Array(pngBuffer), {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (err: any) {
    console.error("QR generation endpoint error:", err);
    return new NextResponse("Failed to generate QR code image", { status: 500 });
  }
}
