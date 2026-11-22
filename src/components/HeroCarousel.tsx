'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

interface SlideItem {
  id: number;
  image: string;
  badge: string;
  title: string;
  subtitle: string;
  ctaText: string;
  targetCategory?: string;
  gradientClass: string;
}

const SLIDES: SlideItem[] = [
  {
    id: 1,
    image: '/slides/slide-1.jpg',
    badge: 'COUNTRY BAZAAR MIDRAND',
    title: 'Fresh Market Essentials Every Day',
    subtitle: 'Build your order list in Rand (R) and generate an instant PDF order slip.',
    ctaText: 'Browse Catalogue',
    targetCategory: 'All',
    gradientClass: 'from-emerald-950 via-emerald-900 to-stone-900',
  },
  {
    id: 2,
    image: '/slides/slide-2.jpg',
    badge: 'FOOD & PANTRY',
    title: 'Quality Groceries & Daily Staples',
    subtitle: 'Hand-picked market selections ready for fast basket & slip preparation.',
    ctaText: 'Explore Food',
    targetCategory: 'Food',
    gradientClass: 'from-red-950 via-red-900 to-stone-900',
  },
  {
    id: 3,
    image: '/slides/slide-3.jpg',
    badge: 'HOME, STATIONERY & GOODS',
    title: 'Everything You Need Under One Roof',
    subtitle: 'Seamless no-payment ordering with instant email & PDF summary.',
    ctaText: 'View All Goods',
    targetCategory: 'All',
    gradientClass: 'from-stone-900 via-emerald-950 to-red-950',
  },
];

interface HeroCarouselProps {
  categories: string[];
  onSelectCategory: (cat: string) => void;
}

export default function HeroCarousel({ categories, onSelectCategory }: HeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % SLIDES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % SLIDES.length);
  };

  const handleCtaClick = (slide: SlideItem) => {
    if (slide.targetCategory) {
      const matched = categories.find(
        (c) => c.toLowerCase() === slide.targetCategory!.toLowerCase()
      );
      onSelectCategory(matched || 'All');
    }
    const gridEl = document.getElementById('products-grid');
    if (gridEl) {
      gridEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const currentSlide = SLIDES[activeIndex];
  const hasImage = !failedImages[currentSlide.id];

  return (
    <section className="max-w-7xl mx-auto px-4 pt-4 pb-2">
      <div className="relative h-[260px] sm:h-[360px] md:h-[420px] rounded-2xl overflow-hidden shadow-md border border-stone-200/80 bg-stone-900">
        {/* Background Gradient Base */}
        <div
          className={`absolute inset-0 bg-gradient-to-r ${currentSlide.gradientClass} transition-all duration-500`}
        />

        {/* User Image Layer */}
        {hasImage && (
          <img
            src={currentSlide.image}
            alt={currentSlide.title}
            onError={() =>
              setFailedImages((prev) => ({ ...prev, [currentSlide.id]: true }))
            }
            className="absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-500"
          />
        )}

        {/* Subtle Overlay for Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-transparent" />

        {/* Slide Text Content */}
        <div className="relative z-10 h-full flex flex-col justify-center px-10 sm:px-16 max-w-2xl text-white space-y-3">
          <span className="inline-block w-fit bg-red-700/95 text-white text-[11px] font-bold tracking-wider uppercase px-3 py-1 rounded-full shadow-2xs">
            {currentSlide.badge}
          </span>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold leading-tight drop-shadow-xs">
            {currentSlide.title}
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-stone-100/90 max-w-lg leading-relaxed">
            {currentSlide.subtitle}
          </p>
          <div className="pt-1">
            <button
              type="button"
              onClick={() => handleCtaClick(currentSlide)}
              className="inline-flex items-center gap-2 bg-red-700 hover:bg-red-600 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md transition cursor-pointer"
            >
              <span>{currentSlide.ctaText}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Left Arrow */}
        <button
          type="button"
          onClick={prevSlide}
          aria-label="Previous slide"
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-stone-900 shadow-md flex items-center justify-center transition cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Right Arrow */}
        <button
          type="button"
          onClick={nextSlide}
          aria-label="Next slide"
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-stone-900 shadow-md flex items-center justify-center transition cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Bottom Indicator Dots */}
        <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-black/30 backdrop-blur-2xs px-3 py-1.5 rounded-full">
          {SLIDES.map((slide, idx) => (
            <button
              key={slide.id}
              type="button"
              aria-label={`Slide ${idx + 1}`}
              onClick={() => setActiveIndex(idx)}
              className={`h-2.5 rounded-full transition-all cursor-pointer ${
                idx === activeIndex ? 'w-7 bg-white' : 'w-2.5 bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}