'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { EcosystemStorySection } from '@/components/EcosystemStorySection';
import { CollectionsSection } from '@/components/CollectionsSection';
import { RoutineSection } from '@/components/RoutineSection';
import { BrandStorySection } from '@/components/BrandStorySection';
import { FaqSection } from '@/components/FaqSection';
import { FooterSection } from '@/components/FooterSection';
import { MobileStickyJoin } from '@/components/MobileStickyJoin';
import type { RoleType } from '@/types';

export default function Home() {
  const router = useRouter();

  // Navigate to dedicated one-page waitlist form
  const navigateToWaitlist = (role: RoleType = 'shopper') => {
    router.push(`/waitlist?role=${role}`);
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#111112] selection:bg-[#B89248]/20 selection:text-[#111112]">
      {/* 1. Header Navigation */}
      <Navbar onJoinClick={() => navigateToWaitlist('shopper')} />

      <main>
        {/* 2. Hero: 3D Coverflow Prism Carousel + Minimal Pre-Launch + Direct Join CTA */}
        <HeroSection 
          onJoinClick={() => navigateToWaitlist('shopper')}
        />

        {/* 3. Affiliation Programs: Creators, Clinics, Community, and AI Diagnostics */}
        <EcosystemStorySection 
          onSelectRole={(role) => navigateToWaitlist(role)}
        />

        {/* 4. Tactile Specimens & BounceCards: Borderless & Backgroundless interactive stack */}
        <CollectionsSection 
          onGetUpdates={(role) => navigateToWaitlist(role || 'shopper')}
        />

        {/* 5. Daily Routine: 4-step Cleanse → Wash → Moisturize → Protect picture-first cards with hover reveal */}
        <RoutineSection 
          onJoinRoutine={(role) => navigateToWaitlist(role || 'shopper')}
        />

        {/* 6. Brand Story & Principles: 4 picture cards */}
        <BrandStorySection />

        {/* 7. FAQs: Plain, practical answers to essential questions */}
        <FaqSection />
      </main>

      {/* 8. Minimal luxury footer */}
      <FooterSection onJoinClick={() => navigateToWaitlist('shopper')} />

      {/* 9. Mobile Sticky Join Action */}
      <MobileStickyJoin onJoinClick={() => navigateToWaitlist('shopper')} />
    </div>
  );
}
