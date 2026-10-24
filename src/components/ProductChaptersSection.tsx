'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, Scan, Truck, MessageSquare, Users, 
  CheckCircle2, ChevronRight, Thermometer, Clock, Navigation
} from 'lucide-react';
import { PRODUCT_CHAPTERS, CONCIERGE_DEMOS } from '../data/waitlistData';

export const ProductChaptersSection: React.FC = () => {
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);

  // States for Chapter 2: AI Skin Intelligence
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);

  // States for Chapter 4: Concierge
  const [selectedPromptIndex, setSelectedPromptIndex] = useState(0);

  const activeChapter = PRODUCT_CHAPTERS[activeChapterIndex];

  const runScanSimulation = () => {
    setIsScanning(true);
    setScanComplete(false);
    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
    }, 1800);
  };

  return (
    <section id="experience" className="relative py-16 sm:py-20 bg-[#F5F2EB] border-b border-[#E8E2D8]">
      <div className="max-w-[1180px] mx-auto px-4 sm:px-8">
        
        {/* Concise Section Header */}
        <div className="max-w-xl mb-10 sm:mb-12 text-left">
          <span 
            className="text-[10px] font-medium tracking-[0.2em] text-[#9E9A95] uppercase block mb-2"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            What To Expect
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#111112] font-light leading-tight mb-2">
            Five chapters of considered craft.
          </h2>
          <p 
            className="text-[14px] text-[#666360] font-normal"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            An interconnected ecosystem designed for personal discovery, clinical efficacy, and verified logistics.
          </p>
        </div>

        {/* Clean Chapter Selector Tabs (Fully responsive with overflow scroll on mobile) */}
        <div 
          className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar"
          style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
        >
          {PRODUCT_CHAPTERS.map((ch, idx) => {
            const isActive = activeChapterIndex === idx;
            return (
              <button
                key={ch.id}
                onClick={() => setActiveChapterIndex(idx)}
                className={`px-3.5 py-2 rounded-full text-[11px] font-medium tracking-[0.12em] uppercase whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-[#111112] text-[#FBF9F5]'
                    : 'bg-[#FBF9F5] text-[#666360] border border-[#E8E2D8] hover:border-[#111112]/30'
                }`}
              >
                <span className={`text-[10px] font-mono ${isActive ? 'text-[#B89248]' : 'text-[#9E9A95]'}`}>
                  {ch.number}
                </span>
                <span>{ch.tag}</span>
              </button>
            );
          })}
        </div>

        {/* 2-Column Responsive Chapter Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Interactive Stage Canvas (7 Cols) */}
          <div className="lg:col-span-7 bg-[#FBF9F5] rounded-2xl border border-[#E8E2D8] p-5 sm:p-7 min-h-[460px] flex flex-col justify-between shadow-sm relative overflow-hidden">
            
            <AnimatePresence mode="wait">
              {/* CHAPTER 01: DISCOVER & SHOP */}
              {activeChapterIndex === 0 && (
                <motion.div
                  key="chap-01"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col h-full justify-between gap-5 text-left"
                  style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                >
                  <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D8]">
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-[#B89248]" />
                      <span className="text-[11px] font-medium tracking-[0.14em] uppercase text-[#111112]">
                        Commerce Preview
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-[#666360]">
                      Batch 084
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center my-auto">
                    <div className="sm:col-span-5 aspect-[4/4.5] rounded-xl overflow-hidden border border-[#E8E2D8] bg-[#F5F2EB]">
                      <img
                        src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80"
                        alt="Product"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="sm:col-span-7 flex flex-col">
                      <span className="text-[10px] tracking-wider uppercase font-semibold text-[#9E9A95] mb-1">
                        Barrier Protocol
                      </span>
                      <h4 className="font-serif text-2xl text-[#111112] font-normal leading-tight mb-2">
                        Bio-Ferment Essence
                      </h4>
                      <p className="text-[13px] text-[#666360] mb-4 leading-relaxed">
                        92% Galactomyces filtrate and green tea extract balanced for coastal climate resilience.
                      </p>

                      <div className="space-y-1.5 text-xs text-[#666360] pb-3 border-b border-[#E8E2D8] mb-3">
                        <div className="flex justify-between">
                          <span>Standard Allocation:</span>
                          <strong className="text-[#111112]">₦26,500</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Absorption:</span>
                          <span className="text-[#111112]">12s Dry-Touch</span>
                        </div>
                      </div>

                      <div className="text-[11px] text-[#666360]">
                        Refrigerated stock verified at Lagos central hub.
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#E8E2D8] flex items-center justify-between text-[11px] text-[#9E9A95]">
                    <span>Chapter 01 / 05</span>
                    <span className="text-[#B89248]">Frictionless Checkout</span>
                  </div>
                </motion.div>
              )}

              {/* CHAPTER 02: AI SKIN INTELLIGENCE */}
              {activeChapterIndex === 1 && (
                <motion.div
                  key="chap-02"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col h-full justify-between gap-5 text-left"
                  style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                >
                  <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D8]">
                    <div className="flex items-center gap-2">
                      <Scan className="w-4 h-4 text-[#B89248]" />
                      <span className="text-[11px] font-medium tracking-[0.14em] uppercase text-[#111112]">
                        Skin Diagnostics
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-[#16A34A] bg-[#16A34A]/10 px-2 py-0.5 rounded">
                      Optical Diagnostic
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center my-auto">
                    <div className="sm:col-span-5 relative aspect-[3.8/4.5] rounded-xl overflow-hidden border border-[#E8E2D8] bg-black">
                      <img
                        src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80"
                        alt="Diagnostics Face"
                        className="w-full h-full object-cover opacity-85"
                      />
                      {isScanning && (
                        <motion.div
                          initial={{ top: '0%' }}
                          animate={{ top: ['0%', '100%', '0%'] }}
                          transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                          className="absolute left-0 right-0 h-0.5 bg-[#B89248] shadow-[0_0_8px_#B89248]"
                        />
                      )}
                      <div className="absolute bottom-2 left-2 right-2 text-center">
                        <span className="text-[9px] font-mono text-white/90 bg-black/60 px-2 py-0.5 rounded">
                          {isScanning ? 'Measuring...' : scanComplete ? 'Diagnostic Ready' : 'Ready'}
                        </span>
                      </div>
                    </div>

                    <div className="sm:col-span-7 flex flex-col">
                      <h4 className="font-serif text-xl text-[#111112] font-normal mb-1">
                        Diagnostic Telemetry
                      </h4>
                      <p className="text-xs text-[#666360] mb-3">
                        Tuned for melanin richness and tropical UV factors.
                      </p>

                      <div className="space-y-2 mb-4 text-xs">
                        <div>
                          <div className="flex justify-between mb-0.5">
                            <span className="text-[#666360]">Barrier Hydration</span>
                            <strong className="text-[#111112]">94 / 100</strong>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-[#E8E2D8]">
                            <div className="h-full bg-[#16A34A] rounded-full w-[94%]" />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between mb-0.5">
                            <span className="text-[#666360]">Hyperpigmentation Risk</span>
                            <span className="text-[#B89248] font-medium">Low (18%)</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-[#E8E2D8]">
                            <div className="h-full bg-[#B89248] rounded-full w-[18%]" />
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={runScanSimulation}
                        disabled={isScanning}
                        className="py-2.5 px-4 rounded-full bg-[#111112] text-white text-[11px] font-medium tracking-[0.12em] uppercase hover:bg-[#28282B] transition-colors cursor-pointer"
                      >
                        {isScanning ? 'Scanning...' : 'Run Diagnostic Simulation'}
                      </button>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#E8E2D8] flex items-center justify-between text-[11px] text-[#9E9A95]">
                    <span>Chapter 02 / 05</span>
                    <span className="text-[#B89248]">Multi-Spectrum AI</span>
                  </div>
                </motion.div>
              )}

              {/* CHAPTER 03: FROM BAG TO DOOR */}
              {activeChapterIndex === 2 && (
                <motion.div
                  key="chap-03"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col h-full justify-between gap-5 text-left"
                  style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                >
                  <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D8]">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-[#B89248]" />
                      <span className="text-[11px] font-medium tracking-[0.14em] uppercase text-[#111112]">
                        Lagos Logistics
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-[#B89248]">
                      Consignment #DL-9042
                    </span>
                  </div>

                  <div className="rounded-xl bg-[#111112] text-white p-5 my-auto">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-[#B89248] block">Route</span>
                        <h4 className="font-serif text-lg font-light">Lekki Hub ➔ Victoria Island</h4>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-[#16A34A] font-mono">
                        <Thermometer className="w-3.5 h-3.5" />
                        <span>21.4°C Vault</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-2 text-center text-[10px] uppercase tracking-wider py-3 border-y border-white/10 text-white/70">
                      <div>Confirmed</div>
                      <div>Compounded</div>
                      <div className="text-[#B89248] font-bold">In Transit</div>
                      <div>Delivered</div>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-[11px] text-white/80">
                      <div className="flex items-center gap-1.5">
                        <Navigation className="w-3.5 h-3.5 text-[#B89248]" />
                        <span>Rider: Babatunde A.</span>
                      </div>
                      <div className="flex items-center gap-1 text-[#B89248] font-mono">
                        <Clock className="w-3.5 h-3.5" />
                        <span>ETA: 18m</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#E8E2D8] flex items-center justify-between text-[11px] text-[#9E9A95]">
                    <span>Chapter 03 / 05</span>
                    <span className="text-[#B89248]">Cold-Chain Preserved</span>
                  </div>
                </motion.div>
              )}

              {/* CHAPTER 04: ASK DELSLA */}
              {activeChapterIndex === 3 && (
                <motion.div
                  key="chap-04"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col h-full justify-between gap-5 text-left"
                  style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                >
                  <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D8]">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-[#B89248]" />
                      <span className="text-[11px] font-medium tracking-[0.14em] uppercase text-[#111112]">
                        Concierge AI
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-[#666360]">
                      Dermatology Model 2.4
                    </span>
                  </div>

                  <div className="space-y-3 my-auto">
                    <div className="flex justify-end">
                      <div className="max-w-[85%] rounded-xl rounded-tr-none bg-[#111112] text-white p-3 text-xs leading-relaxed">
                        {CONCIERGE_DEMOS[selectedPromptIndex].prompt}
                      </div>
                    </div>

                    <div className="flex justify-start">
                      <div className="max-w-[90%] rounded-xl rounded-tl-none bg-[#F5F2EB] border border-[#E8E2D8] p-3 text-xs leading-relaxed text-[#111112]">
                        <p className="whitespace-pre-line">
                          {CONCIERGE_DEMOS[selectedPromptIndex].response}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-[#9E9A95] font-semibold block mb-1.5">
                      Sample inquiries:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {CONCIERGE_DEMOS.map((demo, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedPromptIndex(idx)}
                          className={`px-2.5 py-1 rounded-full text-[10px] transition-colors cursor-pointer ${
                            selectedPromptIndex === idx
                              ? 'bg-[#B89248] text-white'
                              : 'bg-[#F5F2EB] text-[#666360] hover:bg-[#E8E2D8]'
                          }`}
                        >
                          "{demo.prompt.slice(0, 26)}..."
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#E8E2D8] flex items-center justify-between text-[11px] text-[#9E9A95]">
                    <span>Chapter 04 / 05</span>
                    <span className="text-[#B89248]">Conversational Support</span>
                  </div>
                </motion.div>
              )}

              {/* CHAPTER 05: BEAUTY TOGETHER */}
              {activeChapterIndex === 4 && (
                <motion.div
                  key="chap-05"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col h-full justify-between gap-5 text-left"
                  style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                >
                  <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D8]">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#B89248]" />
                      <span className="text-[11px] font-medium tracking-[0.14em] uppercase text-[#111112]">
                        Community Lookbooks
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-[#666360]">
                      Verified Profiles
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-auto">
                    <div className="rounded-xl bg-[#F5F2EB] p-3.5 border border-[#E8E2D8]">
                      <div className="flex items-center gap-2.5 mb-2">
                        <img
                          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                          alt="Creator"
                          className="w-7 h-7 rounded-full object-cover"
                        />
                        <div>
                          <span className="text-xs font-semibold text-[#111112] block">Zainab Aliyu</span>
                          <span className="text-[9px] text-[#9E9A95]">Lagos • Dry Skin</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-[#666360] leading-snug">
                        "Switched to the Bio-Glaze protocol after 2 years of coastal humidity breakouts. Unretouched skin."
                      </p>
                    </div>

                    <div className="rounded-xl bg-[#F5F2EB] p-3.5 border border-[#E8E2D8]">
                      <div className="flex items-center gap-2.5 mb-2">
                        <img
                          src="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=150&q=80"
                          alt="Specialist"
                          className="w-7 h-7 rounded-full object-cover"
                        />
                        <div>
                          <span className="text-xs font-semibold text-[#111112] block">Dr. Nkechi Eze</span>
                          <span className="text-[9px] text-[#B89248]">Dermatologist</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-[#666360] leading-snug">
                        "Finally an African commerce ecosystem verifying ingredient stability in hot ambient transit."
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#E8E2D8] flex items-center justify-between text-[11px] text-[#9E9A95]">
                    <span>Chapter 05 / 05</span>
                    <span className="text-[#B89248]">Authentic Skin Proof</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* Descriptive Narrative (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between text-left min-h-[460px]">
            <div>
              <div 
                className="flex items-center gap-3 mb-3 text-xs"
                style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
              >
                <span className="font-mono text-[#B89248] font-medium">
                  {activeChapter.number}
                </span>
                <span className="w-6 h-px bg-[#E8E2D8]" />
                <span className="tracking-[0.16em] uppercase text-[#9E9A95] font-medium">
                  {activeChapter.tag}
                </span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl text-[#111112] font-normal leading-snug mb-3">
                {activeChapter.title}
              </h3>

              <p 
                className="text-[14px] text-[#666360] leading-relaxed mb-6"
                style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
              >
                {activeChapter.description}
              </p>

              <div 
                className="space-y-2 mb-8"
                style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
              >
                {activeChapter.features.map((feat, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-[#111112]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#B89248] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stepper Control */}
            <div 
              className="pt-4 border-t border-[#E8E2D8] flex items-center justify-between text-xs"
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
            >
              <button
                onClick={() => setActiveChapterIndex((prev) => (prev > 0 ? prev - 1 : PRODUCT_CHAPTERS.length - 1))}
                className="uppercase tracking-wider text-[#666360] hover:text-[#111112] transition-colors cursor-pointer"
              >
                Previous
              </button>

              <div className="flex gap-1.5">
                {PRODUCT_CHAPTERS.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-200 ${
                      activeChapterIndex === i ? 'w-5 bg-[#B89248]' : 'w-1.5 bg-[#E8E2D8]'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={() => setActiveChapterIndex((prev) => (prev + 1) % PRODUCT_CHAPTERS.length)}
                className="uppercase tracking-wider font-semibold text-[#111112] flex items-center gap-1 hover:text-[#B89248] transition-colors cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
