import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { getAdminCookieName, verifyAdminToken } from "@/lib/auth/admin";
import { getVolunteerCookieName, verifyVolunteerToken } from "@/lib/auth/volunteer";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const pathname = request.nextUrl.pathname;

  // 1. Volunteer route logic
  const isVolunteerLoginPage = pathname === "/volunteer/login";
  const isVolunteerRoute = pathname.startsWith("/volunteer");
  const isVolunteerApiRoute = pathname.startsWith("/api/volunteer");
  const isVolunteerAuthApi =
    pathname === "/api/volunteer/login" ||
    pathname === "/api/volunteer/logout" ||
    pathname === "/api/volunteer/session";

  if (isVolunteerAuthApi) {
    return supabaseResponse;
  }

  // Check admin session (admin can also access volunteer area)
  const adminCookie = request.cookies.get(getAdminCookieName())?.value;
  const { valid: isAdminTokenValid } = await verifyAdminToken(adminCookie);

  // Check volunteer session
  const volunteerCookie = request.cookies.get(getVolunteerCookieName())?.value;
  const { valid: isVolunteerTokenValid } = await verifyVolunteerToken(volunteerCookie);

  const isVolunteerAuthenticated = isVolunteerTokenValid || isAdminTokenValid;

  // Protect Volunteer API routes
  if (isVolunteerApiRoute && !isVolunteerAuthenticated) {
    return NextResponse.json(
      { success: false, error: "Unauthorized. Volunteer access required." },
      { status: 401 }
    );
  }

  // Protect Volunteer Pages
  if (isVolunteerRoute) {
    if (!isVolunteerLoginPage && !isVolunteerAuthenticated) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/volunteer/login";
      if (pathname !== "/volunteer") {
        redirectUrl.searchParams.set("redirect", pathname);
      }
      return NextResponse.redirect(redirectUrl);
    }

    if (isVolunteerLoginPage && isVolunteerAuthenticated) {
      const redirectParam = request.nextUrl.searchParams.get("redirect");
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = redirectParam && redirectParam.startsWith("/volunteer") ? redirectParam : "/volunteer";
      redirectUrl.search = "";
      return NextResponse.redirect(redirectUrl);
    }

    return supabaseResponse;
  }

  // 2. Admin route logic
  const isAdminLoginPage = pathname === "/admin/login";
  const isAdminRoute = pathname.startsWith("/admin");
  const isAdminApiRoute = pathname.startsWith("/api/admin");
  const isAdminAuthApi =
    pathname === "/api/admin/login" ||
    pathname === "/api/admin/logout" ||
    pathname === "/api/admin/session";

  if (isAdminAuthApi) {
    return supabaseResponse;
  }

  let isAdminAuthenticated = isAdminTokenValid;

  // Supabase Auth session fallback for admin
  if (!isAdminAuthenticated) {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://xoxklwtgbrohierzfztj.supabase.co";
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

      const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            supabaseResponse = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      });

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        isAdminAuthenticated = true;
      }
    } catch (err) {
      // Supabase fetch failed
    }
  }

  // Protect Admin API endpoints
  if (isAdminApiRoute && !isAdminAuthenticated) {
    return NextResponse.json(
      { success: false, error: "Unauthorized. Admin session required." },
      { status: 401 }
    );
  }

  // Protect Admin Frontend Pages
  if (isAdminRoute && !isAdminLoginPage && !isAdminAuthenticated) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/admin/login";
    if (pathname !== "/admin") {
      redirectUrl.searchParams.set("redirect", pathname);
    }
    return NextResponse.redirect(redirectUrl);
  }

  // Prevent logged-in admin from staying on /admin/login
  if (isAdminLoginPage && isAdminAuthenticated) {
    const redirectParam = request.nextUrl.searchParams.get("redirect");
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = redirectParam && redirectParam.startsWith("/admin") ? redirectParam : "/admin";
    redirectUrl.search = "";
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/volunteer/:path*",
    "/api/volunteer/:path*",
  ],
};
