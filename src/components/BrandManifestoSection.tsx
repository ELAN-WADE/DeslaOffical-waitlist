import React from 'react';

export const BrandManifestoSection: React.FC = () => {
  return (
    <section id="about" className="relative py-20 sm:py-24 bg-[#111112] text-[#FBF9F5] border-b border-[#28282B]">
      <div className="max-w-[1180px] mx-auto px-4 sm:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Concise Statement */}
          <div className="lg:col-span-7 text-left space-y-5">
            <span 
              className="text-[10px] font-medium tracking-[0.24em] uppercase text-[#B89248] block"
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
            >
              The Philosophy
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-white leading-tight">
              Health before beauty. <br />
              <span className="italic font-normal text-[#B89248]">Intention before trend.</span>
            </h2>

            <p 
              className="text-[14px] sm:text-[15px] text-[#9E9A95] leading-relaxed font-light max-w-lg"
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
            >
              For decades, African beauty retail meant either imported formulas unstable in tropical humidity, or unverified local products. Desla establishes a sovereign standard: clean biotechnology, climate-calibrated efficacy, and genuine dermatological integrity.
            </p>

            <div 
              className="pt-4 flex items-center gap-6 text-[11px] font-mono tracking-widest text-[#B89248] uppercase"
              style={{ fontFamily: 'ui-monospace, monospace' }}
            >
              <span>Lagos</span>
              <span>•</span>
              <span>London</span>
              <span>•</span>
              <span>New York</span>
            </div>
          </div>

          {/* Right Column: Restrained Image Frame */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[400px] aspect-[4/4.4] rounded-2xl overflow-hidden border border-white/10">
              <img
                src="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80"
                alt="Portrait"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              
              <div 
                className="absolute bottom-4 left-4 right-4 text-left text-white text-xs font-light"
                style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
              >
                Formulated for our climate, verified for our skin.
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
