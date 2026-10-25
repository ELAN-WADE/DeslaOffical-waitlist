'use client';

import React from 'react';
import { ArrowUpRight, Sparkles, Video, Store, CheckCircle2 } from 'lucide-react';
import type { RoleType } from '../types';

interface AudienceSectionProps {
  onSelectRole: (role: RoleType) => void;
}

export const AudienceSection: React.FC<AudienceSectionProps> = ({ onSelectRole }) => {
  return (
    <section id="audience" className="relative py-20 sm:py-28 bg-[#FBF9F5] border-b border-[#E8E2D8]/60">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-18">
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#9E9A95] block mb-3">
            Who It’s For
          </span>
          <h2 className="font-manrope text-2xl sm:text-3xl lg:text-4xl font-bold text-[#111112] tracking-tight mb-3">
            Connect with Desla!
          </h2>
          <p className="text-[15px] sm:text-[16px] text-[#666360] leading-relaxed">
            Whether you are building your personal routine, sharing beauty stories with your community, or stocking clinics and boutiques, choose your pathway below.
          </p>
        </div>

        {/* 3 Pathway Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch mb-10">
          
          {/* Pathway 1: Beauty Shoppers */}
          <div className="flex flex-col justify-between p-7 sm:p-8 rounded-3xl bg-[#F5F2EB] border border-[#E8E2D8] hover:border-[#D1C9BE] transition-all duration-200">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#111112] text-[#FBF9F5] flex items-center justify-center mb-6 shadow-sm">
                <Sparkles className="w-5 h-5 text-[#B89248]" aria-hidden="true" />
              </div>
              <span className="text-[11px] font-semibold tracking-wider uppercase text-[#B89248] block mb-1.5">
                Everyday Skincare
              </span>
              <h3 className="text-xl font-semibold text-[#111112] mb-3">
                Beauty Shoppers
              </h3>
              <p className="text-sm text-[#666360] leading-relaxed mb-6 font-normal">
                Discover products and everyday routines formulated for your skin’s exact needs—without white cast, harsh sulfates, or confusing 10-step rituals.
              </p>

              <div className="space-y-2.5 pt-4 border-t border-[#E8E2D8] text-xs text-[#55524E]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#B89248] shrink-0" />
                  <span>Formulated for melanin-rich skin</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#B89248] shrink-0" />
                  <span>Simple 4-step daily routine guidance</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#B89248] shrink-0" />
                  <span>First access to our opening batch</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4">
              <button
                onClick={() => onSelectRole('shopper')}
                className="w-full py-3.5 px-5 rounded-full bg-[#111112] text-[#FBF9F5] text-xs font-semibold tracking-wide flex items-center justify-center gap-2 hover:bg-[#28282B] active:scale-[0.98] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89248] min-h-[44px] cursor-pointer"
              >
                <span>Join as a Shopper</span>
                <ArrowUpRight className="w-4 h-4 opacity-80" />
              </button>
            </div>
          </div>

          {/* Pathway 2: Creators */}
          <div className="flex flex-col justify-between p-7 sm:p-8 rounded-3xl bg-[#F5F2EB] border border-[#E8E2D8] hover:border-[#D1C9BE] transition-all duration-200">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#111112] text-[#FBF9F5] flex items-center justify-center mb-6 shadow-sm">
                <Video className="w-5 h-5 text-[#B89248]" aria-hidden="true" />
              </div>
              <span className="text-[11px] font-semibold tracking-wider uppercase text-[#B89248] block mb-1.5">
                Storytelling & Voice
              </span>
              <h3 className="text-xl font-semibold text-[#111112] mb-3">
                Creators & Curators
              </h3>
              <p className="text-sm text-[#666360] leading-relaxed mb-6 font-normal">
                Explore future storytelling, early product previews, and creative partnership opportunities with a brand that respects your community.
              </p>

              <div className="space-y-2.5 pt-4 border-t border-[#E8E2D8] text-xs text-[#55524E]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#B89248] shrink-0" />
                  <span>Early PR box & sample allocations</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#B89248] shrink-0" />
                  <span>Paid collaboration drops at launch</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#B89248] shrink-0" />
                  <span>Direct consultation with lab formulators</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4">
              <button
                onClick={() => onSelectRole('creator')}
                className="w-full py-3.5 px-5 rounded-full bg-[#111112] text-[#FBF9F5] text-xs font-semibold tracking-wide flex items-center justify-center gap-2 hover:bg-[#28282B] active:scale-[0.98] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89248] min-h-[44px] cursor-pointer"
              >
                <span>Join as a Creator</span>
                <ArrowUpRight className="w-4 h-4 opacity-80" />
              </button>
            </div>
          </div>

          {/* Pathway 3: Distributors */}
          <div className="flex flex-col justify-between p-7 sm:p-8 rounded-3xl bg-[#F5F2EB] border border-[#E8E2D8] hover:border-[#D1C9BE] transition-all duration-200">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#111112] text-[#FBF9F5] flex items-center justify-center mb-6 shadow-sm">
                <Store className="w-5 h-5 text-[#B89248]" aria-hidden="true" />
              </div>
              <span className="text-[11px] font-semibold tracking-wider uppercase text-[#B89248] block mb-1.5">
                Retail & Stockists
              </span>
              <h3 className="text-xl font-semibold text-[#111112] mb-3">
                Distributors & Clinics
              </h3>
              <p className="text-sm text-[#666360] leading-relaxed mb-6 font-normal">
                Register early interest in becoming a verified regional stockist or aesthetic dermatology clinic partner with reliable cold-chain supply.
              </p>

              <div className="space-y-2.5 pt-4 border-t border-[#E8E2D8] text-xs text-[#55524E]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#B89248] shrink-0" />
                  <span>Direct wholesale allocation tiers</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#B89248] shrink-0" />
                  <span>Temperature-monitored delivery SLA</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#B89248] shrink-0" />
                  <span>Authenticated batch verification seals</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4">
              <button
                onClick={() => onSelectRole('distributor')}
                className="w-full py-3.5 px-5 rounded-full bg-[#111112] text-[#FBF9F5] text-xs font-semibold tracking-wide flex items-center justify-center gap-2 hover:bg-[#28282B] active:scale-[0.98] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89248] min-h-[44px] cursor-pointer"
              >
                <span>Register as a Stockist</span>
                <ArrowUpRight className="w-4 h-4 opacity-80" />
              </button>
            </div>
          </div>

        </div>

        {/* Clear Non-Binding Disclaimer Notice */}
        <div className="p-4 rounded-2xl bg-[#F5EFE6] border border-[#E8E2D8] max-w-2xl mx-auto text-center">
          <p className="text-xs text-[#666360] leading-relaxed">
            <strong className="text-[#111112] font-medium">Please note:</strong> Selecting any pathway above will preselect your role in the waitlist form below. Joining the waitlist is free, non-binding, and does not create an active customer account or constitute commercial partnership approval.
          </p>
        </div>

      </div>
    </section>
  );
};
