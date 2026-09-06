import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles, ShoppingBag, ShieldCheck, Zap } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const HeroSlider: React.FC = () => {
  const { settings, setSelectedCategory } = useStore();
  const slides = settings.heroSlides || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const primaryColor = settings.theme?.primaryColor || '#10b981';
  const accentColor = settings.theme?.accentColor || '#06b6d4';

  const nextSlide = useCallback(() => {
    if (slides.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    if (slides.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Auto-play timer
  useEffect(() => {
    if (isHovered || slides.length <= 1) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 5500);
    return () => clearInterval(timer);
  }, [nextSlide, isHovered, slides.length]);

  if (slides.length === 0) return null;

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  const currentSlide = slides[currentIndex];

  const handleCtaClick = (category?: string) => {
    if (category) {
      setSelectedCategory(category);
    }
    const productsSection = document.getElementById('products-showcase-section');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero-slider-section"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-3 sm:pt-4 pb-6 sm:pb-8"
    >
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative h-[390px] sm:h-[480px] lg:h-[520px] w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl bg-slate-900 border border-slate-800 touch-pan-y"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.id}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Background Image with Dark Vignette Gradient */}
            <img
              src={currentSlide.imageUrl}
              alt={currentSlide.title}
              className="w-full h-full object-cover object-center transform scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-transparent to-slate-950/30" />

            {/* Slide Content */}
            <div className="absolute inset-0 flex flex-col justify-center max-w-2xl px-4 xs:px-6 sm:px-12 lg:px-16 text-white z-10">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.4 }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md w-fit mb-2.5 sm:mb-3 border"
                style={{
                  backgroundColor: `${primaryColor}22`,
                  borderColor: `${primaryColor}55`,
                  color: primaryColor,
                }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{currentSlide.badge}</span>
              </motion.div>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.4 }}
                className="font-bold text-xs sm:text-base tracking-wide uppercase"
                style={{ color: primaryColor }}
              >
                {currentSlide.subtitle}
              </motion.p>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.4 }}
                className="text-xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight sm:leading-tight mt-1 mb-2 sm:mb-3 text-white drop-shadow-md"
              >
                {currentSlide.title}
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.4 }}
                className="text-slate-300 text-xs sm:text-sm lg:text-base line-clamp-2 sm:line-clamp-3 mb-4 sm:mb-6 max-w-xl font-normal leading-relaxed"
              >
                {currentSlide.description}
              </motion.p>

              {/* Call to Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.4 }}
                className="flex flex-wrap items-center gap-2.5 sm:gap-3"
              >
                <button
                  id={`hero-cta-btn-${currentIndex}`}
                  onClick={() => handleCtaClick(currentSlide.ctaCategory)}
                  className="flex items-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 rounded-2xl text-slate-950 font-extrabold text-xs sm:text-sm transition-all duration-200 shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                  style={{
                    backgroundColor: primaryColor,
                  }}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{currentSlide.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="hidden sm:flex items-center gap-3 text-xs text-slate-300 ml-1">
                  <div className="flex items-center gap-1.5 bg-slate-900/70 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-700/60">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>Instant WhatsApp Order</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-900/70 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-700/60">
                    <ShieldCheck className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                    <span>Warranty Included</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        {slides.length > 1 && (
          <>
            <button
              id="hero-slider-prev-btn"
              onClick={prevSlide}
              className="hidden xs:flex absolute left-2.5 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white backdrop-blur-md border border-white/10 items-center justify-center transition-all hover:scale-110 active:scale-95"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
            </button>
            <button
              id="hero-slider-next-btn"
              onClick={nextSlide}
              className="hidden xs:flex absolute right-2.5 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white backdrop-blur-md border border-white/10 items-center justify-center transition-all hover:scale-110 active:scale-95"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
            </button>
          </>
        )}

        {/* Dot Indicators */}
        {slides.length > 1 && (
          <div
            id="hero-slider-dots"
            className="absolute bottom-3.5 sm:bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-slate-950/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10"
          >
            {slides.map((slide, idx) => (
              <button
                key={slide.id}
                id={`hero-dot-${idx}`}
                onClick={() => setCurrentIndex(idx)}
                className={`transition-all duration-300 rounded-full ${
                  idx === currentIndex
                    ? 'w-6 sm:w-7 h-2 shadow-md'
                    : 'w-2 h-2 bg-white/40 hover:bg-white/80'
                }`}
                style={{
                  backgroundColor: idx === currentIndex ? primaryColor : undefined,
                }}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
