'use client';

import React, { useState } from 'react';
import { ArrowUpRight, Droplets, CheckCircle2 } from 'lucide-react';
import BounceCards from '@/components/ui/BounceCards';
import type { RoleType } from '../types';

interface CollectionsSectionProps {
  onGetUpdates: (role?: RoleType) => void;
}

const FEATURED_SPECIMENS = [
  {
    id: 'ai-scan',
    src: '/beauty_face_3d.jpg',
    alt: 'PIX™ Optical Skin Telemetry Diagnostics',
    title: 'PIX™ Optical Skin Diagnostics',
    category: 'Diagnostic Telemetry',
    actives: 'Computer-Vision Face Mesh • TEWL Hydration Telemetry',
    description: 'Non-invasive optical scanner calibrated for natural skin depths. Analyzes barrier integrity, moisture retention, and tone uniformity in 60 seconds.',
    isAiScan: true,
  },
  {
    id: 'safe-haven-oil',
    src: '/images/desla-studio-oil-model.jpg',
    alt: 'Desla! Safe Haven Body Oil',
    title: 'Desla! Safe Haven Body Oil',
    category: 'Botanical Nourishment',
    actives: 'Nourish • Soften • Glow • 200ml',
    description: 'Cold-pressed botanical dry body oil that seals in moisture, restores natural glow, and leaves skin supple, radiant, and luminous.',
  },
  {
    id: 'safe-haven-butter',
    src: '/images/desla-studio-butter-apply.jpg',
    alt: 'Desla! Safe Haven Body Butter',
    title: 'Desla! Safe Haven Body Butter',
    category: 'Deep Nourishment',
    actives: 'Deep Nourishment • Lasting Softness • 200ml',
    description: 'Ultra-rich nourishing body butter that provides lasting softness, restores skin comfort, and locks in deep, enduring hydration.',
  },
  {
    id: 'safe-haven-lotion',
    src: '/images/desla-body-lotion.jpg',
    alt: 'Desla! Safe Haven Body Lotion',
    title: 'Desla! Safe Haven Body Lotion',
    category: 'Daily Luxury Care',
    actives: 'Nourish • Soften • Glow • 300ml',
    description: 'Lightweight everyday body lotion offering an immediate moment of luxury, all-day hydration, and non-greasy softness.',
  },
  {
    id: 'lifestyle-set',
    src: '/images/desla-studio-couple-collection.jpg',
    alt: 'Desla! Complete Ritual Collection',
    title: 'Desla! Complete Ritual Collection',
    category: 'Complete Ritual Set',
    actives: 'Body Butter • Body Lotion • Body Scrub',
    description: 'The complete Desla! lifestyle set featuring our signature Safe Haven trio, packaged in an elegant custom luxury gift bag.',
  },
];

export const CollectionsSection: React.FC<CollectionsSectionProps> = ({ onGetUpdates }) => {
  const [selectedCardIndex, setSelectedCardIndex] = useState(0);
  const activeSpecimen = FEATURED_SPECIMENS[selectedCardIndex] || FEATURED_SPECIMENS[0];

  return (
    <section id="offerings" className="relative py-12 sm:py-16 bg-[#FBF9F5] border-b border-[#E8E2D8]/70">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with reduced, calibrated typography */}
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-18">
          <span 
            className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#7A7672] mb-3 block"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            Signature Formulations
          </span>

          <h2 className="font-manrope text-xl sm:text-2xl lg:text-3xl font-medium text-[#111112] tracking-tight mb-2.5">
            Collections & Featured Offerings
          </h2>
          <p 
            className="text-xs sm:text-[13px] text-[#666360] leading-relaxed max-w-md mx-auto"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            A tactile preview of our debut formulations. Thoughtful skincare formulated with pure botanical oils and restorative plant butters.
          </p>
        </div>

        {/* ================= BORDERLESS & BACKGROUNDLESS BOUNCECARDS SHOWCASE ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* Left Column: Interactive BounceCards (Soft shadow, no heavy borders) */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center overflow-visible py-4">
            <span 
              className="text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase text-[#9E9A95] mb-4 block"
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
            >
              Hover to Spread • Click to Inspect
            </span>

            <div className="w-full flex items-center justify-center overflow-visible">
              <BounceCards
                images={FEATURED_SPECIMENS.map((s) => ({ src: s.src, alt: s.alt }))}
                containerWidth={500}
                containerHeight={340}
                cardSize={195}
                spread={72}
                rotation={9}
                arc={-10}
                bounciness={0.65}
                hoverScale={1.1}
                pushDistance={135}
                borderWidth={0}
                borderColor="transparent"
                radius={24}
                shadow={true}
                enableHover={true}
                onCardClick={(index) => setSelectedCardIndex(index)}
                className="max-w-full"
              />
            </div>
          </div>

          {/* Right Column: Borderless & Backgroundless Specimen Narrative */}
          <div className="lg:col-span-5 text-left space-y-4">
            <div className="flex items-center justify-between">
              <span 
                className="text-[11px] font-semibold tracking-wider uppercase text-[#B89248]"
                style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
              >
                {activeSpecimen.category}
              </span>
              <span 
                className="text-xs font-mono text-[#9E9A95]"
                style={{ fontFamily: 'ui-monospace, monospace' }}
              >
                0{selectedCardIndex + 1} / 0{FEATURED_SPECIMENS.length}
              </span>
            </div>

            <h3 className="font-manrope text-xl sm:text-2xl font-medium text-[#111112] tracking-tight leading-snug">
              {activeSpecimen.title}
            </h3>

            <div className="flex items-center gap-1.5 text-xs text-[#B89248] font-medium">
              <Droplets className="w-3.5 h-3.5 shrink-0" />
              <span style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                {activeSpecimen.actives}
              </span>
            </div>

            <p 
              className="text-sm text-[#666360] leading-relaxed"
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
            >
              {activeSpecimen.description}
            </p>

            <div className="pt-5 flex items-center gap-6">
              <div className="flex items-center gap-1.5 text-xs text-[#111112] font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>NAFDAC Ready</span>
              </div>

              <button
                type="button"
                onClick={() => onGetUpdates('shopper')}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#111112] text-white text-xs sm:text-sm font-semibold tracking-wide hover:bg-[#28282B] active:scale-[0.98] transition-all cursor-pointer shadow-xs"
              >
                <span>{activeSpecimen.id === 'ai-scan' ? 'Explore AI Diagnosis' : 'Reserve allocation'}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#B89248]" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
