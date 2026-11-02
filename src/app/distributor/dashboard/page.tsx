"use client";
import React from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import {
  Package, TrendingUp, Globe, DollarSign,
  Bell, Settings, LogOut, ChevronRight,
  MapPin, BarChart3, Users, ArrowUpRight, Truck
} from "lucide-react";

export default function DistributorDashboard() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      window.location.href = "/login/distributor";
    },
  });

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#0A0F0D] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-emerald-500/30 border-t-emerald-400 rounded-full animate-spin" />
          <p className="text-xs font-mono text-white/40 uppercase tracking-widest">Loading Distributor Portal...</p>
        </div>
      </div>
    );
  }

  const user = session?.user;
  const displayName = user?.name || "Distributor";
  const initials = displayName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();

  const stats = [
    { label: "Total Revenue", value: "₦0.00", icon: DollarSign, color: "text-[#B89248]", bg: "bg-[#B89248]/10", border: "border-[#B89248]/20" },
    { label: "Active Orders", value: "0", icon: Truck, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { label: "Territory Coverage", value: "—", icon: Globe, color: "text-sky-400", bg: "bg-sky-500/10", border: "border-sky-500/20" },
    { label: "Partner Retailers", value: "0", icon: Users, color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20" },
  ];

  const quickActions = [
    { label: "Manage Orders", desc: "View and process current orders", icon: Package, href: "#" },
    { label: "Territory Map", desc: "See your distribution coverage", icon: MapPin, href: "#" },
    { label: "Revenue Reports", desc: "Monthly earnings and analytics", icon: BarChart3, href: "#" },
    { label: "Onboard Retailers", desc: "Add new partner stores", icon: ArrowUpRight, href: "#" },
  ];

  return (
    <div className="min-h-screen bg-[#0A0F0D] text-white font-sans">
      {/* Ambient glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-emerald-500/8 to-transparent rounded-full blur-[120px] pointer-events-none" />

      {/* Top Nav */}
      <header className="relative z-10 border-b border-white/10 bg-[#0A0F0D]/80 backdrop-blur-xl sticky top-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm font-serif text-[#B89248] tracking-wider">Desla</Link>
            <span className="text-white/20">/</span>
            <span className="text-xs font-mono text-white/50 uppercase tracking-widest">Distributor Portal</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors">
              <Bell className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors">
              <Settings className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 pl-3 border-l border-white/10">
              {user?.image ? (
                <img src={user.image} alt={displayName} className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500/30" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xs font-bold">
                  {initials}
                </div>
              )}
              <span className="text-xs text-white/70 hidden sm:block">{displayName}</span>
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
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono uppercase tracking-widest mb-4">
            <Package className="w-3 h-3" />
            Distributor Dashboard
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-light tracking-wide mb-2">
            Welcome, {displayName.split(" ")[0]}
          </h1>
          <p className="text-sm text-white/50">
            Your Desla Distribution Portal — manage territories, orders, and partner relationships.
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map(({ label, value, icon: Icon, color, bg, border }) => (
            <div key={label} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/8 transition-colors">
              <div className={`w-9 h-9 rounded-xl ${bg} border ${border} flex items-center justify-center mb-4`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <div className="text-2xl font-bold tracking-tight mb-1">{value}</div>
              <div className="text-xs text-white/40 font-mono">{label}</div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="mb-10">
          <h2 className="text-base font-semibold mb-4 text-white/80">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quickActions.map(({ label, desc, icon: Icon, href }) => (
              <a
                key={label}
                href={href}
                className="group flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/8 hover:border-emerald-500/30 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors">{label}</div>
                  <div className="text-xs text-white/40">{desc}</div>
                </div>
                <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
              </a>
            ))}
          </div>
        </div>

        {/* Status banner */}
        <div className="bg-gradient-to-r from-emerald-500/10 to-[#B89248]/10 border border-emerald-500/20 rounded-2xl p-6 flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">Distributor Waitlist Active</span>
            </div>
            <p className="text-sm text-white/70">
              Desla is in pre-launch. Your distributor account is registered. Territory assignment happens at launch.
            </p>
          </div>
          <Link
            href="/waitlist?role=distributor"
            className="flex-shrink-0 text-xs font-semibold px-4 py-2 rounded-xl bg-emerald-500 text-white hover:bg-emerald-400 transition-colors"
          >
            View Status
          </Link>
        </div>

        {/* Profile info */}
        <div className="mt-6 bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-white/80 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            Account Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="text-[11px] font-mono text-white/40 uppercase tracking-widest mb-1">Name</div>
              <div className="text-sm text-white">{user?.name || "—"}</div>
            </div>
            <div>
              <div className="text-[11px] font-mono text-white/40 uppercase tracking-widest mb-1">Email</div>
              <div className="text-sm text-white">{user?.email || "—"}</div>
            </div>
            <div>
              <div className="text-[11px] font-mono text-white/40 uppercase tracking-widest mb-1">Role</div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                Distributor
              </div>
            </div>
            <div>
              <div className="text-[11px] font-mono text-white/40 uppercase tracking-widest mb-1">Status</div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[#B89248] bg-[#B89248]/10 px-2.5 py-0.5 rounded-full border border-[#B89248]/20">
                Pre-Launch
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}