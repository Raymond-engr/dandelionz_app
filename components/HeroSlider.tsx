'use client';

import React, { useState } from 'react';

const slides = [
  { id: 1, bgColor: 'bg-gray-200' },
  { id: 2, bgColor: 'bg-gray-300' },
  { id: 3, bgColor: 'bg-gray-400' },
];

export default function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className="relative w-full aspect-[4/2.5] overflow-hidden rounded-lg">
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide) => (
          <div
            key={slide.id}
            className={`w-full flex-shrink-0 h-full ${slide.bgColor} flex items-center justify-center`}
          >
            <span className="text-gray-500">Image Placeholder</span>
          </div>
        ))}
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full ${
              currentIndex === index ? 'bg-blue-600' : 'bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
