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

    // 1. Check volunteer credentials
    const isVolunteerUser = creds.usernames.includes(trimmedUsername);
    const isVolunteerPass = trimmedPassword === creds.password;

    // 2. Also allow admin credentials
    const isAdminUser = trimmedUsername === "yuva@2047";
    const isAdminPass = trimmedPassword === creds.adminPassword;

    if ((isVolunteerUser && isVolunteerPass) || (isAdminUser && isAdminPass)) {
      authenticated = true;
      authUser = trimmedUsername === "yuva@2047" ? "Admin (Gate Lead)" : "Swayamsevak";
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
