'use client';

import React, { useState } from 'react';
import { Check, ShoppingBag } from 'lucide-react';

export const CommerceStorySection: React.FC = () => {
  const [currency, setCurrency] = useState<'NGN' | 'USD'>('NGN');
  const [addedToBag, setAddedToBag] = useState(false);
  const [selectedShade, setSelectedShade] = useState('02 Dew');

  const price = currency === 'NGN' ? '₦34,000' : '$26 USD';

  const handleAdd = () => {
    setAddedToBag(true);
    setTimeout(() => setAddedToBag(false), 2000);
  };

  return (
    <section className="relative py-16 sm:py-20 bg-[#FBF9F5] border-b border-[#E8E2D8]">
      <div className="max-w-[1180px] mx-auto px-4 sm:px-8">
        
        {/* Minimal Section Marker */}
        <div 
          className="flex items-center justify-between pb-4 border-b border-[#E8E2D8] mb-10 sm:mb-12 text-[10px] tracking-[0.2em] uppercase text-[#9E9A95] font-medium"
          style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
        >
          <span>Commerce Narrative</span>
          <span>Atelier Experience</span>
        </div>

        {/* Two-Column Clean Editorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left: Controlled-Height Editorial Image (No sprawling oversize) */}
          <div className="lg:col-span-6 relative">
            <div className="relative w-full aspect-[4/3.8] sm:aspect-[4/3.5] rounded-2xl overflow-hidden border border-[#E8E2D8] bg-[#F5F2EB]">
              <img
                src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=80"
                alt="Skincare application"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
              
              <div 
                className="absolute bottom-4 left-5 right-5 text-white text-left"
                style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
              >
                <span className="text-[10px] tracking-[0.16em] uppercase text-[#B89248] font-medium block">
                  Sensory Verification
                </span>
                <p className="font-serif text-lg sm:text-xl font-light text-white/95">
                  Know the exact viscosity and finish before delivery.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Concise Text & Clean Product Specimen */}
          <div className="lg:col-span-6 flex flex-col justify-center text-left">
            <span 
              className="text-[10px] font-medium tracking-[0.2em] text-[#9E9A95] uppercase block mb-2"
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
            >
              The Digital Counter
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl text-[#111112] font-light leading-snug mb-3">
              Intimate, transparent beauty shopping.
            </h2>

            <p 
              className="text-[14px] text-[#666360] leading-relaxed mb-6"
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
            >
              Every formulation discloses active ingredient percentages, unretouched skin swatches, and climate compatibility ratings.
            </p>

            {/* Clean Specimen Box */}
            <div 
              className="rounded-2xl bg-[#F5F2EB] border border-[#E8E2D8] p-5 sm:p-6"
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-[#9E9A95] font-semibold">
                    Formula 018
                  </span>
                  <h3 className="font-serif text-xl text-[#111112] font-normal">
                    Ceramide Luminescence Glaze
                  </h3>
                </div>

                {/* Currency Switcher */}
                <div className="flex rounded-full border border-[#E8E2D8] bg-white p-0.5 text-[10px] font-mono">
                  <button
                    onClick={() => setCurrency('NGN')}
                    className={`px-2.5 py-1 rounded-full transition-colors cursor-pointer ${
                      currency === 'NGN' ? 'bg-[#111112] text-white font-medium' : 'text-[#666360]'
                    }`}
                  >
                    ₦ NGN
                  </button>
                  <button
                    onClick={() => setCurrency('USD')}
                    className={`px-2.5 py-1 rounded-full transition-colors cursor-pointer ${
                      currency === 'USD' ? 'bg-[#111112] text-white font-medium' : 'text-[#666360]'
                    }`}
                  >
                    $ USD
                  </button>
                </div>
              </div>

              {/* Shade Selector */}
              <div className="mb-4">
                <span className="text-[10px] text-[#9E9A95] uppercase tracking-wider block mb-1.5 font-medium">
                  Finish: <strong className="text-[#111112]">{selectedShade}</strong>
                </span>
                <div className="flex gap-2">
                  {['01 Radiant Clear', '02 Dew', '03 Sunlit Amber'].map((shade) => (
                    <button
                      key={shade}
                      onClick={() => setSelectedShade(shade)}
                      className={`px-3 py-1 rounded-full text-[11px] transition-all cursor-pointer ${
                        selectedShade === shade
                          ? 'bg-[#111112] text-white font-medium'
                          : 'bg-white text-[#666360] border border-[#E8E2D8] hover:border-[#111112]'
                      }`}
                    >
                      {shade}
                    </button>
                  ))}
                </div>
              </div>

              {/* Verification & Add to Bag */}
              <div className="pt-3 border-t border-[#E8E2D8] flex items-center justify-between gap-4">
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-[#9E9A95] block">Price</span>
                  <span className="font-serif text-xl font-normal text-[#111112]">{price}</span>
                </div>

                <button
                  onClick={handleAdd}
                  disabled={addedToBag}
                  className={`py-2.5 px-5 rounded-full text-[11px] font-medium tracking-[0.14em] uppercase flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    addedToBag
                      ? 'bg-[#16A34A] text-white'
                      : 'bg-[#111112] text-[#FBF9F5] hover:bg-[#28282B] active:scale-[0.98]'
                  }`}
                >
                  {addedToBag ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Reserved</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-3.5 h-3.5 text-[#B89248]" />
                      <span>Add To Bag</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
