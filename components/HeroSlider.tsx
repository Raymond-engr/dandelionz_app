"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import HeroSliderSkeleton from './HeroSliderSkeleton';

interface HeroSliderProps {
  isLoading?: boolean;
}

export default function HeroSlider({ isLoading = false }: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const slides = [
    '/slider1.png',
    '/slider2.png',
    '/slider3.png',
    '/slider4.png',
    '/slider5.png',
  ];

  const [imageErrors, setImageErrors] = useState(() => Array(slides.length).fill(false));

  useEffect(() => {
    if (!isAutoPlaying || isLoading) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length, isLoading]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };
  
  const handleImageError = (index: number) => {
    setImageErrors(prevErrors => {
      const newErrors = [...prevErrors];
      newErrors[index] = true;
      return newErrors;
    });
  };

  if (isLoading) {
    return <HeroSliderSkeleton />;
  }

  return (
    <div className="w-full overflow-hidden mb-6">
      <div className="relative w-full">
        {/* Slides Container */}
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 85}%)` }}
        >
          {slides.map((slide, index) => (
            <div
              key={index}
              // w-[85%] makes the current slide take mostly full width
              // pr-3 creates the gap between this slide and the peeking one
              className="w-[85%] shrink-0 relative pr-1 min-[300px]:pr-2 sm:pr-3 h-[100px] min-[300px]:h-[130px] min-[350px]:h-[145px] min-[400px]:h-40 sm:h-48"
            >
              <div className="w-full h-full relative rounded-xl overflow-hidden shadow-sm">
                {imageErrors[index] ? (
                  <div className="w-full h-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <div className="text-white text-center px-4">
                      <div className="text-xl font-bold mb-1">PAY SMALL SMALL</div>
                      <div className="text-xs bg-white/20 py-1 px-3 rounded-full inline-block">Shop Now</div>
                    </div>
                  </div>
                ) : (
                  <Image
                    src={slide}
                    alt={`Slide ${index + 1}`}
                    fill
                    className="object-cover"
                    priority={index === 0}
                    onError={() => handleImageError(index)}
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Dots (Centered based on screen, not scroll width) */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-1.5 rounded-full transition-all duration-300 shadow-sm ${
                currentIndex === index
                  ? 'w-6 bg-blue-600'
                  : 'w-1.5 bg-white/80'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}