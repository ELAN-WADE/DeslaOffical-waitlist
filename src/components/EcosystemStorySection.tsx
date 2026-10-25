'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import type { RoleType } from '../types';

interface EcosystemStorySectionProps {
  onSelectRole: (role: RoleType) => void;
}

interface StorySlide {
  id: string;
  role: RoleType;
  badge: string;
  title: string;
  tagline: string;
  description: string;
  image: string;
  imageAlt: string;
  features: string[];
  ctaText: string;
}

const STORY_SLIDES: StorySlide[] = [
  {
    id: 'product',
    role: 'shopper',
    badge: 'Natural Formulations',
    title: 'Natural Care & Authentic Formulations',
    tagline: 'Thoughtful skincare formulated for natural radiance and balance.',
    description: 'Every formulation is cold-blended with pure botanical oils and restorative plant butters. Clean, nourishing formulations tested for everyday radiance.',
    image: '/images/desla-natural-formulation.jpg',
    imageAlt: 'Natural barrier formulation and packaging',
    features: [
      '100% certified formulation safety',
      'Rich nourishing plant butters and botanical oils',
      'Natural glow and lasting humidity comfort',
    ],
    ctaText: 'Explore Formulations',
  },
  {
    id: 'creator',
    role: 'creator',
    badge: 'Creator Alliances',
    title: 'Creator Studio & PR Gifting Suite',
    tagline: 'Honest reviews, embargoed drops, and real-time revenue splits.',
    description: 'Verified beauty creators, licensed estheticians, and skin educators receive pre-release PR testing suites, formulation lookbooks, and transparent commission payouts.',
    image: '/images/desla-studio-trio.jpg',
    imageAlt: 'Desla creator collective and brand ambassadors',
    features: [
      'Embargoed PR unboxing suites before public release',
      'Direct affiliate commissions with instant settlement',
      'Personalized audience formulation lookbooks',
    ],
    ctaText: 'Join as a Creator',
  },
  {
    id: 'distributor',
    role: 'distributor',
    badge: 'Distribution & Stockists',
    title: 'Distributor Hub & Retail Partners',
    tagline: 'Priority wholesale allocations for regional stockists and retailers.',
    description: 'Regional stockists, retail partners, and beauty distributors gain guaranteed inventory runs, verifiable batch certificates, and tiered volume pricing.',
    image: '/images/desla-distributor-bag.jpg',
    imageAlt: 'Desla distributor bag and luxury wholesale allocation',
    features: [
      'Guaranteed bulk lot reservations and priority dispatch',
      'Direct ex-factory pricing tiers with account concierge',
      'Verifiable Certificates of Analysis (COA) per batch',
    ],
    ctaText: 'Register Distribution Hub',
  },
  {
    id: 'diagnosis',
    role: 'shopper',
    badge: 'Skin Diagnostics',
    title: 'PIX™ Computer-Vision Skin Telemetry',
    tagline: 'Non-invasive barrier hydration and melanin depth scanning.',
    description: 'Trained specifically on deeper skin tones, PIX™ analyzes barrier integrity and trans-epidermal water loss (TEWL) without false readings from surface melanin.',
    image: '/beauty_face_3d.jpg',
    imageAlt: 'Melanin-calibrated skin telemetry diagnostics',
    features: [
      'Calibrated for equatorial UV index and humidity',
      'Barrier integrity and hydration telemetry in 60s',
      'Hyper-personalized formulation dosages tuned to your skin',
    ],
    ctaText: 'Join Diagnostic Waitlist',
  },
];

export const EcosystemStorySection: React.FC<EcosystemStorySectionProps> = ({ onSelectRole }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Automatic slideshow timer (5.5 seconds per slide, pauses on hover)
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % STORY_SLIDES.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isPaused]);

  const slide = STORY_SLIDES[currentSlideIndex];

  return (
    <section 
      id="affiliates"
      className="relative py-14 sm:py-18 lg:py-20 bg-[#F5F2EB]/40 border-b border-[#E8E2D8]/70 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with reduced, calibrated font sizing */}
        <div className="max-w-xl mx-auto text-center mb-10 sm:mb-14">
          <span 
            className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#7A7672] mb-2.5 block"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            Affiliation Programs
          </span>
          <h2 className="font-manrope text-xl sm:text-2xl lg:text-3xl font-medium text-[#111112] tracking-tight mb-2.5">
            Partnerships & Distribution
          </h2>
          <p 
            className="text-xs sm:text-[13px] text-[#666360] leading-relaxed max-w-md mx-auto"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            Explore the unified operational ecosystem behind Desla — from honest educator partnerships to distribution allocations and AI skin diagnostics.
          </p>
        </div>

        {/* ================= AUTOMATED CINEMATIC SLIDESHOW ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Picture Crossfade with smooth entry */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/3] sm:aspect-[16/11] rounded-3xl overflow-hidden bg-[#EAE4D9] shadow-sm border border-[#E8E2D8]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={slide.image}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.65, ease: [0.23, 1, 0.32, 1] }}
                  className="w-full h-full relative"
                >
                  <img
                    src={slide.image}
                    alt={slide.imageAlt}
                    className="w-full h-full object-cover object-center"
                    loading="eager"
                  />
                  {/* Subtle dark bottom vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Right Column: Slide Text & Features (Smooth slide & fade) */}
          <div className="lg:col-span-6 text-left">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                className="space-y-4"
              >
                <div>
                  <span 
                    className="text-[10px] font-semibold tracking-wider uppercase text-[#B89248] block mb-1.5"
                    style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                  >
                    {slide.badge}
                  </span>
                  <h3 className="font-manrope text-xl sm:text-2xl font-bold text-[#111112] tracking-tight leading-snug">
                    {slide.title}
                  </h3>
                  <p 
                    className="text-xs sm:text-[13px] font-medium text-[#7A7672] mt-1"
                    style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                  >
                    {slide.tagline}
                  </p>
                </div>

                <p 
                  className="text-xs sm:text-sm text-[#55524E] leading-relaxed"
                  style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                >
                  {slide.description}
                </p>

                {/* Bullet Features with minimal custom SVG tick */}
                <ul className="space-y-2 pt-1">
                  {slide.features.map((feat, i) => (
                    <li 
                      key={i}
                      className="flex items-start gap-2.5 text-xs sm:text-[13px] text-[#33312E]"
                      style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                    >
                      <svg className="w-3.5 h-3.5 text-[#B89248] shrink-0 mt-0.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 8 7 12 13 4" />
                      </svg>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                {/* Role CTA Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => onSelectRole(slide.role)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#111112] text-white text-xs font-semibold tracking-wide hover:bg-[#28282B] active:scale-[0.98] transition-all cursor-pointer shadow-xs"
                  >
                    <span>{slide.ctaText}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#B89248]" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>

        {/* Minimal Progress Line Indicators */}
        <div className="flex items-center justify-center gap-2 mt-8 sm:mt-10">
          {STORY_SLIDES.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentSlideIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-1 rounded-full transition-all duration-400 cursor-pointer ${
                idx === currentSlideIndex
                  ? 'w-8 bg-[#111112]'
                  : 'w-2 bg-[#D1C9BE] hover:bg-[#9E9A95]'
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};
