'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  Check, Copy, ArrowRight, Sparkles, Video, Store, 
  AlertCircle, RefreshCw, ShieldCheck, MailCheck, ExternalLink
} from 'lucide-react';
import type { RoleType, WaitlistFormData, WaitlistEntry } from '../types';

interface WaitlistSectionProps {
  activeRole?: RoleType;
}

export const WaitlistSection: React.FC<WaitlistSectionProps> = ({ activeRole = 'shopper' }) => {
  // Normalize role to the 3 main public pathways
  const initialRole: RoleType = activeRole === 'partner' ? 'distributor' : activeRole;
  const [selectedRole, setSelectedRole] = useState<RoleType>(initialRole);
  
  // Form input state
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [skinConcern, setSkinConcern] = useState('Barrier Health & Hydration');
  const [creatorHandle, setCreatorHandle] = useState('');
  const [distributorBusiness, setDistributorBusiness] = useState('');

  // UI & Feedback states
  const [emailTouched, setEmailTouched] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<WaitlistEntry | null>(null);
  const [isExistingMember, setIsExistingMember] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [liveQueueNumber, setLiveQueueNumber] = useState<number>(1426);

  const emailInputRef = useRef<HTMLInputElement>(null);

  // Sync external role selection from audience or collection buttons
  useEffect(() => {
    if (activeRole) {
      const normalized = activeRole === 'partner' ? 'distributor' : activeRole;
      setSelectedRole(normalized);
    }
  }, [activeRole]);

  // Network offline detection
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Validate email format
  const validateEmail = (val: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!val.trim()) {
      return 'Email address is required.';
    }
    if (!emailRegex.test(val.trim())) {
      return 'Please enter a valid email address (e.g. name@domain.com).';
    }
    return null;
  };

  const handleEmailBlur = () => {
    setEmailTouched(true);
    setEmailError(validateEmail(email));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmail(val);
    if (emailTouched) {
      setEmailError(validateEmail(val));
    }
    if (serverError) {
      setServerError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailTouched(true);
    setServerError(null);

    const err = validateEmail(email);
    if (err) {
      setEmailError(err);
      emailInputRef.current?.focus();
      return;
    }

    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setIsOffline(true);
      setServerError('You appear to be offline. Please check your internet connection and try again.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        email: email.trim().toLowerCase(),
        firstName: firstName.trim(),
        fullName: firstName.trim() || 'Desla Member',
        role: selectedRole,
        city: 'Lagos',
        skinConcern: selectedRole === 'shopper' ? skinConcern : undefined,
        creatorHandle: selectedRole === 'creator' ? creatorHandle.trim() : undefined,
        creatorPlatform: selectedRole === 'creator' ? 'Instagram / TikTok' : undefined,
        distributorBusiness: selectedRole === 'distributor' ? distributorBusiness.trim() : undefined,
      };

      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setServerError(data.error || 'A temporary server issue occurred. Your entered details have been preserved. Please try again.');
        setIsSubmitting(false);
        return;
      }

      setSubmissionSuccess(data.entry);
      setIsExistingMember(Boolean(data.isExisting));
      if (data.entry?.queueNumber) {
        setLiveQueueNumber(data.entry.queueNumber);
      }

      // Confetti celebration for successful signups
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.65 },
          colors: ['#B89248', '#111112', '#EAE4D9', '#C5A059'],
        });
      } catch (err) {
        // Non-blocking
      }
    } catch (err: unknown) {
      setServerError('Unable to reach the reservation server. Please verify your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyReferralLink = () => {
    if (!submissionSuccess) return;
    const shareUrl = `https://desla.beauty/waitlist?ref=${submissionSuccess.referralCode}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2400);
  };

  const resetForm = () => {
    setSubmissionSuccess(null);
    setIsExistingMember(false);
    setEmail('');
    setFirstName('');
    setCreatorHandle('');
    setDistributorBusiness('');
    setEmailTouched(false);
    setEmailError(null);
    setServerError(null);
  };

  const roleLabels: Record<RoleType, string> = {
    shopper: 'Beauty Shopper',
    creator: 'Beauty Creator',
    distributor: 'Distributor / Stockist',
    partner: 'Institutional Partner',
  };

  return (
    <section id="waitlist" className="relative py-4 sm:py-8 bg-transparent scroll-mt-20">
      <div className="max-w-[760px] mx-auto px-4 sm:px-8">
        
        {/* Main Card Container */}
        <div className="rounded-3xl bg-[#F5F2EB] border border-[#E8E2D8] p-7 sm:p-12 shadow-sm text-left">
          
          <AnimatePresence mode="wait">
            {!submissionSuccess ? (
              /* ================= 1. FORM STATE: IDLE / FOCUSED / ERROR / SUBMITTING ================= */
              <motion.div
                key="waitlist-form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                {/* Logo & Header */}
                <div className="text-center max-w-lg mx-auto mb-8 sm:mb-9">
                  <img 
                    src="/desla-logo.png" 
                    alt="Desla!" 
                    className="h-8 sm:h-9 w-auto mx-auto mb-4 object-contain" 
                  />
                  <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#9E9A95] block mb-2">
                    Priority Early Access
                  </span>
                  <h2 className="font-manrope text-2xl sm:text-3xl font-bold text-[#111112] tracking-tight mb-2">
                    Join the Desla! waitlist
                  </h2>
                  <p className="text-xs sm:text-xs sm:text-[13px] text-[#666360] leading-relaxed">
                    Thoughtful skincare formulated for melanin-rich skin. Receive launch updates, formulation notes, and opening batch allocations.
                  </p>
                </div>

                {/* Server Error / Offline Recovery Banner */}
                {(serverError || isOffline) && (
                  <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
                    <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium mb-1">
                        {isOffline ? 'Connection Offline' : 'Submission Notice'}
                      </p>
                      <p className="text-amber-800 leading-relaxed mb-2">
                        {serverError || 'Please reconnect to the internet to complete your reservation.'}
                      </p>
                      <button
                        type="button"
                        onClick={handleSubmit}
                        className="text-amber-900 font-semibold underline hover:no-underline flex items-center gap-1 cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Retry submission</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Canonical Form */}
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  
                  {/* Priority Pathway Minimalist Selector */}
                  <div>
                    <label htmlFor="waitlist-role-select" className="block text-xs font-medium text-[#111112] mb-1.5">
                      Priority Pathway
                    </label>
                    <select
                      id="waitlist-role-select"
                      value={selectedRole}
                      onChange={(e) => {
                        setSelectedRole(e.target.value as RoleType);
                        setServerError(null);
                      }}
                      disabled={isSubmitting}
                      className="w-full px-4 py-3.5 rounded-2xl bg-[#FBF9F5] border border-[#D1C9BE] text-sm text-[#111112] transition-all min-h-[48px] focus:outline-none focus:ring-2 focus:ring-[#B89248] focus:border-[#B89248] cursor-pointer"
                    >
                      <option value="shopper">Shopper & Melanin Skincare Enthusiast</option>
                      <option value="creator">Beauty Creator, MUA & Skin Educator (PR Drops)</option>
                      <option value="distributor">Licensed Clinic, Spa & Stockist (B2B Wholesale)</option>
                    </select>
                  </div>
                  
                  {/* Email Input (Required) */}
                  <div>
                    <label htmlFor="waitlist-email" className="block text-xs font-medium text-[#111112] mb-1.5">
                      Email address <span className="text-[#B89248]" aria-hidden="true">*</span>
                    </label>
                    <input
                      id="waitlist-email"
                      ref={emailInputRef}
                      type="email"
                      required
                      value={email}
                      onChange={handleEmailChange}
                      onBlur={handleEmailBlur}
                      disabled={isSubmitting}
                      placeholder="you@domain.com"
                      aria-invalid={Boolean(emailError)}
                      aria-describedby={emailError ? 'email-error' : undefined}
                      className={`w-full px-4 py-3.5 rounded-2xl bg-[#FBF9F5] border text-sm text-[#111112] placeholder-[#9E9A95] transition-all min-h-[48px] focus:outline-none ${
                        emailError 
                          ? 'border-red-400 focus:ring-2 focus:ring-red-400 bg-red-50/20' 
                          : 'border-[#D1C9BE] focus:ring-2 focus:ring-[#B89248] focus:border-[#B89248]'
                      }`}
                    />
                    {emailError && (
                      <p id="email-error" className="mt-1.5 text-xs text-red-600 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{emailError}</span>
                      </p>
                    )}
                  </div>

                  {/* First Name (Optional) */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label htmlFor="waitlist-name" className="text-xs font-medium text-[#111112]">
                        First name
                      </label>
                      <span className="text-[11px] text-[#9E9A95]">Optional</span>
                    </div>
                    <input
                      id="waitlist-name"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      disabled={isSubmitting}
                      placeholder="e.g. Amina"
                      className="w-full px-4 py-3.5 rounded-2xl bg-[#FBF9F5] border border-[#D1C9BE] text-sm text-[#111112] placeholder-[#9E9A95] transition-all min-h-[48px] focus:outline-none focus:ring-2 focus:ring-[#B89248] focus:border-[#B89248]"
                    />
                  </div>

                  {/* Pathway / Role Select Dropdown (Minimalist & Intentional) */}
                  <div>
                    <label htmlFor="waitlist-role-select" className="block text-xs font-medium text-[#111112] mb-1.5">
                      Pathway / Interest <span className="text-[#B89248]">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="waitlist-role-select"
                        value={selectedRole}
                        onChange={(e) => {
                          setSelectedRole(e.target.value as RoleType);
                          setServerError(null);
                        }}
                        disabled={isSubmitting}
                        className="w-full px-4 py-3.5 rounded-2xl bg-[#FBF9F5] border border-[#D1C9BE] text-sm text-[#111112] transition-all min-h-[48px] appearance-none focus:outline-none focus:ring-2 focus:ring-[#B89248] focus:border-[#B89248] cursor-pointer pr-10"
                      >
                        <option value="shopper">Beauty Enthusiast & Shopper</option>
                        <option value="creator">Beauty Creator & Educator</option>
                        <option value="distributor">Clinic, Dispensary & Stockist</option>
                        <option value="partner">Clinical Research & Lab Partner</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#7A7672]">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Role-Tailored Optional Fields */}
                  {selectedRole === 'shopper' && (
                    <div>
                      <label htmlFor="waitlist-concern" className="block text-xs font-medium text-[#111112] mb-1.5">
                        Primary Skin Concern <span className="text-[11px] text-[#9E9A95] font-normal">(Optional)</span>
                      </label>
                      <select
                        id="waitlist-concern"
                        value={skinConcern}
                        onChange={(e) => setSkinConcern(e.target.value)}
                        disabled={isSubmitting}
                        className="w-full px-4 py-3.5 rounded-2xl bg-[#FBF9F5] border border-[#D1C9BE] text-sm text-[#111112] transition-all min-h-[48px] focus:outline-none focus:ring-2 focus:ring-[#B89248] focus:border-[#B89248]"
                      >
                        <option value="Barrier Health & Hydration">Barrier Health & Dehydration</option>
                        <option value="Post-Inflammatory Hyperpigmentation">Post-Inflammatory Dark Spots</option>
                        <option value="Humidity & Oil Balance">Humidity & Oil Balance</option>
                        <option value="Sensitive Melanin Skin">Sensitive / Easily Irritated Skin</option>
                        <option value="Everyday General Care">General Healthy Everyday Glow</option>
                      </select>
                    </div>
                  )}

                  {selectedRole === 'creator' && (
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label htmlFor="waitlist-handle" className="text-xs font-medium text-[#111112]">
                          Social Handle or Channel
                        </label>
                        <span className="text-[11px] text-[#9E9A95]">Optional</span>
                      </div>
                      <input
                        id="waitlist-handle"
                        type="text"
                        value={creatorHandle}
                        onChange={(e) => setCreatorHandle(e.target.value)}
                        disabled={isSubmitting}
                        placeholder="@yourhandle (TikTok, Instagram, or YouTube)"
                        className="w-full px-4 py-3.5 rounded-2xl bg-[#FBF9F5] border border-[#D1C9BE] text-sm text-[#111112] placeholder-[#9E9A95] transition-all min-h-[48px] focus:outline-none focus:ring-2 focus:ring-[#B89248] focus:border-[#B89248]"
                      />
                    </div>
                  )}

                  {selectedRole === 'distributor' && (
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label htmlFor="waitlist-business" className="text-xs font-medium text-[#111112]">
                          Business, Clinic, or Store Name
                        </label>
                        <span className="text-[11px] text-[#9E9A95]">Optional</span>
                      </div>
                      <input
                        id="waitlist-business"
                        type="text"
                        value={distributorBusiness}
                        onChange={(e) => setDistributorBusiness(e.target.value)}
                        disabled={isSubmitting}
                        placeholder="e.g. Victoria Dermatology Clinic"
                        className="w-full px-4 py-3.5 rounded-2xl bg-[#FBF9F5] border border-[#D1C9BE] text-sm text-[#111112] placeholder-[#9E9A95] transition-all min-h-[48px] focus:outline-none focus:ring-2 focus:ring-[#B89248] focus:border-[#B89248]"
                      />
                    </div>
                  )}

                  {/* Submission Action Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 px-6 rounded-full bg-[#111112] text-[#FBF9F5] text-sm font-semibold tracking-wide flex items-center justify-center gap-2 hover:bg-[#28282B] active:scale-[0.98] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89248] focus-visible:ring-offset-2 min-h-[50px] shadow-sm disabled:opacity-60 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-[#B89248]" />
                          <span>Reserving your spot...</span>
                        </>
                      ) : (
                        <>
                          <span>Join the waitlist</span>
                          <ArrowRight className="w-4 h-4 opacity-80" />
                        </>
                      )}
                    </button>
                  </div>

                  {/* Clear Legal & Privacy Statement */}
                  <div className="pt-3 text-center">
                    <p className="text-[11px] text-[#7A7672] leading-relaxed">
                      By submitting, you agree to receive launch updates and early access invitations from Desla!. We never sell or share your personal data. You can unsubscribe anytime with one click. Read our{' '}
                      <a href="#faqs" className="text-[#111112] underline hover:text-[#B89248] transition-colors">
                        Privacy Notice
                      </a>.
                    </p>
                  </div>

                </form>
              </motion.div>
            ) : (
              /* ================= 2. SUCCESS STATE: YOU'RE ON THE LIST ================= */
              <motion.div
                key="waitlist-success"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="text-center py-4"
              >
                {/* Desla Logo */}
                <div className="flex justify-center mb-5"><img src="/desla-logo.png" alt="Desla!" className="h-7 w-auto object-contain" /></div>
                {/* Checkmark Icon */}
                <div className="w-14 h-14 rounded-full bg-[#111112] text-[#B89248] flex items-center justify-center mx-auto mb-6 shadow-md ring-8 ring-[#EAE4D9]">
                  <Check className="w-8 h-8" />
                </div>

                <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#B89248] block mb-2">
                  Reservation Confirmed
                </span>

                <h2 className="font-manrope text-2xl sm:text-3xl font-bold text-[#111112] tracking-tight mb-2.5">
                  {isExistingMember ? 'You’re already on the list.' : 'You’re on the list.'}
                </h2>

                <p className="text-sm text-[#55524E] leading-relaxed max-w-md mx-auto mb-8">
                  {isExistingMember ? (
                    <>
                      Welcome back! We already have <strong className="text-[#111112]">{submissionSuccess.email}</strong> registered for the <strong className="text-[#111112]">{roleLabels[submissionSuccess.role]}</strong> pathway. Your reserved place is secure.
                    </>
                  ) : (
                    <>
                      Thank you for joining Desla!. We’ve reserved your priority place and sent a confirmation email to <strong className="text-[#111112]">{submissionSuccess.email}</strong>.
                    </>
                  )}
                </p>

                {/* Confirmation Details Card */}
                <div className="p-6 rounded-2xl bg-[#FBF9F5] border border-[#E8E2D8] max-w-md mx-auto text-left mb-8 space-y-3 text-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D8]">
                    <span className="text-[#7A7672]">Selected Interest</span>
                    <span className="font-semibold text-[#111112] bg-[#F5EFE6] px-2.5 py-1 rounded-full">
                      {roleLabels[submissionSuccess.role]}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D8]">
                    <span className="text-[#7A7672]">Queue Position</span>
                    <span className="font-mono font-bold text-[#B89248] text-sm">
                      #{submissionSuccess.queueNumber || liveQueueNumber}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#7A7672]">What happens next:</span>
                    <span className="text-[#111112] font-medium">Private launch invite via email</span>
                  </div>
                </div>

                {/* Optional Sharing Link */}
                <div className="max-w-md mx-auto mb-8 p-4 rounded-2xl bg-[#F5EFE6] border border-[#E8E2D8]">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-[#7A7672] block mb-2">
                    Share Desla! With Friends
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={`https://desla.beauty/waitlist?ref=${submissionSuccess.referralCode}`}
                      className="flex-1 px-3 py-2 text-xs rounded-xl bg-white border border-[#D1C9BE] text-[#666360] font-mono select-all focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={copyReferralLink}
                      className="px-4 py-2 rounded-xl bg-[#111112] text-[#FBF9F5] text-xs font-medium flex items-center gap-1.5 hover:bg-[#28282B] transition-colors cursor-pointer shrink-0 min-h-[38px]"
                    >
                      {copiedLink ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#B89248]" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Return / Reset Button */}
                <div>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="text-xs text-[#7A7672] hover:text-[#111112] underline transition-colors cursor-pointer"
                  >
                    Register another email or update details
                  </button>
                </div>

              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>
    </section>
  );
};
