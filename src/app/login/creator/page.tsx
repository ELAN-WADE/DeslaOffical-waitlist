"use client";
import React, { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Sparkles, Star } from "lucide-react";

function CreatorLoginContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/creator/dashboard";
  const error = searchParams.get("error");
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    await signIn("google", {
      callbackUrl,
      redirect: true,
    });
  };

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-white flex flex-col relative overflow-hidden font-sans">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-b from-[#B89248]/20 to-transparent rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#8B5CF6]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top nav */}
      <div className="relative z-10 flex items-center justify-between p-6 sm:p-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs text-white/40 hover:text-white/80 transition-colors font-mono uppercase tracking-widest"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Desla
        </Link>
        <span className="text-[10px] font-mono text-[#B89248] uppercase tracking-[0.2em] px-3 py-1 rounded-full border border-[#B89248]/20 bg-[#B89248]/5">
          Creator Portal
        </span>
      </div>

      {/* Main card */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Icon + heading */}
          <div className="text-center mb-10">
            <div className="inline-flex w-20 h-20 rounded-3xl bg-gradient-to-br from-[#B89248]/30 to-[#8B5CF6]/20 border border-[#B89248]/30 items-center justify-center mb-6 shadow-2xl shadow-[#B89248]/10">
              <Sparkles className="w-9 h-9 text-[#B89248]" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-light tracking-wide mb-3">
              Creator Access
            </h1>
            <p className="text-sm text-white/50 leading-relaxed max-w-xs mx-auto">
              Sign in to your Desla Creator Portal and manage your content, commissions, and community.
            </p>
          </div>

          {/* Card */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl shadow-2xl">
            {error && (
              <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center">
                {error === "OAuthAccountNotLinked"
                  ? "This email is already linked to another account."
                  : error === "AccessDenied"
                  ? "Access denied. Please contact your administrator."
                  : "Sign-in failed. Please try again."}
              </div>
            )}

            {/* Google Sign In button */}
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl bg-white text-[#111112] font-semibold text-sm hover:bg-[#f5f5f5] active:scale-[0.99] transition-all shadow-lg disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-[#111112]/20 border-t-[#111112] rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              <span>{loading ? "Signing in..." : "Continue with Google"}</span>
            </button>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-[11px] font-mono text-white/30 uppercase tracking-widest">or</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <p className="text-center text-xs text-white/40 leading-relaxed">
              Not a creator yet?{" "}
              <Link href="/waitlist?role=creator" className="text-[#B89248] hover:text-[#C5A059] underline underline-offset-2 transition-colors">
                Join the Creator Waitlist
              </Link>
            </p>
          </div>

          {/* Features */}
          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            {["Commission Tracking", "Content Studio", "Analytics"].map((f) => (
              <div key={f} className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <Star className="w-3.5 h-3.5 text-[#B89248]" />
                </div>
                <span className="text-[10px] font-mono text-white/40 leading-tight">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 text-center py-4 text-[10px] font-mono text-white/20">
        © {new Date().getFullYear()} Desla! Laboratories. Secured by OAuth 2.0.
      </div>
    </div>
  );
}

export default function CreatorLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0D0D0F] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#B89248]/30 border-t-[#B89248] rounded-full animate-spin" />
      </div>
    }>
      <CreatorLoginContent />
    </Suspense>
  );
}