'use client';

import React, { useState } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { RoleType } from '../types';

interface RoutineSectionProps {
  onJoinRoutine: (role?: RoleType) => void;
}

const ROUTINE_STEPS = [
  {
    step: '01',
    name: 'Cleanse',
    title: 'Melt Impurities & Clarify',
    description: 'A gentle botanical oil cleanse that dissolves daily impurities and environmental buildup while keeping the barrier calm.',
    melaninNote: 'Protects natural skin lipids to prevent inflammation and reactive hyperpigmentation.',
    image: '/images/desla-studio-oil-model.jpg',
    objectPosition: 'center 15%',
  },
  {
    step: '02',
    name: 'Wash',
    title: 'Purify & Balance',
    description: 'A silky, pH-balanced hydrating wash that cleanses deeply without stripping natural moisture, leaving skin fresh and soft.',
    melaninNote: 'Maintains healthy acid mantle integrity to eliminate dry, tight discomfort.',
    image: '/images/desla-body-lotion.jpg',
    objectPosition: 'center 25%',
  },
  {
    step: '03',
    name: 'Moisturize',
    title: 'Deep Quench & Seal',
    description: 'Layered restorative plant butters and nourishing oils that lock in deep hydration and lasting touchable softness.',
    melaninNote: 'Counters rapid trans-epidermal water loss (TEWL) to deliver lasting bounce and radiance.',
    image: '/images/desla-studio-butter-apply.jpg',
    objectPosition: 'center 20%',
  },
  {
    step: '04',
    name: 'Protect',
    title: 'Shield & Glow',
    description: 'Daily environmental barrier defense that seals in lasting moisture and enhances your skin’s natural, luminous glow.',
    melaninNote: 'Shields skin against tropical dryness and preserves natural collagen integrity.',
    image: '/images/desla-glow-model.jpg',
    objectPosition: 'center 20%',
  },
];

export const RoutineSection: React.FC<RoutineSectionProps> = ({ onJoinRoutine }) => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const nextStep = () => {
    setActiveStepIndex((prev) => (prev + 1) % ROUTINE_STEPS.length);
  };

  const prevStep = () => {
    setActiveStepIndex((prev) => (prev - 1 + ROUTINE_STEPS.length) % ROUTINE_STEPS.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (diff > 45) {
      nextStep();
    } else if (diff < -45) {
      prevStep();
    }
    setTouchStart(null);
  };

  const currentStep = ROUTINE_STEPS[activeStepIndex];

  return (
    <section id="routine" className="relative py-12 sm:py-16 bg-[#FBF9F5] border-b border-[#E8E2D8]/70">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with calibrated font sizing */}
        <div className="text-center max-w-xl mx-auto mb-10 sm:mb-16">
          <span 
            className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#7A7672] mb-3 block"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            Everyday Ritual
          </span>

          <h2 className="font-manrope text-xl sm:text-2xl lg:text-3xl font-medium text-[#111112] tracking-tight mb-2.5">
            The Four-Step Daily Baseline
          </h2>
          <p 
            className="text-xs sm:text-sm text-[#666360] leading-relaxed max-w-md mx-auto"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            No overwhelming 10-step regimens. Desla! focuses on four essential pillars designed to cleanse, wash, moisturize, and protect natural skin.
          </p>
        </div>

        {/* ================= MOBILE SLIDER VIEW (< md) ================= */}
        {/* 1-Card Slider with calibrated height and touch swipe */}
        <div className="md:hidden mb-12">
          <div 
            className="relative h-[290px] sm:h-[330px] rounded-2xl overflow-hidden bg-[#111112] shadow-md"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep.step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="w-full h-full relative"
              >
                {/* Background Picture with calibrated focal position */}
                <img
                  src={currentStep.image}
                  alt={currentStep.title}
                  style={{ objectPosition: currentStep.objectPosition }}
                  className="w-full h-full object-cover opacity-90"
                />

                {/* Step indicator header */}
                <div className="absolute top-3.5 left-4 text-white/85 text-[11px] font-medium tracking-wider uppercase z-10">
                  Step {currentStep.step} &bull; {currentStep.name}
                </div>

                {/* Counter */}
                <div className="absolute top-3.5 right-4 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-sm text-white/80 text-[10px] font-mono z-10">
                  0{activeStepIndex + 1} / 0{ROUTINE_STEPS.length}
                </div>

                {/* Gradient Scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#111112] via-[#111112]/45 to-transparent pointer-events-none" />

                {/* Content Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-3.5 sm:p-4 z-20 text-white flex flex-col justify-end">
                  <h3 className="font-manrope text-base sm:text-lg font-bold text-white mb-1 leading-snug drop-shadow-xs">
                    {currentStep.title}
                  </h3>

                  <p 
                    className="text-xs text-[#E8E2D8]/90 leading-relaxed mb-0.5"
                    style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                  >
                    {currentStep.description}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Slider Navigation Arrows */}
            <button
              type="button"
              onClick={prevStep}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/60 active:scale-95 transition-all cursor-pointer"
              aria-label="Previous routine step"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={nextStep}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/60 active:scale-95 transition-all cursor-pointer"
              aria-label="Next routine step"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Minimal Step Indicator Dots */}
          <div className="flex items-center justify-center gap-2 mt-3.5">
            {ROUTINE_STEPS.map((step, idx) => (
              <button
                key={step.step}
                type="button"
                onClick={() => setActiveStepIndex(idx)}
                className={'transition-all ' + (activeStepIndex === idx ? 'w-6 h-1.5 bg-[#B89248] rounded-full' : 'w-1.5 h-1.5 bg-[#D5CFC5] rounded-full')}
                aria-label={'Go to step ' + step.step + ': ' + step.name}
              />
            ))}
          </div>
        </div>

        {/* ================= DESKTOP 4-COLUMN GRID (md and above) ================= */}
        {/* Calibrated reduced height so cards are compact and pictures are placed well */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 mb-14">
          {ROUTINE_STEPS.map((step) => {
            return (
              <div 
                key={step.step}
                className="group relative h-[280px] lg:h-[300px] rounded-2xl lg:rounded-3xl overflow-hidden bg-[#111112] shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer"
              >
                {/* Full Bleed Picture with calibrated focal position */}
                <img
                  src={step.image}
                  alt={step.title}
                  style={{ objectPosition: step.objectPosition }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                />

                {/* Minimalist Step Label */}
                <div className="absolute top-4 left-4 text-white/80 text-[11px] font-medium tracking-wider uppercase z-10 transition-opacity duration-300">
                  Step {step.step} &bull; {step.name}
                </div>

                {/* Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#111112] via-[#111112]/45 to-transparent z-10 pointer-events-none" />

                {/* Content Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-5 z-20 text-white flex flex-col justify-end transition-all duration-300">
                  <h3 className="font-manrope text-base lg:text-lg font-bold text-white mb-1.5 leading-snug drop-shadow-xs">
                    {step.title}
                  </h3>

                  <p 
                    className="text-xs text-[#E8E2D8]/90 leading-relaxed"
                    style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                  >
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Future Routine Support CTA Banner */}
        <div className="pt-8 pb-4 flex flex-col md:flex-row items-center justify-between gap-6 text-left border-t border-[#E8E2D8]/60">
          <div className="max-w-xl">
            <span 
              className="text-[11px] font-semibold tracking-wider uppercase text-[#B89248] block mb-1.5"
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
            >
              Diagnostic Support
            </span>
            <h3 className="font-manrope text-xl sm:text-2xl font-medium text-[#111112] mb-1.5 tracking-tight">
              Building your everyday routine with clarity.
            </h3>
            <p 
              className="text-xs sm:text-sm text-[#666360] leading-relaxed font-normal"
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
            >
              When Desla launches, waitlist members receive early access to our diagnostic routine builder, formulation compatibility checks, and dosage guides tuned for tropical humidity.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onJoinRoutine('shopper')}
            className="w-full md:w-auto px-7 py-3 rounded-full bg-[#111112] text-white text-xs font-medium tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-[#28282B] active:scale-[0.98] transition-all min-h-[44px] shrink-0 cursor-pointer shadow-xs"
          >
            <span>Join for routine updates</span>
            <ArrowUpRight className="w-4 h-4 text-[#B89248]" />
          </button>
        </div>

      </div>
    </section>
  );
};
