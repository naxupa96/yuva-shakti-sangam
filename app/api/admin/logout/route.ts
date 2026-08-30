import { NextRequest, NextResponse } from "next/server";
import { getAdminCookieName } from "@/lib/auth/admin";

export async function POST(_req: NextRequest) {
  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully.",
  });

  // Clear admin session cookie
  response.cookies.set({
    name: getAdminCookieName(),
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}

export async function GET(_req: NextRequest) {
  return POST(_req);
}
