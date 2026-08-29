"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Loader2, ShieldAlert } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Login page does not require an active session check in layout
    if (pathname === "/admin/login") {
      setAuthorized(true);
      setLoading(false);
      return;
    }

    const supabase = createClient();

    const verifySession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          router.replace(`/admin/login?redirect=${encodeURIComponent(pathname)}`);
        } else {
          setAuthorized(true);
        }
      } catch (err) {
        console.error("Session verification failed:", err);
        router.replace("/admin/login");
      } finally {
        setLoading(false);
      }
    };

    verifySession();

    // Listen for auth state changes (e.g. sign out in another tab)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        if (pathname !== "/admin/login") {
          setAuthorized(false);
          router.replace("/admin/login");
        }
      } else if (session) {
        setAuthorized(true);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [pathname, router]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EAE0D0] bg-parchment-texture flex flex-col items-center justify-center p-6 text-[#1C1917]">
        <div className="flex flex-col items-center gap-3 p-8 rounded-3xl bg-[#F5EBE1] border-2 border-[#292524]/20 shadow-parchment-deep">
          <Loader2 className="w-8 h-8 animate-spin text-[#E65100]" />
          <p className="text-xs font-black uppercase tracking-widest text-[#5A4839]">
            Verifying Admin Security Clearance...
          </p>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-[#EAE0D0] bg-parchment-texture flex flex-col items-center justify-center p-6 text-[#1C1917]">
        <div className="flex flex-col items-center gap-3 p-8 rounded-3xl bg-red-50 border-2 border-red-200 shadow-xl max-w-sm text-center">
          <ShieldAlert className="w-10 h-10 text-red-600" />
          <h2 className="font-display font-black text-lg text-red-900 uppercase">
            Access Restricted
          </h2>
          <p className="text-xs text-red-700 font-medium">
            You must be signed in with an authorized organizer account to view this portal.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
