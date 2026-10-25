'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import PrismCarousel, { type PrismItem } from '@/components/ui/PrismCarousel';

interface HeroSectionProps {
  onJoinClick?: () => void;
}

// 8 Curated Specimens for 3D Coverflow Prism Carousel
const PRISM_ITEMS: PrismItem[] = [
  {
    src: '/screenshots/screenshot-hero-home.png',
    alt: 'Desla! Storefront & Hero Page',
    title: 'Desla! Editorial Storefront',
    subtitle: 'Natural Skin Health • Essential Daily Care',
    tag: '01 • Storefront',
  },
  {
    src: '/screenshots/screenshot-shop-catalog.png',
    alt: 'Formulations Catalogue and 4-Step Daily Ritual',
    title: 'Curated Formulations & Daily Ritual',
    subtitle: 'Category Navigation • Natural Botanical Care',
    tag: '02 • Catalogue',
  },
  {
    src: '/screenshots/screenshot-community-feed.png',
    alt: 'Desla Collective Social Community and Creator Desk',
    title: 'Desla Collective & Video Routines',
    subtitle: 'Routine Logs • Verified Transformations • Local Hubs',
    tag: '03 • Collective',
  },
  {
    src: '/screenshots/screenshot-ai-scan.png',
    alt: 'PIX Computer Vision Skin Diagnostics',
    title: 'PIX™ Skin Diagnostics',
    subtitle: 'Non-Invasive Barrier Hydration Telemetry in 60s',
    tag: '04 • Diagnostic',
  },
  {
    src: '/images/desla-studio-trio.jpg',
    alt: 'Desla! Collective & Creator Studio',
    title: 'Creator Studio & Collective',
    subtitle: 'Pre-Release PR Drops • Instant Affiliate Splits',
    tag: '05 • Creators',
  },
  {
    src: '/images/desla-distributor-bag.jpg',
    alt: 'Regional Distributor Operations Hub',
    title: 'Regional Distributor Operations Hub',
    subtitle: 'Guaranteed Bulk Lot Reservations • Distribution Concierge',
    tag: '06 • Wholesale B2B',
  },
  {
    src: '/images/desla-body-butter.jpg',
    alt: 'Desla! Safe Haven Body Butter',
    title: 'Safe Haven Body Butter',
    subtitle: 'Deep Nourishment • Lasting Softness',
    tag: '07 • Body Butter',
  },
  {
    src: '/images/desla-body-oil.jpg',
    alt: 'Desla! Safe Haven Body Oil',
    title: 'Safe Haven Body Oil',
    subtitle: 'Nourish • Soften • Glow • Botanical Care',
    tag: '08 • Body Oil',
  },
];

export const HeroSection: React.FC<HeroSectionProps> = ({ onJoinClick }) => {
  const handleJoin = () => {
    if (onJoinClick) {
      onJoinClick();
    } else {
      window.location.href = '/waitlist';
    }
  };

  return (
    <section className="relative pt-24 sm:pt-28 pb-14 sm:pb-18 bg-[#FBF9F5] border-b border-[#E8E2D8]/60 overflow-hidden">
      
      {/* Subtle Architectural Grid Lines */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-25 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, #E8E2D8 1px, transparent 1px),
            linear-gradient(to bottom, #E8E2D8 1px, transparent 1px)
          `,
          backgroundSize: '90px 90px',
        }}
        aria-hidden="true"
      />

      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ================= HERO CONTENT ================= */}
        <div className="max-w-2xl mx-auto text-center flex flex-col items-center">
          
          {/* Minimal Pre-Launch Label (No border, no background, no radio dot, no 2026) */}
          <span 
            className="text-[11px] sm:text-xs font-semibold tracking-[0.25em] uppercase text-[#7A7672] mb-4 block"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            Pre-Launch
          </span>

          {/* Manrope Heading */}
          <h1 className="font-manrope text-xl sm:text-2xl lg:text-[1.85rem] font-medium text-[#111112] tracking-tight leading-[1.2] mb-3">
            Every Big Routine <br />
            <span className="text-[#111112]">starts with a </span>
            <span className="text-[#B89248]">waitlist.</span>
          </h1>

          {/* Subtitle in system-ui */}
          <p 
            className="text-xs sm:text-sm text-[#55524E] leading-relaxed max-w-lg mb-6 font-normal"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            Join over 500+ members securing priority allocation access, certified batch reservations, and creator drops.
          </p>

          {/* Direct Waitlist Action (No role switch, takes directly to dedicated waitlist form) */}
          <div className="flex flex-col items-center gap-3 w-full max-w-xs">
            <button
              type="button"
              onClick={handleJoin}
              className="w-full px-8 py-3.5 rounded-full bg-[#111112] text-white text-xs sm:text-sm font-semibold tracking-wide flex items-center justify-center gap-2 hover:bg-[#28282B] active:scale-[0.98] transition-all cursor-pointer shadow-sm hover:shadow-md min-h-[46px]"
            >
              <span>Join the waitlist</span>
              <ArrowRight className="w-4 h-4 text-[#B89248]" />
            </button>
          </div>

          {/* Social Proof */}
          <div className="mt-6 flex items-center justify-center gap-3">
            <div className="flex -space-x-2 overflow-hidden" aria-hidden="true">
              <img
                src="/portraits/melanin-glow.jpg"
                alt="Member"
                className="inline-block h-7 w-7 rounded-full ring-2 ring-[#FBF9F5] object-cover"
              />
              <img
                src="/portraits/portrait-blazer.jpg"
                alt="Member"
                className="inline-block h-7 w-7 rounded-full ring-2 ring-[#FBF9F5] object-cover"
              />
              <img
                src="/portraits/melanin-routine.jpg"
                alt="Member"
                className="inline-block h-7 w-7 rounded-full ring-2 ring-[#FBF9F5] object-cover"
              />
            </div>
            <span 
              className="text-xs font-medium text-[#666360]"
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
            >
              <strong className="text-[#111112] font-semibold">500+</strong> members awaiting access
            </span>
          </div>

        </div>

        {/* ================= 3D COVERFLOW PRISM CAROUSEL ================= */}
        <div className="mt-8 sm:mt-12">
          <PrismCarousel
            items={PRISM_ITEMS}
            autoPlay={true}
            interval={4200}
            onItemClick={() => handleJoin()}
          />
        </div>

      </div>
    </section>
  );
};
