"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  ShieldAlert,
  LayoutDashboard,
  QrCode,
  Users,
  CreditCard,
  LogOut,
  ShieldCheck,
  ExternalLink,
  MessageSquareQuote,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [adminUser, setAdminUser] = useState<string>("admin");
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    // Login page does not require an active session check in layout
    if (pathname === "/admin/login") {
      setAuthorized(true);
      setLoading(false);
      return;
    }

    const verifySession = async () => {
      try {
        const res = await fetch("/api/admin/session");
        const data = await res.json();

        if (data.authenticated) {
          setAuthorized(true);
          if (data.user?.username) {
            setAdminUser(data.user.username);
          }
        } else {
          router.replace(`/admin/login?redirect=${encodeURIComponent(pathname)}`);
        }
      } catch (err) {
        console.error("Session verification failed:", err);
        router.replace("/admin/login");
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, [pathname, router]);

  const handleSignOut = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      window.location.href = "/admin/login";
    }
  };

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
          <Link
            href="/admin/login"
            className="mt-2 px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-red-700 transition-colors"
          >
            Go to Organizer Login
          </Link>
        </div>
      </div>
    );
  }

  const navLinks = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/checkin", label: "Check-in Scanner", icon: QrCode },
    { href: "/admin/participants", label: "Participants", icon: Users },
    { href: "/admin/questions", label: "Questions", icon: MessageSquareQuote },
    { href: "/admin/payments", label: "Payments", icon: CreditCard },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#EAE0D0] bg-parchment-texture text-[#1C1917]">
      {/* Top Global Navigation Bar for Admin Area */}
      <header className="sticky top-0 z-50 bg-[#1C1917] border-b border-[#292524] text-[#FAF4EC] shadow-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#E65100] text-white flex items-center justify-center font-black text-sm shadow">
                YS
              </div>
              <div className="hidden sm:block">
                <span className="font-display font-black text-sm uppercase tracking-wider text-white">
                  Yuva Shakti <span className="text-[#FFA000]">Admin</span>
                </span>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-1 pl-4 border-l border-white/10">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive =
                  link.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                      isActive
                        ? "bg-[#E65100] text-white shadow-sm"
                        : "text-white/70 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-[#FFA000]">
              <ShieldCheck className="w-3.5 h-3.5 text-green-400" />
              <span>{adminUser}</span>
            </div>

            <Link
              href="/"
              target="_blank"
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors text-xs flex items-center gap-1"
              title="View Public Website"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>

            <button
              onClick={handleSignOut}
              disabled={loggingOut}
              className="px-3 py-1.5 rounded-lg bg-red-600/80 hover:bg-red-600 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              title="Sign Out"
            >
              {loggingOut ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <LogOut className="w-3.5 h-3.5" />
              )}
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="md:hidden flex items-center gap-1 px-4 py-2 bg-[#24170D] border-t border-white/5 overflow-x-auto">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive =
              link.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 whitespace-nowrap ${
                  isActive
                    ? "bg-[#E65100] text-white"
                    : "text-white/70 hover:text-white"
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
