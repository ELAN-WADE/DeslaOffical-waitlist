"use client";
import React from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import {
  ShieldCheck, Users, Mail, BarChart3,
  Bell, Settings, LogOut, ChevronRight,
  Database, Megaphone, ExternalLink
} from "lucide-react";

export default function AdminPortalPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      window.location.href = "/login/admin";
    },
  });

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#111112] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-[#B89248]/30 border-t-[#B89248] rounded-full animate-spin" />
          <p className="text-xs font-mono text-white/40 uppercase tracking-widest">Verifying Admin Access...</p>
        </div>
      </div>
    );
  }

  const user = session?.user;
  const displayName = user?.name || "Admin";
  const role = (user as Record<string, unknown>)?.role as string;

  if (role !== "admin") {
    return (
      <div className="min-h-screen bg-[#111112] flex items-center justify-center p-6">
        <div className="max-w-sm text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-7 h-7 text-red-400" />
          </div>
          <h1 className="text-xl font-serif text-white mb-2">Unauthorized Access</h1>
          <p className="text-sm text-white/50 mb-6">
            Your Google account ({user?.email}) does not have admin privileges. Only whitelisted admin accounts may access this portal.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-full py-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-semibold hover:bg-red-500/30 transition-colors"
            >
              Sign Out
            </button>
            <Link href="/login/admin" className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white/70 text-sm font-semibold text-center hover:bg-white/10 transition-colors block">
              Use Password Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const adminModules = [
    {
      label: "Waitlist Console",
      desc: "Manage all waitlist entries, export data, run email broadcasts",
      icon: Users,
      href: "/manage.elantheadmin.waitlist",
      color: "text-[#B89248]",
      bg: "bg-[#B89248]/10",
      border: "border-[#B89248]/20",
      external: true,
    },
    {
      label: "Email Dispatch",
      desc: "Monitor outbox, trigger worker, view send logs",
      icon: Mail,
      href: "/manage.elantheadmin.waitlist",
      color: "text-sky-400",
      bg: "bg-sky-500/10",
      border: "border-sky-500/20",
      external: true,
    },
    {
      label: "Analytics",
      desc: "Waitlist growth, role distribution, referral tracking",
      icon: BarChart3,
      href: "#",
      color: "text-violet-400",
      bg: "bg-violet-500/10",
      border: "border-violet-500/20",
      external: false,
    },
    {
      label: "Broadcast Tool",
      desc: "Send announcements to creators, distributors, or all members",
      icon: Megaphone,
      href: "/manage.elantheadmin.waitlist",
      color: "text-pink-400",
      bg: "bg-pink-500/10",
      border: "border-pink-500/20",
      external: true,
    },
    {
      label: "Database",
      desc: "View raw Supabase tables and manage records",
      icon: Database,
      href: "#",
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      external: false,
    },
    {
      label: "Settings",
      desc: "Email config, SMTP diagnostics, API keys",
      icon: Settings,
      href: "/manage.elantheadmin.waitlist",
      color: "text-orange-400",
      bg: "bg-orange-500/10",
      border: "border-orange-500/20",
      external: true,
    },
  ];

  return (
    <div className="min-h-screen bg-[#111112] text-white font-sans">
      {/* Ambient glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-[#B89248]/8 to-transparent rounded-full blur-[120px] pointer-events-none" />

      {/* Top Nav */}
      <header className="relative z-10 border-b border-white/10 bg-[#111112]/80 backdrop-blur-xl sticky top-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm font-serif text-[#B89248] tracking-wider">Desla</Link>
            <span className="text-white/20">/</span>
            <span className="text-xs font-mono text-[#B89248] uppercase tracking-widest">Admin Portal</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors">
              <Bell className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 pl-3 border-l border-white/10">
              {user?.image ? (
                <img src={user.image} alt={displayName} className="w-8 h-8 rounded-full object-cover ring-2 ring-[#B89248]/40" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#B89248]/20 border border-[#B89248]/30 flex items-center justify-center text-[#B89248] text-xs font-bold">
                  {displayName[0]}
                </div>
              )}
              <div className="hidden sm:block">
                <div className="text-xs text-white/70">{displayName}</div>
                <div className="text-[10px] font-mono text-[#B89248] uppercase tracking-widest">Master Admin</div>
              </div>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/80 transition-colors font-mono"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:block">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-8 py-10">
        {/* Welcome */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#B89248]/10 border border-[#B89248]/20 text-[#B89248] text-xs font-mono uppercase tracking-widest mb-4">
            <ShieldCheck className="w-3 h-3" />
            Executive Console
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-light tracking-wide mb-2">
            Welcome back, {displayName.split(" ")[0]}
          </h1>
          <p className="text-sm text-white/50">
            Desla Executive Admin Portal — full system access and operations control.
          </p>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
              ● Google Auth Active
            </span>
            <span className="text-[11px] font-mono text-[#9E9A95]">{user?.email}</span>
          </div>
        </div>

        {/* Admin modules grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {adminModules.map(({ label, desc, icon: Icon, href, color, bg, border, external }) => (
            <a
              key={label}
              href={href}
              target={external ? "_self" : undefined}
              className="group flex flex-col p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/8 hover:border-white/20 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl ${bg} border ${border} flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
                {external ? (
                  <ExternalLink className="w-3.5 h-3.5 text-white/20 group-hover:text-white/50 transition-colors" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-white/20 group-hover:text-white/50 group-hover:translate-x-0.5 transition-all" />
                )}
              </div>
              <div className={`text-sm font-semibold text-white group-hover:${color} transition-colors mb-1`}>{label}</div>
              <div className="text-xs text-white/40 leading-relaxed">{desc}</div>
            </a>
          ))}
        </div>

        {/* Direct link to existing admin console */}
        <div className="mt-8 bg-[#1A1A1C] border border-[#B89248]/20 rounded-2xl p-6 flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-4 h-4 text-[#B89248]" />
              <span className="text-sm font-semibold text-[#B89248]">Full Admin Console</span>
            </div>
            <p className="text-xs text-white/50">
              Access the complete waitlist management console with email dispatch, SMTP config, and CSV export.
            </p>
          </div>
          <Link
            href="/manage.elantheadmin.waitlist"
            className="flex-shrink-0 flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-xl bg-[#B89248] text-[#111112] hover:bg-[#C5A059] transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Open Console
          </Link>
        </div>
      </main>
    </div>
  );
}