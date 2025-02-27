
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeImage, setActiveImage] = useState(0);

  const handleThumbnailClick = (index: number) => {
    setActiveImage(index);
  };

  const handlePrevClick = () => {
    setActiveImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextClick = () => {
    setActiveImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* Thumbnails - Vertical stack on desktop, horizontal on mobile */}
      <div className="order-2 md:order-1 flex flex-row md:flex-col gap-3 overflow-x-auto md:overflow-visible">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => handleThumbnailClick(index)}
            className={`border flex-shrink-0 transition-all w-16 h-16 md:w-20 md:h-20 ${
              activeImage === index ? 'border-primary-accent' : 'border-secondary hover:border-primary-muted'
            }`}
          >
            <img 
              src={image} 
              alt={`${productName} thumbnail ${index + 1}`} 
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* Main image display */}
      <div className="order-1 md:order-2 relative flex-grow">
        <div className="aspect-[3/4] bg-secondary-lighter relative">
          <img
            src={images[activeImage]}
            alt={productName}
            className="w-full h-full object-contain"
          />
          
          {/* Navigation arrows */}
          <button 
            onClick={handlePrevClick}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center shadow-sm hover:bg-white transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          
          <button 
            onClick={handleNextClick}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center shadow-sm hover:bg-white transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
