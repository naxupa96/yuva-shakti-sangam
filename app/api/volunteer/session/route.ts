import { NextRequest, NextResponse } from "next/server";
import { getVolunteerCookieName, verifyVolunteerToken } from "@/lib/auth/volunteer";
import { getAdminCookieName, verifyAdminToken } from "@/lib/auth/admin";

export async function GET(req: NextRequest) {
  try {
    // 1. Check volunteer session
    const volunteerToken = req.cookies.get(getVolunteerCookieName())?.value;
    const { valid: isVolunteerValid, username: vUser } = await verifyVolunteerToken(volunteerToken);

    if (isVolunteerValid) {
      return NextResponse.json({
        authenticated: true,
        user: {
          username: vUser || "Swayamsevak",
          role: "volunteer",
        },
      });
    }

    // 2. Also check admin session (Admin can access volunteer scanner)
    const adminToken = req.cookies.get(getAdminCookieName())?.value;
    const { valid: isAdminValid, username: aUser } = await verifyAdminToken(adminToken);

    if (isAdminValid) {
      return NextResponse.json({
        authenticated: true,
        user: {
          username: aUser || "Admin",
          role: "admin",
        },
      });
    }

    return NextResponse.json({ authenticated: false });
  } catch (error) {
    return NextResponse.json({ authenticated: false });
  }
}
