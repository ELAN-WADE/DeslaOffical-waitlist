'use client';

import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

interface FooterSectionProps {
  onJoinClick: () => void;
}

export const FooterSection: React.FC<FooterSectionProps> = ({ onJoinClick }) => {
  return (
    <footer 
      className="relative bg-[#111112] text-[#FBF9F5] pt-16 pb-12 px-4 sm:px-8 border-t border-white/10"
      style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
    >
      <div className="max-w-[1200px] mx-auto flex flex-col justify-between">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-white/10 items-start text-left">
          
          <div className="md:col-span-5">
            <a href="#" className="inline-block mb-3" aria-label="Desla! Homepage">
              <img 
                src="/desla-logo.png" 
                alt="Desla!" 
                className="h-7 w-auto object-contain brightness-0 invert" 
              />
            </a>
            <p className="text-xs text-[#9E9A95] max-w-sm leading-relaxed mb-4 font-light">
              Thoughtful skincare, everyday routines, and beauty community designed and formulated for melanin-rich skin.
            </p>
            <span className="text-[10px] font-mono text-[#B89248] uppercase tracking-wider block">
              Lagos • London • New York
            </span>
          </div>

          <div className="md:col-span-3 text-xs">
            <span className="text-[10px] font-semibold tracking-[0.16em] uppercase text-[#9E9A95] block mb-3">
              Waitlist Journey
            </span>
            <ul className="space-y-2 text-white/70">
              <li><a href="#affiliates" className="hover:text-white transition-colors">Affiliation Programs</a></li>
              <li><a href="#offerings" className="hover:text-white transition-colors">Featured Specimens</a></li>
              <li><a href="#routine" className="hover:text-white transition-colors">Daily Routine</a></li>
              <li><a href="#brand-story" className="hover:text-white transition-colors">Brand Philosophy</a></li>
              <li><a href="#faqs" className="hover:text-white transition-colors">FAQs</a></li>
            </ul>
          </div>

          <div className="md:col-span-4 flex flex-col items-start md:items-end">
            <span className="text-[10px] font-semibold tracking-[0.16em] uppercase text-[#9E9A95] block mb-3">
              Priority Access
            </span>
            <button
              onClick={onJoinClick}
              className="px-6 py-3 rounded-full bg-[#FBF9F5] text-[#111112] text-xs font-semibold tracking-wide flex items-center gap-2 hover:bg-[#EAE4D9] active:scale-95 transition-all cursor-pointer min-h-[44px]"
            >
              <span>Join the waitlist</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#B89248]" />
            </button>
          </div>

        </div>

        {/* Bottom Tier */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#9E9A95]">
          <p>© {new Date().getFullYear()} Desla! Beauty Technologies. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#faqs" className="hover:text-white transition-colors">Privacy Notice</a>
            <a href="#faqs" className="hover:text-white transition-colors">Terms of Waitlist</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
