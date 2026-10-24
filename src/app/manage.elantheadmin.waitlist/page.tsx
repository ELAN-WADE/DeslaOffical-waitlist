'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Mail,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowLeft,
  Send,
  ShieldCheck,
  Zap,
  Key,
  ExternalLink,
  Download,
  Megaphone,
  Users,
  FileSpreadsheet,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  LogOut,
  ShieldAlert,
} from 'lucide-react';

interface Entry {
  id: string;
  full_name: string;
  email: string;
  city: string;
  role: string;
  queue_number: number;
  referral_code: string;
  created_at: string;
  email_status: string;
  email_attempts: number;
  email_error?: string;
  skin_concern?: string;
  creator_handle?: string;
  distributor_business?: string;
}

interface Stats {
  totalEntries: number;
  pendingEmails: number;
  sentEmails: number;
  failedEmails: number;
}

interface SmtpStatus {
  configured: boolean;
  connected: boolean;
  message: string;
  host?: string;
  port?: number;
}

export default function SecureAdminPage() {
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authChecking, setAuthChecking] = useState<boolean>(true);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authenticating, setAuthenticating] = useState<boolean>(false);

  // Dashboard states
  const [entries, setEntries] = useState<Entry[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [triggeringWorker, setTriggeringWorker] = useState(false);
  const [workerResult, setWorkerResult] = useState<string | null>(null);

  // SMTP Diagnostics State
  const [smtpStatus, setSmtpStatus] = useState<SmtpStatus | null>(null);
  const [checkingSmtp, setCheckingSmtp] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [savingKey, setSavingKey] = useState(false);
  const [saveKeyFeedback, setSaveKeyFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const [testEmailAddress, setTestEmailAddress] = useState('');
  const [sendingTest, setSendingTest] = useState(false);
  const [testEmailFeedback, setTestEmailFeedback] = useState<{ success: boolean; message: string } | null>(null);

  // Broadcast state
  const [broadcastRole, setBroadcastRole] = useState('all');
  const [broadcastHeadline, setBroadcastHeadline] = useState('ATELIER ANNOUNCEMENT');
  const [broadcastSubject, setBroadcastSubject] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastCtaText, setBroadcastCtaText] = useState('');
  const [broadcastCtaUrl, setBroadcastCtaUrl] = useState('');
  const [sendingBroadcast, setSendingBroadcast] = useState(false);
  const [broadcastFeedback, setBroadcastFeedback] = useState<{ success: boolean; message: string } | null>(null);

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  // Verify authentication on mount
  useEffect(() => {
    checkInitialAuth();
  }, []);

  const checkInitialAuth = async () => {
    setAuthChecking(true);
    try {
      const res = await fetch('/api/admin/auth');
      const data = await res.json();
      if (data.authenticated) {
        setIsAuthenticated(true);
        await Promise.all([fetchData(), checkSmtpStatus()]);
      } else {
        setIsAuthenticated(false);
      }
    } catch {
      setIsAuthenticated(false);
    } finally {
      setAuthChecking(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput.trim()) {
      setAuthError('Please enter the administrative passcode.');
      return;
    }

    setAuthenticating(true);
    setAuthError(null);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput.trim() }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        setPasswordInput('');
        await Promise.all([fetchData(), checkSmtpStatus()]);
      } else {
        setAuthError(data.error || 'Invalid administrator passcode. Access denied.');
      }
    } catch {
      setAuthError('Unable to contact authentication server. Please retry.');
    } finally {
      setAuthenticating(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'logout' }),
      });
    } catch {
      // Non-blocking
    } finally {
      setIsAuthenticated(false);
      setEntries([]);
      setStats(null);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/entries');
      if (res.ok) {
        const data = await res.json();
        setEntries(data.entries || []);
        setStats(data.stats || null);
      } else if (res.status === 401) {
        setIsAuthenticated(false);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const checkSmtpStatus = async () => {
    setCheckingSmtp(true);
    try {
      const res = await fetch('/api/admin/test-smtp');
      const data = await res.json();
      setSmtpStatus(data);
    } catch {
      setSmtpStatus({
        configured: false,
        connected: false,
        message: 'Could not contact SMTP diagnostic endpoint.',
      });
    } finally {
      setCheckingSmtp(false);
    }
  };

  const handleRunWorker = async () => {
    setTriggeringWorker(true);
    setWorkerResult(null);
    try {
      const res = await fetch('/api/worker/process-emails', { method: 'POST' });
      const data = await res.json();
      setWorkerResult(`Processed ${data.processed} jobs (${data.succeeded} sent, ${data.failed} failed)`);
      await fetchData();
    } catch {
      setWorkerResult('Worker trigger failed');
    } finally {
      setTriggeringWorker(false);
    }
  };

  const handleSaveApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKeyInput.trim()) return;

    setSavingKey(true);
    setSaveKeyFeedback(null);

    try {
      const res = await fetch('/api/admin/test-smtp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_key',
          apiKey: apiKeyInput.trim(),
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSaveKeyFeedback({ success: true, message: 'SMTP credentials updated and verified successfully!' });
        await checkSmtpStatus();
      } else {
        setSaveKeyFeedback({ success: false, message: data.error || data.message || 'Verification failed.' });
        await checkSmtpStatus();
      }
    } catch {
      setSaveKeyFeedback({ success: false, message: 'Network error communicating with server.' });
    } finally {
      setSavingKey(false);
    }
  };

  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmailAddress.trim() || !testEmailAddress.includes('@')) {
      setTestEmailFeedback({ success: false, message: 'Please enter a valid recipient email address.' });
      return;
    }

    setSendingTest(true);
    setTestEmailFeedback(null);

    try {
      const res = await fetch('/api/admin/test-smtp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testEmailAddress.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTestEmailFeedback({ success: true, message: data.message });
        await fetchData();
      } else {
        setTestEmailFeedback({ success: false, message: data.error || 'Failed to dispatch test email.' });
      }
    } catch {
      setTestEmailFeedback({ success: false, message: 'Network error communicating with test endpoint.' });
    } finally {
      setSendingTest(false);
    }
  };

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastSubject.trim() || !broadcastMessage.trim()) {
      setBroadcastFeedback({ success: false, message: 'Subject and message are required.' });
      return;
    }

    setSendingBroadcast(true);
    setBroadcastFeedback(null);

    try {
      const res = await fetch('/api/admin/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: broadcastSubject.trim(),
          headline: broadcastHeadline.trim() || 'ATELIER ANNOUNCEMENT',
          messageBody: broadcastMessage.trim(),
          targetRole: broadcastRole,
          callToActionText: broadcastCtaText.trim() || undefined,
          callToActionUrl: broadcastCtaUrl.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setBroadcastFeedback({ success: true, message: data.message });
        setBroadcastSubject('');
        setBroadcastMessage('');
        setBroadcastCtaText('');
        setBroadcastCtaUrl('');
        await fetchData();
      } else {
        setBroadcastFeedback({ success: false, message: data.error || 'Failed to dispatch broadcast.' });
      }
    } catch {
      setBroadcastFeedback({ success: false, message: 'Network error queueing broadcast.' });
    } finally {
      setSendingBroadcast(false);
    }
  };

  // Filter entries
  const filteredEntries = entries.filter((entry) => {
    const matchesRole = roleFilter === 'all' || entry.role === roleFilter;
    const matchesSearch =
      searchTerm === '' ||
      entry.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.referral_code?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });

  // 1. Initial Loading Screen
  if (authChecking) {
    return (
      <div className="min-h-screen bg-[#111112] text-[#FBF9F5] flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-10 h-10 border-2 border-[#B89248] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-[#9E9A95]">
            Verifying Executive Security Handshake...
          </p>
        </div>
      </div>
    );
  }

  // 2. Ultra-Luxury Executive Authentication Gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#111112] text-[#FBF9F5] flex flex-col justify-between p-6 sm:p-12 relative overflow-hidden font-sans selection:bg-[#B89248] selection:text-[#111112]">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#B89248]/10 rounded-full blur-[140px] pointer-events-none" />

        {/* Top brand tag */}
        <div className="flex items-center justify-between z-10 max-w-md mx-auto w-full">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs text-[#9E9A95] hover:text-white transition-colors uppercase tracking-widest font-mono"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Storefront</span>
          </Link>
          <span className="text-[10px] font-mono text-[#B89248] uppercase tracking-widest px-2.5 py-1 rounded-full border border-[#B89248]/20 bg-[#B89248]/5">
            Role: Master Admin
          </span>
        </div>

        {/* Auth Modal Card */}
        <div className="max-w-md w-full mx-auto my-auto z-10">
          <div className="p-8 sm:p-10 rounded-2xl bg-[#1A1A1C] border border-white/10 shadow-2xl backdrop-blur-xl relative">
            <div className="text-center mb-8">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-[#B89248]/10 border border-[#B89248]/30 flex items-center justify-center text-[#B89248] mb-4">
                <Lock className="w-6 h-6 text-[#B89248]" />
              </div>
              <h1 className="text-2xl font-serif text-[#FBF9F5] tracking-wide font-normal mb-2">
                Executive Atelier
              </h1>
              <p className="text-xs text-[#9E9A95] leading-relaxed">
                Restricted operations console. Provide master credentials to decrypt administrative controls.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-[0.16em] text-[#9E9A95] mb-2">
                  Admin Passcode
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      if (authError) setAuthError(null);
                    }}
                    placeholder="Enter authorization key..."
                    autoFocus
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
                    <span>Authorizing Session...</span>
                  </>
                ) : (
                  <>
                    <Unlock className="w-4 h-4" />
                    <span>Authorize & Access</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-[#666360]">
              <span>Secured by Desla Cryptographic Auth</span>
              <span>Lagos • London • New York</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center text-[10px] font-mono text-[#666360] z-10">
          Unauthorized access attempts are logged and monitored.
        </div>
      </div>
    );
  }

  // 3. Fully Authenticated Dashboard
  return (
    <div className="min-h-screen bg-[#F5F2EB] text-[#111112] p-6 sm:p-12 font-sans selection:bg-[#B89248] selection:text-[#111112]">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Executive Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8E2D8]">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs text-[#9E9A95] hover:text-[#111112] transition-colors uppercase tracking-wider font-semibold"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Storefront</span>
              </Link>
              <span className="text-gray-300">•</span>
              <span className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Session Active: Master Admin (Elan)
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-light text-[#111112]">
              Desla Executive Atelier Console
            </h1>
            <p className="text-xs text-[#666360] mt-1 font-mono">
              URL: /manage.elantheadmin.waitlist &bull; High-Priority Queue Management & Dispatch Telemetry
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href="/api/admin/export-csv"
              download="desla_waitlist.csv"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#E8E2D8] text-xs font-medium text-[#111112] hover:bg-[#EAE4D9] transition-all shadow-sm active:scale-95"
            >
              <Download className="w-3.5 h-3.5 text-[#B89248]" />
              <span>Download Excel CSV</span>
            </a>

            <button
              onClick={handleRunWorker}
              disabled={triggeringWorker}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#111112] text-white text-xs font-medium hover:bg-black transition-all shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${triggeringWorker ? 'animate-spin' : ''}`} />
              <span>{triggeringWorker ? 'Dispatching...' : 'Trigger Outbox Worker'}</span>
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-red-50 text-red-700 border border-red-200 text-xs font-medium hover:bg-red-100 transition-all cursor-pointer"
              title="Lock Console & Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {workerResult && (
          <div className="p-4 rounded-xl bg-[#EAE4D9] text-xs text-[#111112] flex items-center justify-between border border-[#D5CEBF]">
            <span>{workerResult}</span>
            <button onClick={() => setWorkerResult(null)} className="text-xs font-bold text-gray-600 hover:text-black">
              &times;
            </button>
          </div>
        )}

        {/* Telemetry Stats Row */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-[#E8E2D8] shadow-sm">
              <span className="text-[11px] font-mono text-[#9E9A95] uppercase tracking-wider block mb-1">
                Total Members
              </span>
              <span className="font-serif text-3xl text-[#111112]">{stats.totalEntries}</span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#E8E2D8] shadow-sm">
              <span className="text-[11px] font-mono text-[#9E9A95] uppercase tracking-wider block mb-1">
                Pending Outbox
              </span>
              <span className="font-serif text-3xl text-[#B89248]">{stats.pendingEmails}</span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#E8E2D8] shadow-sm">
              <span className="text-[11px] font-mono text-[#9E9A95] uppercase tracking-wider block mb-1">
                Delivered
              </span>
              <span className="font-serif text-3xl text-emerald-700">{stats.sentEmails}</span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#E8E2D8] shadow-sm">
              <span className="text-[11px] font-mono text-[#9E9A95] uppercase tracking-wider block mb-1">
                Delivery Failures
              </span>
              <span className="font-serif text-3xl text-rose-700">{stats.failedEmails}</span>
            </div>
          </div>
        )}

        {/* SMTP Diagnostics & Live Dispatch Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* SMTP Status & Credential Update */}
          <div className="lg:col-span-6 p-6 rounded-2xl bg-white border border-[#E8E2D8] shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#B89248]" />
                  <h2 className="text-base font-semibold text-[#111112]">SMTP Delivery Engine</h2>
                </div>
                <button
                  onClick={checkSmtpStatus}
                  disabled={checkingSmtp}
                  className="text-xs text-[#9E9A95] hover:text-[#111112] flex items-center gap-1 font-mono"
                >
                  <RefreshCw className={`w-3 h-3 ${checkingSmtp ? 'animate-spin' : ''}`} />
                  <span>Verify</span>
                </button>
              </div>

              {smtpStatus ? (
                <div
                  className={`p-4 rounded-xl mb-4 text-xs ${
                    smtpStatus.connected
                      ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                      : 'bg-amber-50 text-amber-900 border border-amber-200'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {smtpStatus.connected ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                    )}
                    <div>
                      <p className="font-semibold">{smtpStatus.message}</p>
                      {smtpStatus.host && (
                        <p className="mt-1 font-mono text-[11px] text-gray-600">
                          Relay: {smtpStatus.host}:{smtpStatus.port || 465} (SSL Active)
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-gray-50 text-xs text-gray-600 mb-4 font-mono">
                  Checking SMTP connection...
                </div>
              )}
            </div>

            {/* Quick API Key Update Form */}
            <form onSubmit={handleSaveApiKey} className="pt-4 border-t border-gray-100">
              <label className="block text-[11px] font-mono text-[#9E9A95] uppercase tracking-wider mb-1.5">
                Update App Password / API Key
              </label>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="Paste 16-character code or API key..."
                  className="flex-1 px-3 py-2 text-xs rounded-xl bg-[#F5F2EB] border border-[#E8E2D8] focus:outline-none focus:border-[#B89248] font-mono"
                />
                <button
                  type="submit"
                  disabled={savingKey || !apiKeyInput.trim()}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-[#111112] text-white hover:bg-black transition-all disabled:opacity-40"
                >
                  {savingKey ? 'Saving...' : 'Save & Connect'}
                </button>
              </div>
              {saveKeyFeedback && (
                <p className={`mt-2 text-xs ${saveKeyFeedback.success ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {saveKeyFeedback.message}
                </p>
              )}
            </form>
          </div>

          {/* Live Test Email Sender */}
          <div className="lg:col-span-6 p-6 rounded-2xl bg-white border border-[#E8E2D8] shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Send className="w-5 h-5 text-[#B89248]" />
                <h2 className="text-base font-semibold text-[#111112]">Live Test Dispatcher</h2>
              </div>
              <p className="text-xs text-[#666360] mb-4">
                Send an immediate live HTML test transmission to verify deliverability and visual inbox formatting.
              </p>
            </div>

            <form onSubmit={handleSendTestEmail} className="space-y-3">
              <div>
                <label className="block text-[11px] font-mono text-[#9E9A95] uppercase tracking-wider mb-1">
                  Recipient Destination
                </label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={testEmailAddress}
                    onChange={(e) => setTestEmailAddress(e.target.value)}
                    placeholder="Enter any destination email..."
                    required
                    className="flex-1 px-3 py-2 text-xs rounded-xl bg-[#F5F2EB] border border-[#E8E2D8] focus:outline-none focus:border-[#B89248] font-mono"
                  />
                  <button
                    type="submit"
                    disabled={sendingTest || !testEmailAddress.trim()}
                    className="px-4 py-2 text-xs font-semibold rounded-xl bg-[#B89248] text-[#111112] hover:bg-[#C5A059] transition-all disabled:opacity-40"
                  >
                    {sendingTest ? 'Sending...' : 'Send Live Test'}
                  </button>
                </div>
              </div>
              {testEmailFeedback && (
                <p className={`text-xs ${testEmailFeedback.success ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {testEmailFeedback.message}
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Atelier Broadcast Announcement Tool */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E8E2D8] shadow-sm">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#E8E2D8]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#B89248]/10 flex items-center justify-center text-[#B89248]">
                <Megaphone className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-[#111112]">VIP Announcement Broadcast</h2>
                <p className="text-xs text-[#666360]">
                  Dispatch editorial announcements to confirmed waitlist members by cohort.
                </p>
              </div>
            </div>
            <span className="text-[11px] font-mono text-[#B89248] px-3 py-1 rounded-full bg-[#F5F2EB] border border-[#E8E2D8]">
              Target: {broadcastRole.toUpperCase()}
            </span>
          </div>

          <form onSubmit={handleSendBroadcast} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-mono text-[#9E9A95] uppercase tracking-wider mb-1.5">
                  Target Audience
                </label>
                <select
                  value={broadcastRole}
                  onChange={(e) => setBroadcastRole(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#F5F2EB] border border-[#E8E2D8] focus:outline-none focus:border-[#B89248]"
                >
                  <option value="all">All Registered Members (Global Broadcast)</option>
                  <option value="shopper">Shopper Cohort Only</option>
                  <option value="creator">Creator Atelier Only</option>
                  <option value="distributor">Commercial Distributors Only</option>
                  <option value="partner">Clinical Partners Only</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-[#9E9A95] uppercase tracking-wider mb-1.5">
                  Headline Category
                </label>
                <input
                  type="text"
                  value={broadcastHeadline}
                  onChange={(e) => setBroadcastHeadline(e.target.value)}
                  placeholder="e.g. BATCH ALLOCATION ANNOUNCEMENT"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#F5F2EB] border border-[#E8E2D8] focus:outline-none focus:border-[#B89248]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-[#9E9A95] uppercase tracking-wider mb-1.5">
                  Email Subject Line
                </label>
                <input
                  type="text"
                  value={broadcastSubject}
                  onChange={(e) => setBroadcastSubject(e.target.value)}
                  placeholder="e.g. Exclusive Atelier Update: Initial Allocation"
                  required
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#F5F2EB] border border-[#E8E2D8] focus:outline-none focus:border-[#B89248]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-[#9E9A95] uppercase tracking-wider mb-1.5">
                Editorial Announcement Body
              </label>
              <textarea
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                rows={4}
                placeholder="Write your editorial announcement message to members..."
                required
                className="w-full p-3 text-xs rounded-xl bg-[#F5F2EB] border border-[#E8E2D8] focus:outline-none focus:border-[#B89248] font-sans"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono text-[#9E9A95] uppercase tracking-wider mb-1.5">
                  Call to Action Button Text (Optional)
                </label>
                <input
                  type="text"
                  value={broadcastCtaText}
                  onChange={(e) => setBroadcastCtaText(e.target.value)}
                  placeholder="e.g. Confirm Your Atelier Delivery"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#F5F2EB] border border-[#E8E2D8] focus:outline-none focus:border-[#B89248]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-[#9E9A95] uppercase tracking-wider mb-1.5">
                  Destination URL (Optional)
                </label>
                <input
                  type="url"
                  value={broadcastCtaUrl}
                  onChange={(e) => setBroadcastCtaUrl(e.target.value)}
                  placeholder="https://desla.beauty/atelier"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#F5F2EB] border border-[#E8E2D8] focus:outline-none focus:border-[#B89248]"
                />
              </div>
            </div>

            {broadcastFeedback && (
              <div
                className={`p-3 rounded-xl text-xs ${
                  broadcastFeedback.success
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                {broadcastFeedback.message}
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={sendingBroadcast}
                className="px-6 py-2.5 rounded-xl bg-[#111112] text-white hover:bg-black transition-all text-xs font-semibold flex items-center gap-2 shadow-sm disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{sendingBroadcast ? 'Enqueuing Broadcast...' : 'Queue Announcement to Audience'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Waitlist Registry Table */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E8E2D8] shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-[#111112]">Confirmed Member Registry</h2>
              <p className="text-xs text-[#666360]">
                Showing {filteredEntries.length} of {entries.length} records.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <input
                type="text"
                placeholder="Search by name, email, city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3.5 py-2 text-xs rounded-xl bg-[#F5F2EB] border border-[#E8E2D8] focus:outline-none focus:border-[#B89248] w-48 sm:w-64"
              />

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl bg-[#F5F2EB] border border-[#E8E2D8] focus:outline-none focus:border-[#B89248]"
              >
                <option value="all">All Roles</option>
                <option value="shopper">Shopper</option>
                <option value="creator">Creator</option>
                <option value="distributor">Distributor</option>
                <option value="partner">Partner</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-[#E8E2D8]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F5F2EB] text-[#666360] font-mono uppercase tracking-wider text-[10px] border-b border-[#E8E2D8]">
                <tr>
                  <th className="py-3 px-4">Priority #</th>
                  <th className="py-3 px-4">Member Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Market / Handle</th>
                  <th className="py-3 px-4">Email Status</th>
                  <th className="py-3 px-4">Registered</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-gray-400">
                      Loading registry data...
                    </td>
                  </tr>
                ) : filteredEntries.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-gray-400">
                      No matching records found.
                    </td>
                  </tr>
                ) : (
                  filteredEntries.map((entry) => (
                    <tr key={entry.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-semibold text-[#B89248]">
                        #{entry.queue_number}
                      </td>
                      <td className="py-3 px-4 font-medium text-[#111112]">
                        {entry.full_name}
                      </td>
                      <td className="py-3 px-4 text-gray-600 font-mono text-[11px]">
                        {entry.email}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-mono capitalize bg-[#F5F2EB] text-gray-700 border border-[#E8E2D8]">
                          {entry.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {entry.creator_handle
                          ? `@${entry.creator_handle.replace('@', '')}`
                          : entry.distributor_business || entry.city}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono ${
                            entry.email_status === 'sent'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : entry.email_status === 'failed'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              entry.email_status === 'sent'
                                ? 'bg-emerald-500'
                                : entry.email_status === 'failed'
                                ? 'bg-rose-500'
                                : 'bg-amber-500'
                            }`}
                          />
                          {entry.email_status || 'pending'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-400 font-mono text-[11px]">
                        {new Date(entry.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
