'use client';

import React from 'react';
import { ArrowUpRight, FlaskConical, Microscope, Compass, CheckCircle2 } from 'lucide-react';

interface PartnersSectionProps {
  onJoinPartner: () => void;
}

export const PartnersSection: React.FC<PartnersSectionProps> = ({ onJoinPartner }) => {
  return (
    <section id="partners" className="relative py-20 sm:py-24 bg-[#F5F2EB] border-b border-[#E8E2D8]">
      <div className="max-w-[1180px] mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-12 sm:mb-16">
          <span 
            className="text-[10px] font-medium tracking-[0.24em] text-[#9E9A95] uppercase block mb-2"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            Institutional Alliances
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#111112] font-light leading-tight mb-3">
            Formulation & Research Partners
          </h2>
          <p 
            className="text-[14px] text-[#666360] font-normal leading-relaxed"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            Collaborating with leading cosmetic chemistry laboratories, pharmaceutical supply chains, and skincare researchers across Africa and Europe.
          </p>
        </div>

        {/* 3 Pillar Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          {/* Card 1: Co-Lab R&D */}
          <div className="p-7 rounded-2xl bg-[#FBF9F5] border border-[#E8E2D8] flex flex-col justify-between text-left">
            <div>
              <div className="w-9 h-9 rounded-xl bg-[#111112] text-white flex items-center justify-center mb-5">
                <FlaskConical className="w-4 h-4 text-[#B89248]" />
              </div>
              <span className="text-[10px] tracking-[0.16em] uppercase font-semibold text-[#B89248] block mb-1">
                Collaborative R&D
              </span>
              <h3 className="font-serif text-2xl text-[#111112] font-normal mb-3">
                Equatorial Barrier Formulations
              </h3>
              <p className="text-xs text-[#666360] leading-relaxed mb-6 font-light">
                Co-develop climate-tuned skincare capsules optimized for high ambient humidity, elevated UV exposure, and post-inflammatory melanin restoration.
              </p>
            </div>
            <div className="pt-4 border-t border-[#E8E2D8] space-y-2 text-[11px] text-[#666360]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
                <span>Custom pilot batch allocation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
                <span>Clean-room stability verification</span>
              </div>
            </div>
          </div>

          {/* Card 2: AI Skin Diagnostic Telemetry */}
          <div className="p-7 rounded-2xl bg-[#FBF9F5] border border-[#E8E2D8] flex flex-col justify-between text-left">
            <div>
              <div className="w-9 h-9 rounded-xl bg-[#111112] text-white flex items-center justify-center mb-5">
                <Microscope className="w-4 h-4 text-[#B89248]" />
              </div>
              <span className="text-[10px] tracking-[0.16em] uppercase font-semibold text-[#111112] block mb-1">
                Diagnostics & Telemetry
              </span>
              <h3 className="font-serif text-2xl text-[#111112] font-normal mb-3">
                Multi-Spectrum Vision Intelligence
              </h3>
              <p className="text-xs text-[#666360] leading-relaxed mb-6 font-light">
                Contribute diagnostic reference datasets and evaluate routine efficacy through anonymized computer-vision barrier measurements over 30-day wear intervals.
              </p>
            </div>
            <div className="pt-4 border-t border-[#E8E2D8] space-y-2 text-[11px] text-[#666360]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
                <span>Empirical product tolerance index</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
                <span>Dermatologist peer-review suite</span>
              </div>
            </div>
          </div>

          {/* Card 3: Cold-Chain Logistics Hub */}
          <div className="p-7 rounded-2xl bg-[#FBF9F5] border border-[#E8E2D8] flex flex-col justify-between text-left">
            <div>
              <div className="w-9 h-9 rounded-xl bg-[#111112] text-white flex items-center justify-center mb-5">
                <Compass className="w-4 h-4 text-[#B89248]" />
              </div>
              <span className="text-[10px] tracking-[0.16em] uppercase font-semibold text-[#111112] block mb-1">
                Infrastructure
              </span>
              <h3 className="font-serif text-2xl text-[#111112] font-normal mb-3">
                Pharmaceutical Logistics SLA
              </h3>
              <p className="text-xs text-[#666360] leading-relaxed mb-6 font-light">
                Leverage Desla's temperature-monitored cold-chain dispatch (guaranteed under 24°C) to protect formulation integrity from airport arrival to retail partners nationwide.
              </p>
            </div>
            <div className="pt-4 border-t border-[#E8E2D8] space-y-2 text-[11px] text-[#666360]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
                <span>Real-time GPS sensor logging</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
                <span>Anti-counterfeit cryptographic seals</span>
              </div>
            </div>
          </div>

        </div>

        {/* Action Bar */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#111112] text-white flex flex-col sm:flex-row items-center justify-between gap-6 text-left">
          <div>
            <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-[#B89248] block mb-1">
              Institutional Allocation
            </span>
            <h4 className="font-serif text-2xl text-white font-light">
              Are you a laboratory, supplier, or research partner?
            </h4>
            <p className="text-xs text-[#9E9A95] max-w-lg mt-1 font-light">
              Register for tier-1 partner credentials to receive formulation telemetry and priority collaboration drops.
            </p>
          </div>

          <button
            onClick={onJoinPartner}
            className="w-full sm:w-auto px-7 py-3 rounded-full bg-[#B89248] text-[#111112] text-xs font-semibold tracking-[0.14em] uppercase flex items-center justify-center gap-2 hover:bg-[#C5A059] transition-colors cursor-pointer shrink-0"
          >
            <span>Explore Partnership Opportunities</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </section>
  );
};
