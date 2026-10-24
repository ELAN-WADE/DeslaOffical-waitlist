'use client';

import React from 'react';
import { ArrowUpRight, ShieldCheck, Share2, Award, Building2, PackageCheck } from 'lucide-react';

interface EcosystemSectionProps {
  onJoinCreator: () => void;
  onJoinDistributor: () => void;
}

export const EcosystemSection: React.FC<EcosystemSectionProps> = ({
  onJoinCreator,
  onJoinDistributor
}) => {
  return (
    <section id="creators" className="relative py-16 sm:py-20 bg-[#FBF9F5] border-b border-[#E8E2D8]">
      <div className="max-w-[1180px] mx-auto px-4 sm:px-8">
        
        {/* Concise Section Header */}
        <div className="text-center max-w-xl mx-auto mb-12 sm:mb-14">
          <span 
            className="text-[10px] font-medium tracking-[0.2em] text-[#9E9A95] uppercase block mb-2"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            The Ecosystem
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#111112] font-light leading-tight mb-2">
            Built for creators and distributors.
          </h2>
          <p 
            className="text-[14px] text-[#666360] font-normal"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            Connecting creative curation with direct-from-lab logistics across Nigeria.
          </p>
        </div>

        {/* 2 Differentiated Minimal Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          
          {/* CREATORS STORY */}
          <div 
            className="flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-[#F5F2EB] border border-[#E8E2D8] text-left"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] tracking-[0.16em] uppercase font-semibold text-[#B89248]">
                  Creators & Curators
                </span>
                <span className="text-[10px] text-[#9E9A95] uppercase font-mono">01</span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl text-[#111112] font-normal leading-snug mb-2">
                Monetize your taste, not just clicks.
              </h3>

              <p className="text-[13px] text-[#666360] leading-relaxed mb-6">
                Curate custom lookbooks, formulate lab drops, and earn transparent automated royalties on every verified routine order.
              </p>

              {/* Creator Specimen Box */}
              <div className="rounded-xl bg-[#FBF9F5] p-4 border border-[#E8E2D8] mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=160&q=80"
                    alt="Creator"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="text-sm font-semibold text-[#111112]">Amina Bello</h4>
                    <span className="text-[11px] text-[#9E9A95] block">Beauty Editor • Lagos</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center pt-2.5 border-t border-[#E8E2D8] text-xs">
                  <div className="bg-[#F5F2EB] p-2 rounded-lg">
                    <span className="text-[9px] text-[#9E9A95] uppercase block">Lookbook Clones</span>
                    <strong className="text-[#111112]">1,840</strong>
                  </div>
                  <div className="bg-[#F5F2EB] p-2 rounded-lg">
                    <span className="text-[9px] text-[#9E9A95] uppercase block">Shared Royalties</span>
                    <strong className="text-[#16A34A]">₦1.42M</strong>
                  </div>
                </div>
              </div>

              {/* Value points */}
              <div className="space-y-2 mb-6 text-xs text-[#666360]">
                <div className="flex items-center gap-2">
                  <Award className="w-3.5 h-3.5 text-[#B89248]" />
                  <span>Quarterly complimentary pre-release lab drops</span>
                </div>
                <div className="flex items-center gap-2">
                  <Share2 className="w-3.5 h-3.5 text-[#B89248]" />
                  <span>Personalized digital shopfront with zero inventory holding</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#B89248]" />
                  <span>Direct automated bank payouts via Paystack</span>
                </div>
              </div>
            </div>

            <button
              onClick={onJoinCreator}
              className="w-full py-3 rounded-full bg-[#111112] text-[#FBF9F5] text-[11px] font-medium tracking-[0.14em] uppercase flex items-center justify-center gap-1.5 hover:bg-[#28282B] transition-colors cursor-pointer"
            >
              <span>Join Creator Program</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#B89248]" />
            </button>
          </div>

          {/* DISTRIBUTORS STORY */}
          <div 
            id="distributors"
            className="flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-[#F5F2EB] border border-[#E8E2D8] text-left"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] tracking-[0.16em] uppercase font-semibold text-[#111112]">
                  Distributors & Salons
                </span>
                <span className="text-[10px] text-[#9E9A95] uppercase font-mono">02</span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl text-[#111112] font-normal leading-snug mb-2">
                Verified wholesale allocation.
              </h3>

              <p className="text-[13px] text-[#666360] leading-relaxed mb-6">
                Direct factory allocations, tamper-evident anti-counterfeit QR seals, and guaranteed cold-chain logistics across Nigeria.
              </p>

              {/* Distributor Specimen Box */}
              <div className="rounded-xl bg-[#FBF9F5] p-4 border border-[#E8E2D8] mb-6">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E8E2D8]">
                  <span className="text-[10px] uppercase font-semibold text-[#9E9A95]">
                    Wholesale Order Allocation
                  </span>
                  <span className="text-[10px] font-mono text-[#16A34A] bg-[#16A34A]/10 px-2 py-0.5 rounded">
                    Verified Hub
                  </span>
                </div>

                <div className="space-y-1 text-xs text-[#111112]">
                  <div className="flex justify-between">
                    <span className="text-[#666360]">Batch Units:</span>
                    <span>Bio-Glaze Serums (240 Units)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#666360]">Verification:</span>
                    <span className="text-[#B89248]">QR Batch #992</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#666360]">Route:</span>
                    <span>Lagos Hub ➔ Maitama Boutique</span>
                  </div>
                </div>
              </div>

              {/* Value points */}
              <div className="space-y-2 mb-6 text-xs text-[#666360]">
                <div className="flex items-center gap-2">
                  <PackageCheck className="w-3.5 h-3.5 text-[#111112]" />
                  <span>Direct lab wholesale pricing with zero middlemen markups</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#111112]" />
                  <span>Encrypted anti-counterfeit batch verification</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-[#111112]" />
                  <span>Territorial partner priority for verified clinics</span>
                </div>
              </div>
            </div>

            <button
              onClick={onJoinDistributor}
              className="w-full py-3 rounded-full bg-transparent border border-[#111112] text-[#111112] text-[11px] font-medium tracking-[0.14em] uppercase flex items-center justify-center gap-1.5 hover:bg-[#111112] hover:text-[#FBF9F5] transition-colors cursor-pointer"
            >
              <span>Apply For Distribution</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#B89248]" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
