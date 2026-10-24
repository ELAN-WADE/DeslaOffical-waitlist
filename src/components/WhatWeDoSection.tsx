import React from 'react';
import { Compass, Cpu, Package, Users } from 'lucide-react';

export const WhatWeDoSection: React.FC = () => {
  const pillars = [
    {
      num: '01',
      title: 'Discover',
      tagline: 'Climate-Specific Formulations',
      icon: Compass,
      desc: 'Skincare balanced for tropical humidity, high UV, and melanin richness.',
    },
    {
      num: '02',
      title: 'Understand',
      tagline: 'Vision Diagnostics',
      icon: Cpu,
      desc: 'Micro-barrier scanning that translates skin metrics into clear daily protocols.',
    },
    {
      num: '03',
      title: 'Shop',
      tagline: 'Cold-Chain Delivery',
      icon: Package,
      desc: 'Temperature-controlled storage and same-day dispatch from our Lagos hub.',
    },
    {
      num: '04',
      title: 'Connect',
      tagline: 'Creator Alliances',
      icon: Users,
      desc: 'Honest routines shared by verified creators and cosmetic professionals.',
    },
  ];

  return (
    <section id="discover" className="relative pt-16 sm:pt-20 pb-24 sm:pb-28 bg-[#F5F2EB] overflow-hidden">
      <div className="max-w-[1180px] mx-auto px-4 sm:px-8 relative z-10">
        
        {/* Concise Section Header */}
        <div className="max-w-xl mb-12 sm:mb-14 text-left">
          <span 
            className="text-[10px] font-medium tracking-[0.2em] text-[#9E9A95] uppercase block mb-2"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            The Proposition
          </span>

          <h2 className="font-serif text-3xl sm:text-4xl text-[#111112] font-light leading-tight mb-3">
            More than somewhere to buy beauty.
          </h2>

          <p 
            className="text-[14px] text-[#666360] font-normal leading-relaxed"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            A cohesive bridge between dermatological science, local climate, and dependable logistics.
          </p>
        </div>

        {/* Clean Minimalist 4-Column Grid with System UI text */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.num}
                className="flex flex-col justify-between p-6 rounded-2xl bg-[#FBF9F5] border border-[#E8E2D8] text-left transition-colors duration-200 hover:border-[#B89248]/50"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span 
                      className="text-xs font-mono font-medium text-[#B89248]"
                      style={{ fontFamily: 'ui-monospace, monospace' }}
                    >
                      {item.num}
                    </span>
                    <Icon className="w-4 h-4 text-[#9E9A95]" />
                  </div>

                  <h3 className="font-serif text-xl text-[#111112] font-normal mb-1">
                    {item.title}
                  </h3>

                  <span 
                    className="text-[10px] font-medium tracking-[0.14em] uppercase text-[#9E9A95] block mb-3"
                    style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                  >
                    {item.tagline}
                  </span>

                  <p 
                    className="text-[13px] leading-relaxed text-[#666360] font-normal"
                    style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                  >
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* ================= INTENTIONAL CURVY SECTION BORDER ================= */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none z-10 pointer-events-none">
        <svg 
          viewBox="0 0 1440 68" 
          fill="none" 
          className="w-full h-10 sm:h-16 text-[#FBF9F5] preserve-3d" 
          preserveAspectRatio="none"
        >
          <path 
            d="M0,68 C380,0 1060,0 1440,68 L1440,68 L0,68 Z" 
            fill="currentColor" 
          />
        </svg>
      </div>

    </section>
  );
};
