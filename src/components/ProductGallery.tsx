import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ images, productName }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  const nextImage = () => {
    setSelectedIndex(prev => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedIndex(prev => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4 items-start">
      {/* Thumbnail Bar (Vertical on desktop, horizontal on mobile) */}
      <div className="flex lg:flex-col gap-2.5 overflow-x-auto w-full lg:w-20 shrink-0 pb-2 lg:pb-0 scrollbar-none justify-center lg:justify-start">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedIndex(idx)}
            className={`w-16 h-16 rounded-lg p-1 bg-white border-2 transition-all shrink-0 overflow-hidden ${
              selectedIndex === idx
                ? 'border-[#E30613] shadow-md ring-2 ring-red-100'
                : 'border-gray-200 hover:border-gray-300 opacity-70 hover:opacity-100'
            }`}
          >
            <img
              src={img}
              alt={`${productName} thumbnail ${idx + 1}`}
              className="w-full h-full object-contain"
            />
          </button>
        ))}
      </div>

      {/* Main Image Viewport with Zoom */}
      <div className="relative flex-1 bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 w-full flex items-center justify-center min-h-[320px] sm:min-h-[420px] overflow-hidden">
        {/* Main image container */}
        <div
          className="w-full h-full flex items-center justify-center cursor-crosshair relative"
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
          onMouseMove={handleMouseMove}
        >
          <img
            src={images[selectedIndex] || images[0]}
            alt={productName}
            className={`max-h-[300px] sm:max-h-[380px] max-w-full object-contain transition-transform duration-200 ${
              isZoomed ? 'scale-150' : 'scale-100'
            }`}
            style={
              isZoomed
                ? {
                    transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                  }
                : undefined
            }
          />
        </div>

        {/* Zoom Hint Icon */}
        <div className="absolute top-3 right-3 bg-black/40 text-white p-1.5 rounded-full pointer-events-none text-xs flex items-center gap-1">
          <ZoomIn className="w-3.5 h-3.5" />
          <span className="text-[10px] hidden sm:inline">Hover to Zoom</span>
        </div>

        {/* Mobile Left/Right Slide Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="lg:hidden absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 shadow border border-gray-200 flex items-center justify-center text-gray-700"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextImage}
              className="lg:hidden absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 shadow border border-gray-200 flex items-center justify-center text-gray-700"
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Mobile Pagination Dots matching screenshot */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 lg:hidden">
          {images.map((_, idx) => (
            <span
              key={idx}
              className={`rounded-full transition-all ${
                selectedIndex === idx ? 'w-4 h-1.5 bg-[#E30613]' : 'w-1.5 h-1.5 bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
