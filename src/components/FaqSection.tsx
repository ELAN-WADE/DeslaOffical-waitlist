'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle } from 'lucide-react';
import { FAQ_ITEMS } from '../data/waitlistData';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faqs" className="relative py-14 sm:py-18 lg:py-20 bg-[#FBF9F5] border-b border-[#E8E2D8]/60">
      <div className="max-w-[840px] mx-auto px-4 sm:px-8 text-left">
        
        {/* Section Header */}
        <div className="mb-12 sm:mb-16">
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#9E9A95] block mb-3">
            Clear Answers
          </span>
          <h2 className="font-manrope text-xl sm:text-2xl lg:text-3xl font-medium text-[#111112] tracking-tight mb-2">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-[13px] text-[#666360] leading-relaxed max-w-md">
            Everything you need to know about our upcoming launch, joining the waitlist, and what to expect in your inbox.
          </p>
        </div>

        {/* Hairline Accordion */}
        <div className="divide-y divide-[#E8E2D8] border-t border-b border-[#E8E2D8]" role="region" aria-label="Frequently Asked Questions">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            const contentId = `faq-content-${index}`;
            const buttonId = `faq-header-${index}`;

            return (
              <div key={index} className="py-5 sm:py-6">
                <button
                  id={buttonId}
                  onClick={() => toggleItem(index)}
                  className="w-full flex items-center justify-between gap-4 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89248] rounded py-1 cursor-pointer"
                  aria-expanded={isOpen}
                  aria-controls={contentId}
                >
                  <span className="text-lg sm:text-xl text-[#111112] font-medium group-hover:text-[#B89248] transition-colors">
                    {item.question}
                  </span>
                  <div className="w-8 h-8 rounded-full border border-[#E8E2D8] bg-[#F5F2EB] flex items-center justify-center text-[#666360] group-hover:border-[#B89248] transition-colors shrink-0">
                    {isOpen ? <Minus className="w-3.5 h-3.5 text-[#111112]" /> : <Plus className="w-3.5 h-3.5 text-[#666360]" />}
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={contentId}
                      role="region"
                      aria-labelledby={buttonId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pt-3 pb-1 text-sm sm:text-[15px] leading-relaxed text-[#55524E] max-w-2xl font-normal">
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
