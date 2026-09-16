import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Zap, ShieldCheck } from 'lucide-react';
import { useStoreData } from '../context/StoreDataContext';

export const HeroCarousel: React.FC = () => {
  const { heroSlides } = useStoreData();
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const prevSlide = () => {
    setCurrent(prev => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const nextSlide = () => {
    setCurrent(prev => (prev + 1) % heroSlides.length);
  };

  return (
    <div 
      className="relative w-full overflow-hidden bg-gray-900 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div 
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {heroSlides.map((slide, idx) => (
          <div
            key={slide.id}
            className={`min-w-full relative bg-linear-to-r ${slide.bgColor} text-white py-10 md:py-16 px-4 md:px-12 flex items-center justify-between min-h-[300px] md:min-h-[380px]`}
          >
            {/* Background Texture Graphic */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

            <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 items-center gap-6 z-10">
              {/* Text Information */}
              <div className="md:col-span-7 space-y-3.5 text-left">
                <div className="inline-flex items-center gap-1.5 bg-black/30 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-bold tracking-wider text-yellow-300 border border-yellow-300/30">
                  <Zap className="w-3.5 h-3.5" />
                  <span>{slide.badge}</span>
                </div>

                <h2 className="text-2xl md:text-4xl lg:text-5xl font-black tracking-tight uppercase leading-tight drop-shadow-md">
                  {slide.title}
                </h2>

                <p className="text-sm md:text-base text-gray-100 max-w-xl font-normal opacity-95">
                  {slide.subtitle}
                </p>

                {/* Promotional tag */}
                <div className="flex items-center gap-2 text-xs font-bold text-white/90">
                  <ShieldCheck className="w-4 h-4 text-emerald-300" />
                  <span className="tracking-wide">{slide.tag}</span>
                </div>

                {/* CTAs */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link
                    to={slide.ctaLink}
                    className="bg-white text-gray-900 hover:bg-yellow-400 font-extrabold px-6 py-2.5 rounded-full text-xs md:text-sm uppercase tracking-wider shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    {slide.ctaText}
                  </Link>
                  {slide.secondaryCtaText && (
                    <Link
                      to={slide.secondaryCtaLink || '/offers'}
                      className="bg-black/30 hover:bg-black/50 text-white font-bold px-5 py-2.5 rounded-full text-xs md:text-sm uppercase tracking-wider border border-white/40 transition-colors backdrop-blur-xs"
                    >
                      {slide.secondaryCtaText}
                    </Link>
                  )}
                </div>
              </div>

              {/* Product Visual Image */}
              <div className="md:col-span-5 flex justify-center items-center">
                <div className="relative group">
                  <div className="absolute -inset-2 bg-white/20 rounded-2xl blur-xl opacity-70 group-hover:opacity-100 transition-opacity" />
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="relative w-48 h-48 md:w-72 md:h-72 object-cover rounded-2xl shadow-2xl border-2 border-white/30 transform hover:scale-102 transition-transform duration-300"
                    loading={idx === 0 ? 'eager' : 'lazy'}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white items-center justify-center transition-all focus:outline-none"
        aria-label="Previous banner"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white items-center justify-center transition-all focus:outline-none"
        aria-label="Next banner"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`transition-all rounded-full ${
              current === index
                ? 'w-6 h-2 bg-white shadow'
                : 'w-2 h-2 bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
