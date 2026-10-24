'use client';

import React from 'react';

const PRINCIPLES = [
  {
    title: 'Health Before Beauty',
    tagline: 'Barrier Integrity First',
    description: 'Skincare should nourish long-term barrier health. We reject formulas that promise instant cosmetic fixes while damaging natural resilience.',
    image: '/portraits/melanin-routine.jpg',
    imageAlt: 'Gentle facial barrier care application',
  },
  {
    title: 'Formulated for Melanin',
    tagline: 'Depths IV through VI',
    description: 'Melanin reacts distinctly to inflammation and dehydration. Formulations calibrated specifically for deep skin from the first drop.',
    image: '/portraits/melanin-glow.jpg',
    imageAlt: 'Radiant deep melanin skin barrier glow',
  },
  {
    title: 'Clean Ingredient Integrity',
    tagline: 'Bio-Identical Actives',
    description: 'Proven dermatological actives paired with indigenous botanical extracts. Zero hydroquinone, mercury, steroids, or harsh sulfates.',
    image: '/portraits/portrait-hair-touch.jpg',
    imageAlt: 'Clean botanical extracts and natural skin health',
  },
  {
    title: 'Radical Transparency',
    tagline: 'Cold-Chain Provenance',
    description: 'No fabricated reviews or artificial urgency countdowns. Just thoughtful chemistry, airtight packaging, and honest clinical care.',
    image: '/products/barrier-tube.jpg',
    imageAlt: 'Clinical barrier treatment tube in aluminum packaging',
  },
];

export const BrandStorySection: React.FC = () => {
  return (
    <section id="brand-story" className="relative py-14 sm:py-18 lg:py-20 bg-[#F5F2EB]/50 border-b border-[#E8E2D8]/70">
      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Story Header */}
        <div className="max-w-xl mx-auto text-center mb-10 sm:mb-14">
          <span 
            className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#7A7672] mb-2.5 block"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            Brand Philosophy
          </span>
          <h2 className="font-manrope text-xl sm:text-2xl lg:text-3xl font-medium text-[#111112] tracking-tight mb-2.5">
            Health before beauty. Always.
          </h2>
          <p 
            className="text-xs sm:text-[13px] text-[#55524E] leading-relaxed max-w-md mx-auto"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            For too long, individuals with melanin-rich skin navigated shelves lined with products leaving ashy casts or stripping natural oils. Desla! was founded to change that baseline.
          </p>
        </div>

        {/* 4 Cards with Images & Hover Narrative */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PRINCIPLES.map((principle, idx) => (
            <div 
              key={idx}
              className="group relative h-[210px] sm:h-auto sm:aspect-[4/5] rounded-2xl overflow-hidden bg-[#111112] shadow-xs hover:shadow-lg transition-all duration-500 cursor-pointer"
            >
              {/* Background Picture */}
              <img
                src={principle.image}
                alt={principle.imageAlt}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-85 group-hover:opacity-95"
              />

              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#111112] via-[#111112]/40 to-transparent pointer-events-none" />

              {/* Text Overlay */}
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 z-10 text-white flex flex-col justify-end">
                <span className="text-[10px] font-semibold tracking-wider uppercase text-[#C5A059] mb-1">
                  {principle.tagline}
                </span>

                <h3 className="font-manrope text-base sm:text-lg font-bold text-white mb-1.5 leading-snug">
                  {principle.title}
                </h3>

                <p 
                  className="text-[11px] sm:text-xs text-[#E8E2D8]/85 leading-relaxed line-clamp-2 sm:line-clamp-3 group-hover:line-clamp-none transition-all duration-300"
                  style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                >
                  {principle.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
