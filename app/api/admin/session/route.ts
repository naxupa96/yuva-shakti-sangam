import { NextRequest, NextResponse } from "next/server";
import { getAdminCookieName, verifyAdminToken } from "@/lib/auth/admin";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get(getAdminCookieName())?.value;
    const { valid, username } = await verifyAdminToken(token);

    if (!valid) {
      return NextResponse.json({
        authenticated: false,
      });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        username: username || "Admin",
        role: "admin",
      },
    });
  } catch (error) {
    return NextResponse.json({
      authenticated: false,
    });
  }
}
