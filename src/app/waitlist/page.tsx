'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { WaitlistSection } from '@/components/WaitlistSection';
import type { RoleType } from '@/types';

function WaitlistContent() {
  const searchParams = useSearchParams();
  const roleParam = searchParams.get('role');
  const validRole: RoleType = 
    roleParam === 'creator' ? 'creator' : 
    roleParam === 'distributor' ? 'distributor' : 'shopper';

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#111112] selection:bg-[#B89248]/20 selection:text-[#111112]">
      {/* Minimal Top Header */}
      <header className="sticky top-0 z-40 bg-[#FBF9F5]/90 backdrop-blur-md border-b border-[#E8E2D8]">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-[#666360] hover:text-[#111112] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-[#B89248]" />
            <span>Return to overview</span>
          </Link>

          <Link href="/" className="flex items-center" aria-label="Desla! Homepage">
            <img 
              src="/desla-logo.png" 
              alt="Desla!" 
              className="h-7 sm:h-8 w-auto object-contain"
            />
          </Link>

          <div className="text-right">
            <span className="text-[11px] font-semibold tracking-wider uppercase text-[#B89248] hidden sm:inline-block">
              Priority Waitlist
            </span>
          </div>
        </div>
      </header>

      {/* Main Focus Form */}
      <main className="py-8 sm:py-12">
        <WaitlistSection activeRole={validRole} />
      </main>

      {/* Footer Note */}
      <footer className="py-8 text-center border-t border-[#E8E2D8] text-xs text-[#7A7672]">
        <p>© {new Date().getFullYear()} Desla! Laboratories. Formulated for Melanin Depths IV–VI.</p>
      </footer>
    </div>
  );
}

export default function WaitlistPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FBF9F5] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#111112]/20 border-t-[#B89248] rounded-full animate-spin" />
      </div>
    }>
      <WaitlistContent />
    </Suspense>
  );
}
