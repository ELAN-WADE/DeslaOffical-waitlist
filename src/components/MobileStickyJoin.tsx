'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';

interface MobileStickyJoinProps {
  onJoinClick: () => void;
}

export const MobileStickyJoin: React.FC<MobileStickyJoinProps> = ({ onJoinClick }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [isFormInView, setIsFormInView] = useState(false);

  useEffect(() => {
    // 1. Scroll listener: Show after scrolling past hero (~350px)
    const handleScroll = () => {
      const pastHero = window.scrollY > 350;
      setIsVisible(pastHero);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // 2. Intersection Observer on #waitlist form: Hide when waitlist form is in view
    const waitlistElement = document.getElementById('waitlist');
    let observer: IntersectionObserver | null = null;

    if (waitlistElement && typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          setIsFormInView(entry.isIntersecting);
        },
        { threshold: 0.15 }
      );
      observer.observe(waitlistElement);
    }

    // 3. Virtual keyboard detection via focus on input/textarea/select
    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) {
        setIsKeyboardOpen(true);
      }
    };

    const handleFocusOut = () => {
      setIsKeyboardOpen(false);
    };

    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('focusout', handleFocusOut);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (observer) observer.disconnect();
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('focusout', handleFocusOut);
    };
  }, []);

  // Determine whether to display
  const shouldShow = isVisible && !isFormInView && !isKeyboardOpen;

  if (!shouldShow) return null;

  return (
    <aside 
      aria-label="Quick registration bar"
      className="fixed bottom-5 inset-x-0 z-40 sm:hidden flex justify-center px-4 animate-in fade-in slide-in-from-bottom-3 duration-200 pointer-events-none"
    >
      <button
        type="button"
        onClick={onJoinClick}
        className="pointer-events-auto py-3 px-8 rounded-full bg-[#111112] text-white border border-[#B89248]/40 text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-[#28282B] active:scale-95 transition-all shadow-xl min-h-[46px] cursor-pointer"
      >
        <span>Join Waitlist</span>
        <ArrowUpRight className="w-3.5 h-3.5 text-[#B89248]" aria-hidden="true" />
      </button>
    </aside>
  );
};
