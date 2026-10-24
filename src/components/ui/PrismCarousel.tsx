'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './PrismCarousel.css';

export interface PrismItem {
  src: string;
  alt?: string;
  title: string;
  subtitle?: string;
  tag?: string;
}

interface PrismCarouselProps {
  items: PrismItem[];
  autoPlay?: boolean;
  interval?: number;
  className?: string;
  onItemClick?: (item: PrismItem, index: number) => void;
}

export default function PrismCarousel({
  items = [],
  autoPlay = true,
  interval = 4200,
  className = '',
  onItemClick,
}: PrismCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const total = items.length;

  // Touch and drag handling
  const [isMobile, setIsMobile] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const nextSlide = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // Auto-play timer
  useEffect(() => {
    if (!autoPlay || isPaused || total <= 1) return;
    const timer = setInterval(() => {
      nextSlide();
    }, interval);
    return () => clearInterval(timer);
  }, [autoPlay, isPaused, interval, nextSlide, total]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      prevSlide();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      nextSlide();
    }
  };

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      prevSlide();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (total === 0) return null;

  return (
    <div
      className={`prism-carousel-container ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-roledescription="carousel"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-label="Editorial Specimen Coverflow"
    >
      {/* 3D Stage */}
      <div className="prism-carousel-stage">
        {items.map((item, index) => {
          // Calculate shortest distance in circular array
          let offset = index - currentIndex;
          if (offset > total / 2) offset -= total;
          if (offset < -total / 2) offset += total;

          const isActive = offset === 0;
          const absOffset = Math.abs(offset);
          const isVisible = absOffset <= 2;

          // 3D positioning
          const spacing = isMobile ? 150 : 210;
          const translateX = offset * spacing;
          const translateZ = isActive ? 0 : -Math.min(absOffset * 100, 240);
          const rotateY = -offset * 26; // coverflow angle
          const scale = isActive ? 1.04 : Math.max(0.78, 1 - absOffset * 0.12);
          const opacity = isVisible ? Math.max(0.3, 1 - absOffset * 0.32) : 0;
          const zIndex = 30 - Math.round(absOffset * 5);

          return (
            <div
              key={`${item.src}-${index}`}
              onClick={() => {
                if (isActive && onItemClick) {
                  onItemClick(item, index);
                } else {
                  goToSlide(index);
                }
              }}
              className={`prism-card ${isActive ? 'is-active' : ''}`}
              style={{
                transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                zIndex,
                opacity,
                pointerEvents: isVisible ? 'auto' : 'none',
              }}
              role="group"
              aria-roledescription="slide"
              aria-label={`${item.title} (${index + 1} of ${total})`}
            >
              {/* Image */}
              <img
                src={item.src}
                alt={item.alt || item.title}
                className="w-full h-full object-cover object-top select-none"
                loading="eager"
                draggable={false}
              />

              {/* Prismatic iridescent refraction sheen */}
              <div className="prism-sheen" />

              {/* Editorial bottom vignette */}
              <div className="prism-vignette" />

              {/* Card Label & Telemetry Overlay */}
              <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6 z-20 text-left text-white">
                {item.tag && (
                  <span className="inline-block text-[10px] font-semibold tracking-[0.2em] uppercase text-[#C5A059] mb-1">
                    {item.tag}
                  </span>
                )}
                <h3 className="font-manrope text-base sm:text-lg font-bold text-white tracking-tight leading-snug drop-shadow-sm">
                  {item.title}
                </h3>
                {item.subtitle && (
                  <p className="text-xs text-[#E8E2D8]/85 font-medium mt-0.5 line-clamp-1">
                    {item.subtitle}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Buttons */}
      <button
        type="button"
        onClick={prevSlide}
        className="prism-nav-button prism-nav-prev"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        type="button"
        onClick={nextSlide}
        className="prism-nav-button prism-nav-next"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Minimalist Progress Indicators */}
      <div className="flex items-center justify-center gap-1.5 mt-4 sm:mt-6">
        {items.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goToSlide(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === currentIndex
                ? 'w-6 bg-[#B89248]'
                : 'w-1.5 bg-[#D1C9BE] hover:bg-[#9E9A95]'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
