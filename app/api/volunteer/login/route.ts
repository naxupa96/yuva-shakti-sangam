import { NextRequest, NextResponse } from "next/server";
import {
  createVolunteerToken,
  getVolunteerCookieName,
  getVolunteerCredentials,
  VOLUNTEER_SESSION_DURATION,
} from "@/lib/auth/volunteer";

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

    const trimmedUsername = String(username).trim().toLowerCase();
    const trimmedPassword = String(password).trim();
    const creds = getVolunteerCredentials();

    let authenticated = false;
    let authUser = "Volunteer";

    const isVolunteerPass = trimmedPassword === creds.password;
    const isAdminPass = trimmedPassword === creds.adminPassword;

    // 1. Check admin credentials
    if (isAdminPass && (trimmedUsername === "yuva@2047" || trimmedUsername === "admin")) {
      authenticated = true;
      authUser = "Admin (Gate Lead)";
    }
    // 2. Check volunteer credentials (accepts any volunteer name/ID with valid event password)
    else if (isVolunteerPass && trimmedUsername.length >= 2) {
      authenticated = true;
      authUser = trimmedUsername
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
    }

    if (!authenticated) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid volunteer credentials. Please verify your username and password.",
        },
        { status: 401 }
      );
    }

    // Generate signed volunteer session token
    const token = await createVolunteerToken(authUser, VOLUNTEER_SESSION_DURATION);

    const response = NextResponse.json({
      success: true,
      message: "Volunteer authentication successful.",
      user: { username: authUser },
    });

    // Set secure HTTP-only cookie
    response.cookies.set({
      name: getVolunteerCookieName(),
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: VOLUNTEER_SESSION_DURATION,
    });

    return response;
  } catch (error: any) {
    console.error("Volunteer login API error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred during login." },
      { status: 500 }
    );
  }
}
