'use client';

import React from 'react';

const PRINCIPLES = [
  {
    title: 'Health Before Beauty',
    tagline: 'Barrier Health First',
    description: 'True radiance starts with deep nourishment. We formulate to honor and protect your natural moisture barrier for lasting skin health.',
    image: '/images/desla-studio-oil-model.jpg',
    imageAlt: 'Model holding Desla Safe Haven Body Oil with radiant skin glow',
    objectPosition: 'center 15%',
  },
  {
    title: 'Pure Botanical Care',
    tagline: 'Clean Plant Formulations',
    description: 'Cold-blended with restorative plant butters and botanical oils. Zero harsh sulfates, hydroquinone, steroids, or artificial fillers.',
    image: '/images/desla-studio-butter-apply.jpg',
    imageAlt: 'Model applying Desla Safe Haven nourishing body butter',
    objectPosition: 'center 20%',
  },
  {
    title: 'Collective Radiance',
    tagline: 'Shared Representation',
    description: 'Thoughtfully formulated for all skin depths. Celebrating natural textures, authentic tones, and shared everyday radiance.',
    image: '/images/desla-studio-trio.jpg',
    imageAlt: 'Models celebrating Desla Safe Haven clean formulations',
    objectPosition: 'center 20%',
  },
  {
    title: 'Safe Haven Body Butter',
    tagline: 'Enduring Softness',
    description: 'Ultra-rich restorative body butter providing intense, long-lasting hydration to keep your skin smooth, supple, and comforted.',
    image: '/images/desla-body-butter.jpg',
    imageAlt: 'Desla Safe Haven Body Butter in luxury jar packaging',
    objectPosition: 'center center',
  },
  {
    title: 'Safe Haven Body Lotion',
    tagline: 'Daily Luxury Ritual',
    description: 'Fast-absorbing, non-greasy everyday body lotion providing touchable softness, instant skin comfort, and all-day hydration.',
    image: '/images/desla-body-lotion.jpg',
    imageAlt: 'Desla Safe Haven Body Lotion daily pump formulation',
    objectPosition: 'center 25%',
  },
  {
    title: 'The Complete Ritual',
    tagline: 'Radical Transparency',
    description: 'Experience the complete Desla ritual featuring our Body Butter, Body Lotion, and Body Scrub with full ingredient provenance.',
    image: '/images/desla-studio-couple-collection.jpg',
    imageAlt: 'Desla complete collection with Safe Haven Body Butter, Lotion, and Scrub',
    objectPosition: 'center 20%',
  },
];

export const BrandStorySection: React.FC = () => {
  return (
    <section id="brand-story" className="relative py-14 sm:py-18 lg:py-20 bg-[#F5F2EB]/50 border-b border-[#E8E2D8]/70">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        
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
            Formulated to nourish long-term skin health with pure botanicals and restorative oils. Experience Desla’s signature Safe Haven collection.
          </p>
        </div>

        {/* 6 Cards with Real Desla Pictures - Calibrated to show full subject */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRINCIPLES.map((principle, idx) => (
            <div 
              key={idx}
              className="group relative h-[210px] sm:h-auto sm:aspect-[4/5] rounded-2xl overflow-hidden bg-[#161514] shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer border border-[#E8E2D8]/60 flex flex-col justify-end"
            >
              {/* Full-bleed background image calibrated with tailored focal position */}
              <img
                src={principle.image}
                alt={principle.imageAlt}
                style={{ objectPosition: principle.objectPosition }}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
              />

              {/* Refined gradient scrim so text is readable without obscuring product */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#111112]/95 via-[#111112]/40 to-transparent pointer-events-none z-15" />

              {/* Text Overlay */}
              <div className="relative z-20 p-5 sm:p-6 text-white flex flex-col justify-end">
                <span className="text-[10px] font-semibold tracking-wider uppercase text-[#C5A059] mb-1">
                  {principle.tagline}
                </span>

                <h3 className="font-manrope text-base sm:text-lg font-bold text-white mb-1 leading-snug">
                  {principle.title}
                </h3>

                <p 
                  className="text-[11px] sm:text-xs text-[#E8E2D8]/90 leading-relaxed"
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
