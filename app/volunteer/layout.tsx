"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function VolunteerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (pathname === "/volunteer/login") {
      setAuthorized(true);
      setLoading(false);
      return;
    }

    const checkSession = async () => {
      try {
        const res = await fetch("/api/volunteer/session");
        const data = await res.json();

        if (data.authenticated) {
          setAuthorized(true);
        } else {
          router.replace(`/volunteer/login?redirect=${encodeURIComponent(pathname)}`);
        }
      } catch (err) {
        console.error("Volunteer session check failed:", err);
        router.replace("/volunteer/login");
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [pathname, router]);

  if (pathname === "/volunteer/login") {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1C1917] flex flex-col items-center justify-center p-6 text-[#FAF4EC]">
        <div className="flex flex-col items-center gap-3 p-8 rounded-3xl bg-[#292524] border border-white/10 shadow-xl">
          <Loader2 className="w-8 h-8 animate-spin text-[#FFA000]" />
          <p className="text-xs font-mono font-bold uppercase tracking-widest text-[#FFA000]">
            Verifying Gate Clearance...
          </p>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-[#1C1917] flex flex-col items-center justify-center p-6 text-[#FAF4EC]">
        <div className="flex flex-col items-center gap-3 p-8 rounded-3xl bg-red-950/80 border border-red-800 shadow-xl max-w-sm text-center">
          <ShieldAlert className="w-10 h-10 text-red-400" />
          <h2 className="font-display font-black text-lg text-white uppercase">
            Access Restricted
          </h2>
          <p className="text-xs text-red-200">
            You must be logged in as an authorized Swayamsevak or Gate Organizer to use this scanner.
          </p>
          <Link
            href="/volunteer/login"
            className="mt-2 px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-red-700 transition-colors"
          >
            Go to Volunteer Login
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
