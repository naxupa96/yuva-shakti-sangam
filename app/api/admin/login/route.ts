import { NextRequest, NextResponse } from "next/server";
import { createAdminToken, getAdminCookieName, getAdminCredentials } from "@/lib/auth/admin";
import { getAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password, rememberMe } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: "Username/Email and password are required." },
        { status: 400 }
      );
    }

    const trimmedUsername = String(username).trim();
    const trimmedPassword = String(password).trim();
    const creds = getAdminCredentials();

    let authenticated = false;
    let authUser = "admin";

    // 1. Check against organizer admin credentials
    const isMatchingUsername =
      trimmedUsername.toLowerCase() === creds.username.toLowerCase() ||
      creds.aliases.some((alias) => alias.toLowerCase() === trimmedUsername.toLowerCase());

    if (isMatchingUsername && trimmedPassword === creds.password) {
      authenticated = true;
      authUser = trimmedUsername;
    }

    // 2. Fallback: check Supabase Auth if credentials weren't master credentials
    if (!authenticated) {
      try {
        const supabase = getAdminClient();
        let formattedEmail = trimmedUsername;
        if (!formattedEmail.includes("@")) {
          formattedEmail = `${formattedEmail}@admin.com`;
        }

        const { data, error } = await supabase.auth.signInWithPassword({
          email: formattedEmail,
          password: trimmedPassword,
        });

        if (!error && data?.user) {
          authenticated = true;
          authUser = data.user.email || trimmedUsername;
        }
      } catch (sbErr) {
        // Supabase Auth check failed, ignore
      }
    }

    if (!authenticated) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid organizer credentials. Please verify username and password.",
        },
        { status: 401 }
      );
    }

    // Generate signed admin session token (7 days or 24 hours)
    const duration = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7;
    const token = await createAdminToken(authUser, duration);

    const response = NextResponse.json({
      success: true,
      message: "Admin authentication successful.",
      user: { username: authUser },
    });

    // Set secure HTTP-only cookie
    response.cookies.set({
      name: getAdminCookieName(),
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: duration,
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
