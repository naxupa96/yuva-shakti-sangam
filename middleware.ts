import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { getAdminCookieName, verifyAdminToken } from "@/lib/auth/admin";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const pathname = request.nextUrl.pathname;
  const isLoginPage = pathname === "/admin/login";
  const isAdminRoute = pathname.startsWith("/admin");
  const isAdminApiRoute = pathname.startsWith("/api/admin");
  const isAuthApiRoute =
    pathname === "/api/admin/login" ||
    pathname === "/api/admin/logout" ||
    pathname === "/api/admin/session";

  // Allow public auth API endpoints without verification
  if (isAuthApiRoute) {
    return supabaseResponse;
  }

  // Check 1: Admin signed session cookie
  const adminCookie = request.cookies.get(getAdminCookieName())?.value;
  const { valid: isAdminTokenValid } = await verifyAdminToken(adminCookie);

  let isAuthenticated = isAdminTokenValid;

  // Check 2: Supabase Auth session as fallback
  if (!isAuthenticated) {
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
        isAuthenticated = true;
      }
    } catch (err) {
      // Supabase user fetch failed, proceed with isAuthenticated = false
    }
  }

  // 1. Protect Admin API endpoints
  if (isAdminApiRoute && !isAuthenticated) {
    return NextResponse.json(
      { success: false, error: "Unauthorized. Admin session required." },
      { status: 401 }
    );
  }

  // 2. Protect Admin Frontend Pages (Redirect unauthenticated users to /admin/login)
  if (isAdminRoute && !isLoginPage && !isAuthenticated) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/admin/login";
    if (pathname !== "/admin") {
      redirectUrl.searchParams.set("redirect", pathname);
    }
    return NextResponse.redirect(redirectUrl);
  }

  // 3. Prevent logged-in admin from staying on /admin/login
  if (isLoginPage && isAuthenticated) {
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
  ],
};
