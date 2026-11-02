"use client";
import React from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, Package, ShieldCheck } from "lucide-react";

const portals = [
  {
    role: "Creator",
    desc: "Content creators, influencers & brand ambassadors",
    icon: Sparkles,
    href: "/login/creator",
    color: "text-[#B89248]",
    bg: "bg-[#B89248]/10",
    border: "border-[#B89248]/20",
    hoverBorder: "hover:border-[#B89248]/50",
    badgeColor: "text-[#B89248]",
    glow: "from-[#B89248]/20",
  },
  {
    role: "Distributor",
    desc: "Distribution partners & territory managers",
    icon: Package,
    href: "/login/distributor",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    hoverBorder: "hover:border-emerald-500/50",
    badgeColor: "text-emerald-400",
    glow: "from-emerald-500/15",
  },
  {
    role: "Admin",
    desc: "Executive operations console & system management",
    icon: ShieldCheck,
    href: "/login/admin",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    hoverBorder: "hover:border-violet-500/50",
    badgeColor: "text-violet-400",
    glow: "from-violet-500/15",
  },
];

export default function LoginIndexPage() {
  return (
    <div className="min-h-screen bg-[#0D0D0F] text-white flex flex-col relative overflow-hidden font-sans">
      {/* Ambient background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#B89248_0%,_transparent_50%)] opacity-5 pointer-events-none" />

      {/* Top nav */}
      <div className="relative z-10 flex items-center justify-between p-6 sm:p-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs text-white/40 hover:text-white/80 transition-colors font-mono uppercase tracking-widest"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Desla
        </Link>
        <span className="text-sm font-serif text-[#B89248] tracking-wider">Desla!</span>
      </div>

      {/* Main */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-serif font-light tracking-wide mb-4">
              Partner Access
            </h1>
            <p className="text-sm text-white/50 leading-relaxed">
              Select your portal to sign in or apply to join the Desla ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {portals.map(({ role, desc, icon: Icon, href, color, bg, border, hoverBorder, glow }) => (
              <Link
                key={role}
                href={href}
                className={`group relative flex flex-col p-6 bg-white/5 border ${border} ${hoverBorder} rounded-2xl hover:bg-white/8 transition-all overflow-hidden`}
              >
                {/* Glow */}
                <div className={`absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b ${glow} to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`} />

                <div className={`w-12 h-12 rounded-2xl ${bg} border ${border} flex items-center justify-center mb-5 relative z-10`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <div className={`text-base font-semibold text-white group-hover:${color} transition-colors mb-2 relative z-10`}>
                  {role}
                </div>
                <p className="text-xs text-white/40 leading-relaxed flex-1 relative z-10">{desc}</p>
                <div className={`mt-4 text-xs font-mono ${color} uppercase tracking-widest relative z-10 flex items-center gap-1 group-hover:gap-2 transition-all`}>
                  Sign in
                  <span>→</span>
                </div>
              </Link>
            ))}
          </div>

          <p className="text-center text-xs text-white/30 mt-8">
            Not registered yet?{" "}
            <Link href="/waitlist" className="text-[#B89248] hover:text-[#C5A059] underline underline-offset-2 transition-colors">
              Join the waitlist
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}