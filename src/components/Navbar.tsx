'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  onJoinClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 sm:px-8 ${
          isScrolled 
            ? 'py-3 bg-[#FBF9F5]/94 backdrop-blur-md border-b border-[#E8E2D8]/80 shadow-xs' 
            : 'py-4 sm:py-5 bg-transparent'
        }`}
      >
        <div className="max-w-[1240px] mx-auto flex items-center justify-between">
          
          {/* Official Desla! Logo */}
          <Link
            href="/"
            className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89248] rounded py-1"
            aria-label="Desla! Homepage"
          >
            <img 
              src="/desla-logo.png" 
              alt="Desla!" 
              className="h-7 sm:h-8 w-auto object-contain"
            />
          </Link>

          {/* Desktop Nav Links */}
          <nav 
            className="hidden md:flex items-center gap-7 text-[13px] tracking-wide font-medium text-[#666360]"
            aria-label="Primary Navigation"
          >
            <button
              onClick={() => scrollToSection('affiliates')}
              className="hover:text-[#111112] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89248] rounded py-1 cursor-pointer"
            >
              Affiliation
            </button>
            <button
              onClick={() => scrollToSection('offerings')}
              className="hover:text-[#111112] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89248] rounded py-1 cursor-pointer"
            >
              Specimens
            </button>
            <button
              onClick={() => scrollToSection('routine')}
              className="hover:text-[#111112] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89248] rounded py-1 cursor-pointer"
            >
              Daily Routine
            </button>
            <button
              onClick={() => scrollToSection('brand-story')}
              className="hover:text-[#111112] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89248] rounded py-1 cursor-pointer"
            >
              Philosophy
            </button>
            <button
              onClick={() => scrollToSection('faqs')}
              className="hover:text-[#111112] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89248] rounded py-1 cursor-pointer"
            >
              FAQs
            </button>
          </nav>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#111112] hover:bg-[#EFE9DF]/50 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89248] min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden animate-fadeIn"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div 
            className="fixed top-16 left-4 right-4 bg-[#FBF9F5] border border-[#E8E2D8] rounded-3xl p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="flex flex-col space-y-4 text-sm font-medium text-[#111112]">
              <button
                onClick={() => scrollToSection('affiliates')}
                className="text-left py-2 hover:text-[#B89248] transition-colors"
              >
                Affiliation Programs
              </button>
              <button
                onClick={() => scrollToSection('offerings')}
                className="text-left py-2 hover:text-[#B89248] transition-colors"
              >
                Featured Specimens
              </button>
              <button
                onClick={() => scrollToSection('routine')}
                className="text-left py-2 hover:text-[#B89248] transition-colors"
              >
                Daily Routine
              </button>
              <button
                onClick={() => scrollToSection('brand-story')}
                className="text-left py-2 hover:text-[#B89248] transition-colors"
              >
                Brand Philosophy
              </button>
              <button
                onClick={() => scrollToSection('faqs')}
                className="text-left py-2 hover:text-[#B89248] transition-colors"
              >
                FAQs
              </button>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};
