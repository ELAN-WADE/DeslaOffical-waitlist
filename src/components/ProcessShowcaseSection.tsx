'use client';

import React, { useState } from 'react';
import { ShoppingBag, Sparkles, Building2, Truck, ArrowUpRight, ShieldCheck, ThermometerSnowflake, Check } from 'lucide-react';
import type { RoleType } from '@/types';

interface ProcessShowcaseSectionProps {
  onSelectProcess?: (role: RoleType) => void;
}

const PROCESS_ITEMS = [
  {
    id: 'store',
    number: '01',
    badge: 'Natural Commerce',
    title: 'The Formulation Apothecary',
    subtitle: 'Thoughtful skincare formulated for natural radiance and balance.',
    description: 'Every formulation is cold-blended with pure botanical oils and restorative plant butters. Clean, nourishing formulations tested for everyday radiance.',
    image: '/images/desla-model-safehaven.jpg',
    role: 'shopper' as RoleType,
    icon: ShoppingBag,
    specs: [
      '100% Certified Authentic Care',
      'Botanical Oils & Restorative Butters',
      'Natural Shade & Glow Verification',
    ],
    highlight: 'Opening Batch: 5,000 Units Only',
  },
  {
    id: 'creator',
    number: '02',
    badge: 'Creator Alliances',
    title: 'Creator Studio & PR Gifting Suite',
    subtitle: 'Honest reviews, embargoed drops, and real-time revenue splits.',
    description: 'Verified beauty creators, licensed estheticians, and skin educators receive pre-release PR testing suites, custom formulation lookbooks, and instant transparent commission payouts.',
    image: '/images/desla-studio-trio.jpg',
    role: 'creator' as RoleType,
    icon: Sparkles,
    specs: [
      'Embargoed PR Unboxing Kits',
      '15% Baseline Affiliate Royalty',
      'Direct Paystack & Stripe Payouts',
    ],
    highlight: 'VIP Creator Tier Enrollment',
  },
  {
    id: 'distributor',
    number: '03',
    badge: 'B2B Wholesale',
    title: 'Distributor Hub & Retail Partners',
    subtitle: 'Priority wholesale allocations for regional stockists and retailers.',
    description: 'Regional stockists, retail partners, and beauty distributors gain guaranteed inventory runs, verifiable batch certificates, and tiered volume pricing with dedicated account concierges.',
    image: '/images/desla-distributor-bag.jpg',
    role: 'distributor' as RoleType,
    icon: Building2,
    specs: [
      'Guaranteed Bulk Lot Reservations',
      'Direct Ex-Factory Pricing Tiers',
      'Certificates of Analysis (COA)',
    ],
    highlight: 'Authorized Partner Network',
  },
  {
    id: 'tracking',
    number: '04',
    badge: 'Climate Logistics',
    title: 'Cold-Chain Dispatch & Live Tracking',
    subtitle: 'Thermal-insulated logistics guaranteed under 24°C door-to-door.',
    description: 'Tropical heat breaks down active bio-peptides. We engineered proprietary insulated shipping boxes with live IoT temperature sensor tracking from central dispatch to your doorstep.',
    image: '/showcase/showcase-tracking.jpg',
    role: 'shopper' as RoleType,
    icon: Truck,
    specs: [
      'Under 24°C Guaranteed In-Transit',
      'Live GPS Route & Sensor Telemetry',
      'Same-Day Lagos & Abuja Dispatch',
    ],
    highlight: 'Active Sensor Monitoring',
  },
];

export const ProcessShowcaseSection: React.FC<ProcessShowcaseSectionProps> = ({ onSelectProcess }) => {
  const [activeCard, setActiveCard] = useState<string>('store');

  return (
    <section id="architecture" className="relative py-24 sm:py-32 bg-[#F5F2EB] border-b border-[#E8E2D8] overflow-hidden">
      
      {/* Background Architectural Accent */}
      <div 
        className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-[#EAE4D9]/80 rounded-full blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14 sm:mb-18 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-[#E8E2D8] mb-4">
            <span className="w-2 h-2 rounded-full bg-[#B89248]" />
            <span 
              className="text-[11px] font-semibold tracking-wider text-[#666360] uppercase"
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
            >
              The Architecture of Desla!
            </span>
          </div>

          <h2 className="font-manrope text-3xl sm:text-4xl lg:text-5xl font-bold text-[#111112] tracking-tight leading-[1.15] mb-4">
            Picture-first processes. <br />
            <span className="text-[#B89248]">Engineered for tropical depth.</span>
          </h2>

          <p 
            className="text-[15px] sm:text-[17px] text-[#55524E] leading-relaxed max-w-2xl font-normal"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            Explore the unified operational ecosystem behind our waitlist — combining natural formulation research, honest creator alliances, wholesale distribution, and temperature-controlled logistics.
          </p>
        </div>

        {/* 2x2 Picture-First Glassmorphic Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10">
          {PROCESS_ITEMS.map((item) => {
            const Icon = item.icon;
            const isHovered = activeCard === item.id;

            return (
              <div
                key={item.id}
                onMouseEnter={() => setActiveCard(item.id)}
                className="group relative rounded-3xl overflow-hidden border border-[#E8E2D8] bg-[#111112] shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col justify-end min-h-[440px] sm:min-h-[500px]"
              >
                {/* Full Bleed Photographic Background */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-105 filter brightness-[0.92]"
                  />
                  {/* Subtle Gradient Veil for Text Scannability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111112]/95 via-[#111112]/40 to-transparent" />
                </div>

                {/* Top Glassmorphic Indicator Bar */}
                <div className="absolute top-5 inset-x-5 z-10 flex items-center justify-between pointer-events-none">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#111112]/75 backdrop-blur-md border border-white/20 text-white text-xs font-semibold tracking-wide">
                    <Icon className="w-3.5 h-3.5 text-[#B89248]" />
                    <span>{item.badge}</span>
                  </div>

                  <span 
                    className="text-xs font-mono font-medium text-white/80 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15"
                    style={{ fontFamily: 'ui-monospace, monospace' }}
                  >
                    {item.number}
                  </span>
                </div>

                {/* Bottom Glassmorphism Overlay Card */}
                <div className="relative z-10 m-4 sm:m-6 p-6 sm:p-7 rounded-2xl bg-[#111112]/75 backdrop-blur-xl border border-white/15 text-white transition-all duration-300 group-hover:bg-[#111112]/85 group-hover:border-[#B89248]/50">
                  
                  {/* Title & Subtitle in Manrope */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-manrope text-xl sm:text-2xl font-bold text-white tracking-tight">
                        {item.title}
                      </h3>
                      <button
                        type="button"
                        onClick={() => onSelectProcess?.(item.role)}
                        className="p-1.5 rounded-full bg-white/10 hover:bg-[#B89248] text-white transition-colors cursor-pointer shrink-0"
                        aria-label={`Join waitlist as ${item.role}`}
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </div>
                    <p 
                      className="text-xs sm:text-sm text-[#EAE4D9] mt-1 font-medium"
                      style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                    >
                      {item.subtitle}
                    </p>
                  </div>

                  {/* Body Description */}
                  <p 
                    className="text-xs sm:text-[13px] text-white/75 leading-relaxed mb-5 font-normal"
                    style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                  >
                    {item.description}
                  </p>

                  {/* Specifications Pill Badges */}
                  <div className="pt-4 border-t border-white/10 flex flex-wrap gap-2">
                    {item.specs.map((spec, sIdx) => (
                      <span
                        key={sIdx}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 text-[11px] font-medium text-white/90 border border-white/10"
                        style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                      >
                        <Check className="w-3 h-3 text-[#B89248]" />
                        <span>{spec}</span>
                      </span>
                    ))}
                  </div>

                </div>

              </div>
            );
          })}
        </div>

        {/* Reassurance Footer Banner */}
        <div className="mt-14 p-6 rounded-2xl bg-white border border-[#E8E2D8] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#F5EFE6] flex items-center justify-center text-[#B89248] shrink-0 border border-[#E8E2D8]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-manrope text-sm font-semibold text-[#111112]">
                Guaranteed Pre-Launch Traceability
              </h4>
              <p 
                className="text-xs text-[#666360]"
                style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
              >
                Every waitlist registration is recorded with cryptographic timestamps on our secure ledger.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('waitlist');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-6 py-2.5 rounded-full bg-[#111112] text-white text-xs font-semibold hover:bg-[#28282B] transition-all cursor-pointer whitespace-nowrap shrink-0"
          >
            Claim priority allocation →
          </button>
        </div>

      </div>
    </section>
  );
};
