import { NextRequest, NextResponse } from "next/server";
import {
  createAdminToken,
  getAdminCookieName,
  getAdminCredentials,
  ADMIN_SESSION_DURATION,
} from "@/lib/auth/admin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: "Username and password are required." },
        { status: 400 }
      );
    }

    const trimmedUsername = String(username).trim();
    const trimmedPassword = String(password).trim();
    const creds = getAdminCredentials();

    // Strict validation: Only yuva@2047 with bharatmatakijai
    const isMatchingUsername = trimmedUsername.toLowerCase() === creds.username.toLowerCase();
    const isMatchingPassword = trimmedPassword === creds.password;

    if (!isMatchingUsername || !isMatchingPassword) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid username or password.",
        },
        { status: 401 }
      );
    }

    // Generate signed admin session token valid for 1 full year
    const token = await createAdminToken(creds.username, ADMIN_SESSION_DURATION);

    const response = NextResponse.json({
      success: true,
      message: "Admin authentication successful.",
      user: { username: creds.username },
    });

    // Set secure, persistent HTTP-only cookie
    response.cookies.set({
      name: getAdminCookieName(),
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: ADMIN_SESSION_DURATION,
    });

    return response;
  } catch (error: any) {
    console.error("Admin login API error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred during login." },
      { status: 500 }
    );
  }
}
