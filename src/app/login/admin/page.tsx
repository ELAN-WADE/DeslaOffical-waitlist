"use client";
import React, { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Lock, Eye, EyeOff, ShieldAlert, RefreshCw, Unlock } from "lucide-react";

function AdminLoginContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/manage.elantheadmin.waitlist";
  const error = searchParams.get("error");
  const [loading, setLoading] = useState(false);

  // Password fallback
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authenticating, setAuthenticating] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    await signIn("google", {
      callbackUrl: "/admin-portal",
      redirect: true,
    });
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput.trim()) {
      setAuthError("Please enter the administrative passcode.");
      return;
    }
    setAuthenticating(true);
    setAuthError(null);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: passwordInput.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        window.location.href = callbackUrl || "/manage.elantheadmin.waitlist";
      } else {
        setAuthError(data.error || "Invalid administrator passcode. Access denied.");
      }
    } catch {
      setAuthError("Unable to contact authentication server. Please retry.");
    } finally {
      setAuthenticating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111112] text-[#FBF9F5] flex flex-col relative overflow-hidden font-sans">
      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#B89248]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top nav */}
      <div className="relative z-10 flex items-center justify-between p-6 sm:p-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs text-white/40 hover:text-white/80 transition-colors font-mono uppercase tracking-widest"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Storefront
        </Link>
        <span className="text-[10px] font-mono text-[#B89248] uppercase tracking-[0.2em] px-3 py-1 rounded-full border border-[#B89248]/20 bg-[#B89248]/5">
          Role: Master Admin
        </span>
      </div>

      {/* Main */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex w-20 h-20 rounded-3xl bg-[#B89248]/10 border border-[#B89248]/30 items-center justify-center mb-6 shadow-2xl shadow-[#B89248]/10">
              <ShieldCheck className="w-9 h-9 text-[#B89248]" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-light tracking-wide mb-3">
              Executive Atelier
            </h1>
            <p className="text-sm text-white/50 leading-relaxed max-w-xs mx-auto">
              Restricted operations console. Authenticate to access administrative controls.
            </p>
          </div>

          {/* Card */}
          <div className="bg-[#1A1A1C] border border-white/10 rounded-2xl p-8 backdrop-blur-xl shadow-2xl">
            {(error || (searchParams.get("error") === "unauthorized")) && (
              <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center">
                {searchParams.get("error") === "unauthorized"
                  ? "Unauthorized: Your Google account does not have admin privileges."
                  : error === "OAuthAccountNotLinked"
                  ? "This email is already linked to another account."
                  : "Sign-in failed. Please try again."}
              </div>
            )}

            {/* Google Sign In (admin-whitelisted) */}
            <div className="mb-6">
              <p className="text-[11px] font-mono uppercase tracking-[0.16em] text-[#9E9A95] mb-3">
                Google Admin Access
              </p>
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
                <span>{loading ? "Verifying..." : "Sign in with Google"}</span>
              </button>
              <p className="text-[10px] font-mono text-[#666360] text-center mt-2">
                Only whitelisted admin accounts are permitted
              </p>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-[11px] font-mono text-[#666360] uppercase tracking-widest">or</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Password login */}
            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-[0.16em] text-[#9E9A95] mb-2">
                  Admin Passcode
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      if (authError) setAuthError(null);
                    }}
                    placeholder="Enter authorization key..."
                    autoComplete="current-password"
                    required
                    className="w-full px-4 py-3 pr-11 rounded-xl bg-[#111112] border border-white/10 text-white placeholder-white/30 text-sm font-mono focus:outline-none focus:border-[#B89248] focus:ring-1 focus:ring-[#B89248] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9E9A95] hover:text-white transition-colors p-1"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {authError && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={authenticating}
                className="w-full py-3.5 px-4 rounded-xl bg-[#B89248] hover:bg-[#C5A059] active:scale-[0.99] text-[#111112] font-semibold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#B89248]/10 disabled:opacity-60 cursor-pointer"
              >
                {authenticating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Authorizing...</span>
                  </>
                ) : (
                  <>
                    <Unlock className="w-4 h-4" />
                    <span>Authorize &amp; Access</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-[#666360]">
              <span>Secured by Desla Cryptographic Auth</span>
              <span>Lagos · London · New York</span>
            </div>
          </div>

          <p className="text-center text-[10px] font-mono text-[#666360] mt-6">
            Unauthorized access attempts are logged and monitored.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#111112] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#B89248]/30 border-t-[#B89248] rounded-full animate-spin" />
      </div>
    }>
      <AdminLoginContent />
    </Suspense>
  );
}